$ErrorActionPreference='Stop'
# npm can inherit PowerShell 7's PSModulePath when spawning Windows PowerShell.
# Load the security module shipped with the current host, rather than a module
# for another PowerShell version. This does not change execution/trust policy.
Import-Module (Join-Path $PSHOME 'Modules/Microsoft.PowerShell.Security/Microsoft.PowerShell.Security.psd1') -ErrorAction Stop

function Get-NexoraSha256 {
  param([Parameter(Mandatory=$true)][string]$Path)
  $algorithm=[Security.Cryptography.SHA256]::Create()
  $stream=$null
  try{$stream=[IO.File]::OpenRead($Path);return ([BitConverter]::ToString($algorithm.ComputeHash($stream))).Replace('-','')}
  finally{if($stream){$stream.Dispose()};$algorithm.Dispose()}
}

function Assert-NexoraPublisherSignature {
  param([Parameter(Mandatory=$true)][string]$Path,[string]$ExpectedThumbprint)
  $signature=Get-AuthenticodeSignature -LiteralPath $Path
  if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or -not $signature.SignerCertificate){
    throw ('NEXORA publisher verification failed ('+$signature.Status+'). A valid certificate from a trusted signing provider is required. Windows protections were not changed.')
  }
  if($ExpectedThumbprint -and $signature.SignerCertificate.Thumbprint -ne $ExpectedThumbprint){throw 'NEXORA signer does not match the selected publisher certificate.'}
  $codeSigning=@($signature.SignerCertificate.EnhancedKeyUsageList | Where-Object {$_.ObjectId -eq '1.3.6.1.5.5.7.3.3'})
  if($codeSigning.Count -eq 0){throw 'The publisher certificate does not permit code signing.'}
  if(-not $signature.TimeStamperCertificate){throw 'A trusted timestamp is required for the NEXORA release.'}
  return $signature
}

