$ErrorActionPreference='Stop'
function Copy-NexoraFile {param([string]$Source,[string]$Destination) [IO.File]::Copy($Source,$Destination,$true)}
function Restore-NexoraReleaseFiles {
  param([string]$Backup,[string]$Destination)
  $existed=Get-Content -LiteralPath (Join-Path $Backup 'previous.json') -Raw | ConvertFrom-Json
  foreach($name in @('NEXORA.exe','NEXORA.ico','NEXORA.png','launcher.conf')){$target=Join-Path $Destination $name;if($existed.$name){[IO.File]::Copy((Join-Path $Backup $name),$target,$true)}elseif([IO.File]::Exists($target)){[IO.File]::Delete($target)}}
}

# File transaction only. The public installer verifies signatures/catalog first.
# User profiles, database folders, backups and .env are outside this fixed list.
function Copy-NexoraReleaseFiles {
  param([Parameter(Mandatory=$true)][string]$Source,[Parameter(Mandatory=$true)][string]$Destination)
  $names=@('NEXORA.exe','NEXORA.ico','NEXORA.png','launcher.conf')
  $sourcePath=(Resolve-Path -LiteralPath $Source).Path
  $targetPath=[IO.Path]::GetFullPath($Destination)
  if($sourcePath -eq $targetPath){throw 'Release staging and installation directories must differ.'}
  foreach($name in $names){$file=Get-Item -LiteralPath (Join-Path $sourcePath $name);if($file.PSIsContainer -or ($file.Attributes -band [IO.FileAttributes]::ReparsePoint)){throw 'Release files must be regular files.'}}
  New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
  $backup=Join-Path (Split-Path -Parent $targetPath) ('desktop-upgrade-'+[guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $backup | Out-Null
  $existed=@{}
  foreach($name in $names){$target=Join-Path $targetPath $name;$existed[$name]=Test-Path -LiteralPath $target;if($existed[$name]){if((Get-Item -LiteralPath $target).Attributes -band [IO.FileAttributes]::ReparsePoint){throw 'Installed launcher files cannot be reparse points.'};[IO.File]::Copy($target,(Join-Path $backup $name),$false)}}
  $existed | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $backup 'previous.json') -Encoding UTF8
  try{
    foreach($name in $names){Copy-NexoraFile -Source (Join-Path $sourcePath $name) -Destination (Join-Path $targetPath $name);if((Get-NexoraSha256 -Path (Join-Path $sourcePath $name)) -ne (Get-NexoraSha256 -Path (Join-Path $targetPath $name))){throw 'Installed file integrity check failed.'}}
  }catch{
    Restore-NexoraReleaseFiles -Backup $backup -Destination $targetPath
    throw 'Launcher upgrade failed; previous launcher files were restored. User data was not reset.'
  }
  return $backup
}

function Assert-NexoraRelease {
  param([Parameter(Mandatory=$true)][string]$Path,[Parameter(Mandatory=$true)][string]$ExpectedPublisherThumbprint)
  $folder=(Resolve-Path -LiteralPath $Path).Path
  if((Get-Item -LiteralPath $folder).Attributes -band [IO.FileAttributes]::ReparsePoint){throw 'Release staging cannot be a reparse point.'}
  foreach($name in @('NEXORA.exe','NEXORA.cat','Install-NEXORA.ps1','publisher-signing.ps1','release-files.ps1')){[void](Assert-NexoraPublisherSignature -Path (Join-Path $folder $name) -ExpectedThumbprint $ExpectedPublisherThumbprint)}
  $catalog=Test-FileCatalog -Path $folder -CatalogFilePath (Join-Path $folder 'NEXORA.cat')
  if($catalog.ToString() -ne 'Valid'){throw 'NEXORA release catalog integrity validation failed.'}
  $configuration=[IO.File]::ReadAllLines((Join-Path $folder 'launcher.conf'))
  if($configuration.Count -ne 3){throw 'Invalid NEXORA launcher configuration.'}
  $projectRoot=[IO.Path]::GetFullPath($configuration[0])
  if(-not(Test-Path -LiteralPath (Join-Path $projectRoot 'package.json')) -or ((Get-Content -LiteralPath (Join-Path $projectRoot 'package.json') -Raw | ConvertFrom-Json).name -ne 'nexora-ai')){throw 'NEXORA project directory is unavailable.'}
  foreach($relative in @('apps/api/dist/main.js','apps/web/.next/BUILD_ID')){if(-not(Test-Path -LiteralPath (Join-Path $projectRoot $relative))){throw 'The compiled NEXORA application build is missing.'}}
  for($index=1;$index -le 2;$index++){
    $file=$configuration[$index];$expectedName=if($index -eq 1){'node.exe'}else{'msedge.exe'};$publisher=if($index -eq 1){'O=OpenJS Foundation'}else{'O=Microsoft Corporation'}
    if(-not [IO.Path]::IsPathRooted($file) -or [IO.Path]::GetFileName($file) -ine $expectedName -or -not(Test-Path -LiteralPath $file -PathType Leaf)){throw 'A required installed application dependency path is invalid.'}
    $signature=Get-AuthenticodeSignature -LiteralPath $file
    if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $signature.SignerCertificate.Subject -notmatch $publisher){throw 'A required application dependency has an unexpected or invalid publisher signature.'}
  }
  return $projectRoot
}
