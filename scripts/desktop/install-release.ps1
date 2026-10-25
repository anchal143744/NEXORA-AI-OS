param([Parameter(Mandatory=$true)][string]$ReleasePath,[Parameter(Mandatory=$true)][string]$ExpectedPublisherThumbprint,[switch]$NoShortcut)
$ErrorActionPreference='Stop'
Import-Module (Join-Path $PSHOME 'Modules/Microsoft.PowerShell.Security/Microsoft.PowerShell.Security.psd1') -ErrorAction Stop
# Verify helpers before dot-sourcing code from a release package. Obtain the
# expected publisher thumbprint out of band, not from the downloaded package.
foreach($name in @('publisher-signing.ps1','release-files.ps1')){
  $signature=Get-AuthenticodeSignature -LiteralPath (Join-Path $ReleasePath $name)
  if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $signature.SignerCertificate.Thumbprint -ne $ExpectedPublisherThumbprint){throw 'Release helper publisher verification failed. No files were installed.'}
}
. (Join-Path $ReleasePath 'publisher-signing.ps1')
. (Join-Path $ReleasePath 'release-files.ps1')
$projectRoot=Assert-NexoraRelease -Path $ReleasePath -ExpectedPublisherThumbprint $ExpectedPublisherThumbprint
$destination=Join-Path $projectRoot '.local/desktop'
$shortcutPath=$null;$shortcutBytes=$null
if(-not $NoShortcut){
  $desktop=[Environment]::GetFolderPath('Desktop');$shell=New-Object -ComObject WScript.Shell;$shortcutPath=Join-Path $desktop 'NEXORA.lnk'
  if(Test-Path -LiteralPath $shortcutPath){$existing=$shell.CreateShortcut($shortcutPath);if($existing.TargetPath -ne (Join-Path $destination 'NEXORA.exe')){throw 'An unrelated NEXORA shortcut exists; nothing was installed. Use -NoShortcut and choose a separate shortcut name manually.'};$shortcutBytes=[IO.File]::ReadAllBytes($shortcutPath)}
}
$mutex=New-Object Threading.Mutex($false,'Local\NEXORA_Retail_Launcher')
$acquired=$false
$backup=$null
try{
  try{$acquired=$mutex.WaitOne(30000)}catch [Threading.AbandonedMutexException] {$acquired=$true}
  if(-not $acquired){throw 'NEXORA is starting. Try the upgrade after startup finishes.'}
  $backup=Copy-NexoraReleaseFiles -Source $ReleasePath -Destination $destination
  [void](Assert-NexoraPublisherSignature -Path (Join-Path $destination 'NEXORA.exe') -ExpectedThumbprint $ExpectedPublisherThumbprint)
  if(-not $NoShortcut){
    $executable=Join-Path $destination 'NEXORA.exe'
    $shortcut=$shell.CreateShortcut($shortcutPath);$shortcut.TargetPath=$executable;$shortcut.WorkingDirectory=$projectRoot;$shortcut.IconLocation=(Join-Path $destination 'NEXORA.ico')+',0';$shortcut.Description='NEXORA local business application';$shortcut.Save()
  }
  Write-Output 'Verified NEXORA launcher installed. Previous launcher files retained; database, configuration and browser profile preserved.'
}catch{
  if($backup){Restore-NexoraReleaseFiles -Backup $backup -Destination $destination}
  if($shortcutPath){if($shortcutBytes){[IO.File]::WriteAllBytes($shortcutPath,$shortcutBytes)}elseif([IO.File]::Exists($shortcutPath)){[IO.File]::Delete($shortcutPath)}}
  throw 'NEXORA installation failed; previous launcher/shortcut restored where present. User data was not reset.'
}finally{if($acquired){$mutex.ReleaseMutex()};$mutex.Dispose()}