function Get-NexoraSigningCertificate {
  param([string]$Thumbprint)
  $normalized=($Thumbprint -replace '\s','').ToUpperInvariant()
  if($normalized -notmatch '^[A-F0-9]{40}$'){
    throw 'No code-signing certificate selected. Set NEXORA_SIGNING_CERT_THUMBPRINT to an existing trusted publisher certificate thumbprint, or supply -CertificateThumbprint. No certificate was created, imported or trusted automatically.'
  }
  $certificate=$null
  foreach($store in @('Cert:\CurrentUser\My','Cert:\LocalMachine\My')){
    $candidate=Join-Path $store $normalized
    if(Test-Path -LiteralPath $candidate){$certificate=Get-Item -LiteralPath $candidate;break}
  }
  if(-not $certificate -or -not $certificate.HasPrivateKey){throw 'The selected publisher certificate and its signing key are unavailable in the Windows certificate store.'}
  $now=Get-Date
  if($certificate.NotBefore -gt $now -or $certificate.NotAfter -le $now){throw 'The selected publisher certificate is not currently valid.'}
  if($certificate.Subject -eq $certificate.Issuer){throw 'Self-signed publisher certificates are not accepted for NEXORA releases.'}
  $codeSigning=@($certificate.EnhancedKeyUsageList | Where-Object {$_.ObjectId -eq '1.3.6.1.5.5.7.3.3'})
  if($codeSigning.Count -eq 0){throw 'The selected certificate does not permit code signing.'}
  $chain=New-Object Security.Cryptography.X509Certificates.X509Chain
  try{
    $chain.ChainPolicy.RevocationMode=[Security.Cryptography.X509Certificates.X509RevocationMode]::Online
    $chain.ChainPolicy.UrlRetrievalTimeout=[TimeSpan]::FromSeconds(15)
    [void]$chain.ChainPolicy.ApplicationPolicy.Add([Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.3'))
    if(-not $chain.Build($certificate)){throw 'The publisher certificate trust/revocation check failed. No release was installed.'}
  }finally{$chain.Dispose()}
  $certificate | Add-Member -NotePropertyName NexoraMachineStore -NotePropertyValue ($store -eq 'Cert:\LocalMachine\My') -Force
  return $certificate
}

function Resolve-NexoraSignTool {
  param([string]$Path=$env:NEXORA_SIGNTOOL_PATH)
  if(-not $Path){
    $sdk=Join-Path ${env:ProgramFiles(x86)} 'Windows Kits/10/bin'
    if(Test-Path -LiteralPath $sdk){$Path=Get-ChildItem -LiteralPath $sdk -Directory | Sort-Object Name -Descending | ForEach-Object {Join-Path $_.FullName 'x64/signtool.exe'} | Where-Object {Test-Path -LiteralPath $_} | Select-Object -First 1}
  }
  if(-not $Path){
    $bundle=Get-NexoraSigningToolsBundle
    if(Test-Path -LiteralPath $bundle.Tool){$Path=$bundle.Tool}
  }
  if(-not $Path -or -not(Test-Path -LiteralPath $Path -PathType Leaf)){throw 'Windows SDK SignTool is required for SHA-256/RFC3161 release signing. Install Windows SDK Signing Tools and set NEXORA_SIGNTOOL_PATH to its signtool.exe.'}
  $bundle=Get-NexoraSigningToolsBundle
  if([IO.Path]::GetFullPath($Path) -eq [IO.Path]::GetFullPath($bundle.Tool)){Assert-NexoraSigningToolsBundle $bundle}
  if([IO.Path]::GetFileName($Path) -ine 'signtool.exe'){throw 'Select the Windows SDK signtool.exe executable.'}
  $signature=Get-AuthenticodeSignature -LiteralPath $Path
  if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $signature.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation'){throw 'The selected SignTool does not have a valid Microsoft publisher signature.'}
  return (Resolve-Path -LiteralPath $Path).Path
}

function Get-NexoraSigningToolsBundle {
  $root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
  $folder=Join-Path $root '.local/tools/windows-sdk/10.0.28000.2705'
  return @{Version='10.0.28000.2705';Folder=$folder;Archive=(Join-Path $folder 'buildtools.zip');Sha256='8BFDFB6CA2633F531CF80B5FA22512BA61A394D7988F0970DB83BAADC67929ED';Prefix='bin/10.0.28000.0/x64/';Names=@('signtool.exe','mssign32.dll','wintrust.dll','msisip.dll','appxsip.dll','appxpackaging.dll','opcservices.dll');Tool=(Join-Path $folder 'x64/signtool.exe')}
}

function Assert-NexoraSigningToolsBundle {
  param([Parameter(Mandatory=$true)]$Bundle)
  if(-not(Test-Path -LiteralPath $Bundle.Archive) -or (Get-NexoraSha256 $Bundle.Archive) -ne $Bundle.Sha256){throw 'Pinned Windows SDK archive hash mismatch. No signing tool was executed.'}
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive=[IO.Compression.ZipFile]::OpenRead($Bundle.Archive)
  try{
    foreach($name in $Bundle.Names){
      $entry=$archive.GetEntry($Bundle.Prefix+$name)
      if(-not $entry){throw 'Required Windows signing tool package entry is missing.'}
      $stream=$entry.Open();$algorithm=[Security.Cryptography.SHA256]::Create()
      try{$expected=([BitConverter]::ToString($algorithm.ComputeHash($stream))).Replace('-','')}finally{$stream.Dispose();$algorithm.Dispose()}
      $file=Join-Path $Bundle.Folder ('x64/'+$name)
      if(-not(Test-Path -LiteralPath $file) -or (Get-NexoraSha256 $file) -ne $expected){throw 'Windows SDK signing tool file differs from the pinned archive. No tool was executed.'}
      $signature=Get-AuthenticodeSignature -LiteralPath $file
      if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $signature.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation'){throw 'Windows signing tool Microsoft publisher verification failed. No tool was executed.'}
    }
    $unexpected=@(Get-ChildItem -LiteralPath (Split-Path -Parent $Bundle.Tool) -Filter '*.dll' -File | Where-Object {$Bundle.Names -notcontains $_.Name})
    if($unexpected.Count){throw 'Unexpected adjacent DLL in the signing tool bundle. No tool was executed.'}
  }finally{$archive.Dispose()}
}

function Set-NexoraPublisherSignature {
  param([Parameter(Mandatory=$true)][string]$Path,[Parameter(Mandatory=$true)]$Certificate,[Parameter(Mandatory=$true)][string]$TimestampServer)
  $timestampAddress=$null
  if(-not [Uri]::TryCreate($TimestampServer,[UriKind]::Absolute,[ref]$timestampAddress) -or $timestampAddress.Scheme -ne 'https' -or $timestampAddress.UserInfo -or $timestampAddress.Fragment){throw 'Supply the trusted signing provider HTTPS timestamp endpoint using -TimestampServer or NEXORA_SIGNING_TIMESTAMP_URL.'}
  $tool=Resolve-NexoraSignTool
  $signArguments=@('sign','/sha1',$Certificate.Thumbprint,'/s','My','/fd','SHA256','/tr',$TimestampServer,'/td','SHA256')
  if($Certificate.NexoraMachineStore){$signArguments+='/sm'}
  $signArguments+=$Path
  & $tool @signArguments | Out-Null
  if($LASTEXITCODE -ne 0){throw 'SignTool signing/timestamping failed. The installed launcher was preserved.'}
  return Assert-NexoraPublisherSignature -Path $Path -ExpectedThumbprint $Certificate.Thumbprint
}
