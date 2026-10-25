export type DomainEventType =
  | 'user.created' | 'user.updated'
  | 'organization.created' | 'workspace.created'
  | 'lead.created' | 'lead.updated' | 'lead.converted'
  | 'customer.created'
  | 'invoice.created' | 'invoice.updated' | 'invoice.paid'
  | 'expense.created'
  | 'employee.created'
  | 'project.created' | 'task.created' | 'task.completed'
  | 'workflow.executed' | 'workflow.started' | 'workflow.completed' | 'workflow.failed'
  | 'workflow.definition.created' | 'workflow.definition.published' | 'workflow.template.created'
  | 'workflow.execution.retried' | 'workflow.approval.requested' | 'workflow.approval.decided'
  | 'workflow.metric.recorded' | 'workflow.ai.generated'
  | 'agent.started' | 'agent.completed' | 'agent.failed'
  | 'notification.created'
  | 'ai.insight.generated'
  | 'kpi.generated' | 'report.generated' | 'alert.generated' | 'forecast.generated'
  | 'connector.created' | 'connector.updated' | 'connector.deleted'
  | 'webhook.triggered' | 'webhook.failed' | 'sync.started' | 'sync.completed'
  | 'api_key.created' | 'api_key.rotated' | 'api_key.revoked'
  | 'admin.operation.created' | 'release.approved' | 'release.rolled_back'
  | 'feature_flag.updated' | 'incident.created' | 'emergency_control.activated'
  | 'tenant.suspended' | 'tenant.restored'
  | 'data_import.created' | 'data_import.processed' | 'migration.started' | 'migration.completed'
  | 'onboarding.started' | 'onboarding.completed' | 'workspace.onboarding.generated'
  | 'marketplace.app.created' | 'marketplace.app.installed' | 'marketplace.app.uninstalled'
  | 'extension.hook.registered' | 'partner.created' | 'industry_template.installed'
  | 'device.registered' | 'device.approved' | 'device.revoked' | 'device.session.revoked'
  | 'offline.queue.item.created' | 'offline.queue.item.synced' | 'sync.conflict.detected'
  | 'mobile.command.created' | 'desktop.notification.created'
  | 'data.governance.asset.created' | 'data.classified' | 'data.lineage.recorded' | 'data.quality.checked'
  | 'privacy.request.created' | 'privacy.request.completed' | 'privacy.consent.updated'
  | 'retention.policy.created' | 'records.lifecycle.action.created' | 'records.archive.created'
  | 'compliance.evidence.generated' | 'compliance.monitoring.completed'
  | 'search.index.created' | 'search.document.indexed' | 'search.query.executed'
  | 'search.semantic.executed' | 'retrieval.session.created' | 'retrieval.context.generated'
  | 'knowledge.space.created' | 'knowledge.article.created' | 'discussion.created' | 'discussion.message.created'
  | 'decision.room.created' | 'decision.vote.cast' | 'decision.approval.decided' | 'decision.record.created'
  | 'ai.collaboration.summary.generated' | 'collaboration.action_item.created'
  | 'communication.channel.created' | 'conversation.created' | 'message.sent' | 'announcement.sent'
  | 'meeting.created' | 'meeting.summary.generated' | 'calendar.event.created'
  | 'scheduling.recommendation.created' | 'reminder.created' | 'availability.updated'
  | 'voice.session.started' | 'voice.transcript.created' | 'voice.command.executed'
  | 'contact_center.queue.created' | 'contact_center.assignment.created' | 'contact_center.escalated'
  | 'omnichannel.identity.resolved' | 'omnichannel.message.synced'
  | 'conversation.sentiment.detected' | 'conversation.intent.detected' | 'conversation.summary.generated'
  | 'voice_agent.execution.started' | 'voice_agent.execution.completed'
  | 'customer.health.scored' | 'customer.journey.updated' | 'customer.feedback.created'
  | 'customer.success.plan.created' | 'customer.engagement.scored' | 'churn.prediction.created'
  | 'renewal.opportunity.created' | 'revenue.opportunity.created' | 'revenue.risk.detected'
  | 'service.ticket.created' | 'service.ticket.resolved' | 'service.escalated' | 'sla.record.created'
  | 'product.health.scored' | 'product.event.tracked' | 'product.usage.metric.recorded'
  | 'feature.usage.recorded' | 'user.journey.started' | 'user.journey.step.recorded'
  | 'funnel.result.generated' | 'experiment.created' | 'experiment.result.evaluated'
  | 'retention.cohort.generated' | 'engagement.score.created' | 'growth.recommendation.created'
  | 'forecast.model.created' | 'forecast.result.generated' | 'prediction.model.created' | 'prediction.result.generated'
  | 'strategic.goal.created' | 'strategic.plan.created' | 'scenario.model.created' | 'scenario.result.generated'
  | 'budget.plan.created' | 'capacity.plan.created' | 'risk.forecast.generated' | 'growth.forecast.generated'
  | 'strategy.recommendation.generated'
  | 'data.lake.created' | 'data.warehouse.created' | 'data.mart.created' | 'semantic.metric.created'
  | 'semantic.dimension.created' | 'kpi.created' | 'kpi.result.generated' | 'executive.dashboard.created'
  | 'warehouse.job.created' | 'data.pipeline.created' | 'data.pipeline.executed'
  | 'ai.model.registry.created' | 'ai.model.created' | 'ai.model.version.created' | 'ai.model.deployment.created'
  | 'ai.decision.recorded' | 'ai.decision.reason.created' | 'ai.decision.risk.created'
  | 'ai.audit.log.created' | 'ai.compliance.record.created' | 'ai.explainability.record.created'
  | 'model.performance.metric.recorded' | 'model.approval.workflow.created' | 'model.approval.workflow.decided'
  | 'security.incident.created' | 'security.threat.detected' | 'threat.rule.created' | 'threat.event.created'
  | 'security.risk.assessed' | 'security.score.updated' | 'security.audit.created' | 'compliance.violation.created'
  | 'zero_trust.policy.created' | 'access.verification.created' | 'security.alert.created'
  | 'security.investigation.created' | 'security.investigation.updated'
  | 'service.health.recorded' | 'system.incident.created' | 'incident.timeline.created'
  | 'recovery.action.created' | 'recovery.action.completed' | 'uptime.metric.recorded'
  | 'reliability.score.updated' | 'scaling.policy.created' | 'scaling.event.created'
  | 'region.health.recorded' | 'failover.event.created' | 'sre.alert.created'
  | 'capacity.forecast.created'
  | 'cost.center.created' | 'resource.usage.recorded' | 'cost.metric.recorded'
  | 'cost.forecast.created' | 'optimization.recommendation.created' | 'efficiency.score.updated'
  | 'performance.metric.recorded' | 'resource.allocation.created' | 'finops.policy.created'
  | 'budget.tracking.created' | 'cost.alert.created' | 'savings.opportunity.created'
  | 'data.region.created' | 'residency.policy.created' | 'sovereignty.rule.created'
  | 'regulatory.framework.created' | 'compliance.requirement.created' | 'jurisdiction.rule.created'
  | 'data.transfer.rule.created' | 'compliance.audit.created' | 'regulatory.alert.created'
  | 'residency.assignment.created' | 'data.location.recorded' | 'regulatory.risk.created'
  | 'data.contract.created' | 'contract.version.created' | 'api.product.created'
  | 'api.plan.created' | 'api.subscription.created' | 'api.usage.recorded'
  | 'api.billing.created' | 'governance.policy.created' | 'api.quota.created'
  | 'rate.limit.policy.created' | 'partner.access.created'
  | 'trust.report.created' | 'security.certification.created' | 'compliance.artifact.created'
  | 'developer.account.created' | 'developer.application.created' | 'api.documentation.created'
  | 'sdk.package.created' | 'external.integration.created' | 'partner.listing.created'
  | 'marketplace.application.created' | 'status.incident.created' | 'ecosystem.event.created'
  | 'customer.account.created' | 'customer.workspace.created' | 'customer.subscription.created'
  | 'billing.profile.created' | 'invoice.record.created' | 'payment.method.created'
  | 'usage.metric.recorded' | 'partner.account.created' | 'partner.workspace.created'
  | 'partner.commission.created' | 'partner.referral.created'
  | 'revenue.account.created' | 'revenue.contract.created' | 'contract.amendment.created'
  | 'renewal.schedule.created' | 'renewal.forecast.created' | 'churn.signal.created'
  | 'expansion.opportunity.created' | 'account.health.scored' | 'revenue.forecast.created'
  | 'revenue.event.created'
  | 'vendor.created' | 'vendor.contract.created' | 'vendor.scorecard.created'
  | 'procurement.request.created' | 'procurement.approval.created' | 'purchase.order.created'
  | 'purchase.category.created' | 'budget.allocation.created' | 'spend.transaction.recorded'
  | 'spend.insight.created' | 'cost.optimization.recommendation.created' | 'procurement.event.created'
  | 'supply.item.created' | 'warehouse.created' | 'inventory.stock.updated'
  | 'inventory.batch.created' | 'inventory.serial.created' | 'inventory.audit.created'
  | 'inventory.movement.recorded' | 'inventory.transfer.created' | 'receiving.record.created'
  | 'fulfillment.order.created' | 'shipment.created' | 'shipment.tracking.updated'
  | 'carrier.created' | 'distribution.route.optimized'
  | 'demand.forecast.model.created' | 'demand.forecast.scenario.created'
  | 'replenishment.plan.created' | 'supply.chain.risk.detected'
  | 'supply.chain.insight.created' | 'supply.chain.copilot.queried'

  | 'manufacturing.plant.created' | 'production.line.created' | 'work.center.created'
  | 'factory.resource.created' | 'bom.created' | 'bom.component.created'
  | 'production.plan.created' | 'production.schedule.created' | 'production.order.created'
  | 'production.operation.created' | 'mes.execution.started' | 'production.material.requirement.created'
  | 'machine.telemetry.recorded' | 'quality.inspection.created' | 'quality.issue.created'
  | 'maintenance.asset.created' | 'maintenance.prediction.created' | 'production.cost.recorded'
  | 'manufacturing.metric.recorded' | 'manufacturing.risk.detected'
  | 'digital.twin.model.created' | 'digital.twin.snapshot.created'
  | 'manufacturing.copilot.queried' | 'manufacturing.event.created'
  | 'EMPLOYEE_CREATED' | 'EMPLOYEE_UPDATED' | 'JOB_POSTED' | 'CANDIDATE_APPLIED' | 'INTERVIEW_COMPLETED' | 'EMPLOYEE_ONBOARDED' | 'PERFORMANCE_REVIEW_COMPLETED' | 'COURSE_COMPLETED' | 'PROMOTION_APPROVED' | 'RETENTION_RISK_DETECTED' | 'HR_COPILOT_QUERIED' | 'HR_RECOMMENDATION_CREATED'
  | 'ASSET_CREATED' | 'ASSET_UPDATED' | 'ASSET_LIFECYCLE_UPDATED' | 'ASSET_ASSIGNED' | 'ASSET_COST_RECORDED' | 'ASSET_MAINTENANCE_SCHEDULED' | 'ASSET_MAINTENANCE_COMPLETED' | 'ASSET_HEALTH_UPDATED' | 'ASSET_WORK_ORDER_CREATED' | 'ASSET_WORK_ORDER_UPDATED' | 'ASSET_WORK_ORDER_COMPLETED' | 'ASSET_RISK_DETECTED' | 'ASSET_WARRANTY_EXPIRING' | 'ASSET_CONTRACT_RENEWAL_DUE' | 'ASSET_RECOMMENDATION_CREATED' | 'ASSET_IOT_SIGNAL_RECEIVED' | 'ASSET_ANALYTICS_GENERATED' | 'ASSET_COPILOT_QUERIED'
  | 'FIELD_SERVICE_REQUEST_CREATED' | 'FIELD_SERVICE_CASE_UPDATED' | 'SERVICE_APPOINTMENT_SCHEDULED' | 'FIELD_WORK_ORDER_CREATED' | 'FIELD_WORK_ORDER_UPDATED' | 'FIELD_WORK_ORDER_COMPLETED' | 'DISPATCH_ASSIGNMENT_CREATED' | 'DISPATCH_EXCEPTION_CREATED' | 'TECHNICIAN_UPDATED' | 'ROUTE_OPTIMIZED' | 'MOBILE_WORK_STARTED' | 'MOBILE_SYNC_COMPLETED' | 'SLA_POLICY_CREATED' | 'SLA_BREACH_DETECTED' | 'FIELD_SERVICE_ESCALATED' | 'CUSTOMER_VISIT_COMPLETED' | 'CUSTOMER_FEEDBACK_RECEIVED' | 'FIELD_ANALYTICS_GENERATED' | 'FIELD_SERVICE_COPILOT_QUERIED' | 'FIELD_RECOMMENDATION_CREATED' | 'FIELD_RISK_DETECTED'
  | 'OKR_OBJECTIVE_CREATED'
  | 'OKR_KEY_RESULT_UPDATED'
  | 'OKR_CHECK_IN_CREATED'
  | 'STRATEGIC_PLAN_CREATED'
  | 'STRATEGY_MILESTONE_UPDATED'
  | 'PORTFOLIO_CREATED'
  | 'PORTFOLIO_PROJECT_UPDATED'
  | 'PORTFOLIO_RISK_DETECTED'
  | 'RESOURCE_PLAN_CREATED'
  | 'RESOURCE_ALLOCATION_UPDATED'
  | 'CAPACITY_PLAN_CREATED'
  | 'BUDGET_PLAN_CREATED'
  | 'BUDGET_VARIANCE_DETECTED'
  | 'SCENARIO_MODEL_CREATED'
  | 'SCENARIO_SIMULATED'
  | 'EXECUTIVE_PLANNING_DASHBOARD_CREATED'
  | 'PORTFOLIO_ANALYTICS_GENERATED'
  | 'STRATEGY_COPILOT_QUERIED'
  | 'STRATEGY_RECOMMENDATION_CREATED'
  | 'STRATEGIC_RISK_DETECTED'
  | 'PLANNING_AUDIT_RECORDED'
  | 'MDM_CUSTOMER_MASTER_CREATED'
  | 'MDM_VENDOR_MASTER_CREATED'
  | 'MDM_PRODUCT_MASTER_CREATED'
  | 'MDM_EMPLOYEE_MASTER_CREATED'
  | 'MDM_ASSET_MASTER_CREATED'
  | 'MDM_DATA_QUALITY_RULE_CREATED'
  | 'MDM_DATA_QUALITY_RUN_COMPLETED'
  | 'MDM_DATA_QUALITY_ISSUE_DETECTED'
  | 'MDM_DUPLICATE_CANDIDATE_DETECTED'
  | 'MDM_DUPLICATE_CLUSTER_CREATED'
  | 'MDM_DUPLICATE_REVIEW_COMPLETED'
  | 'MDM_ENTITY_RESOLUTION_STARTED'
  | 'MDM_ENTITY_MATCH_CREATED'
  | 'MDM_ENTITY_RESOLUTION_COMPLETED'
  | 'MDM_GOLDEN_RECORD_CREATED'
  | 'MDM_GOLDEN_RECORD_UPDATED'
  | 'MDM_MERGE_REQUEST_CREATED'
  | 'MDM_GOVERNANCE_POLICY_CREATED'
  | 'MDM_STEWARDSHIP_ASSIGNED'
  | 'MDM_LINEAGE_RECORDED'
  | 'MDM_SOURCE_SYSTEM_CONNECTED'
  | 'MDM_DATA_CONTRACT_LINKED'
  | 'MDM_COPILOT_QUERIED'
  | 'MDM_RECOMMENDATION_CREATED'
  | 'MDM_RISK_DETECTED'
  | 'MDM_AUDIT_RECORDED'
  | 'GLOBAL_INTEGRATION_REGISTERED'
  | 'INTEGRATION_CONNECTION_CREATED'
  | 'INTEGRATION_CONNECTION_VALIDATED'
  | 'OAUTH_TOKEN_ROTATED'
  | 'OPENID_CONNECT_SESSION_LINKED'
  | 'SALESFORCE_SYNC_STARTED'
  | 'SALESFORCE_SYNC_COMPLETED'
  | 'SAP_SYNC_STARTED'
  | 'SAP_SYNC_COMPLETED'
  | 'ORACLE_SYNC_STARTED'
  | 'ORACLE_SYNC_COMPLETED'
  | 'MICROSOFT_GRAPH_SUBSCRIBED'
  | 'GOOGLE_WORKSPACE_SYNC_STARTED'
  | 'COMMUNICATION_ROUTE_CREATED'
  | 'PAYMENT_PROVIDER_CONNECTED'
  | 'PAYMENT_RECONCILIATION_COMPLETED'
  | 'CLOUD_INTEGRATION_CONNECTED'
  | 'API_GATEWAY_ROUTE_CREATED'
  | 'API_GATEWAY_POLICY_UPDATED'
  | 'WEBHOOK_ENDPOINT_CREATED'
  | 'WEBHOOK_DELIVERY_SUCCEEDED'
  | 'WEBHOOK_DELIVERY_FAILED'
  | 'CONNECTOR_SDK_PUBLISHED'
  | 'CONNECTOR_EXTENSION_REGISTERED'
  | 'INTEGRATION_HEALTH_CHECK_RECORDED'
  | 'INTEGRATION_SYNC_COMPLETED'
  | 'INTEGRATION_ALERT_CREATED'
  | 'INTEGRATION_USAGE_RECORDED'
  | 'INTEGRATION_COPILOT_QUERIED'
  | 'INTEGRATION_RECOMMENDATION_CREATED'
  | 'INTEGRATION_RISK_DETECTED'
  | 'INTEGRATION_AUDIT_RECORDED'
  | 'SECURITY_HARDENING_CONTROL_CREATED'
  | 'SECURITY_AUDIT_COMPLETED'
  | 'DEPENDENCY_REMEDIATION_RECORDED'
  | 'LOAD_TEST_STARTED'
  | 'LOAD_TEST_COMPLETED'
  | 'STRESS_TEST_COMPLETED'
  | 'PERFORMANCE_BENCHMARK_RECORDED'
  | 'PERFORMANCE_OPTIMIZATION_APPLIED'
  | 'PERFORMANCE_REGRESSION_DETECTED'
  | 'OBSERVABILITY_SIGNAL_RECORDED'
  | 'MONITORING_ALERT_RULE_CREATED'
  | 'BACKUP_POLICY_CREATED'
  | 'BACKUP_VALIDATION_COMPLETED'
  | 'RECOVERY_POINT_VALIDATED'
  | 'DISASTER_RECOVERY_PLAN_CREATED'
  | 'DISASTER_RECOVERY_EXERCISED'
  | 'FAILOVER_VALIDATED'
  | 'DEPLOYMENT_READINESS_CHECKED'
  | 'ENVIRONMENT_READINESS_VALIDATED'
  | 'STARTUP_VALIDATION_COMPLETED'
  | 'API_GOVERNANCE_REVIEW_COMPLETED'
  | 'API_POLICY_ASSESSED'
  | 'API_VERSION_COMPLIANCE_RECORDED'
  | 'TEST_COVERAGE_SNAPSHOT_CREATED'
  | 'UNIT_COVERAGE_REVIEW_COMPLETED'
  | 'INTEGRATION_COVERAGE_REVIEW_COMPLETED'
  | 'RELEASE_CANDIDATE_CHECKLIST_CREATED'
  | 'RELEASE_VALIDATION_COMPLETED'
  | 'RELEASE_APPROVAL_RECORDED'
  | 'DOCUMENTATION_REVIEW_COMPLETED'
  | 'DOCUMENTATION_GAP_RECORDED'
  | 'PRODUCTION_READINESS_SCORED'
  | 'PRODUCTION_RISK_REGISTERED'
  | 'HARDENING_AUDIT_RECORDED';

export interface DomainEvent<TPayload = Record<string, unknown>> {
  id: string;
  tenantId: string;
  workspaceId?: string;
  type: DomainEventType;
  source: string;
  subject?: { type: string; id: string };
  payload: TPayload;
  occurredAt: string;
  correlationId?: string;
  actorUserId?: string;
}






