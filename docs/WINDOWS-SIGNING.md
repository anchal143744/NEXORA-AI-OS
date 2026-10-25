# Trusted Windows signing and installation

**Current native host/MSI route:** use `npm run desktop:sdk`, then `npm run desktop:release` after provisioning the real certificate and Windows SDK SignTool described below. The command signs both the embedded WebView2 EXE and MSI, with a signed catalog/hash inventory, and installs nothing automatically. The output remains a companion installer for the existing configured workspace. Neither the current EXE nor MSI is signed or accepted. See [the current native release report](NATIVE-DESKTOP-RELEASE-2026-10-22.md) for actual test results, signature checks, installed launch command and acceptance checklist. The older `desktop:prepare` / `Install-NEXORA.ps1` instructions below describe the preserved **legacy external-Edge launcher** and are not the new MSI installation route.

The implemented route uses a **real code-signing certificate and its key exposed through the Windows certificate store/CSP**. It does not generate a certificate, import a trust root, accept self-signed identities, export a private key or disable Windows protection. No certificate/account is configured. The remaining-work continuation on 24 October provisioned Microsoft's official SignTool locally; a system-wide SDK installation is no longer required on this workspace. Microsoft Artifact Signing is another provider option, but its remote identity/DLL integration is not implemented here; merely opening an Azure account will not satisfy this certificate-store workflow.

## External setup you must complete

