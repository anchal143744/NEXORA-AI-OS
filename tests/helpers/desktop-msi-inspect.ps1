param([Parameter(Mandatory=$true)][string]$Package,[Parameter(Mandatory=$true)][string]$Payload)
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot '../../scripts/desktop/publisher-signing.ps1')
$installer=New-Object -ComObject WindowsInstaller.Installer
$db=$installer.OpenDatabase((Resolve-Path -LiteralPath $Package).Path,0)
function Rows([string]$sql,[int]$count){$view=$db.OpenView($sql);[void]$view.Execute();try{while($record=$view.Fetch()){$values=@();for($i=1;$i -le $count;$i++){$values+=$record.StringData($i)};Write-Output -NoEnumerate $values}}finally{[void]$view.Close()}}
$properties=@{};foreach($row in (Rows 'SELECT `Property`,`Value` FROM `Property`' 2)){$properties[$row[0]]=$row[1]}
$tables=@(Rows 'SELECT `Name` FROM `_Tables`' 1 | ForEach-Object {$_[0]})
if($tables -contains 'CustomAction' -or $tables -contains 'RemoveFile'){throw 'Unexpected executable custom actions or wildcard cleanup table.'}
if($properties.ProductName -ne 'NEXORA AI' -or $properties.ALLUSERS){throw 'Unexpected application or privileged installation scope.'}
$files=@(Rows 'SELECT `File`,`FileName`,`FileSize` FROM `File` ORDER BY `Sequence`' 3)
if($files.Count -ne @(Get-ChildItem -LiteralPath $Payload -File).Count){throw 'The MSI payload file count differs.'}
$cab=Join-Path (Split-Path -Parent $Package) 'cabinet/payload.cab'
$streamView=$db.OpenView('SELECT `Data` FROM `_Streams` WHERE `Name` = ''payload.cab''');[void]$streamView.Execute();$streamRecord=$streamView.Fetch()
if(-not $streamRecord -or $streamRecord.DataSize(1) -ne (Get-Item -LiteralPath $cab).Length){throw 'The embedded cabinet stream is incomplete.'};[void]$streamView.Close()
$extracted=Join-Path (Split-Path -Parent $Package) ('verification-'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $extracted | Out-Null
& "$env:WINDIR/system32/expand.exe" '-F:*' $cab $extracted | Out-Null
if($LASTEXITCODE -ne 0){throw 'Could not verify cabinet contents.'}
foreach($row in $files){
  if($row[1] -match '(?i)\.env|\.dump|postgres|runtime\.json|launcher\.conf'){throw 'Private workspace content was included in MSI.'}
  $source=Join-Path $Payload $row[1];$copy=Join-Path $extracted $row[0]
  if((Get-NexoraSha256 $source) -ne (Get-NexoraSha256 $copy) -or (Get-Item -LiteralPath $copy).Length -ne [int]$row[2]){throw 'Cabinet payload hash or size mismatch.'}
}
$actions=@(Rows 'SELECT `Action` FROM `InstallExecuteSequence`' 1 | ForEach-Object {$_[0]})
foreach($required in @('RemoveExistingProducts','RemoveFiles','InstallFiles','CreateShortcuts','InstallFinalize')){if($actions -notcontains $required){throw 'An upgrade, install or uninstall action is missing.'}}
$shortcuts=@(Rows 'SELECT `Target`,`WkDir` FROM `Shortcut`' 2)
if($shortcuts.Count -ne 2){throw 'Desktop and start menu shortcuts are required.'}
foreach($row in $shortcuts){if($row[0] -ne '[INSTALLDIR]NEXORA.exe' -or $row[1] -ne 'INSTALLDIR'){throw 'Shortcut target or working directory mismatch.'}}
$directories=@(Rows 'SELECT `Directory`,`Directory_Parent` FROM `Directory`' 2)
if(-not($directories | Where-Object {$_[0] -eq 'ProgramsFolder' -and $_[1] -eq 'LocalAppDataFolder'})){throw 'Installation must be scoped to the current user.'}
$upgrades=@(Rows 'SELECT `UpgradeCode`,`Attributes` FROM `Upgrade`' 2)
if($upgrades.Count -ne 2){throw 'Upgrade and downgrade detection must both exist.'}
$signature=Get-AuthenticodeSignature -LiteralPath $Package
[ordered]@{passed=$true;files=$files.Count;cabinetHashesVerified=$true;shortcuts=2;perUser=$true;upgradeAndDowngradeRulesPresent=$true;customActionsPresent=$false;installed=$false;executed=$false;signatureStatus=$signature.Status.ToString()} | ConvertTo-Json
