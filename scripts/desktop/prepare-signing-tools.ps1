$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
$bundle=Get-NexoraSigningToolsBundle
New-Item -ItemType Directory -Force -Path $bundle.Folder | Out-Null
if(-not(Test-Path -LiteralPath $bundle.Archive)){
  Invoke-WebRequest -UseBasicParsing -Uri ('https://api.nuget.org/v3-flatcontainer/microsoft.windows.sdk.buildtools/'+$bundle.Version+'/microsoft.windows.sdk.buildtools.'+$bundle.Version+'.nupkg') -OutFile $bundle.Archive -TimeoutSec 120
}
if((Get-NexoraSha256 $bundle.Archive) -ne $bundle.Sha256){throw 'Pinned Windows SDK archive hash mismatch. Nothing was executed or installed.'}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$destination=Join-Path $bundle.Folder 'x64'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$archive=[IO.Compression.ZipFile]::OpenRead($bundle.Archive)
try{
  foreach($name in $bundle.Names){
    $entry=$archive.GetEntry($bundle.Prefix+$name)
    if(-not $entry){throw 'Required Windows signing tool package entry is missing.'}
    [IO.Compression.ZipFileExtensions]::ExtractToFile($entry,(Join-Path $destination $name),$true)
  }
}finally{$archive.Dispose()}
Assert-NexoraSigningToolsBundle $bundle
[ordered]@{tool=(Resolve-NexoraSignTool -Path $bundle.Tool);version=$bundle.Version;archiveSha256=$bundle.Sha256;filesVerified=$bundle.Names.Count;publisherVerified=$true;systemInstallerExecuted=$false;certificateCreated=$false;protectionChanged=$false} | ConvertTo-Json
