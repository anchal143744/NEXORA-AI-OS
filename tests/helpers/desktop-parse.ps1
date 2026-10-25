$ErrorActionPreference='Stop'
$repo=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
foreach($file in (Get-ChildItem -LiteralPath (Join-Path $repo 'scripts/desktop') -Filter '*.ps1')){
  $tokens=$null;$parseErrors=$null
  [void][System.Management.Automation.Language.Parser]::ParseFile($file.FullName,[ref]$tokens,[ref]$parseErrors)
  if($parseErrors.Count){throw ('Invalid desktop script syntax: '+$file.Name)}
}
Write-Output 'All desktop PowerShell files parsed successfully without executing installer code.'
