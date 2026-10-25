param([string]$Path)
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
if(-not $Path){$Path=Join-Path (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path '.local/desktop/NEXORA.exe'}
try{
  $signature=Assert-NexoraPublisherSignature -Path $Path
  [ordered]@{publisherVerified=$true;status=$signature.Status.ToString();publisher=$signature.SignerCertificate.Subject;timestamped=$true;sha256=(Get-NexoraSha256 -Path $Path);executed=$false} | ConvertTo-Json
}catch{
  [ordered]@{publisherVerified=$false;reason=$_.Exception.Message;executed=$false;protectionChanged=$false} | ConvertTo-Json
  exit 1
}
