$ErrorActionPreference='Stop'
$projectRoot=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$nodePath=(Get-Command node.exe -ErrorAction Stop).Source
& $nodePath (Join-Path $projectRoot 'scripts/desktop-stop.mjs')
exit $LASTEXITCODE
