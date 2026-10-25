# Sync Engine

The sync engine supports one-way, two-way, scheduled and realtime sync modes. Sync runs are persisted in SyncRun and executed through BullMQ.

Sync audit events include sync.started and sync.completed.
