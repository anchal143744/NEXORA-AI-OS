param([switch]$NoInstall,[switch]$DevelopmentBuild,[string]$CertificateThumbprint=$env:NEXORA_SIGNING_CERT_THUMBPRINT,[string]$TimestampServer=$env:NEXORA_SIGNING_TIMESTAMP_URL)
$ErrorActionPreference='Stop'
$projectRoot=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
# Never replace the installed launcher or shortcut with an unsigned build.
if($DevelopmentBuild -and -not $NoInstall){throw 'Development builds require -NoInstall and cannot replace the desktop application.'}
$certificate=$null
if(-not $DevelopmentBuild){
  $certificate=Get-NexoraSigningCertificate -Thumbprint $CertificateThumbprint
  if(-not $TimestampServer){throw 'The signing provider timestamp endpoint is required. Set NEXORA_SIGNING_TIMESTAMP_URL or supply -TimestampServer.'}
}
$destination=Join-Path $projectRoot ('.local/desktop-builds/'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$compiler=Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
if(-not (Test-Path -LiteralPath $compiler)){throw 'The installed .NET Framework compiler is required.'}
$nodePath=(Get-Command node.exe -ErrorAction Stop).Source
$browserPath=Join-Path ${env:ProgramFiles(x86)} 'Microsoft/Edge/Application/msedge.exe'
if(-not (Test-Path -LiteralPath $browserPath)){ $browserPath=Join-Path $env:ProgramFiles 'Microsoft/Edge/Application/msedge.exe' }
if(-not (Test-Path -LiteralPath $browserPath)){throw 'Microsoft Edge is required for the desktop app window.'}
Add-Type -AssemblyName System.Drawing
$bitmap=New-Object Drawing.Bitmap 256,256
$graphics=[Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([Drawing.Color]::FromArgb(11,20,38))
$points=@([Drawing.PointF]::new(58,196),[Drawing.PointF]::new(58,60),[Drawing.PointF]::new(92,60),[Drawing.PointF]::new(164,149),[Drawing.PointF]::new(164,60),[Drawing.PointF]::new(198,60),[Drawing.PointF]::new(198,196),[Drawing.PointF]::new(164,196),[Drawing.PointF]::new(92,107),[Drawing.PointF]::new(92,196))
$gradient=[Drawing.Drawing2D.LinearGradientBrush]::new([Drawing.Point]::new(58,60),[Drawing.Point]::new(198,196),[Drawing.Color]::FromArgb(181,163,255),[Drawing.Color]::FromArgb(96,80,236))
$graphics.FillPolygon($gradient,$points)
$pngPath=Join-Path $destination 'NEXORA.png'
$bitmap.Save($pngPath,[Drawing.Imaging.ImageFormat]::Png)
$gradient.Dispose();$graphics.Dispose();$bitmap.Dispose()
$png=[IO.File]::ReadAllBytes($pngPath)
$stream=[IO.File]::Create((Join-Path $destination 'NEXORA.ico'))
$writer=[IO.BinaryWriter]::new($stream)
$writer.Write([uint16]0);$writer.Write([uint16]1);$writer.Write([uint16]1)
$writer.Write([byte]0);$writer.Write([byte]0);$writer.Write([byte]0);$writer.Write([byte]0)
$writer.Write([uint16]1);$writer.Write([uint16]32);$writer.Write([uint32]$png.Length);$writer.Write([uint32]22);$writer.Write($png);$writer.Dispose();$stream.Dispose()
$executable=Join-Path $destination 'NEXORA.exe'
& $compiler /nologo /target:winexe /optimize+ /reference:System.Windows.Forms.dll /reference:System.Drawing.dll "/win32manifest:$PSScriptRoot/app.manifest" "/win32icon:$destination/NEXORA.ico" "/out:$executable" (Join-Path $PSScriptRoot 'NexoraLauncher.cs')
if($LASTEXITCODE -ne 0){throw 'NEXORA desktop launcher compilation failed'}
@($projectRoot,$nodePath,$browserPath) | Set-Content -LiteralPath (Join-Path $destination 'launcher.conf') -Encoding UTF8
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'install-release.ps1') -Destination (Join-Path $destination 'Install-NEXORA.ps1')
foreach($name in @('publisher-signing.ps1','release-files.ps1')){Copy-Item -LiteralPath (Join-Path $PSScriptRoot $name) -Destination (Join-Path $destination $name)}
if($DevelopmentBuild){
  New-FileCatalog -Path $destination -CatalogFilePath (Join-Path $destination 'NEXORA.cat') -CatalogVersion 2.0 | Out-Null
  Write-Output "DEVELOPMENT ONLY: unsigned build at $executable. Not installed, executed or represented as a trusted release."
  exit 0
}
$signature=Set-NexoraPublisherSignature -Path $executable -Certificate $certificate -TimestampServer $TimestampServer
foreach($name in @('Install-NEXORA.ps1','publisher-signing.ps1','release-files.ps1')){[void](Set-NexoraPublisherSignature -Path (Join-Path $destination $name) -Certificate $certificate -TimestampServer $TimestampServer)}
New-FileCatalog -Path $destination -CatalogFilePath (Join-Path $destination 'NEXORA.cat') -CatalogVersion 2.0 | Out-Null
[void](Set-NexoraPublisherSignature -Path (Join-Path $destination 'NEXORA.cat') -Certificate $certificate -TimestampServer $TimestampServer)
. (Join-Path $PSScriptRoot 'release-files.ps1')
[void](Assert-NexoraRelease -Path $destination -ExpectedPublisherThumbprint $certificate.Thumbprint)
if($NoInstall){
  Write-Output "Signed NEXORA release staged: $destination. Existing installation and shortcut were not modified."
  exit 0
}
& (Join-Path $destination 'Install-NEXORA.ps1') -ReleasePath $destination -ExpectedPublisherThumbprint $certificate.Thumbprint