1. Obtain a code-signing certificate from a trusted provider after its publisher identity verification. Use your actual legal identity. Follow its hardware token/HSM/CSP provisioning instructions so the selected Windows user can sign using the certificate in `CurrentUser\My` or `LocalMachine\My`. Do not send passwords, PFX files or keys in chat, commit them or place them in launcher configuration. Give signing permission only to the publisher/build identity; end-user installation does not need it.
2. Run `npm run desktop:signing:tools` to prepare the pinned **Microsoft.Windows.SDK.BuildTools 10.0.28000.2705** package inside `.local/tools/windows-sdk/10.0.28000.2705`. This has already succeeded on this workspace. The script checks the SHA-256 archive pin, extracts only seven signing-tool files, and checks their hashes and Microsoft Authenticode signatures. The resolver repeats validation before using this bundled tool and refuses unexpected adjacent DLLs. No system installer, certificate, trust root or Windows-protection change is involved. An existing Microsoft-signed Windows SDK SignTool is also supported. Keep Node/dependencies, Edge and the existing project-owned PostgreSQL installation available. This remains a launcher tied to the project installation, not a portable MSI/MSIX. Microsoft documents the [SDK BuildTools NuGet distribution](https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-signing-integrations#download-and-install-signtool); this provisions the tool, not a cloud signing account.
3. Obtain the actual certificate thumbprint and provider's **RFC 3161 HTTPS timestamp endpoint**, then set these process variables in the publishing PowerShell session. The values below are placeholders, not issued credentials:

```powershell
$env:NEXORA_SIGNING_CERT_THUMBPRINT = '<actual certificate thumbprint>'
$env:NEXORA_SIGNING_TIMESTAMP_URL = '<provider RFC3161 HTTPS endpoint>'
$env:NEXORA_SIGNTOOL_PATH = (Resolve-Path '.local/tools/windows-sdk/10.0.28000.2705/x64/signtool.exe').Path
npm run desktop:signing:check
```

Signing variables are process configuration, not read from .env by PowerShell. The SHA-1 thumbprint selects a certificate; file and timestamp digests are **SHA-256**. The key is accessed through its provider, not a password command-line argument. The build validates certificate dates, code-signing EKU, chain/revocation, selected signer and timestamp. Provider access and network timestamp/revocation services must work. Current readiness correctly fails before any build/install mutation.

## Current native MSI build, verify and install

The latest 24 October check still finds zero code-signing certificate candidates. **SignTool is now available and actually executed:** it verified the existing trusted Node signature and rejected unsigned NEXORA without opening NEXORA; a tampered-library test also passed. Evidence: `docs/verification/remaining-signing-tools-2026-10-24.txt` and `remaining-signing-tool-tests-2026-10-24.txt`. Full and production dependency audits report zero findings; actual release signing and native acceptance remain independent release gates. No diagnostic package has been installed or opened.

After completing the external setup above, keep the existing workspace and Node paths stable and run:

```powershell
Set-Location 'C:\Users\Acer\OneDrive\Documents\PORTFOLIOV1\NEXORA_AI'
npm run desktop:signing:check
npm run desktop:release
```

This command checks the certificate before stopping owned services, builds API/web, signs the embedded EXE, authors/signs the MSI and signs the catalog. It prints the actual `NEXORA_DESKTOP_PACKAGE` path; do not reuse an unsigned diagnostic MSI. No installation happens automatically. Read `artifacts.json` in that output directory and independently verify publisher, chain and timestamp for all three signed artifacts:

```powershell
$release = '<actual signed build directory printed by the release command>'
foreach ($name in @('payload\NEXORA.exe','NEXORA-1.9.0-x64.msi','NEXORA-release.cat')) {
  $artifact = Join-Path $release $name
  & $env:NEXORA_SIGNTOOL_PATH verify /pa /all /v $artifact
  if ($LASTEXITCODE -ne 0) { throw 'Signature verification failed. Do not install.' }
  $signature = Get-AuthenticodeSignature -LiteralPath $artifact
  if ($signature.Status -ne 'Valid' -or
      $signature.SignerCertificate.Thumbprint -ne $env:NEXORA_SIGNING_CERT_THUMBPRINT -or
      -not $signature.TimeStamperCertificate) {
    throw 'Unexpected publisher or missing trusted timestamp. Do not install.'
  }
}
# Only after all verification passes:
$msi = Join-Path $release 'NEXORA-1.9.0-x64.msi'
$install = Start-Process -FilePath msiexec.exe -ArgumentList @('/i',('"' + $msi + '"'),'/passive','/norestart') -Wait -PassThru -WindowStyle Hidden
if ($install.ExitCode -notin @(0,3010)) { throw 'MSI installation failed. Inspect Windows Installer logs before launching.' }
Start-Process -FilePath "$env:LOCALAPPDATA\Programs\NEXORA\NEXORA.exe"
```

Verify desktop/start-menu shortcuts target the installed EXE, then complete native first launch, login, second launch, close/reopen, failure recovery and signed upgrade/repair/uninstall/reinstall acceptance with Windows protections enabled. Use disposable acceptance data; compare saved records/configuration/profile and separately restore a backup. Do not retire the legacy launcher before acceptance succeeds. These steps have **not** been executed on this machine.

The MSI packages the shell, not Node/PostgreSQL/application engines. It requires the existing configured workspace and supported .NET Framework/WebView2 Evergreen. A moved/modified pinned runtime needs a rebuilt signed release. Uninstall must preserve workspace/database/documents/backups and the separate WebView2 profile.

## Preserved legacy launcher route — not the native MSI procedure

4. Use Node 24 and npm 12.2.1, the toolchain used for this verification. For a clean checkout, use npm 12's `npm ci` and generate the Prisma client; do not reset/migrate an existing database. The checked-in lockfile and narrow overrides are required. A temporary CLI is available through `npm exec --yes --package=npm@12.2.1 -- <npm command>` without replacing global npm. A clean-install dry run passed; a full clean reinstall was not executed in this repair.
5. Run `npm run desktop:prepare`. It checks signing readiness, gracefully stops only owned NEXORA services, builds the application, and stages a signed launcher payload. It does **not** replace the installed launcher or shortcut. Record the actual staged directory printed by the command; do not guess a GUID.
6. The staged payload must contain signed `NEXORA.exe`, `Install-NEXORA.ps1`, `publisher-signing.ps1`, `release-files.ps1`, and signed `NEXORA.cat`; the catalog covers all payload files, including logo and path configuration. Verify using Windows Authenticode and the helper below. Use a publisher thumbprint obtained independently, not one supplied only inside a downloaded package:

```powershell
$release = '<actual staged directory>'
foreach ($name in @('NEXORA.exe','Install-NEXORA.ps1','publisher-signing.ps1','release-files.ps1','NEXORA.cat')) {
  $signature = Get-AuthenticodeSignature -LiteralPath (Join-Path $release $name)
  if ($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Thumbprint -ne $env:NEXORA_SIGNING_CERT_THUMBPRINT) {
    throw 'Unexpected or invalid release publisher. Nothing was installed.'
  }
}
& (Join-Path $release 'Install-NEXORA.ps1') `
  -ReleasePath $release `
  -ExpectedPublisherThumbprint $env:NEXORA_SIGNING_CERT_THUMBPRINT
npm run desktop:trust
```

The installer checks helper signatures before loading them, checks the catalog and required paths/publishers, serializes against launcher startup and rolls back fixed launcher files on failure. Previous files stay in a `desktop-upgrade-*` backup. Unrelated shortcuts are rejected before promotion. It never installs unsigned development builds or touches .env, database directories, backups or browser profiles.

7. Only after `desktop:trust` reports a valid trusted timestamped signature, run the installed `NEXORA.exe --verify`, then double-click the actual NEXORA desktop shortcut **with Smart App Control, Defender and SmartScreen still enabled**. Check splash → login/signup → setup → dashboard and invoice printing manually. Do not substitute another executable, import a fake root, disable protection, whitelist the unsigned binary or treat signature verification alone as malware/production certification. Check a real signed upgrade and reinstall as well; those acceptance steps remain unverified today.
8. `npm run desktop:stop` should close API and frontend gracefully while PostgreSQL and saved data remain available. `npm run desktop:start` restarts the local web services independently; it does not certify or execute the native launcher. Signing and a successful first launch do not certify public-deployment readiness.

## Verified and unverified boundaries

Verified locally: unsigned rejection, native C# compilation without execution, catalog tamper detection, synthetic upgrade/reinstall/rollback file transactions, all installer PowerShell syntax, actual local service start/reuse/graceful stop/restart, unchanged hashes across 822 existing database tables, and synthetic encryption plus disposable database restore. No signed NEXORA installer, signed EXE, native first launch, actual signed reinstall, timestamp service or private-key operation has been verified.

Microsoft references: [Smart App Control signing requirements](https://learn.microsoft.com/en-us/windows/apps/develop/smart-app-control/code-signing-for-smart-app-control), [SignTool digest/timestamp options](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool). See [the current release decision, security findings and verification matrix](NATIVE-DESKTOP-RELEASE-2026-10-22.md).
