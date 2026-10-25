param([switch]$DevelopmentBuild,[string]$CertificateThumbprint=$env:NEXORA_SIGNING_CERT_THUMBPRINT,[string]$TimestampServer=$env:NEXORA_SIGNING_TIMESTAMP_URL)
$ErrorActionPreference='Stop'
$root=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
$certificate=$null
if(-not $DevelopmentBuild){$certificate=Get-NexoraSigningCertificate $CertificateThumbprint;[void](Resolve-NexoraSignTool);if(-not $TimestampServer){throw 'A trusted provider timestamp URL is required.'}}
foreach($name in @('apps/api/dist/main.js','apps/web/.next/BUILD_ID')){if(-not(Test-Path -LiteralPath (Join-Path $root $name))){throw 'Production API and web builds are required.'}}
$sdk=Join-Path $root '.local/tools/webview2/1.0.4258.31/sdk'
if(-not(Test-Path -LiteralPath (Join-Path $sdk 'lib/net462/Microsoft.Web.WebView2.Core.dll'))){throw 'Run npm run desktop:sdk to download and verify the pinned Microsoft WebView2 SDK.'}
# Always revalidate the archive and Microsoft loader, even when cached.
& (Join-Path $PSScriptRoot 'prepare-webview2.ps1')
$node=(Get-Command node.exe -ErrorAction Stop).Source
$nodeSignature=Get-AuthenticodeSignature -LiteralPath $node
if($nodeSignature.Status -ne [System.Management.Automation.SignatureStatus]::Valid -or $nodeSignature.SignerCertificate.Subject -notmatch 'O=OpenJS Foundation'){throw 'A verified OpenJS Node.js runtime is required.'}
$output=Join-Path $root ('.local/windows-releases/'+[guid]::NewGuid().ToString('N'))
$payload=Join-Path $output 'payload'
New-Item -ItemType Directory -Path $payload -Force | Out-Null
# Reuse the existing reviewed branding generator in isolated compile-only mode.
$branding=& (Join-Path $PSScriptRoot 'install-desktop.ps1') -NoInstall -DevelopmentBuild
$match=[regex]::Match(($branding -join "`n"),'unsigned build at (.+?NEXORA\.exe)\. Not installed')
if(-not $match.Success){throw 'Isolated branding preparation failed.'}
$brandingFolder=Split-Path -Parent $match.Groups[1].Value
foreach($name in @('NEXORA.ico','NEXORA.png')){Copy-Item -LiteralPath (Join-Path $brandingFolder $name) -Destination (Join-Path $payload $name)}
$manifest=Join-Path $output 'runtime.sha256'
$nodeHash=Join-Path $output 'node.sha256';[IO.File]::WriteAllText($nodeHash,(Get-NexoraSha256 $node))
& $node (Join-Path $PSScriptRoot 'runtime-manifest.mjs') $manifest
if($LASTEXITCODE -ne 0){throw 'Runtime manifest preparation failed.'}
$compiler=Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
$exe=Join-Path $payload 'NEXORA.exe'
$refs=@('/reference:System.Windows.Forms.dll','/reference:System.Drawing.dll','/reference:System.Net.Http.dll',('/reference:'+(Join-Path $sdk 'lib/net462/Microsoft.Web.WebView2.Core.dll')),('/reference:'+(Join-Path $sdk 'lib/net462/Microsoft.Web.WebView2.WinForms.dll')))
& $compiler /nologo /target:winexe /platform:x64 /optimize+ @refs "/win32manifest:$PSScriptRoot/app.manifest" "/win32icon:$payload/NEXORA.ico" "/resource:$manifest,Nexora.RuntimeHashes" "/resource:$nodeHash,Nexora.NodeHash" "/out:$exe" (Join-Path $PSScriptRoot 'NexoraDesktop.cs')
if($LASTEXITCODE -ne 0){throw 'Embedded NEXORA desktop compilation failed.'}
foreach($name in @('Microsoft.Web.WebView2.Core.dll','Microsoft.Web.WebView2.WinForms.dll')){Copy-Item -LiteralPath (Join-Path $sdk ('lib/net462/'+$name)) -Destination (Join-Path $payload $name)}
Copy-Item -LiteralPath (Join-Path $sdk 'build/native/x64/WebView2Loader.dll') -Destination (Join-Path $payload 'WebView2Loader.dll')
Copy-Item -LiteralPath (Join-Path $sdk 'LICENSE.txt') -Destination (Join-Path $payload 'WebView2-LICENSE.txt')
Copy-Item -LiteralPath (Join-Path $sdk 'NOTICE.txt') -Destination (Join-Path $payload 'WebView2-NOTICE.txt')
@($root,$node) | Set-Content -LiteralPath (Join-Path $payload 'desktop.conf') -Encoding UTF8
& $node (Join-Path $PSScriptRoot 'check-release-secrets.mjs') $payload
if($LASTEXITCODE -ne 0){throw 'Release artifact configured-secret scan failed. No release was signed or installed.'}
if(-not $DevelopmentBuild){[void](Set-NexoraPublisherSignature -Path $exe -Certificate $certificate -TimestampServer $TimestampServer)}
$msi=Join-Path $output 'NEXORA-1.9.0-x64.msi'
& powershell.exe -NoProfile -NonInteractive -File (Join-Path $PSScriptRoot 'build-msi.ps1') -Payload $payload -Output $msi
if($LASTEXITCODE -ne 0){throw 'Windows Installer authoring failed.'}
if(-not $DevelopmentBuild){[void](Set-NexoraPublisherSignature -Path $msi -Certificate $certificate -TimestampServer $TimestampServer)}
$hashes=@(Get-ChildItem -LiteralPath $payload -File | Sort-Object Name | ForEach-Object {[ordered]@{file=('payload/'+$_.Name);sha256=(Get-NexoraSha256 $_.FullName)}})
$hashes+=@([ordered]@{file=[IO.Path]::GetFileName($msi);sha256=(Get-NexoraSha256 $msi)})
[ordered]@{version='1.9.0';developmentOnly=[bool]$DevelopmentBuild;signed=(-not [bool]$DevelopmentBuild);installed=$false;executableOpened=$false;engineBundled=$false;requiresExistingConfiguredWorkspace=$true;artifacts=$hashes} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $output 'artifacts.json') -Encoding UTF8
if(-not $DevelopmentBuild){
  New-FileCatalog -Path $output -CatalogFilePath (Join-Path $output 'NEXORA-release.cat') -CatalogVersion 2.0 | Out-Null
  [void](Set-NexoraPublisherSignature -Path (Join-Path $output 'NEXORA-release.cat') -Certificate $certificate -TimestampServer $TimestampServer)
}
Write-Output ('NEXORA_DESKTOP_PACKAGE:'+ $msi)
if($DevelopmentBuild){Write-Output 'UNSIGNED DEVELOPMENT PACKAGE ONLY. Not installed or executed. Windows protections remain enabled.'}
else{Write-Output 'Publisher-verified executable and MSI prepared. Installation and native UI acceptance must still pass.'}
