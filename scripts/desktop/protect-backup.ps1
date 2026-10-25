param([Parameter(Mandatory=$true)][string]$SourcePath,[Parameter(Mandatory=$true)][string]$TargetPath,[switch]$Decrypt)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Security
$bytes=[IO.File]::ReadAllBytes($SourcePath)
if($Decrypt){$result=[Security.Cryptography.ProtectedData]::Unprotect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)}
else{$result=[Security.Cryptography.ProtectedData]::Protect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)}
[IO.File]::WriteAllBytes($TargetPath,$result)
