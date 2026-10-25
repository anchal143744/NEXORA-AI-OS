import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { QueueModule } from './infrastructure/queues/queue.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AdaptiveWorkspaceModule } from './modules/adaptive-workspace/adaptive-workspace.module';
import { AgentModule } from './modules/agents/agent.module';
import { AiGovernanceModule } from './modules/ai-governance/ai-governance.module';
import { AiModule } from './modules/ai/ai.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { ContactCenterModule } from './modules/contact-center/contact-center.module';
import { CrmModule } from './modules/crm/crm.module';
import { CustomerExperienceModule } from './modules/customer-experience/customer-experience.module';
import { CustomerPortalModule } from './modules/customer-portal/customer-portal.module';
import { DataPlatformModule } from './modules/data-platform/data-platform.module';
import { DataResidencyModule } from './modules/data-residency/data-residency.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EamModule } from './modules/eam/eam.module';
import { EcosystemModule } from './modules/ecosystem/ecosystem.module';
import { EmailModule } from './modules/email/email.module';
import { EnterpriseAdminModule } from './modules/enterprise-admin/enterprise-admin.module';
import { EventsModule } from './modules/events/events.module';
import { FieldServiceModule } from './modules/field-service/field-service.module';
import { FinanceModule } from './modules/finance/finance.module';
import { FinOpsModule } from './modules/finops/finops.module';
import { GlobalConnectivityModule } from './modules/global-connectivity/global-connectivity.module';
import { GlobalFinanceModule } from './modules/global-finance/global-finance.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { HrModule } from './modules/hr/hr.module';
import { IamModule } from './modules/iam/iam.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { KnowledgeGraphModule } from './modules/knowledge-graph/knowledge-graph.module';
import { LocalizationModule } from './modules/localization/localization.module';
import { ManufacturingModule } from './modules/manufacturing/manufacturing.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { MdmModule } from './modules/mdm/mdm.module';
import { ModuleRegistryModule } from './modules/module-registry/module-registry.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { OmnichannelModule } from './modules/omnichannel/omnichannel.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { OperationsModule } from './modules/operations/operations.module';
import { PlanningModule } from './modules/planning/planning.module';
import { PlatformGovernanceModule } from './modules/platform-governance/platform-governance.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProductIntelligenceModule } from './modules/product-intelligence/product-intelligence.module';
import { ProductionReadinessModule } from './modules/production-readiness/production-readiness.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { ReliabilityOperationsModule } from './modules/reliability-operations/reliability-operations.module';
import { RevenueOperationsModule } from './modules/revenue-operations/revenue-operations.module';
import { SearchModule } from './modules/search/search.module';
import { SecurityIntelligenceModule } from './modules/security-intelligence/security-intelligence.module';
import { TenantValidationMiddleware } from './modules/security/middleware/tenant-validation.middleware';
import { WorkspaceValidationMiddleware } from './modules/security/middleware/workspace-validation.middleware';
import { SecurityModule } from './modules/security/security.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { StrategicForecastingModule } from './modules/strategic-forecasting/strategic-forecasting.module';
import { SupplyChainModule } from './modules/supply-chain/supply-chain.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { WorkflowModule } from './modules/workflows/workflow.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { WorkforceModule } from './modules/workforce/workforce.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    DatabaseModule,
    RedisModule,
    QueueModule,
    AuthModule,
    SecurityModule,
    SessionsModule,
    TenantsModule,
    WorkspacesModule,
    UsersModule,
    RbacModule,
    EnterpriseAdminModule,
    ActivityModule,
    AdaptiveWorkspaceModule,
    AgentModule,
    AiModule,
    AiGovernanceModule,
    AuditModule,
    CollaborationModule,
    CommunicationsModule,
    ContactCenterModule,
    CrmModule,
    CustomerExperienceModule,
    CustomerPortalModule,
    DataPlatformModule,
    DataResidencyModule,
    DocumentsModule,
    EamModule,
    EcosystemModule,
    EmailModule,
    EventsModule,
    FieldServiceModule,
    FinanceModule,
    FinOpsModule,
    GlobalConnectivityModule,
    GlobalFinanceModule,
    GovernanceModule,
    HrModule,
    IamModule,
    IntegrationsModule,
    IntelligenceModule,
    KnowledgeGraphModule,
    LocalizationModule,
    ManufacturingModule,
    MarketplaceModule,
    MdmModule,
    ModuleRegistryModule,
    NotificationModule,
    OmnichannelModule,
    OnboardingModule,
    OperationsModule,
    PlanningModule,
    PlatformGovernanceModule,
    ProcurementModule,
    ProductIntelligenceModule,
    ProductionReadinessModule,
    ProjectsModule,
    RealtimeModule,
    ReliabilityOperationsModule,
    RevenueOperationsModule,
    SearchModule,
    SecurityIntelligenceModule,
    StrategicForecastingModule,
    SupplyChainModule,
    WorkflowModule,
    WorkforceModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware, TenantValidationMiddleware, WorkspaceValidationMiddleware)
      .forRoutes('*path');
  }
}
