# Partner Ecosystem

Phase: 21
Version: 0.21.0

## Purpose

The partner ecosystem allows NEXORA to support technology partners, implementation partners, consultants, agencies and system integrators with certification and service listing governance.

## Backend Surface

API group: `/v1/partners`

- `GET /` lists partner profiles.
- `POST /` creates a partner profile.
- `GET /services` lists service listings.
- `GET /:id/certifications` lists certifications for a partner.
- `POST /:id/certifications` adds a partner certification.
- `POST /:id/services` adds a service listing.

## Data Model

- `PartnerProfile` stores partner identity, tier, type, status, country and capability metadata.
- `PartnerCertification` stores certification status, type, evidence, issue date and expiry date.
- `PartnerServiceListing` stores implementation, advisory, connector and ecosystem service offerings.

## Governance

Partner profiles are tenant-scoped. Certifications can expire or be revoked without deleting historical partner records. Service listings are status-controlled so admin teams can review or hide listings.

## Events

- `partner.created`