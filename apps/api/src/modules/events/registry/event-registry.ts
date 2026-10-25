import { Injectable } from '@nestjs/common';
import { DomainEventType } from '../contracts/domain-event.contract';

export interface EventDefinition {
  type: DomainEventType;
  description: string;
  realtime: boolean;
  notification: boolean;
}

@Injectable()
export class EventRegistry {
  private readonly events = new Map<DomainEventType, EventDefinition>([
    ['user.created', { type: 'user.created', description: 'User created', realtime: true, notification: true }],
    ['user.updated', { type: 'user.updated', description: 'User updated', realtime: true, notification: false }],
    ['organization.created', { type: 'organization.created', description: 'Organization created', realtime: true, notification: true }],
    ['workspace.created', { type: 'workspace.created', description: 'Workspace created', realtime: true, notification: true }],
    ['lead.created', { type: 'lead.created', description: 'Lead created', realtime: true, notification: true }],
    ['lead.updated', { type: 'lead.updated', description: 'Lead updated', realtime: true, notification: false }],
    ['lead.converted', { type: 'lead.converted', description: 'Lead converted', realtime: true, notification: true }],
    ['customer.created', { type: 'customer.created', description: 'Customer created', realtime: true, notification: true }],
    ['invoice.created', { type: 'invoice.created', description: 'Invoice created', realtime: true, notification: true }],
    ['invoice.updated', { type: 'invoice.updated', description: 'Invoice updated', realtime: true, notification: false }],
    ['invoice.paid', { type: 'invoice.paid', description: 'Invoice paid', realtime: true, notification: true }],
    ['expense.created', { type: 'expense.created', description: 'Expense created', realtime: true, notification: true }],
    ['employee.created', { type: 'employee.created', description: 'Employee created', realtime: true, notification: true }],
    ['project.created', { type: 'project.created', description: 'Project created', realtime: true, notification: true }],
    ['task.created', { type: 'task.created', description: 'Task created', realtime: true, notification: true }],
    ['task.completed', { type: 'task.completed', description: 'Task completed', realtime: true, notification: true }],
    ['workflow.executed', { type: 'workflow.executed', description: 'Workflow executed', realtime: true, notification: true }],
    ['workflow.started', { type: 'workflow.started', description: 'Workflow execution started', realtime: true, notification: false }],
    ['workflow.completed', { type: 'workflow.completed', description: 'Workflow execution completed', realtime: true, notification: true }],
    ['workflow.failed', { type: 'workflow.failed', description: 'Workflow execution failed', realtime: true, notification: true }],
    ['workflow.definition.created', { type: 'workflow.definition.created', description: 'Workflow builder definition created', realtime: true, notification: false }],
    ['workflow.definition.published', { type: 'workflow.definition.published', description: 'Workflow builder definition published to runtime', realtime: true, notification: true }],
    ['workflow.template.created', { type: 'workflow.template.created', description: 'Workflow template created', realtime: true, notification: false }],
    ['workflow.execution.retried', { type: 'workflow.execution.retried', description: 'Workflow execution retried', realtime: true, notification: true }],
    ['workflow.approval.requested', { type: 'workflow.approval.requested', description: 'Workflow approval requested', realtime: true, notification: true }],
    ['workflow.approval.decided', { type: 'workflow.approval.decided', description: 'Workflow approval decided', realtime: true, notification: true }],
    ['workflow.metric.recorded', { type: 'workflow.metric.recorded', description: 'Workflow monitoring metric recorded', realtime: true, notification: false }],
    ['workflow.ai.generated', { type: 'workflow.ai.generated', description: 'AI generated workflow blueprint', realtime: true, notification: false }],
    ['agent.started', { type: 'agent.started', description: 'AI agent execution started', realtime: true, notification: false }],
    ['agent.completed', { type: 'agent.completed', description: 'AI agent execution completed', realtime: true, notification: true }],
    ['agent.failed', { type: 'agent.failed', description: 'AI agent execution failed', realtime: true, notification: true }],
    ['notification.created', { type: 'notification.created', description: 'Notification created', realtime: true, notification: false }],
    ['ai.insight.generated', { type: 'ai.insight.generated', description: 'AI insight generated', realtime: true, notification: true }],
    ['kpi.generated', { type: 'kpi.generated', description: 'KPI snapshot generated', realtime: true, notification: false }],
    ['report.generated', { type: 'report.generated', description: 'Report generated', realtime: true, notification: true }],
    ['alert.generated', { type: 'alert.generated', description: 'Predictive alert generated', realtime: true, notification: true }],
    ['forecast.generated', { type: 'forecast.generated', description: 'Forecast generated', realtime: true, notification: false }],
    ['connector.created', { type: 'connector.created', description: 'Connector created', realtime: true, notification: true }],
    ['connector.updated', { type: 'connector.updated', description: 'Connector updated', realtime: true, notification: false }],
    ['connector.deleted', { type: 'connector.deleted', description: 'Connector deleted', realtime: true, notification: true }],
    ['webhook.triggered', { type: 'webhook.triggered', description: 'Webhook triggered', realtime: true, notification: false }],
    ['webhook.failed', { type: 'webhook.failed', description: 'Webhook failed', realtime: true, notification: true }],
    ['sync.started', { type: 'sync.started', description: 'Sync started', realtime: true, notification: false }],
    ['sync.completed', { type: 'sync.completed', description: 'Sync completed', realtime: true, notification: false }],
    ['api_key.created', { type: 'api_key.created', description: 'API key created', realtime: true, notification: true }],
    ['api_key.rotated', { type: 'api_key.rotated', description: 'API key rotated', realtime: true, notification: true }],
    ['api_key.revoked', { type: 'api_key.revoked', description: 'API key revoked', realtime: true, notification: true }],
    ['admin.operation.created', { type: 'admin.operation.created', description: 'Enterprise admin operation created', realtime: true, notification: true }],
    ['release.approved', { type: 'release.approved', description: 'Production release approved', realtime: true, notification: true }],
    ['release.rolled_back', { type: 'release.rolled_back', description: 'Production release rolled back', realtime: true, notification: true }],
    ['feature_flag.updated', { type: 'feature_flag.updated', description: 'Feature flag updated', realtime: true, notification: false }],
    ['incident.created', { type: 'incident.created', description: 'Operations incident created', realtime: true, notification: true }],
    ['emergency_control.activated', { type: 'emergency_control.activated', description: 'Emergency control activated', realtime: true, notification: true }],
    ['tenant.suspended', { type: 'tenant.suspended', description: 'Tenant suspended by security operations', realtime: true, notification: true }],
    ['tenant.restored', { type: 'tenant.restored', description: 'Tenant restored by security operations', realtime: true, notification: true }],
    ['data_import.created', { type: 'data_import.created', description: 'Enterprise data import job created', realtime: true, notification: false }],
    ['data_import.processed', { type: 'data_import.processed', description: 'Enterprise data import processed', realtime: true, notification: true }],
    ['migration.started', { type: 'migration.started', description: 'External system migration started', realtime: true, notification: false }],
    ['migration.completed', { type: 'migration.completed', description: 'External system migration completed', realtime: true, notification: true }],
    ['onboarding.started', { type: 'onboarding.started', description: 'Customer onboarding started', realtime: true, notification: false }],
    ['onboarding.completed', { type: 'onboarding.completed', description: 'Customer onboarding completed', realtime: true, notification: true }],
    ['workspace.onboarding.generated', { type: 'workspace.onboarding.generated', description: 'Onboarding generated workspace blueprint', realtime: true, notification: true }],
    ['marketplace.app.created', { type: 'marketplace.app.created', description: 'Marketplace app catalog entry created', realtime: true, notification: false }],
    ['marketplace.app.installed', { type: 'marketplace.app.installed', description: 'Marketplace app installed into a tenant or workspace', realtime: true, notification: true }],
    ['marketplace.app.uninstalled', { type: 'marketplace.app.uninstalled', description: 'Marketplace app uninstalled from a tenant or workspace', realtime: true, notification: true }],
    ['extension.hook.registered', { type: 'extension.hook.registered', description: 'Extension framework hook registered', realtime: true, notification: false }],
    ['partner.created', { type: 'partner.created', description: 'Partner ecosystem profile created', realtime: true, notification: true }],
    ['industry_template.installed', { type: 'industry_template.installed', description: 'Industry template pack installed into a workspace', realtime: true, notification: true }],
    ['device.registered', { type: 'device.registered', description: 'Device registered for mobile, desktop or tablet access', realtime: true, notification: true }],
    ['device.approved', { type: 'device.approved', description: 'Registered device approved or trusted', realtime: true, notification: true }],
    ['device.revoked', { type: 'device.revoked', description: 'Registered device revoked by administrator', realtime: true, notification: true }],
    ['device.session.revoked', { type: 'device.session.revoked', description: 'Device sessions revoked remotely', realtime: true, notification: true }],
    ['offline.queue.item.created', { type: 'offline.queue.item.created', description: 'Offline operation queued for sync', realtime: true, notification: false }],
    ['offline.queue.item.synced', { type: 'offline.queue.item.synced', description: 'Offline operation synchronized successfully', realtime: true, notification: false }],
    ['sync.conflict.detected', { type: 'sync.conflict.detected', description: 'Synchronization conflict detected', realtime: true, notification: true }],
    ['mobile.command.created', { type: 'mobile.command.created', description: 'Mobile command center action created', realtime: true, notification: false }],
    ['desktop.notification.created', { type: 'desktop.notification.created', description: 'Desktop companion notification created', realtime: true, notification: true }],
    ['data.governance.asset.created', { type: 'data.governance.asset.created', description: 'Data catalog asset created', realtime: true, notification: false }],
    ['data.classified', { type: 'data.classified', description: 'Data classification event recorded', realtime: true, notification: false }],
    ['data.lineage.recorded', { type: 'data.lineage.recorded', description: 'Data lineage edge recorded', realtime: true, notification: false }],
    ['data.quality.checked', { type: 'data.quality.checked', description: 'Data quality check executed', realtime: true, notification: false }],
    ['privacy.request.created', { type: 'privacy.request.created', description: 'Privacy subject request created', realtime: true, notification: true }],
    ['privacy.request.completed', { type: 'privacy.request.completed', description: 'Privacy subject request completed', realtime: true, notification: true }],
    ['privacy.consent.updated', { type: 'privacy.consent.updated', description: 'Privacy consent record updated', realtime: true, notification: false }],
    ['retention.policy.created', { type: 'retention.policy.created', description: 'Records retention policy created', realtime: true, notification: false }],
    ['records.lifecycle.action.created', { type: 'records.lifecycle.action.created', description: 'Records lifecycle action scheduled or executed', realtime: true, notification: false }],
    ['records.archive.created', { type: 'records.archive.created', description: 'Records archive job created', realtime: true, notification: false }],
    ['compliance.evidence.generated', { type: 'compliance.evidence.generated', description: 'Compliance evidence package generated', realtime: true, notification: true }],
    ['compliance.monitoring.completed', { type: 'compliance.monitoring.completed', description: 'Compliance monitoring run completed', realtime: true, notification: true }],
    ['search.index.created', { type: 'search.index.created', description: 'Enterprise search index created', realtime: true, notification: false }],
    ['search.document.indexed', { type: 'search.document.indexed', description: 'Document or business record indexed for search', realtime: true, notification: false }],
    ['search.query.executed', { type: 'search.query.executed', description: 'Enterprise search query executed', realtime: true, notification: false }],
    ['search.semantic.executed', { type: 'search.semantic.executed', description: 'Semantic search query executed', realtime: true, notification: false }],
    ['retrieval.session.created', { type: 'retrieval.session.created', description: 'Secure retrieval session created', realtime: true, notification: false }],
    ['retrieval.context.generated', { type: 'retrieval.context.generated', description: 'AI-ready retrieval context generated', realtime: true, notification: false }],
    ['knowledge.space.created', { type: 'knowledge.space.created', description: 'Knowledge space created', realtime: true, notification: true }],
    ['knowledge.article.created', { type: 'knowledge.article.created', description: 'Knowledge article created', realtime: true, notification: false }],
    ['discussion.created', { type: 'discussion.created', description: 'Collaboration discussion created', realtime: true, notification: true }],
    ['discussion.message.created', { type: 'discussion.message.created', description: 'Discussion message created', realtime: true, notification: true }],
    ['decision.room.created', { type: 'decision.room.created', description: 'Decision room created', realtime: true, notification: true }],
    ['decision.vote.cast', { type: 'decision.vote.cast', description: 'Decision room vote cast', realtime: true, notification: false }],
    ['decision.approval.decided', { type: 'decision.approval.decided', description: 'Decision approval resolved', realtime: true, notification: true }],
    ['decision.record.created', { type: 'decision.record.created', description: 'Decision record created', realtime: true, notification: true }],
    ['ai.collaboration.summary.generated', { type: 'ai.collaboration.summary.generated', description: 'AI collaboration summary generated', realtime: true, notification: false }],
    ['collaboration.action_item.created', { type: 'collaboration.action_item.created', description: 'Collaboration action item created', realtime: true, notification: true }],
    ['communication.channel.created', { type: 'communication.channel.created', description: 'Communication channel created', realtime: true, notification: true }],
    ['conversation.created', { type: 'conversation.created', description: 'Conversation created', realtime: true, notification: false }],
    ['message.sent', { type: 'message.sent', description: 'Message sent', realtime: true, notification: true }],
    ['announcement.sent', { type: 'announcement.sent', description: 'Announcement sent', realtime: true, notification: true }],
    ['meeting.created', { type: 'meeting.created', description: 'Meeting created', realtime: true, notification: true }],
    ['meeting.summary.generated', { type: 'meeting.summary.generated', description: 'AI meeting summary generated', realtime: true, notification: false }],
    ['calendar.event.created', { type: 'calendar.event.created', description: 'Calendar event created', realtime: true, notification: true }],
    ['scheduling.recommendation.created', { type: 'scheduling.recommendation.created', description: 'Scheduling recommendation created', realtime: true, notification: false }],
    ['reminder.created', { type: 'reminder.created', description: 'Reminder created', realtime: true, notification: true }],
    ['availability.updated', { type: 'availability.updated', description: 'Availability updated', realtime: true, notification: false }],
    ['voice.session.started', { type: 'voice.session.started', description: 'Voice AI session started', realtime: true, notification: false }],
    ['voice.transcript.created', { type: 'voice.transcript.created', description: 'Voice transcript segment created', realtime: true, notification: false }],
    ['voice.command.executed', { type: 'voice.command.executed', description: 'Voice command executed through governed action pipeline', realtime: true, notification: true }],
    ['contact_center.queue.created', { type: 'contact_center.queue.created', description: 'Contact center queue created', realtime: true, notification: false }],
    ['contact_center.assignment.created', { type: 'contact_center.assignment.created', description: 'Conversation or voice session assigned to an agent', realtime: true, notification: true }],
    ['contact_center.escalated', { type: 'contact_center.escalated', description: 'Contact center escalation created', realtime: true, notification: true }],
    ['omnichannel.identity.resolved', { type: 'omnichannel.identity.resolved', description: 'Customer identity resolved across communication channels', realtime: true, notification: false }],
    ['omnichannel.message.synced', { type: 'omnichannel.message.synced', description: 'External omnichannel message synchronized', realtime: true, notification: false }],
    ['conversation.sentiment.detected', { type: 'conversation.sentiment.detected', description: 'Conversation sentiment detected', realtime: true, notification: false }],
    ['conversation.intent.detected', { type: 'conversation.intent.detected', description: 'Conversation intent detected', realtime: true, notification: false }],
    ['conversation.summary.generated', { type: 'conversation.summary.generated', description: 'Conversation intelligence summary generated', realtime: true, notification: true }],
    ['voice_agent.execution.started', { type: 'voice_agent.execution.started', description: 'Voice agent execution started', realtime: true, notification: false }],
    ['voice_agent.execution.completed', { type: 'voice_agent.execution.completed', description: 'Voice agent execution completed', realtime: true, notification: true }],    ['customer.health.scored', { type: 'customer.health.scored', description: 'Customer health score calculated', realtime: true, notification: false }],
    ['customer.journey.updated', { type: 'customer.journey.updated', description: 'Customer journey updated', realtime: true, notification: false }],
    ['customer.feedback.created', { type: 'customer.feedback.created', description: 'Customer feedback captured', realtime: true, notification: true }],
    ['customer.success.plan.created', { type: 'customer.success.plan.created', description: 'Customer success plan created', realtime: true, notification: true }],
    ['customer.engagement.scored', { type: 'customer.engagement.scored', description: 'Customer engagement score calculated', realtime: true, notification: false }],
    ['churn.prediction.created', { type: 'churn.prediction.created', description: 'Churn prediction generated', realtime: true, notification: true }],
    ['renewal.opportunity.created', { type: 'renewal.opportunity.created', description: 'Renewal opportunity created', realtime: true, notification: true }],
    ['revenue.opportunity.created', { type: 'revenue.opportunity.created', description: 'Revenue opportunity created', realtime: true, notification: true }],
    ['revenue.risk.detected', { type: 'revenue.risk.detected', description: 'Revenue risk detected', realtime: true, notification: true }],
    ['service.ticket.created', { type: 'service.ticket.created', description: 'Service ticket created', realtime: true, notification: true }],
    ['service.ticket.resolved', { type: 'service.ticket.resolved', description: 'Service ticket resolved', realtime: true, notification: true }],
    ['service.escalated', { type: 'service.escalated', description: 'Service ticket escalated', realtime: true, notification: true }],
    ['sla.record.created', { type: 'sla.record.created', description: 'SLA record created or updated', realtime: true, notification: false }],    ['product.health.scored', { type: 'product.health.scored', description: 'Product health score calculated', realtime: true, notification: false }],
    ['product.event.tracked', { type: 'product.event.tracked', description: 'Product analytics event tracked', realtime: true, notification: false }],
    ['product.usage.metric.recorded', { type: 'product.usage.metric.recorded', description: 'Product usage metric recorded', realtime: true, notification: false }],
    ['feature.usage.recorded', { type: 'feature.usage.recorded', description: 'Feature usage recorded', realtime: true, notification: false }],
    ['user.journey.started', { type: 'user.journey.started', description: 'User journey started', realtime: true, notification: false }],
    ['user.journey.step.recorded', { type: 'user.journey.step.recorded', description: 'User journey step recorded', realtime: true, notification: false }],
    ['funnel.result.generated', { type: 'funnel.result.generated', description: 'Funnel analytics result generated', realtime: true, notification: false }],
    ['experiment.created', { type: 'experiment.created', description: 'Growth experiment created', realtime: true, notification: true }],
    ['experiment.result.evaluated', { type: 'experiment.result.evaluated', description: 'Experiment result evaluated', realtime: true, notification: true }],
    ['retention.cohort.generated', { type: 'retention.cohort.generated', description: 'Retention cohort generated', realtime: true, notification: false }],
    ['engagement.score.created', { type: 'engagement.score.created', description: 'Product engagement score created', realtime: true, notification: false }],
    ['growth.recommendation.created', { type: 'growth.recommendation.created', description: 'Growth recommendation created', realtime: true, notification: true }],    ['forecast.model.created', { type: 'forecast.model.created', description: 'Forecast model created', realtime: true, notification: false }],
    ['forecast.result.generated', { type: 'forecast.result.generated', description: 'Forecast result generated', realtime: true, notification: true }],
    ['prediction.model.created', { type: 'prediction.model.created', description: 'Prediction model created', realtime: true, notification: false }],
    ['prediction.result.generated', { type: 'prediction.result.generated', description: 'Prediction result generated', realtime: true, notification: true }],
    ['strategic.goal.created', { type: 'strategic.goal.created', description: 'Strategic goal created', realtime: true, notification: true }],
    ['strategic.plan.created', { type: 'strategic.plan.created', description: 'Strategic plan created', realtime: true, notification: true }],
    ['scenario.model.created', { type: 'scenario.model.created', description: 'Scenario model created', realtime: true, notification: false }],
    ['scenario.result.generated', { type: 'scenario.result.generated', description: 'Scenario result generated', realtime: true, notification: true }],
    ['budget.plan.created', { type: 'budget.plan.created', description: 'Budget plan created', realtime: true, notification: true }],
    ['capacity.plan.created', { type: 'capacity.plan.created', description: 'Capacity plan created', realtime: true, notification: true }],
    ['risk.forecast.generated', { type: 'risk.forecast.generated', description: 'Risk forecast generated', realtime: true, notification: true }],
    ['growth.forecast.generated', { type: 'growth.forecast.generated', description: 'Growth forecast generated', realtime: true, notification: true }],
    ['strategy.recommendation.generated', { type: 'strategy.recommendation.generated', description: 'AI strategy recommendation generated', realtime: true, notification: true }],    ['data.lake.created', { type: 'data.lake.created', description: 'Enterprise data lake created', realtime: true, notification: true }],
    ['data.warehouse.created', { type: 'data.warehouse.created', description: 'Enterprise data warehouse created', realtime: true, notification: true }],
    ['data.mart.created', { type: 'data.mart.created', description: 'Data mart created', realtime: true, notification: true }],
    ['semantic.metric.created', { type: 'semantic.metric.created', description: 'Semantic metric created', realtime: true, notification: false }],
    ['semantic.dimension.created', { type: 'semantic.dimension.created', description: 'Semantic dimension created', realtime: true, notification: false }],
    ['kpi.created', { type: 'kpi.created', description: 'KPI created', realtime: true, notification: true }],
    ['kpi.result.generated', { type: 'kpi.result.generated', description: 'KPI result generated', realtime: true, notification: true }],
    ['executive.dashboard.created', { type: 'executive.dashboard.created', description: 'Executive dashboard created', realtime: true, notification: true }],
    ['warehouse.job.created', { type: 'warehouse.job.created', description: 'Warehouse job created', realtime: true, notification: false }],
    ['data.pipeline.created', { type: 'data.pipeline.created', description: 'Data pipeline created', realtime: true, notification: true }],
    ['data.pipeline.executed', { type: 'data.pipeline.executed', description: 'Data pipeline execution recorded', realtime: true, notification: true }],    ['ai.model.registry.created', { type: 'ai.model.registry.created', description: 'AI model registry created', realtime: true, notification: true }],
    ['ai.model.created', { type: 'ai.model.created', description: 'AI model registered', realtime: true, notification: true }],
    ['ai.model.version.created', { type: 'ai.model.version.created', description: 'AI model version created', realtime: true, notification: false }],
    ['ai.model.deployment.created', { type: 'ai.model.deployment.created', description: 'AI model deployment created', realtime: true, notification: true }],
    ['ai.decision.recorded', { type: 'ai.decision.recorded', description: 'AI decision recorded', realtime: true, notification: true }],
    ['ai.decision.reason.created', { type: 'ai.decision.reason.created', description: 'AI decision reason created', realtime: true, notification: false }],
    ['ai.decision.risk.created', { type: 'ai.decision.risk.created', description: 'AI decision risk created', realtime: true, notification: true }],
    ['ai.audit.log.created', { type: 'ai.audit.log.created', description: 'AI audit log created', realtime: true, notification: false }],
    ['ai.compliance.record.created', { type: 'ai.compliance.record.created', description: 'AI compliance record created', realtime: true, notification: true }],
    ['ai.explainability.record.created', { type: 'ai.explainability.record.created', description: 'AI explainability record created', realtime: true, notification: false }],
    ['model.performance.metric.recorded', { type: 'model.performance.metric.recorded', description: 'Model performance metric recorded', realtime: true, notification: false }],
    ['model.approval.workflow.created', { type: 'model.approval.workflow.created', description: 'Model approval workflow created', realtime: true, notification: true }],
    ['model.approval.workflow.decided', { type: 'model.approval.workflow.decided', description: 'Model approval workflow decided', realtime: true, notification: true }],    ['security.incident.created', { type: 'security.incident.created', description: 'Security incident created for investigation and response', realtime: true, notification: true }],
    ['security.threat.detected', { type: 'security.threat.detected', description: 'Security threat detected by intelligence or detection rules', realtime: true, notification: true }],
    ['threat.rule.created', { type: 'threat.rule.created', description: 'Threat detection rule created or registered', realtime: true, notification: false }],
    ['threat.event.created', { type: 'threat.event.created', description: 'Threat event recorded for monitoring and correlation', realtime: true, notification: true }],
    ['security.risk.assessed', { type: 'security.risk.assessed', description: 'Security risk assessed and scored', realtime: true, notification: true }],
    ['security.score.updated', { type: 'security.score.updated', description: 'Security score calculated or updated', realtime: true, notification: false }],
    ['security.audit.created', { type: 'security.audit.created', description: 'Security audit record created', realtime: true, notification: false }],
    ['compliance.violation.created', { type: 'compliance.violation.created', description: 'Compliance violation detected from security monitoring', realtime: true, notification: true }],
    ['zero_trust.policy.created', { type: 'zero_trust.policy.created', description: 'Zero trust access policy created', realtime: true, notification: false }],
    ['access.verification.created', { type: 'access.verification.created', description: 'Zero trust access verification decision recorded', realtime: true, notification: true }],
    ['security.alert.created', { type: 'security.alert.created', description: 'Security alert created for command center triage', realtime: true, notification: true }],
    ['security.investigation.created', { type: 'security.investigation.created', description: 'Security investigation opened', realtime: true, notification: true }],
    ['security.investigation.updated', { type: 'security.investigation.updated', description: 'Security investigation updated', realtime: true, notification: true }],    ['service.health.recorded', { type: 'service.health.recorded', description: 'Service health signal recorded for SRE monitoring', realtime: true, notification: false }],
    ['system.incident.created', { type: 'system.incident.created', description: 'System reliability incident created', realtime: true, notification: true }],
    ['incident.timeline.created', { type: 'incident.timeline.created', description: 'Incident timeline event recorded', realtime: true, notification: true }],
    ['recovery.action.created', { type: 'recovery.action.created', description: 'Recovery automation action queued or started', realtime: true, notification: true }],
    ['recovery.action.completed', { type: 'recovery.action.completed', description: 'Recovery automation action completed', realtime: true, notification: true }],
    ['uptime.metric.recorded', { type: 'uptime.metric.recorded', description: 'Uptime and SLO metric recorded', realtime: true, notification: false }],
    ['reliability.score.updated', { type: 'reliability.score.updated', description: 'Reliability score calculated or updated', realtime: true, notification: false }],
    ['scaling.policy.created', { type: 'scaling.policy.created', description: 'Autoscaling policy created', realtime: true, notification: false }],
    ['scaling.event.created', { type: 'scaling.event.created', description: 'Scaling event created for capacity operations', realtime: true, notification: true }],
    ['region.health.recorded', { type: 'region.health.recorded', description: 'Global region health signal recorded', realtime: true, notification: false }],
    ['failover.event.created', { type: 'failover.event.created', description: 'Global failover event created', realtime: true, notification: true }],
    ['sre.alert.created', { type: 'sre.alert.created', description: 'SRE alert created for reliability operations', realtime: true, notification: true }],
    ['capacity.forecast.created', { type: 'capacity.forecast.created', description: 'Capacity forecast generated', realtime: true, notification: true }],    ['cost.center.created', { type: 'cost.center.created', description: 'FinOps cost center created', realtime: true, notification: false }],
    ['resource.usage.recorded', { type: 'resource.usage.recorded', description: 'Resource usage recorded for cost and performance analytics', realtime: true, notification: false }],
    ['cost.metric.recorded', { type: 'cost.metric.recorded', description: 'Cost metric recorded for financial operations', realtime: true, notification: false }],
    ['cost.forecast.created', { type: 'cost.forecast.created', description: 'Cost forecast generated', realtime: true, notification: true }],
    ['optimization.recommendation.created', { type: 'optimization.recommendation.created', description: 'Optimization recommendation created', realtime: true, notification: true }],
    ['efficiency.score.updated', { type: 'efficiency.score.updated', description: 'Efficiency score calculated or updated', realtime: true, notification: false }],
    ['performance.metric.recorded', { type: 'performance.metric.recorded', description: 'Performance metric recorded for optimization analysis', realtime: true, notification: false }],
    ['resource.allocation.created', { type: 'resource.allocation.created', description: 'Resource allocation created for department cost attribution', realtime: true, notification: false }],
    ['finops.policy.created', { type: 'finops.policy.created', description: 'FinOps policy created for budget and cost governance', realtime: true, notification: false }],
    ['budget.tracking.created', { type: 'budget.tracking.created', description: 'Budget tracking record created', realtime: true, notification: true }],
    ['cost.alert.created', { type: 'cost.alert.created', description: 'Cost alert created for budget or anomaly monitoring', realtime: true, notification: true }],
    ['savings.opportunity.created', { type: 'savings.opportunity.created', description: 'Savings opportunity created', realtime: true, notification: true }],    ['data.region.created', { type: 'data.region.created', description: 'Data residency region created', realtime: true, notification: false }],
    ['residency.policy.created', { type: 'residency.policy.created', description: 'Data residency policy created', realtime: true, notification: false }],
    ['sovereignty.rule.created', { type: 'sovereignty.rule.created', description: 'Data sovereignty rule created', realtime: true, notification: false }],
    ['regulatory.framework.created', { type: 'regulatory.framework.created', description: 'Regulatory framework registered', realtime: true, notification: false }],
    ['compliance.requirement.created', { type: 'compliance.requirement.created', description: 'Compliance requirement created', realtime: true, notification: false }],
    ['jurisdiction.rule.created', { type: 'jurisdiction.rule.created', description: 'Jurisdiction rule created', realtime: true, notification: false }],
    ['data.transfer.rule.created', { type: 'data.transfer.rule.created', description: 'Data transfer rule created', realtime: true, notification: true }],
    ['compliance.audit.created', { type: 'compliance.audit.created', description: 'Regulatory compliance audit created', realtime: true, notification: true }],
    ['regulatory.alert.created', { type: 'regulatory.alert.created', description: 'Regulatory alert created', realtime: true, notification: true }],
    ['residency.assignment.created', { type: 'residency.assignment.created', description: 'Residency assignment created for data subject or object', realtime: true, notification: false }],
    ['data.location.recorded', { type: 'data.location.recorded', description: 'Data location recorded for residency monitoring', realtime: true, notification: false }],
    ['regulatory.risk.created', { type: 'regulatory.risk.created', description: 'Regulatory risk created', realtime: true, notification: true }],    ['data.contract.created', { type: 'data.contract.created', description: 'Data contract registered for governed consumers', realtime: true, notification: false }],
    ['contract.version.created', { type: 'contract.version.created', description: 'Data contract version created', realtime: true, notification: false }],
    ['api.product.created', { type: 'api.product.created', description: 'API product created for marketplace publication', realtime: true, notification: true }],
    ['api.plan.created', { type: 'api.plan.created', description: 'API monetization plan created', realtime: true, notification: false }],
    ['api.subscription.created', { type: 'api.subscription.created', description: 'API subscription created for consumer access', realtime: true, notification: true }],
    ['api.usage.recorded', { type: 'api.usage.recorded', description: 'API usage record metered for billing and analytics', realtime: true, notification: false }],
    ['api.billing.created', { type: 'api.billing.created', description: 'API billing record created for monetization', realtime: true, notification: true }],
    ['governance.policy.created', { type: 'governance.policy.created', description: 'Platform governance policy created', realtime: true, notification: true }],
    ['api.quota.created', { type: 'api.quota.created', description: 'API quota created for consumption controls', realtime: true, notification: false }],
    ['rate.limit.policy.created', { type: 'rate.limit.policy.created', description: 'Rate limit policy created for access control', realtime: true, notification: false }],
    ['partner.access.created', { type: 'partner.access.created', description: 'Partner API access grant created', realtime: true, notification: true }],
    ['trust.report.created', { type: 'trust.report.created', description: 'Trust report created for customer-facing assurance', realtime: true, notification: true }],
    ['security.certification.created', { type: 'security.certification.created', description: 'Security certification registered for trust center', realtime: true, notification: true }],
    ['compliance.artifact.created', { type: 'compliance.artifact.created', description: 'Compliance artifact published for trust center access', realtime: true, notification: false }],
    ['developer.account.created', { type: 'developer.account.created', description: 'Developer account created for external ecosystem access', realtime: true, notification: true }],
    ['developer.application.created', { type: 'developer.application.created', description: 'Developer application registered for API access', realtime: true, notification: true }],
    ['api.documentation.created', { type: 'api.documentation.created', description: 'API documentation published for developer portal', realtime: true, notification: false }],
    ['sdk.package.created', { type: 'sdk.package.created', description: 'SDK package published for developer distribution', realtime: true, notification: false }],
    ['external.integration.created', { type: 'external.integration.created', description: 'External integration catalog entry created', realtime: true, notification: true }],
    ['partner.listing.created', { type: 'partner.listing.created', description: 'Partner marketplace listing created', realtime: true, notification: true }],
    ['marketplace.application.created', { type: 'marketplace.application.created', description: 'Marketplace application published', realtime: true, notification: true }],
    ['status.incident.created', { type: 'status.incident.created', description: 'Public status center incident created', realtime: true, notification: true }],
    ['ecosystem.event.created', { type: 'ecosystem.event.created', description: 'External ecosystem event recorded', realtime: true, notification: false }],
    ['customer.account.created', { type: 'customer.account.created', description: 'Customer portal account created', realtime: true, notification: true }],
    ['customer.workspace.created', { type: 'customer.workspace.created', description: 'Customer workspace created for self-service access', realtime: true, notification: true }],
    ['customer.subscription.created', { type: 'customer.subscription.created', description: 'Customer subscription created', realtime: true, notification: true }],
    ['billing.profile.created', { type: 'billing.profile.created', description: 'Billing profile created for customer account', realtime: true, notification: false }],
    ['invoice.record.created', { type: 'invoice.record.created', description: 'Invoice record created for external billing', realtime: true, notification: true }],
    ['payment.method.created', { type: 'payment.method.created', description: 'Payment method created for customer billing', realtime: true, notification: false }],
    ['usage.metric.recorded', { type: 'usage.metric.recorded', description: 'Usage metric recorded for customer billing and monitoring', realtime: true, notification: false }],
    ['partner.account.created', { type: 'partner.account.created', description: 'Partner portal account created', realtime: true, notification: true }],
    ['partner.workspace.created', { type: 'partner.workspace.created', description: 'Partner workspace created for self-service access', realtime: true, notification: true }],
    ['partner.commission.created', { type: 'partner.commission.created', description: 'Partner commission record created', realtime: true, notification: true }],
    ['partner.referral.created', { type: 'partner.referral.created', description: 'Partner referral submitted', realtime: true, notification: true }],
    ['revenue.account.created', { type: 'revenue.account.created', description: 'Revenue account created for revenue operations', realtime: true, notification: true }],
    ['revenue.contract.created', { type: 'revenue.contract.created', description: 'Revenue contract created for contract lifecycle management', realtime: true, notification: true }],
    ['contract.amendment.created', { type: 'contract.amendment.created', description: 'Contract amendment created', realtime: true, notification: true }],
    ['renewal.schedule.created', { type: 'renewal.schedule.created', description: 'Renewal schedule created', realtime: true, notification: true }],
    ['renewal.forecast.created', { type: 'renewal.forecast.created', description: 'Renewal forecast generated', realtime: true, notification: true }],
    ['churn.signal.created', { type: 'churn.signal.created', description: 'Revenue churn signal captured', realtime: true, notification: true }],
    ['expansion.opportunity.created', { type: 'expansion.opportunity.created', description: 'Expansion opportunity created', realtime: true, notification: true }],
    ['account.health.scored', { type: 'account.health.scored', description: 'Revenue account health score calculated', realtime: true, notification: false }],
    ['revenue.forecast.created', { type: 'revenue.forecast.created', description: 'Revenue forecast created', realtime: true, notification: true }],
    ['revenue.event.created', { type: 'revenue.event.created', description: 'Revenue operations event recorded', realtime: true, notification: false }],
    ['vendor.created', { type: 'vendor.created', description: 'Vendor created for procurement management', realtime: true, notification: true }],
    ['vendor.contract.created', { type: 'vendor.contract.created', description: 'Vendor contract created', realtime: true, notification: true }],
    ['vendor.scorecard.created', { type: 'vendor.scorecard.created', description: 'Vendor scorecard created', realtime: true, notification: false }],
    ['procurement.request.created', { type: 'procurement.request.created', description: 'Procurement request created', realtime: true, notification: true }],
    ['procurement.approval.created', { type: 'procurement.approval.created', description: 'Procurement approval record created', realtime: true, notification: true }],
    ['purchase.order.created', { type: 'purchase.order.created', description: 'Purchase order created', realtime: true, notification: true }],
    ['purchase.category.created', { type: 'purchase.category.created', description: 'Purchase category created', realtime: true, notification: false }],
    ['budget.allocation.created', { type: 'budget.allocation.created', description: 'Budget allocation created for procurement control', realtime: true, notification: true }],
    ['spend.transaction.recorded', { type: 'spend.transaction.recorded', description: 'Spend transaction recorded', realtime: true, notification: false }],
    ['spend.insight.created', { type: 'spend.insight.created', description: 'Spend intelligence insight created', realtime: true, notification: true }],
    ['cost.optimization.recommendation.created', { type: 'cost.optimization.recommendation.created', description: 'Cost optimization recommendation created', realtime: true, notification: true }],
    ['procurement.event.created', { type: 'procurement.event.created', description: 'Procurement event recorded', realtime: true, notification: false }],
    ['supply.item.created', { type: 'supply.item.created', description: 'Supply chain item created', realtime: true, notification: false }],
    ['warehouse.created', { type: 'warehouse.created', description: 'Warehouse created', realtime: true, notification: true }],
    ['inventory.stock.updated', { type: 'inventory.stock.updated', description: 'Inventory stock balance updated', realtime: true, notification: false }],
    ['inventory.batch.created', { type: 'inventory.batch.created', description: 'Inventory batch created', realtime: true, notification: false }],
    ['inventory.serial.created', { type: 'inventory.serial.created', description: 'Inventory serial created', realtime: true, notification: false }],
    ['inventory.audit.created', { type: 'inventory.audit.created', description: 'Inventory audit created', realtime: true, notification: true }],
    ['inventory.movement.recorded', { type: 'inventory.movement.recorded', description: 'Inventory movement recorded', realtime: true, notification: false }],
    ['inventory.transfer.created', { type: 'inventory.transfer.created', description: 'Inventory transfer created', realtime: true, notification: true }],
    ['receiving.record.created', { type: 'receiving.record.created', description: 'Receiving record created', realtime: true, notification: true }],
    ['fulfillment.order.created', { type: 'fulfillment.order.created', description: 'Fulfillment order created', realtime: true, notification: true }],
    ['shipment.created', { type: 'shipment.created', description: 'Shipment created', realtime: true, notification: true }],
    ['shipment.tracking.updated', { type: 'shipment.tracking.updated', description: 'Shipment tracking event recorded', realtime: true, notification: true }],
    ['carrier.created', { type: 'carrier.created', description: 'Carrier created', realtime: true, notification: false }],
    ['distribution.route.optimized', { type: 'distribution.route.optimized', description: 'Distribution route optimization plan created', realtime: true, notification: true }],
    ['demand.forecast.model.created', { type: 'demand.forecast.model.created', description: 'Demand forecast model created', realtime: true, notification: false }],
    ['demand.forecast.scenario.created', { type: 'demand.forecast.scenario.created', description: 'Demand forecast scenario created', realtime: true, notification: true }],
    ['replenishment.plan.created', { type: 'replenishment.plan.created', description: 'Replenishment plan created', realtime: true, notification: true }],
    ['supply.chain.risk.detected', { type: 'supply.chain.risk.detected', description: 'Supply chain risk detected', realtime: true, notification: true }],
    ['supply.chain.insight.created', { type: 'supply.chain.insight.created', description: 'Supply chain insight created', realtime: true, notification: true }],
    ['supply.chain.copilot.queried', { type: 'supply.chain.copilot.queried', description: 'Supply chain copilot query captured', realtime: true, notification: false }],

    ['manufacturing.plant.created', { type: 'manufacturing.plant.created', description: 'Manufacturing plant created', realtime: true, notification: true }],
    ['production.line.created', { type: 'production.line.created', description: 'Production line created', realtime: true, notification: true }],
    ['work.center.created', { type: 'work.center.created', description: 'Work center created for manufacturing execution', realtime: true, notification: false }],
    ['factory.resource.created', { type: 'factory.resource.created', description: 'Factory resource registered', realtime: true, notification: false }],
    ['bom.created', { type: 'bom.created', description: 'Bill of materials created', realtime: true, notification: true }],
    ['bom.component.created', { type: 'bom.component.created', description: 'Bill of materials component created', realtime: true, notification: false }],
    ['production.plan.created', { type: 'production.plan.created', description: 'Production plan created', realtime: true, notification: true }],
    ['production.schedule.created', { type: 'production.schedule.created', description: 'Production schedule created', realtime: true, notification: true }],
    ['production.order.created', { type: 'production.order.created', description: 'Production order created', realtime: true, notification: true }],
    ['production.operation.created', { type: 'production.operation.created', description: 'Production operation created', realtime: true, notification: false }],
    ['mes.execution.started', { type: 'mes.execution.started', description: 'Manufacturing execution run started', realtime: true, notification: true }],
    ['production.material.requirement.created', { type: 'production.material.requirement.created', description: 'Production material requirement created', realtime: true, notification: true }],
    ['machine.telemetry.recorded', { type: 'machine.telemetry.recorded', description: 'Machine telemetry recorded', realtime: true, notification: false }],
    ['quality.inspection.created', { type: 'quality.inspection.created', description: 'Quality inspection created', realtime: true, notification: true }],
    ['quality.issue.created', { type: 'quality.issue.created', description: 'Quality issue created', realtime: true, notification: true }],
    ['maintenance.asset.created', { type: 'maintenance.asset.created', description: 'Maintenance asset created', realtime: true, notification: false }],
    ['maintenance.prediction.created', { type: 'maintenance.prediction.created', description: 'Predictive maintenance signal created', realtime: true, notification: true }],
    ['production.cost.recorded', { type: 'production.cost.recorded', description: 'Production cost record created', realtime: true, notification: false }],
    ['manufacturing.metric.recorded', { type: 'manufacturing.metric.recorded', description: 'Manufacturing metric recorded', realtime: true, notification: false }],
    ['manufacturing.risk.detected', { type: 'manufacturing.risk.detected', description: 'Manufacturing risk detected', realtime: true, notification: true }],
    ['digital.twin.model.created', { type: 'digital.twin.model.created', description: 'Digital twin model created', realtime: true, notification: false }],
    ['digital.twin.snapshot.created', { type: 'digital.twin.snapshot.created', description: 'Digital twin snapshot created', realtime: true, notification: true }],
    ['manufacturing.copilot.queried', { type: 'manufacturing.copilot.queried', description: 'Manufacturing copilot query captured', realtime: true, notification: false }],
    ['manufacturing.event.created', { type: 'manufacturing.event.created', description: 'Manufacturing domain event created', realtime: true, notification: false }],
    ['EMPLOYEE_CREATED', { type: 'EMPLOYEE_CREATED', description: 'Phase 44 workforce HR event: employee created', realtime: true, notification: false }],
    ['EMPLOYEE_UPDATED', { type: 'EMPLOYEE_UPDATED', description: 'Phase 44 workforce HR event: employee updated', realtime: true, notification: false }],
    ['JOB_POSTED', { type: 'JOB_POSTED', description: 'Phase 44 workforce HR event: job posted', realtime: true, notification: false }],
    ['CANDIDATE_APPLIED', { type: 'CANDIDATE_APPLIED', description: 'Phase 44 workforce HR event: candidate applied', realtime: true, notification: false }],
    ['INTERVIEW_COMPLETED', { type: 'INTERVIEW_COMPLETED', description: 'Phase 44 workforce HR event: interview completed', realtime: true, notification: true }],
    ['EMPLOYEE_ONBOARDED', { type: 'EMPLOYEE_ONBOARDED', description: 'Phase 44 workforce HR event: employee onboarded', realtime: true, notification: false }],
    ['PERFORMANCE_REVIEW_COMPLETED', { type: 'PERFORMANCE_REVIEW_COMPLETED', description: 'Phase 44 workforce HR event: performance review completed', realtime: true, notification: false }],
    ['COURSE_COMPLETED', { type: 'COURSE_COMPLETED', description: 'Phase 44 workforce HR event: course completed', realtime: true, notification: false }],
    ['PROMOTION_APPROVED', { type: 'PROMOTION_APPROVED', description: 'Phase 44 workforce HR event: promotion approved', realtime: true, notification: true }],
    ['RETENTION_RISK_DETECTED', { type: 'RETENTION_RISK_DETECTED', description: 'Phase 44 workforce HR event: retention risk detected', realtime: true, notification: true }],
    ['HR_COPILOT_QUERIED', { type: 'HR_COPILOT_QUERIED', description: 'Phase 44 workforce HR event: hr copilot queried', realtime: true, notification: false }],
    ['HR_RECOMMENDATION_CREATED', { type: 'HR_RECOMMENDATION_CREATED', description: 'Phase 44 workforce HR event: hr recommendation created', realtime: true, notification: false }],
    ['ASSET_CREATED', { type: 'ASSET_CREATED', description: 'Phase 45 EAM event: asset created', realtime: true, notification: false }],
    ['ASSET_UPDATED', { type: 'ASSET_UPDATED', description: 'Phase 45 EAM event: asset updated', realtime: true, notification: false }],
    ['ASSET_LIFECYCLE_UPDATED', { type: 'ASSET_LIFECYCLE_UPDATED', description: 'Phase 45 EAM event: asset lifecycle updated', realtime: true, notification: false }],
    ['ASSET_ASSIGNED', { type: 'ASSET_ASSIGNED', description: 'Phase 45 EAM event: asset assigned', realtime: true, notification: false }],
    ['ASSET_COST_RECORDED', { type: 'ASSET_COST_RECORDED', description: 'Phase 45 EAM event: asset cost recorded', realtime: true, notification: false }],
    ['ASSET_MAINTENANCE_SCHEDULED', { type: 'ASSET_MAINTENANCE_SCHEDULED', description: 'Phase 45 EAM event: asset maintenance scheduled', realtime: true, notification: false }],
    ['ASSET_MAINTENANCE_COMPLETED', { type: 'ASSET_MAINTENANCE_COMPLETED', description: 'Phase 45 EAM event: asset maintenance completed', realtime: true, notification: false }],
    ['ASSET_HEALTH_UPDATED', { type: 'ASSET_HEALTH_UPDATED', description: 'Phase 45 EAM event: asset health updated', realtime: true, notification: false }],
    ['ASSET_WORK_ORDER_CREATED', { type: 'ASSET_WORK_ORDER_CREATED', description: 'Phase 45 EAM event: asset work order created', realtime: true, notification: true }],
    ['ASSET_WORK_ORDER_UPDATED', { type: 'ASSET_WORK_ORDER_UPDATED', description: 'Phase 45 EAM event: asset work order updated', realtime: true, notification: true }],
    ['ASSET_WORK_ORDER_COMPLETED', { type: 'ASSET_WORK_ORDER_COMPLETED', description: 'Phase 45 EAM event: asset work order completed', realtime: true, notification: true }],
    ['ASSET_RISK_DETECTED', { type: 'ASSET_RISK_DETECTED', description: 'Phase 45 EAM event: asset risk detected', realtime: true, notification: true }],
    ['ASSET_WARRANTY_EXPIRING', { type: 'ASSET_WARRANTY_EXPIRING', description: 'Phase 45 EAM event: asset warranty expiring', realtime: true, notification: true }],
    ['ASSET_CONTRACT_RENEWAL_DUE', { type: 'ASSET_CONTRACT_RENEWAL_DUE', description: 'Phase 45 EAM event: asset contract renewal due', realtime: true, notification: false }],
    ['ASSET_RECOMMENDATION_CREATED', { type: 'ASSET_RECOMMENDATION_CREATED', description: 'Phase 45 EAM event: asset recommendation created', realtime: true, notification: false }],
    ['ASSET_IOT_SIGNAL_RECEIVED', { type: 'ASSET_IOT_SIGNAL_RECEIVED', description: 'Phase 45 EAM event: asset iot signal received', realtime: true, notification: false }],
    ['ASSET_ANALYTICS_GENERATED', { type: 'ASSET_ANALYTICS_GENERATED', description: 'Phase 45 EAM event: asset analytics generated', realtime: true, notification: false }],
    ['ASSET_COPILOT_QUERIED', { type: 'ASSET_COPILOT_QUERIED', description: 'Phase 45 EAM event: asset copilot queried', realtime: true, notification: false }],
    ['FIELD_SERVICE_REQUEST_CREATED', { type: 'FIELD_SERVICE_REQUEST_CREATED', description: 'Phase 46 field service event: field service request created', realtime: true, notification: false }],
    ['FIELD_SERVICE_CASE_UPDATED', { type: 'FIELD_SERVICE_CASE_UPDATED', description: 'Phase 46 field service event: field service case updated', realtime: true, notification: false }],
    ['SERVICE_APPOINTMENT_SCHEDULED', { type: 'SERVICE_APPOINTMENT_SCHEDULED', description: 'Phase 46 field service event: service appointment scheduled', realtime: true, notification: false }],
    ['FIELD_WORK_ORDER_CREATED', { type: 'FIELD_WORK_ORDER_CREATED', description: 'Phase 46 field service event: field work order created', realtime: true, notification: false }],
    ['FIELD_WORK_ORDER_UPDATED', { type: 'FIELD_WORK_ORDER_UPDATED', description: 'Phase 46 field service event: field work order updated', realtime: true, notification: false }],
    ['FIELD_WORK_ORDER_COMPLETED', { type: 'FIELD_WORK_ORDER_COMPLETED', description: 'Phase 46 field service event: field work order completed', realtime: true, notification: false }],
    ['DISPATCH_ASSIGNMENT_CREATED', { type: 'DISPATCH_ASSIGNMENT_CREATED', description: 'Phase 46 field service event: dispatch assignment created', realtime: true, notification: false }],
    ['DISPATCH_EXCEPTION_CREATED', { type: 'DISPATCH_EXCEPTION_CREATED', description: 'Phase 46 field service event: dispatch exception created', realtime: true, notification: true }],
    ['TECHNICIAN_UPDATED', { type: 'TECHNICIAN_UPDATED', description: 'Phase 46 field service event: technician updated', realtime: true, notification: false }],
    ['ROUTE_OPTIMIZED', { type: 'ROUTE_OPTIMIZED', description: 'Phase 46 field service event: route optimized', realtime: true, notification: false }],
    ['MOBILE_WORK_STARTED', { type: 'MOBILE_WORK_STARTED', description: 'Phase 46 field service event: mobile work started', realtime: true, notification: false }],
    ['MOBILE_SYNC_COMPLETED', { type: 'MOBILE_SYNC_COMPLETED', description: 'Phase 46 field service event: mobile sync completed', realtime: true, notification: false }],
    ['SLA_POLICY_CREATED', { type: 'SLA_POLICY_CREATED', description: 'Phase 46 field service event: sla policy created', realtime: true, notification: false }],
    ['SLA_BREACH_DETECTED', { type: 'SLA_BREACH_DETECTED', description: 'Phase 46 field service event: sla breach detected', realtime: true, notification: true }],
    ['FIELD_SERVICE_ESCALATED', { type: 'FIELD_SERVICE_ESCALATED', description: 'Phase 46 field service event: field service escalated', realtime: true, notification: true }],
    ['CUSTOMER_VISIT_COMPLETED', { type: 'CUSTOMER_VISIT_COMPLETED', description: 'Phase 46 field service event: customer visit completed', realtime: true, notification: false }],
    ['CUSTOMER_FEEDBACK_RECEIVED', { type: 'CUSTOMER_FEEDBACK_RECEIVED', description: 'Phase 46 field service event: customer feedback received', realtime: true, notification: false }],
    ['FIELD_ANALYTICS_GENERATED', { type: 'FIELD_ANALYTICS_GENERATED', description: 'Phase 46 field service event: field analytics generated', realtime: true, notification: false }],
    ['FIELD_SERVICE_COPILOT_QUERIED', { type: 'FIELD_SERVICE_COPILOT_QUERIED', description: 'Phase 46 field service event: field service copilot queried', realtime: true, notification: false }],
    ['FIELD_RECOMMENDATION_CREATED', { type: 'FIELD_RECOMMENDATION_CREATED', description: 'Phase 46 field service event: field recommendation created', realtime: true, notification: false }],
    ['FIELD_RISK_DETECTED', { type: 'FIELD_RISK_DETECTED', description: 'Phase 46 field service event: field risk detected', realtime: true, notification: true }],
    ['OKR_OBJECTIVE_CREATED', { type: 'OKR_OBJECTIVE_CREATED', description: 'Phase 47 planning event: okr objective created', realtime: true, notification: false }],
    ['OKR_KEY_RESULT_UPDATED', { type: 'OKR_KEY_RESULT_UPDATED', description: 'Phase 47 planning event: okr key result updated', realtime: true, notification: false }],
    ['OKR_CHECK_IN_CREATED', { type: 'OKR_CHECK_IN_CREATED', description: 'Phase 47 planning event: okr check in created', realtime: true, notification: false }],
    ['STRATEGIC_PLAN_CREATED', { type: 'STRATEGIC_PLAN_CREATED', description: 'Phase 47 planning event: strategic plan created', realtime: true, notification: false }],
    ['STRATEGY_MILESTONE_UPDATED', { type: 'STRATEGY_MILESTONE_UPDATED', description: 'Phase 47 planning event: strategy milestone updated', realtime: true, notification: false }],
    ['PORTFOLIO_CREATED', { type: 'PORTFOLIO_CREATED', description: 'Phase 47 planning event: portfolio created', realtime: true, notification: false }],
    ['PORTFOLIO_PROJECT_UPDATED', { type: 'PORTFOLIO_PROJECT_UPDATED', description: 'Phase 47 planning event: portfolio project updated', realtime: true, notification: false }],
    ['PORTFOLIO_RISK_DETECTED', { type: 'PORTFOLIO_RISK_DETECTED', description: 'Phase 47 planning event: portfolio risk detected', realtime: true, notification: true }],
    ['RESOURCE_PLAN_CREATED', { type: 'RESOURCE_PLAN_CREATED', description: 'Phase 47 planning event: resource plan created', realtime: true, notification: false }],
    ['RESOURCE_ALLOCATION_UPDATED', { type: 'RESOURCE_ALLOCATION_UPDATED', description: 'Phase 47 planning event: resource allocation updated', realtime: true, notification: false }],
    ['CAPACITY_PLAN_CREATED', { type: 'CAPACITY_PLAN_CREATED', description: 'Phase 47 planning event: capacity plan created', realtime: true, notification: false }],
    ['BUDGET_PLAN_CREATED', { type: 'BUDGET_PLAN_CREATED', description: 'Phase 47 planning event: budget plan created', realtime: true, notification: false }],
    ['BUDGET_VARIANCE_DETECTED', { type: 'BUDGET_VARIANCE_DETECTED', description: 'Phase 47 planning event: budget variance detected', realtime: true, notification: true }],
    ['SCENARIO_MODEL_CREATED', { type: 'SCENARIO_MODEL_CREATED', description: 'Phase 47 planning event: scenario model created', realtime: true, notification: false }],
    ['SCENARIO_SIMULATED', { type: 'SCENARIO_SIMULATED', description: 'Phase 47 planning event: scenario simulated', realtime: true, notification: false }],
    ['EXECUTIVE_PLANNING_DASHBOARD_CREATED', { type: 'EXECUTIVE_PLANNING_DASHBOARD_CREATED', description: 'Phase 47 planning event: executive planning dashboard created', realtime: true, notification: false }],
    ['PORTFOLIO_ANALYTICS_GENERATED', { type: 'PORTFOLIO_ANALYTICS_GENERATED', description: 'Phase 47 planning event: portfolio analytics generated', realtime: true, notification: false }],
    ['STRATEGY_COPILOT_QUERIED', { type: 'STRATEGY_COPILOT_QUERIED', description: 'Phase 47 planning event: strategy copilot queried', realtime: true, notification: false }],
    ['STRATEGY_RECOMMENDATION_CREATED', { type: 'STRATEGY_RECOMMENDATION_CREATED', description: 'Phase 47 planning event: strategy recommendation created', realtime: true, notification: false }],
    ['STRATEGIC_RISK_DETECTED', { type: 'STRATEGIC_RISK_DETECTED', description: 'Phase 47 planning event: strategic risk detected', realtime: true, notification: true }],
    ['PLANNING_AUDIT_RECORDED', { type: 'PLANNING_AUDIT_RECORDED', description: 'Phase 47 planning event: planning audit recorded', realtime: true, notification: false }],
    ['MDM_CUSTOMER_MASTER_CREATED', { type: 'MDM_CUSTOMER_MASTER_CREATED', description: 'Phase 48 MDM event: mdm customer master created', realtime: true, notification: false }],
    ['MDM_VENDOR_MASTER_CREATED', { type: 'MDM_VENDOR_MASTER_CREATED', description: 'Phase 48 MDM event: mdm vendor master created', realtime: true, notification: false }],
    ['MDM_PRODUCT_MASTER_CREATED', { type: 'MDM_PRODUCT_MASTER_CREATED', description: 'Phase 48 MDM event: mdm product master created', realtime: true, notification: false }],
    ['MDM_EMPLOYEE_MASTER_CREATED', { type: 'MDM_EMPLOYEE_MASTER_CREATED', description: 'Phase 48 MDM event: mdm employee master created', realtime: true, notification: false }],
    ['MDM_ASSET_MASTER_CREATED', { type: 'MDM_ASSET_MASTER_CREATED', description: 'Phase 48 MDM event: mdm asset master created', realtime: true, notification: false }],
    ['MDM_DATA_QUALITY_RULE_CREATED', { type: 'MDM_DATA_QUALITY_RULE_CREATED', description: 'Phase 48 MDM event: mdm data quality rule created', realtime: true, notification: false }],
    ['MDM_DATA_QUALITY_RUN_COMPLETED', { type: 'MDM_DATA_QUALITY_RUN_COMPLETED', description: 'Phase 48 MDM event: mdm data quality run completed', realtime: true, notification: false }],
    ['MDM_DATA_QUALITY_ISSUE_DETECTED', { type: 'MDM_DATA_QUALITY_ISSUE_DETECTED', description: 'Phase 48 MDM event: mdm data quality issue detected', realtime: true, notification: true }],
    ['MDM_DUPLICATE_CANDIDATE_DETECTED', { type: 'MDM_DUPLICATE_CANDIDATE_DETECTED', description: 'Phase 48 MDM event: mdm duplicate candidate detected', realtime: true, notification: true }],
    ['MDM_DUPLICATE_CLUSTER_CREATED', { type: 'MDM_DUPLICATE_CLUSTER_CREATED', description: 'Phase 48 MDM event: mdm duplicate cluster created', realtime: true, notification: true }],
    ['MDM_DUPLICATE_REVIEW_COMPLETED', { type: 'MDM_DUPLICATE_REVIEW_COMPLETED', description: 'Phase 48 MDM event: mdm duplicate review completed', realtime: true, notification: true }],
    ['MDM_ENTITY_RESOLUTION_STARTED', { type: 'MDM_ENTITY_RESOLUTION_STARTED', description: 'Phase 48 MDM event: mdm entity resolution started', realtime: true, notification: false }],
    ['MDM_ENTITY_MATCH_CREATED', { type: 'MDM_ENTITY_MATCH_CREATED', description: 'Phase 48 MDM event: mdm entity match created', realtime: true, notification: false }],
    ['MDM_ENTITY_RESOLUTION_COMPLETED', { type: 'MDM_ENTITY_RESOLUTION_COMPLETED', description: 'Phase 48 MDM event: mdm entity resolution completed', realtime: true, notification: false }],
    ['MDM_GOLDEN_RECORD_CREATED', { type: 'MDM_GOLDEN_RECORD_CREATED', description: 'Phase 48 MDM event: mdm golden record created', realtime: true, notification: false }],
    ['MDM_GOLDEN_RECORD_UPDATED', { type: 'MDM_GOLDEN_RECORD_UPDATED', description: 'Phase 48 MDM event: mdm golden record updated', realtime: true, notification: false }],
    ['MDM_MERGE_REQUEST_CREATED', { type: 'MDM_MERGE_REQUEST_CREATED', description: 'Phase 48 MDM event: mdm merge request created', realtime: true, notification: false }],
    ['MDM_GOVERNANCE_POLICY_CREATED', { type: 'MDM_GOVERNANCE_POLICY_CREATED', description: 'Phase 48 MDM event: mdm governance policy created', realtime: true, notification: false }],
    ['MDM_STEWARDSHIP_ASSIGNED', { type: 'MDM_STEWARDSHIP_ASSIGNED', description: 'Phase 48 MDM event: mdm stewardship assigned', realtime: true, notification: false }],
    ['MDM_LINEAGE_RECORDED', { type: 'MDM_LINEAGE_RECORDED', description: 'Phase 48 MDM event: mdm lineage recorded', realtime: true, notification: false }],
    ['MDM_SOURCE_SYSTEM_CONNECTED', { type: 'MDM_SOURCE_SYSTEM_CONNECTED', description: 'Phase 48 MDM event: mdm source system connected', realtime: true, notification: false }],
    ['MDM_DATA_CONTRACT_LINKED', { type: 'MDM_DATA_CONTRACT_LINKED', description: 'Phase 48 MDM event: mdm data contract linked', realtime: true, notification: false }],
    ['MDM_COPILOT_QUERIED', { type: 'MDM_COPILOT_QUERIED', description: 'Phase 48 MDM event: mdm copilot queried', realtime: true, notification: false }],
    ['MDM_RECOMMENDATION_CREATED', { type: 'MDM_RECOMMENDATION_CREATED', description: 'Phase 48 MDM event: mdm recommendation created', realtime: true, notification: false }],
    ['MDM_RISK_DETECTED', { type: 'MDM_RISK_DETECTED', description: 'Phase 48 MDM event: mdm risk detected', realtime: true, notification: true }],
    ['MDM_AUDIT_RECORDED', { type: 'MDM_AUDIT_RECORDED', description: 'Phase 48 MDM event: mdm audit recorded', realtime: true, notification: false }],
    ['GLOBAL_INTEGRATION_REGISTERED', { type: 'GLOBAL_INTEGRATION_REGISTERED', description: 'Phase 49 connectivity event: global integration registered', realtime: true, notification: false }],
    ['INTEGRATION_CONNECTION_CREATED', { type: 'INTEGRATION_CONNECTION_CREATED', description: 'Phase 49 connectivity event: integration connection created', realtime: true, notification: false }],
    ['INTEGRATION_CONNECTION_VALIDATED', { type: 'INTEGRATION_CONNECTION_VALIDATED', description: 'Phase 49 connectivity event: integration connection validated', realtime: true, notification: false }],
    ['OAUTH_TOKEN_ROTATED', { type: 'OAUTH_TOKEN_ROTATED', description: 'Phase 49 connectivity event: oauth token rotated', realtime: true, notification: false }],
    ['OPENID_CONNECT_SESSION_LINKED', { type: 'OPENID_CONNECT_SESSION_LINKED', description: 'Phase 49 connectivity event: openid connect session linked', realtime: true, notification: false }],
    ['SALESFORCE_SYNC_STARTED', { type: 'SALESFORCE_SYNC_STARTED', description: 'Phase 49 connectivity event: salesforce sync started', realtime: true, notification: false }],
    ['SALESFORCE_SYNC_COMPLETED', { type: 'SALESFORCE_SYNC_COMPLETED', description: 'Phase 49 connectivity event: salesforce sync completed', realtime: true, notification: false }],
    ['SAP_SYNC_STARTED', { type: 'SAP_SYNC_STARTED', description: 'Phase 49 connectivity event: sap sync started', realtime: true, notification: false }],
    ['SAP_SYNC_COMPLETED', { type: 'SAP_SYNC_COMPLETED', description: 'Phase 49 connectivity event: sap sync completed', realtime: true, notification: false }],
    ['ORACLE_SYNC_STARTED', { type: 'ORACLE_SYNC_STARTED', description: 'Phase 49 connectivity event: oracle sync started', realtime: true, notification: false }],
    ['ORACLE_SYNC_COMPLETED', { type: 'ORACLE_SYNC_COMPLETED', description: 'Phase 49 connectivity event: oracle sync completed', realtime: true, notification: false }],
    ['MICROSOFT_GRAPH_SUBSCRIBED', { type: 'MICROSOFT_GRAPH_SUBSCRIBED', description: 'Phase 49 connectivity event: microsoft graph subscribed', realtime: true, notification: false }],
    ['GOOGLE_WORKSPACE_SYNC_STARTED', { type: 'GOOGLE_WORKSPACE_SYNC_STARTED', description: 'Phase 49 connectivity event: google workspace sync started', realtime: true, notification: false }],
    ['COMMUNICATION_ROUTE_CREATED', { type: 'COMMUNICATION_ROUTE_CREATED', description: 'Phase 49 connectivity event: communication route created', realtime: true, notification: false }],
    ['PAYMENT_PROVIDER_CONNECTED', { type: 'PAYMENT_PROVIDER_CONNECTED', description: 'Phase 49 connectivity event: payment provider connected', realtime: true, notification: false }],
    ['PAYMENT_RECONCILIATION_COMPLETED', { type: 'PAYMENT_RECONCILIATION_COMPLETED', description: 'Phase 49 connectivity event: payment reconciliation completed', realtime: true, notification: false }],
    ['CLOUD_INTEGRATION_CONNECTED', { type: 'CLOUD_INTEGRATION_CONNECTED', description: 'Phase 49 connectivity event: cloud integration connected', realtime: true, notification: false }],
    ['API_GATEWAY_ROUTE_CREATED', { type: 'API_GATEWAY_ROUTE_CREATED', description: 'Phase 49 connectivity event: api gateway route created', realtime: true, notification: false }],
    ['API_GATEWAY_POLICY_UPDATED', { type: 'API_GATEWAY_POLICY_UPDATED', description: 'Phase 49 connectivity event: api gateway policy updated', realtime: true, notification: false }],
    ['WEBHOOK_ENDPOINT_CREATED', { type: 'WEBHOOK_ENDPOINT_CREATED', description: 'Phase 49 connectivity event: webhook endpoint created', realtime: true, notification: false }],
    ['WEBHOOK_DELIVERY_SUCCEEDED', { type: 'WEBHOOK_DELIVERY_SUCCEEDED', description: 'Phase 49 connectivity event: webhook delivery succeeded', realtime: true, notification: false }],
    ['WEBHOOK_DELIVERY_FAILED', { type: 'WEBHOOK_DELIVERY_FAILED', description: 'Phase 49 connectivity event: webhook delivery failed', realtime: true, notification: true }],
    ['CONNECTOR_SDK_PUBLISHED', { type: 'CONNECTOR_SDK_PUBLISHED', description: 'Phase 49 connectivity event: connector sdk published', realtime: true, notification: false }],
    ['CONNECTOR_EXTENSION_REGISTERED', { type: 'CONNECTOR_EXTENSION_REGISTERED', description: 'Phase 49 connectivity event: connector extension registered', realtime: true, notification: false }],
    ['INTEGRATION_HEALTH_CHECK_RECORDED', { type: 'INTEGRATION_HEALTH_CHECK_RECORDED', description: 'Phase 49 connectivity event: integration health check recorded', realtime: true, notification: false }],
    ['INTEGRATION_SYNC_COMPLETED', { type: 'INTEGRATION_SYNC_COMPLETED', description: 'Phase 49 connectivity event: integration sync completed', realtime: true, notification: false }],
    ['INTEGRATION_ALERT_CREATED', { type: 'INTEGRATION_ALERT_CREATED', description: 'Phase 49 connectivity event: integration alert created', realtime: true, notification: true }],
    ['INTEGRATION_USAGE_RECORDED', { type: 'INTEGRATION_USAGE_RECORDED', description: 'Phase 49 connectivity event: integration usage recorded', realtime: true, notification: false }],
    ['INTEGRATION_COPILOT_QUERIED', { type: 'INTEGRATION_COPILOT_QUERIED', description: 'Phase 49 connectivity event: integration copilot queried', realtime: true, notification: false }],
    ['INTEGRATION_RECOMMENDATION_CREATED', { type: 'INTEGRATION_RECOMMENDATION_CREATED', description: 'Phase 49 connectivity event: integration recommendation created', realtime: true, notification: false }],
    ['INTEGRATION_RISK_DETECTED', { type: 'INTEGRATION_RISK_DETECTED', description: 'Phase 49 connectivity event: integration risk detected', realtime: true, notification: true }],
    ['INTEGRATION_AUDIT_RECORDED', { type: 'INTEGRATION_AUDIT_RECORDED', description: 'Phase 49 connectivity event: integration audit recorded', realtime: true, notification: false }],
    ['SECURITY_HARDENING_CONTROL_CREATED', { type: 'SECURITY_HARDENING_CONTROL_CREATED', description: 'Phase 50 release candidate event: security hardening control created', realtime: true, notification: false }],
    ['SECURITY_AUDIT_COMPLETED', { type: 'SECURITY_AUDIT_COMPLETED', description: 'Phase 50 release candidate event: security audit completed', realtime: true, notification: false }],
    ['DEPENDENCY_REMEDIATION_RECORDED', { type: 'DEPENDENCY_REMEDIATION_RECORDED', description: 'Phase 50 release candidate event: dependency remediation recorded', realtime: true, notification: false }],
    ['LOAD_TEST_STARTED', { type: 'LOAD_TEST_STARTED', description: 'Phase 50 release candidate event: load test started', realtime: true, notification: false }],
    ['LOAD_TEST_COMPLETED', { type: 'LOAD_TEST_COMPLETED', description: 'Phase 50 release candidate event: load test completed', realtime: true, notification: false }],
    ['STRESS_TEST_COMPLETED', { type: 'STRESS_TEST_COMPLETED', description: 'Phase 50 release candidate event: stress test completed', realtime: true, notification: false }],
    ['PERFORMANCE_BENCHMARK_RECORDED', { type: 'PERFORMANCE_BENCHMARK_RECORDED', description: 'Phase 50 release candidate event: performance benchmark recorded', realtime: true, notification: false }],
    ['PERFORMANCE_OPTIMIZATION_APPLIED', { type: 'PERFORMANCE_OPTIMIZATION_APPLIED', description: 'Phase 50 release candidate event: performance optimization applied', realtime: true, notification: false }],
    ['PERFORMANCE_REGRESSION_DETECTED', { type: 'PERFORMANCE_REGRESSION_DETECTED', description: 'Phase 50 release candidate event: performance regression detected', realtime: true, notification: true }],
    ['OBSERVABILITY_SIGNAL_RECORDED', { type: 'OBSERVABILITY_SIGNAL_RECORDED', description: 'Phase 50 release candidate event: observability signal recorded', realtime: true, notification: false }],
    ['MONITORING_ALERT_RULE_CREATED', { type: 'MONITORING_ALERT_RULE_CREATED', description: 'Phase 50 release candidate event: monitoring alert rule created', realtime: true, notification: false }],
    ['BACKUP_POLICY_CREATED', { type: 'BACKUP_POLICY_CREATED', description: 'Phase 50 release candidate event: backup policy created', realtime: true, notification: false }],
    ['BACKUP_VALIDATION_COMPLETED', { type: 'BACKUP_VALIDATION_COMPLETED', description: 'Phase 50 release candidate event: backup validation completed', realtime: true, notification: false }],
    ['RECOVERY_POINT_VALIDATED', { type: 'RECOVERY_POINT_VALIDATED', description: 'Phase 50 release candidate event: recovery point validated', realtime: true, notification: false }],
    ['DISASTER_RECOVERY_PLAN_CREATED', { type: 'DISASTER_RECOVERY_PLAN_CREATED', description: 'Phase 50 release candidate event: disaster recovery plan created', realtime: true, notification: false }],
    ['DISASTER_RECOVERY_EXERCISED', { type: 'DISASTER_RECOVERY_EXERCISED', description: 'Phase 50 release candidate event: disaster recovery exercised', realtime: true, notification: false }],
    ['FAILOVER_VALIDATED', { type: 'FAILOVER_VALIDATED', description: 'Phase 50 release candidate event: failover validated', realtime: true, notification: true }],
    ['DEPLOYMENT_READINESS_CHECKED', { type: 'DEPLOYMENT_READINESS_CHECKED', description: 'Phase 50 release candidate event: deployment readiness checked', realtime: true, notification: false }],
    ['ENVIRONMENT_READINESS_VALIDATED', { type: 'ENVIRONMENT_READINESS_VALIDATED', description: 'Phase 50 release candidate event: environment readiness validated', realtime: true, notification: false }],
    ['STARTUP_VALIDATION_COMPLETED', { type: 'STARTUP_VALIDATION_COMPLETED', description: 'Phase 50 release candidate event: startup validation completed', realtime: true, notification: false }],
    ['API_GOVERNANCE_REVIEW_COMPLETED', { type: 'API_GOVERNANCE_REVIEW_COMPLETED', description: 'Phase 50 release candidate event: api governance review completed', realtime: true, notification: false }],
    ['API_POLICY_ASSESSED', { type: 'API_POLICY_ASSESSED', description: 'Phase 50 release candidate event: api policy assessed', realtime: true, notification: false }],
    ['API_VERSION_COMPLIANCE_RECORDED', { type: 'API_VERSION_COMPLIANCE_RECORDED', description: 'Phase 50 release candidate event: api version compliance recorded', realtime: true, notification: false }],
    ['TEST_COVERAGE_SNAPSHOT_CREATED', { type: 'TEST_COVERAGE_SNAPSHOT_CREATED', description: 'Phase 50 release candidate event: test coverage snapshot created', realtime: true, notification: false }],
    ['UNIT_COVERAGE_REVIEW_COMPLETED', { type: 'UNIT_COVERAGE_REVIEW_COMPLETED', description: 'Phase 50 release candidate event: unit coverage review completed', realtime: true, notification: false }],
    ['INTEGRATION_COVERAGE_REVIEW_COMPLETED', { type: 'INTEGRATION_COVERAGE_REVIEW_COMPLETED', description: 'Phase 50 release candidate event: integration coverage review completed', realtime: true, notification: false }],
    ['RELEASE_CANDIDATE_CHECKLIST_CREATED', { type: 'RELEASE_CANDIDATE_CHECKLIST_CREATED', description: 'Phase 50 release candidate event: release candidate checklist created', realtime: true, notification: false }],
    ['RELEASE_VALIDATION_COMPLETED', { type: 'RELEASE_VALIDATION_COMPLETED', description: 'Phase 50 release candidate event: release validation completed', realtime: true, notification: false }],
    ['RELEASE_APPROVAL_RECORDED', { type: 'RELEASE_APPROVAL_RECORDED', description: 'Phase 50 release candidate event: release approval recorded', realtime: true, notification: false }],
    ['DOCUMENTATION_REVIEW_COMPLETED', { type: 'DOCUMENTATION_REVIEW_COMPLETED', description: 'Phase 50 release candidate event: documentation review completed', realtime: true, notification: false }],
    ['DOCUMENTATION_GAP_RECORDED', { type: 'DOCUMENTATION_GAP_RECORDED', description: 'Phase 50 release candidate event: documentation gap recorded', realtime: true, notification: false }],
    ['PRODUCTION_READINESS_SCORED', { type: 'PRODUCTION_READINESS_SCORED', description: 'Phase 50 release candidate event: production readiness scored', realtime: true, notification: false }],
    ['PRODUCTION_RISK_REGISTERED', { type: 'PRODUCTION_RISK_REGISTERED', description: 'Phase 50 release candidate event: production risk registered', realtime: true, notification: true }],
    ['HARDENING_AUDIT_RECORDED', { type: 'HARDENING_AUDIT_RECORDED', description: 'Phase 50 release candidate event: hardening audit recorded', realtime: true, notification: false }],
  ]);

  list() { return [...this.events.values()]; }
  get(type: DomainEventType) { return this.events.get(type); }
  has(type: DomainEventType) { return this.events.has(type); }
}






