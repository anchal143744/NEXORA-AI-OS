# Phase 46 Prisma Report

Version: 0.46.0
Date: 2026-06-14

## Models Added

- FieldServiceRegion
- FieldServiceTerritory
- FieldServiceRequest
- FieldServiceCase
- FieldServiceAppointment
- FieldWorkOrder
- FieldWorkOrderTask
- FieldWorkOrderPart
- FieldWorkOrderChecklist
- FieldWorkOrderCompletion
- DispatchBoard
- DispatchAssignment
- DispatchRule
- DispatchException
- TechnicianProfile
- TechnicianSkill
- TechnicianCertification
- TechnicianAvailability
- TechnicianPerformance
- FieldRoutePlan
- FieldRouteStop
- FieldRouteOptimization
- TravelTimeEstimate
- MobileWorkSession
- MobileDeviceRegistration
- OfflineJobQueue
- MobileSyncEvent
- FieldServiceSlaPolicy
- FieldServiceSlaCommitment
- FieldServiceSlaBreach
- FieldServiceEscalation
- CustomerServiceVisit
- CustomerServiceFeedback
- CustomerServiceResolution
- CustomerServiceInsight
- FieldWorkforceMetric
- FieldWorkforceAnalyticsSnapshot
- TechnicianUtilizationRecord
- FieldServiceForecast
- FieldServiceCopilotQuery
- FieldServiceRecommendation
- FieldServiceRiskSignal

## Model Count

- Previous total: 595
- Phase 46 added: 42
- Updated total: 637

## Database Architecture

Each field-service model includes UUID identity, tenantId, workspaceId, recordKey, service/work-order/customer/technician/routing/SLA references, scheduling timestamps, location coordinates, SLA metrics, field cost fields, route data, mobile state, metrics, recommendations, metadata, timestamps and soft delete.

