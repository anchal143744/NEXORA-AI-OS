$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
$version='1.0.4258.31'
$expected='56F7F4B8BF9AEE4B8EFEFBBDD4F67D5F74EBD1B100ED0806DA71BF76AF481AA9'
$root=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$folder=Join-Path $root ('.local/tools/webview2/'+$version)
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$archive=Join-Path $folder 'webview2.zip'
if(-not(Test-Path -LiteralPath $archive)){Invoke-WebRequest -UseBasicParsing -Uri "https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/$version/microsoft.web.webview2.$version.nupkg" -OutFile $archive -TimeoutSec 60}
if((Get-NexoraSha256 $archive) -ne $expected){throw 'Microsoft WebView2 SDK archive hash mismatch. No code was executed.'}
$sdk=Join-Path $folder 'sdk'
Expand-Archive -LiteralPath $archive -DestinationPath $sdk -Force
$signature=Get-AuthenticodeSignature -LiteralPath (Join-Path $sdk 'build/native/x64/WebView2Loader.dll')
if($signature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $signature.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation'){throw 'WebView2 loader Microsoft signature validation failed.'}
Write-Output "Verified pinned WebView2 SDK $version. No runtime or app was installed or executed."
