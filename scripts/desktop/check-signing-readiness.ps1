param([string]$CertificateThumbprint=$env:NEXORA_SIGNING_CERT_THUMBPRINT,[string]$TimestampServer=$env:NEXORA_SIGNING_TIMESTAMP_URL)
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'publisher-signing.ps1')
try{
  $certificate=Get-NexoraSigningCertificate -Thumbprint $CertificateThumbprint
  $address=$null
  if(-not [Uri]::TryCreate($TimestampServer,[UriKind]::Absolute,[ref]$address) -or $address.Scheme -ne 'https' -or $address.UserInfo -or $address.Fragment){throw 'Set NEXORA_SIGNING_TIMESTAMP_URL to the trusted signing provider HTTPS timestamp endpoint.'}
  $tool=Resolve-NexoraSignTool
  [ordered]@{readyToSign=$true;publisher=$certificate.Subject;expiresAt=$certificate.NotAfter.ToUniversalTime().ToString('o');privateKeyExported=$false;protectionChanged=$false} | ConvertTo-Json
}catch{
  [ordered]@{readyToSign=$false;reason=$_.Exception.Message;protectionChanged=$false} | ConvertTo-Json
  exit 1
}
