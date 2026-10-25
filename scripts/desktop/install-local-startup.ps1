param()
$ErrorActionPreference='Stop'
# Source-workspace convenience only; does not install or replace the signed native release.
$root=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$launcher=Join-Path $root 'scripts\open-local-desktop.cmd'
if(-not(Test-Path -LiteralPath $launcher)){throw 'Local source launcher is missing.'}
$shell=New-Object -ComObject WScript.Shell
$desktop=Join-Path ([Environment]::GetFolderPath('Desktop')) 'NEXORA AI OS.lnk'
$startup=Join-Path ([Environment]::GetFolderPath('Startup')) 'NEXORA Local Services.lnk'
$backup=Join-Path $root '.local\desktop\shortcut-backups'
New-Item -ItemType Directory -Force -Path $backup | Out-Null
foreach($item in @(@{Path=$desktop;ServicesOnly=$false},@{Path=$startup;ServicesOnly=$true})){
  if(Test-Path -LiteralPath $item.Path){
    $original=$shell.CreateShortcut($item.Path)
    if($item.ServicesOnly -and $original.Description -ne 'NEXORA local source services at Windows sign-in'){throw 'An unrelated Startup shortcut already exists; it was preserved.'}
    $copy=Join-Path $backup ((Split-Path $item.Path -Leaf)+'.original.lnk')
    if(-not(Test-Path -LiteralPath $copy)){Copy-Item -LiteralPath $item.Path -Destination $copy}
  }
  $shortcut=$shell.CreateShortcut($item.Path)
  $shortcut.TargetPath=Join-Path $env:WINDIR 'System32\cmd.exe'
  $suffix=if($item.ServicesOnly){' --verify'}else{''}
  $shortcut.Arguments='/d /c ""'+$launcher+'"'+$suffix+'"'
  $shortcut.WorkingDirectory=$root
  $shortcut.IconLocation=Join-Path $root '.local\desktop\NEXORA.ico'
  $shortcut.WindowStyle=7
  $shortcut.Description=if($item.ServicesOnly){'NEXORA local source services at Windows sign-in'}else{'Start local NEXORA services, wait for health checks, then open your existing app'}
  $shortcut.Save()
  $saved=$shell.CreateShortcut($item.Path)
  if($saved.TargetPath -ne $shortcut.TargetPath -or $saved.Arguments -ne $shortcut.Arguments){throw 'Shortcut verification failed.'}
  Write-Output ('Configured: '+$item.Path)
}
Write-Output 'No administrator access, native EXE installation, security changes or database changes were performed.'
