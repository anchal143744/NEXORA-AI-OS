# Disposable UI fixture verification

These commands use only a new PostgreSQL cluster under `tests/.runtime/cluster-*`. There is no fallback to `.env` or an existing application database. Keep the production build available; set `NEXORA_TEST_POSTGRES_BIN` if PostgreSQL 16 binaries are not in the documented default directory.

```powershell
npm run retail:test                 # 73 database/API tests plus encrypted restore
npm run retail:ui:fixture:test      # Two real frontend/API lifecycle tests, no browser actions
npm run retail:ui:session           # Isolated live fixture for approved browser automation
```

Only one UI fixture may own the shared Next source configuration at a time. Every fixture captures source bytes durably before Next starts and retains a snapshot in ignored `tests/.runtime`. Its frontend uses a unique build directory and log. Generated Next changes are restored byte for byte only after both source files validate; independent edits are preserved and cause failure. The shared lease is released only after a successful restoration.

The lifecycle tests execute real frontend/API health and authentication-boundary HTTP requests, authenticated shutdown, and deliberate parent IPC disconnection. They assert both HTTP listeners close, frontend exit code zero without a forced kill, exact source-byte restoration, and control-descriptor/lease release. Normal UI shutdown leaves the database with the runner. If the parent channel disappears, the session checks the exact captured PostgreSQL identity and stops only its designated disposable cluster. The runner retains failed clusters and per-run logs for diagnosis. PostgreSQL's active log sits outside PGDATA, avoiding its own log during data-directory fsync/recovery. This does not diagnose every external process interruption or remove antivirus/OneDrive protections.

Stop a live approved-browser session through `requestDesktopShutdown` using its ignored `tests/.runtime/approved-ui-session.json` descriptor. Treat that descriptor as private: it contains a local control token and the disposable database URL. Do not print it, commit it or place it in published evidence. SIGINT/SIGTERM received by the runner are also forwarded as graceful shutdown requests. Native Windows hard termination is distinct from delivery of a POSIX signal; the IPC-disconnect fallback handles a lost parent after runtime startup.

If the fixture process was forcibly terminated and left a source lease, verify that process and its owned frontend are no longer running, then use:

```powershell
npm run retail:ui:recover
```

Recovery refuses a live owner or recorded frontend, invalid snapshot/lease identity or independent edits. The frontend PID is recorded durably after spawn; if snapshot and lease updates were interrupted, their mismatch fails closed. It changes only the known generated source files and removes that lease; it never starts, migrates, resets or deletes a database. If it refuses recovery, retain the lease/snapshot and review the difference rather than deleting the lock or overwriting edits. An OS crash/power loss during writes still requires guarded recovery and is not a tested transactional filesystem guarantee.

`npm run retail:ui:test` retains the standalone Playwright suite for a supported CI environment. Its two browser scenarios were previously performed through approved CUA automation; the Playwright CLI browser runner has **not** been executed in this session. The new fixture tests perform HTTP/process/database lifecycle verification and do not count as additional UI click-through passes or native WebView2 acceptance.
