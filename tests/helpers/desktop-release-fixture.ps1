param([Parameter(Mandatory=$true)][string]$Root,[Parameter(Mandatory=$true)][ValidateSet('install','rollback','catalog')][string]$Scenario)
$ErrorActionPreference='Stop'
$repo=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$allowed=[IO.Path]::GetFullPath((Join-Path $repo 'tests/.runtime'))+[IO.Path]::DirectorySeparatorChar
if(-not [IO.Path]::GetFullPath($Root).StartsWith($allowed,[StringComparison]::OrdinalIgnoreCase)){throw 'Fixture must stay in the test runtime directory.'}
. (Join-Path $repo 'scripts/desktop/publisher-signing.ps1')
. (Join-Path $repo 'scripts/desktop/release-files.ps1')
$source=Join-Path $Root 'release';$target=Join-Path $Root 'installed'
New-Item -ItemType Directory -Force -Path $source,$target,(Join-Path $target 'browser-profile') | Out-Null
$names=@('NEXORA.exe','NEXORA.ico','NEXORA.png','launcher.conf')
foreach($name in $names){[IO.File]::WriteAllText((Join-Path $source $name),('synthetic-new-'+$name));[IO.File]::WriteAllText((Join-Path $target $name),('synthetic-old-'+$name))}
$data=Join-Path $target 'browser-profile/session.json';[IO.File]::WriteAllText($data,'synthetic-saved-profile')
$configuration=Join-Path $Root '.env';[IO.File]::WriteAllText($configuration,'SYNTHETIC_SETTING=preserve')
$beforeData=Get-NexoraSha256 -Path $data;$beforeConfiguration=Get-NexoraSha256 -Path $configuration
if($Scenario -eq 'install'){
  [void](Copy-NexoraReleaseFiles -Source $source -Destination $target)
  [void](Copy-NexoraReleaseFiles -Source $source -Destination $target)
  foreach($name in $names){if((Get-NexoraSha256 -Path (Join-Path $source $name)) -ne (Get-NexoraSha256 -Path (Join-Path $target $name))){throw 'Fixture reinstall mismatch'}}
}elseif($Scenario -eq 'rollback'){
  function Copy-NexoraFile {param([string]$Source,[string]$Destination) if($Destination.EndsWith('NEXORA.png')){throw 'Synthetic disk failure'};[IO.File]::Copy($Source,$Destination,$true)}
  $failed=$false
  try{[void](Copy-NexoraReleaseFiles -Source $source -Destination $target)}catch{if($_.Exception.Message -notmatch 'previous launcher files were restored'){throw};$failed=$true}
  if(-not $failed){throw 'Expected a file transaction failure'}
  foreach($name in $names){if([IO.File]::ReadAllText((Join-Path $target $name)) -ne ('synthetic-old-'+$name)){throw 'Fixture rollback mismatch'}}
}else{
  $catalog=Join-Path $source 'NEXORA.cat'
  New-FileCatalog -Path $source -CatalogFilePath $catalog -CatalogVersion 2.0 | Out-Null
  if((Test-FileCatalog -Path $source -CatalogFilePath $catalog).ToString() -ne 'Valid'){throw 'New fixture catalog should match'}
  [IO.File]::AppendAllText((Join-Path $source 'launcher.conf'),'tampered')
  if((Test-FileCatalog -Path $source -CatalogFilePath $catalog).ToString() -ne 'ValidationFailed'){throw 'Tampering must fail catalog integrity validation'}
}
if((Get-NexoraSha256 -Path $data) -ne $beforeData -or (Get-NexoraSha256 -Path $configuration) -ne $beforeConfiguration){throw 'Fixture user data changed'}
@{scenario=$Scenario;passed=$true;syntheticFilesOnly=$true;binaryExecuted=$false;profilePreserved=$true;configurationPreserved=$true} | ConvertTo-Json
