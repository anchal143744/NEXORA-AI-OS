param([Parameter(Mandatory=$true)][string]$Payload,[Parameter(Mandatory=$true)][string]$Output,[string]$Version='1.9.0')
$ErrorActionPreference='Stop'
# Windows Installer database authoring only: no custom action, shell command,
# database command, elevation, recursive removal or install is performed here.
$folder=(Resolve-Path -LiteralPath $Payload).Path
$outputPath=[IO.Path]::GetFullPath($Output)
if(Test-Path -LiteralPath $outputPath){throw 'Refusing to overwrite an existing installer.'}
$files=@(Get-ChildItem -LiteralPath $folder -File | Sort-Object Name)
if($files.Count -lt 6 -or -not(Test-Path -LiteralPath (Join-Path $folder 'NEXORA.exe'))){throw 'Desktop payload is incomplete.'}
foreach($file in $files){if($file.Attributes -band [IO.FileAttributes]::ReparsePoint){throw 'Payload files cannot be reparse points.'}}
$installer=New-Object -ComObject WindowsInstaller.Installer
$database=$installer.OpenDatabase($outputPath,3)
$columnNames=@{
Property='Property,Value';Directory='Directory,Directory_Parent,DefaultDir';Component='Component,ComponentId,Directory_,Attributes,Condition,KeyPath';Feature='Feature,Feature_Parent,Title,Description,Display,Level,Directory_,Attributes';FeatureComponents='Feature_,Component_';File='File,Component_,FileName,FileSize,Version,Language,Attributes,Sequence';Media='DiskId,LastSequence,DiskPrompt,Cabinet,VolumeLabel,Source';Registry='Registry,Root,Key,Name,Value,Component_';Shortcut='Shortcut,Directory_,Name,Component_,Target,Arguments,Description,Hotkey,Icon_,IconIndex,ShowCmd,WkDir';InstallExecuteSequence='Action,Condition,Sequence';Upgrade='UpgradeCode,VersionMin,VersionMax,Language,Attributes,Remove,ActionProperty';LaunchCondition='Condition,Description'
}
function Sql([string]$sql){try{$view=$database.OpenView($sql);try{$view.Execute()}finally{$view.Close()}}catch{throw ('MSI schema authoring failed: '+$sql+'; '+$_.Exception.Message)}}
function Row([string]$table,[object[]]$values){
  $marks=($values | ForEach-Object {'?'}) -join ','
  $names=@($columnNames[$table].Split(',') | ForEach-Object {'`'+$_+'`'})
  if($names.Count -ne $values.Count){throw ('MSI row column mismatch: '+$table)}
  $query='INSERT INTO `'+$table+'` ('+($names -join ',')+') VALUES ('+$marks+')'
  try{$view=$database.OpenView($query)}catch{throw ('MSI insert preparation failed: '+$query)}
  $record=$installer.CreateRecord($values.Count)
  for($i=0;$i -lt $values.Count;$i++){if($null -ne $values[$i]){if($values[$i] -is [int]){$record.IntegerData($i+1)=$values[$i]}else{$record.StringData($i+1)=[string]$values[$i]}}}
  try{$view.Execute($record)}finally{$view.Close()}
}
function Stream([string]$table,[string]$name,[string]$file){$view=$database.OpenView(('INSERT INTO `'+$table+'` (`Name`,`Data`) VALUES (?, ?)'));$record=$installer.CreateRecord(2);$record.StringData(1)=$name;$record.SetStream(2,$file);try{$view.Execute($record)}finally{$view.Close()}}
Sql 'CREATE TABLE `Property` (`Property` CHAR(72) NOT NULL, `Value` CHAR(0) NOT NULL PRIMARY KEY `Property`)'
Sql 'CREATE TABLE `Directory` (`Directory` CHAR(72) NOT NULL, `Directory_Parent` CHAR(72), `DefaultDir` CHAR(255) NOT NULL PRIMARY KEY `Directory`)'
Sql 'CREATE TABLE `Component` (`Component` CHAR(72) NOT NULL, `ComponentId` CHAR(38), `Directory_` CHAR(72) NOT NULL, `Attributes` SHORT NOT NULL, `Condition` CHAR(255), `KeyPath` CHAR(72) PRIMARY KEY `Component`)'
Sql 'CREATE TABLE `Feature` (`Feature` CHAR(38) NOT NULL, `Feature_Parent` CHAR(38), `Title` CHAR(64), `Description` CHAR(255), `Display` SHORT, `Level` SHORT NOT NULL, `Directory_` CHAR(72), `Attributes` SHORT NOT NULL PRIMARY KEY `Feature`)'
Sql 'CREATE TABLE `FeatureComponents` (`Feature_` CHAR(38) NOT NULL, `Component_` CHAR(72) NOT NULL PRIMARY KEY `Feature_`, `Component_`)'
Sql 'CREATE TABLE `File` (`File` CHAR(72) NOT NULL, `Component_` CHAR(72) NOT NULL, `FileName` CHAR(255) NOT NULL, `FileSize` LONG NOT NULL, `Version` CHAR(72), `Language` CHAR(20), `Attributes` SHORT, `Sequence` LONG NOT NULL PRIMARY KEY `File`)'
Sql 'CREATE TABLE `Media` (`DiskId` SHORT NOT NULL, `LastSequence` LONG NOT NULL, `DiskPrompt` CHAR(64), `Cabinet` CHAR(255), `VolumeLabel` CHAR(32), `Source` CHAR(72) PRIMARY KEY `DiskId`)'
Sql 'CREATE TABLE `Registry` (`Registry` CHAR(72) NOT NULL, `Root` SHORT NOT NULL, `Key` CHAR(255) NOT NULL, `Name` CHAR(255), `Value` CHAR(0), `Component_` CHAR(72) NOT NULL PRIMARY KEY `Registry`)'
Sql 'CREATE TABLE `Shortcut` (`Shortcut` CHAR(72) NOT NULL, `Directory_` CHAR(72) NOT NULL, `Name` CHAR(128) NOT NULL, `Component_` CHAR(72) NOT NULL, `Target` CHAR(255) NOT NULL, `Arguments` CHAR(255), `Description` CHAR(255), `Hotkey` SHORT, `Icon_` CHAR(72), `IconIndex` SHORT, `ShowCmd` SHORT, `WkDir` CHAR(72) PRIMARY KEY `Shortcut`)'
Sql 'CREATE TABLE `Icon` (`Name` CHAR(72) NOT NULL, `Data` OBJECT NOT NULL PRIMARY KEY `Name`)'
Sql 'CREATE TABLE `InstallExecuteSequence` (`Action` CHAR(72) NOT NULL, `Condition` CHAR(255), `Sequence` SHORT PRIMARY KEY `Action`)'
Sql 'CREATE TABLE `Upgrade` (`UpgradeCode` CHAR(38) NOT NULL, `VersionMin` CHAR(20), `VersionMax` CHAR(20), `Language` CHAR(255), `Attributes` LONG NOT NULL, `Remove` CHAR(255), `ActionProperty` CHAR(72) NOT NULL PRIMARY KEY `UpgradeCode`, `VersionMin`, `VersionMax`, `Language`, `Attributes`)'
Sql 'CREATE TABLE `LaunchCondition` (`Condition` CHAR(255) NOT NULL, `Description` CHAR(255) NOT NULL PRIMARY KEY `Condition`)'
$upgrade='{B0B664B5-549C-4A01-ACD2-E321A6608BB4}'
$properties=@{ProductCode=('{'+[guid]::NewGuid().ToString().ToUpperInvariant()+'}');UpgradeCode=$upgrade;ProductName='NEXORA AI';ProductVersion=$Version;ProductLanguage='1033';Manufacturer='NEXORA';INSTALLLEVEL='1';ARPNOMODIFY='1';ARPPRODUCTICON='NexoraIcon';SecureCustomProperties='OLDERPRODUCTS;NEWERPRODUCTS';MSIINSTALLPERUSER='1'}
foreach($key in $properties.Keys){Row 'Property' @($key,$properties[$key])}
Row 'Directory' @('TARGETDIR',$null,'SourceDir')
Row 'Directory' @('LocalAppDataFolder','TARGETDIR','.')
Row 'Directory' @('ProgramsFolder','LocalAppDataFolder','Programs')
Row 'Directory' @('INSTALLDIR','ProgramsFolder','NEXORA')
Row 'Directory' @('DesktopFolder','TARGETDIR','.')
Row 'Directory' @('ProgramMenuFolder','TARGETDIR','.')
Row 'Directory' @('NexoraMenu','ProgramMenuFolder','NEXORA')
Row 'Component' @('DesktopHost','{18D14045-04CD-4476-AC38-F43BBE5A83DE}','INSTALLDIR',260,$null,'InstallRegistry')
Row 'Registry' @('InstallRegistry',1,'Software\NEXORA\Desktop','InstallPath','[INSTALLDIR]','DesktopHost')
Row 'Feature' @('Desktop',$null,'NEXORA AI','Embedded NEXORA Windows application',1,1,'INSTALLDIR',0)
Row 'FeatureComponents' @('Desktop','DesktopHost')
foreach($entry in @(@('NexoraDesktop','DesktopFolder'),@('NexoraStart','NexoraMenu'))){Row 'Shortcut' @($entry[0],$entry[1],'NEXORA','DesktopHost','[INSTALLDIR]NEXORA.exe',$null,'NEXORA AI business workspace',$null,'NexoraIcon',0,1,'INSTALLDIR')}
Stream 'Icon' 'NexoraIcon' (Join-Path $folder 'NEXORA.ico')
$cabFolder=Join-Path (Split-Path -Parent $outputPath) 'cabinet'
New-Item -ItemType Directory -Path $cabFolder -ErrorAction Stop | Out-Null
$ddf=@('.OPTION EXPLICIT','.Set Cabinet=on','.Set Compress=on','.Set CompressionType=MSZIP','.Set MaxDiskSize=0','.Set MaxCabinetSize=0','.Set CabinetNameTemplate=payload.cab',('.Set DiskDirectoryTemplate="'+$cabFolder+'"'),('.Set InfFileName="'+(Join-Path $cabFolder 'setup.inf')+'"'),('.Set RptFileName="'+(Join-Path $cabFolder 'setup.rpt')+'"'))
$index=0
foreach($file in $files){$index++;$id='F'+$index.ToString('D3');$fileVersion=[Diagnostics.FileVersionInfo]::GetVersionInfo($file.FullName).FileVersion;if($fileVersion -notmatch '^\d+\.\d+\.\d+\.\d+$'){$fileVersion=$null};Row 'File' @($id,'DesktopHost',$file.Name,[int]$file.Length,$fileVersion,$null,512,$index);$ddf+=('"'+$file.FullName+'" '+$id)}
$ddfPath=Join-Path $cabFolder 'payload.ddf';[IO.File]::WriteAllLines($ddfPath,$ddf,[Text.Encoding]::ASCII)
& "$env:WINDIR/system32/makecab.exe" /F $ddfPath | Out-Null
if($LASTEXITCODE -ne 0){throw 'Windows makecab failed.'}
Row 'Media' @(1,$index,$null,'#payload.cab',$null,$null)
Stream '_Streams' 'payload.cab' (Join-Path $cabFolder 'payload.cab')
Row 'Upgrade' @($upgrade,$null,$Version,$null,1,$null,'OLDERPRODUCTS')
Row 'Upgrade' @($upgrade,$Version,$null,$null,258,$null,'NEWERPRODUCTS')
Row 'LaunchCondition' @('NOT NEWERPRODUCTS','A newer or equal NEXORA release is already installed. Use repair or uninstall the existing desktop shell first. Your database is outside the installer.')
Row 'LaunchCondition' @('VersionNT64','NEXORA requires 64-bit Windows.')
$actions=@{FindRelatedProducts=25;LaunchConditions=100;ValidateProductID=700;CostInitialize=800;FileCost=900;CostFinalize=1000;MigrateFeatureStates=1200;InstallValidate=1400;InstallInitialize=1500;RemoveExistingProducts=1510;ProcessComponents=1600;UnpublishFeatures=1800;RemoveShortcuts=3200;RemoveRegistryValues=2600;RemoveFiles=3500;InstallFiles=4000;CreateShortcuts=4500;WriteRegistryValues=5000;RegisterUser=6000;RegisterProduct=6100;PublishFeatures=6300;PublishProduct=6400;InstallFinalize=6600}
foreach($key in $actions.Keys){$condition=if($key -eq 'RemoveExistingProducts'){'OLDERPRODUCTS'}else{$null};Row 'InstallExecuteSequence' @($key,$condition,[int]$actions[$key])}
$summary=$database.SummaryInformation(20)
$summary.Property(2)='NEXORA AI Windows desktop installation';$summary.Property(3)='Embedded desktop host; existing engine and data preserved';$summary.Property(4)='NEXORA';$summary.Property(7)='x64;1033';$summary.Property(9)=('{'+[guid]::NewGuid().ToString().ToUpperInvariant()+'}');$summary.Property(14)=500;$summary.Property(15)=10;$summary.Property(18)='NEXORA Windows Installer authoring';$summary.Persist()
$database.Commit()
[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($summary)
[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($database)
[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($installer)
Write-Output ('Windows Installer package authored (not installed): '+$outputPath)
