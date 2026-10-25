# Disaster Recovery

Disaster recovery includes backup runs, restore runs and failover strategy planning. Supported backup domains are database, config, workflow and audit.

Default targets are RTO 30 minutes and RPO 15 minutes, with database replica promotion, Redis primary switch and queue pause-drain-resume procedures.
