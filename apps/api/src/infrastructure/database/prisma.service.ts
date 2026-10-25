import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RequestContextStore } from '../../common/context/request-context.store';
import { Prisma, PrismaClient as TypedPrismaClient } from '@prisma/client';
import { telemetryRegistry } from '../../common/observability/telemetry-registry';
import { tracingBackend } from '../../common/observability/tracing-backend';

const { PrismaClient } = require('@prisma/client') as { PrismaClient: new () => any };

function createInstrumentedPrismaClient() {
  const baseClient = new PrismaClient();
  if (typeof baseClient.$extends !== 'function') return baseClient;
  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: any) {
          const modelName = model ?? 'raw';
          const operationName = operation ?? 'unknown';
          const span = tracingBackend.startSpan(`prisma.${modelName}.${operationName}`, { kind: 'client', attributes: { 'db.system': 'postgresql', 'db.operation': operationName, 'db.prisma.model': modelName } });
          const started = process.hrtime.bigint();
          try {
            const result = await query(args);
            const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
            telemetryRegistry.incrementCounter('nexora_database_queries_total', 1, { model: modelName, operation: operationName, status: 'ok' });
            telemetryRegistry.observeHistogram('nexora_database_query_duration_ms', durationMs, { model: modelName, operation: operationName, status: 'ok' });
            tracingBackend.finishSpan(span, 'OK', { durationMs });
            return result;
          } catch (error) {
            const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
            telemetryRegistry.incrementCounter('nexora_database_queries_total', 1, { model: modelName, operation: operationName, status: 'error' });
            telemetryRegistry.incrementCounter('nexora_database_query_errors_total', 1, { model: modelName, operation: operationName });
            telemetryRegistry.observeHistogram('nexora_database_query_duration_ms', durationMs, { model: modelName, operation: operationName, status: 'error' });
            tracingBackend.finishSpan(span, 'ERROR', { durationMs, 'error.message': error instanceof Error ? error.message : 'unknown' });
            throw error;
          }
        },
      },
    },
  });
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {

  get database(): TypedPrismaClient { return this.client as TypedPrismaClient; }
  async transaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.client.$transaction(work, { isolationLevel: 'Serializable', maxWait: 10000, timeout: 20000 });
      } catch (error) {
        if (attempt >= 4 || !(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2034') throw error;
      }
    }
  }
  private readonly client = createInstrumentedPrismaClient();

  private readonly logger = new Logger(PrismaService.name);

  readonly tenant = this.client.tenant;
  readonly organization = this.client.organization;
  readonly business = this.client.business;
  readonly workspace = this.client.workspace;
  readonly user = this.client.user;
  readonly authAccount = this.client.authAccount;
  readonly credential = this.client.credential;
  readonly session = this.client.session;
  readonly membership = this.client.membership;
  readonly workspaceMember = this.client.workspaceMember;
  readonly role = this.client.role;
  readonly permission = this.client.permission;
  readonly rolePermission = this.client.rolePermission;
  readonly roleAssignment = this.client.roleAssignment;
  readonly auditLog = this.client.auditLog;
  readonly activityLog = this.client.activityLog;
  readonly event = this.client.event;
  readonly notification = this.client.notification;
  readonly moduleActivation = this.client.moduleActivation;
  readonly crmPipeline = this.client.crmPipeline;
  readonly crmLeadRecord = this.client.crmLeadRecord;
  readonly crmCustomerRecord = this.client.crmCustomerRecord;
  readonly crmOpportunity = this.client.crmOpportunity;
  readonly currency = this.client.currency;
  readonly exchangeRate = this.client.exchangeRate;
  readonly taxRegion = this.client.taxRegion;
  readonly taxCategory = this.client.taxCategory;
  readonly taxRule = this.client.taxRule;
  readonly invoiceTemplate = this.client.invoiceTemplate;
  readonly invoiceSeries = this.client.invoiceSeries;
  readonly invoiceItem = this.client.invoiceItem;
  readonly invoiceTax = this.client.invoiceTax;
  readonly invoicePayment = this.client.invoicePayment;
  readonly invoiceAudit = this.client.invoiceAudit;
  readonly financialLocalizationProfile = this.client.financialLocalizationProfile;
  readonly financeExpense = this.client.financeExpense;
  readonly financeRevenue = this.client.financeRevenue;
  readonly cashflowSnapshot = this.client.cashflowSnapshot;
  readonly department = this.client.department;
  readonly attendanceRecord = this.client.attendanceRecord;
  readonly documentFolder = this.client.documentFolder;
  readonly uploadRecord = this.client.uploadRecord;
  readonly invoice = this.client.invoice;
  readonly employeeProfile = this.client.employeeProfile;
  readonly project = this.client.project;
  readonly task = this.client.task;
  readonly inventoryItem = this.client.inventoryItem;
  readonly inventoryMovement = this.client.inventoryMovement;
  readonly document = this.client.document;
  readonly workflow = this.client.workflow;
  readonly workflowExecution = this.client.workflowExecution;
  readonly workflowStepExecution = this.client.workflowStepExecution;
  readonly aiConversation = this.client.aiConversation;
  readonly aiMessage = this.client.aiMessage;
  readonly aiToolCall = this.client.aiToolCall;
  readonly aiRecommendation = this.client.aiRecommendation;
  readonly aiInsight = this.client.aiInsight;
  readonly aiCopilot = this.client.aiCopilot;
  readonly aiMemory = this.client.aiMemory;
  readonly aiContext = this.client.aiContext;
  readonly aiTaskSuggestion = this.client.aiTaskSuggestion;
  readonly aiWorkflowSuggestion = this.client.aiWorkflowSuggestion;
  readonly aiRiskAssessment = this.client.aiRiskAssessment;
  readonly aiOpportunity = this.client.aiOpportunity;
  readonly aiKnowledgeReference = this.client.aiKnowledgeReference;
  readonly aiPromptLog = this.client.aiPromptLog;
  readonly aiActionLog = this.client.aiActionLog;
  readonly analyticsDataset = this.client.analyticsDataset;
  readonly kpiMetric = this.client.kpiMetric;
  readonly metricValue = this.client.metricValue;
  readonly dashboard = this.client.dashboard;
  readonly dashboardWidget = this.client.dashboardWidget;
  readonly aiAgent = this.client.aiAgent;
  readonly aiAgentRole = this.client.aiAgentRole;
  readonly aiAgentCapability = this.client.aiAgentCapability;
  readonly aiAgentExecution = this.client.aiAgentExecution;
  readonly aiAgentApproval = this.client.aiAgentApproval;
  readonly aiAgentTask = this.client.aiAgentTask;
  readonly aiAgentWorkflow = this.client.aiAgentWorkflow;
  readonly aiAgentMemory = this.client.aiAgentMemory;
  readonly aiAgentDecision = this.client.aiAgentDecision;
  readonly aiAgentOutcome = this.client.aiAgentOutcome;
  readonly aiAgentAudit = this.client.aiAgentAudit;
  readonly agentMemory = this.client.agentMemory;
  readonly kpiSnapshot = this.client.kpiSnapshot;
  readonly reportRun = this.client.reportRun;
  readonly predictiveAlert = this.client.predictiveAlert;
  readonly integrationProvider = this.client.integrationProvider;
  readonly integration = this.client.integration;
  readonly apiKey = this.client.apiKey;
  readonly eventBusTopic = this.client.eventBusTopic;
  readonly eventBusSubscription = this.client.eventBusSubscription;
  readonly integrationSecret = this.client.integrationSecret;
  readonly webhookEndpoint = this.client.webhookEndpoint;
  readonly webhookDelivery = this.client.webhookDelivery;
  readonly syncRun = this.client.syncRun;
  readonly complianceFramework = this.client.complianceFramework;
  readonly complianceControl = this.client.complianceControl;
  readonly operationalMetric = this.client.operationalMetric;
  readonly dataRetentionPolicy = this.client.dataRetentionPolicy;
  readonly backupRun = this.client.backupRun;
  readonly recoveryRun = this.client.recoveryRun;
  readonly workspaceBlueprint = this.client.workspaceBlueprint;
  readonly industryTemplate = this.client.industryTemplate;
  readonly moduleTemplate = this.client.moduleTemplate;
  readonly dashboardTemplate = this.client.dashboardTemplate;
  readonly navigationTemplate = this.client.navigationTemplate;
  readonly kpiTemplate = this.client.kpiTemplate;
  readonly workflowTemplate = this.client.workflowTemplate;
  readonly workflowDefinition = this.client.workflowDefinition;
  readonly workflowNode = this.client.workflowNode;
  readonly workflowEdge = this.client.workflowEdge;
  readonly workflowApproval = this.client.workflowApproval;
  readonly workflowMetric = this.client.workflowMetric;
  readonly workflowAudit = this.client.workflowAudit;
  readonly subscriptionPlan = this.client.subscriptionPlan;
  readonly billingAccount = this.client.billingAccount;
  readonly subscription = this.client.subscription;
  readonly usageRecord = this.client.usageRecord;
  readonly roleTemplate = this.client.roleTemplate;
  readonly agentTemplate = this.client.agentTemplate;
  readonly recommendationTemplate = this.client.recommendationTemplate;
  readonly ontologyEntity = this.client.ontologyEntity;
  readonly ontologyRelationship = this.client.ontologyRelationship;
  readonly knowledgeNode = this.client.knowledgeNode;
  readonly knowledgeEdge = this.client.knowledgeEdge;
  readonly businessContext = this.client.businessContext;
  readonly entityLink = this.client.entityLink;
  readonly relationshipTemplate = this.client.relationshipTemplate;
  readonly contextSnapshot = this.client.contextSnapshot;
  readonly industryKnowledgeModel = this.client.industryKnowledgeModel;
  readonly businessMemory = this.client.businessMemory;
  readonly language = this.client.language;
  readonly translation = this.client.translation;
  readonly translationKey = this.client.translationKey;
  readonly translationValue = this.client.translationValue;
  readonly localeProfile = this.client.localeProfile;
  readonly languagePreference = this.client.languagePreference;
  readonly country = this.client.country;
  readonly countryProfile = this.client.countryProfile;
  readonly countryCompliance = this.client.countryCompliance;
  readonly countryTaxProfile = this.client.countryTaxProfile;
  readonly countryBusinessRule = this.client.countryBusinessRule;
  readonly countryHoliday = this.client.countryHoliday;
  readonly complianceRule = this.client.complianceRule;
  readonly dataPolicy = this.client.dataPolicy;
  readonly retentionPolicy = this.client.retentionPolicy;
  readonly privacyControl = this.client.privacyControl;
  readonly adminOperation = this.client.adminOperation;
  readonly deploymentEnvironment = this.client.deploymentEnvironment;
  readonly releaseControl = this.client.releaseControl;
  readonly featureFlag = this.client.featureFlag;
  readonly changeRequest = this.client.changeRequest;
  readonly adminIncident = this.client.adminIncident;
  readonly tenantSuspension = this.client.tenantSuspension;
  readonly emergencyControl = this.client.emergencyControl;
  readonly systemHealthSnapshot = this.client.systemHealthSnapshot;
  readonly aiUsageSnapshot = this.client.aiUsageSnapshot;
  readonly dataImportJob = this.client.dataImportJob;
  readonly dataImportBatch = this.client.dataImportBatch;
  readonly dataImportRecord = this.client.dataImportRecord;
  readonly dataImportError = this.client.dataImportError;
  readonly migrationConnection = this.client.migrationConnection;
  readonly migrationRun = this.client.migrationRun;
  readonly migrationMapping = this.client.migrationMapping;
  readonly onboardingProfile = this.client.onboardingProfile;
  readonly onboardingStep = this.client.onboardingStep;
  readonly onboardingRecommendation = this.client.onboardingRecommendation;
  readonly marketplaceApp = this.client.marketplaceApp;
  readonly marketplaceAppVersion = this.client.marketplaceAppVersion;
  readonly marketplaceInstallation = this.client.marketplaceInstallation;
  readonly marketplacePermission = this.client.marketplacePermission;
  readonly extensionDefinition = this.client.extensionDefinition;
  readonly extensionHook = this.client.extensionHook;
  readonly extensionPoint = this.client.extensionPoint;
  readonly partnerProfile = this.client.partnerProfile;
  readonly partnerCertification = this.client.partnerCertification;
  readonly partnerServiceListing = this.client.partnerServiceListing;
  readonly industryTemplatePack = this.client.industryTemplatePack;
  readonly registeredDevice = this.client.registeredDevice;
  readonly deviceSession = this.client.deviceSession;
  readonly deviceTrustPolicy = this.client.deviceTrustPolicy;
  readonly devicePermission = this.client.devicePermission;
  readonly deviceActivityLog = this.client.deviceActivityLog;
  readonly deviceApprovalRequest = this.client.deviceApprovalRequest;
  readonly mobileWorkspaceProfile = this.client.mobileWorkspaceProfile;
  readonly desktopCompanionProfile = this.client.desktopCompanionProfile;
  readonly offlineStore = this.client.offlineStore;
  readonly offlineQueueItem = this.client.offlineQueueItem;
  readonly offlineConflict = this.client.offlineConflict;
  readonly localCachePolicy = this.client.localCachePolicy;
  readonly syncCursor = this.client.syncCursor;
  readonly syncStatusSnapshot = this.client.syncStatusSnapshot;
  readonly offlineModulePolicy = this.client.offlineModulePolicy;
  readonly dataCatalogAsset = this.client.dataCatalogAsset;
  readonly dataClassificationEvent = this.client.dataClassificationEvent;
  readonly dataOwnershipAssignment = this.client.dataOwnershipAssignment;
  readonly dataLineageEdge = this.client.dataLineageEdge;
  readonly dataQualityCheck = this.client.dataQualityCheck;
  readonly privacyConsentRecord = this.client.privacyConsentRecord;
  readonly privacyRequest = this.client.privacyRequest;
  readonly privacyWorkflowRun = this.client.privacyWorkflowRun;
  readonly recordsLifecyclePolicy = this.client.recordsLifecyclePolicy;
  readonly recordsLifecycleAction = this.client.recordsLifecycleAction;
  readonly recordsArchiveJob = this.client.recordsArchiveJob;
  readonly complianceEvidencePackage = this.client.complianceEvidencePackage;
  readonly complianceMonitoringRun = this.client.complianceMonitoringRun;
  readonly searchIndex = this.client.searchIndex;
  readonly searchIndexedDocument = this.client.searchIndexedDocument;
  readonly searchEmbeddingRecord = this.client.searchEmbeddingRecord;
  readonly savedSearch = this.client.savedSearch;
  readonly searchQueryLog = this.client.searchQueryLog;
  readonly retrievalSession = this.client.retrievalSession;
  readonly retrievalResult = this.client.retrievalResult;
  readonly searchAccessPolicy = this.client.searchAccessPolicy;
  readonly knowledgeSpace = this.client.knowledgeSpace;
  readonly knowledgeCategory = this.client.knowledgeCategory;
  readonly knowledgeArticle = this.client.knowledgeArticle;
  readonly discussion = this.client.discussion;
  readonly discussionThread = this.client.discussionThread;
  readonly discussionMessage = this.client.discussionMessage;
  readonly collaborationMention = this.client.collaborationMention;
  readonly collaborationReaction = this.client.collaborationReaction;
  readonly collaborationActivity = this.client.collaborationActivity;
  readonly decisionRoom = this.client.decisionRoom;
  readonly decisionParticipant = this.client.decisionParticipant;
  readonly decisionVote = this.client.decisionVote;
  readonly decisionApproval = this.client.decisionApproval;
  readonly decisionRecord = this.client.decisionRecord;
  readonly aiCollaborationSummary = this.client.aiCollaborationSummary;
  readonly collaborationActionItem = this.client.collaborationActionItem;
  readonly communicationChannel = this.client.communicationChannel;
  readonly communicationMember = this.client.communicationMember;
  readonly conversation = this.client.conversation;
  readonly message = this.client.message;
  readonly messageAttachment = this.client.messageAttachment;
  readonly messageReaction = this.client.messageReaction;
  readonly announcement = this.client.announcement;
  readonly announcementRecipient = this.client.announcementRecipient;
  readonly meeting = this.client.meeting;
  readonly meetingParticipant = this.client.meetingParticipant;
  readonly meetingAgenda = this.client.meetingAgenda;
  readonly meetingDecision = this.client.meetingDecision;
  readonly meetingActionItem = this.client.meetingActionItem;
  readonly meetingSummary = this.client.meetingSummary;
  readonly calendar = this.client.calendar;
  readonly calendarEvent = this.client.calendarEvent;
  readonly calendarParticipant = this.client.calendarParticipant;
  readonly scheduleRule = this.client.scheduleRule;
  readonly availabilityWindow = this.client.availabilityWindow;
  readonly meetingRecommendation = this.client.meetingRecommendation;
  readonly reminder = this.client.reminder;
  readonly notificationPreference = this.client.notificationPreference;
  readonly voiceSession = this.client.voiceSession;
  readonly voiceTranscript = this.client.voiceTranscript;
  readonly conversationParticipant = this.client.conversationParticipant;
  readonly contactCenterQueue = this.client.contactCenterQueue;
  readonly agentAssignment = this.client.agentAssignment;
  readonly customerIdentity = this.client.customerIdentity;
  readonly sentimentRecord = this.client.sentimentRecord;
  readonly intentRecord = this.client.intentRecord;
  readonly conversationSummary = this.client.conversationSummary;
  readonly voiceAgentExecution = this.client.voiceAgentExecution;
  readonly escalationEvent = this.client.escalationEvent;
  readonly customerHealthScore = this.client.customerHealthScore;
  readonly customerJourney = this.client.customerJourney;
  readonly customerFeedback = this.client.customerFeedback;
  readonly customerSuccessPlan = this.client.customerSuccessPlan;
  readonly customerEngagementScore = this.client.customerEngagementScore;
  readonly churnPrediction = this.client.churnPrediction;
  readonly renewalOpportunity = this.client.renewalOpportunity;
  readonly upsellOpportunity = this.client.upsellOpportunity;
  readonly crossSellOpportunity = this.client.crossSellOpportunity;
  readonly serviceTicket = this.client.serviceTicket;
  readonly serviceEscalation = this.client.serviceEscalation;
  readonly serviceResolution = this.client.serviceResolution;
  readonly sLARecord = this.client.sLARecord;
  readonly revenueOpportunity = this.client.revenueOpportunity;
  readonly revenueRisk = this.client.revenueRisk;
  readonly productHealthScore = this.client.productHealthScore;
  readonly productUsageMetric = this.client.productUsageMetric;
  readonly userJourney = this.client.userJourney;
  readonly journeyStep = this.client.journeyStep;
  readonly productEvent = this.client.productEvent;
  readonly sessionAnalytics = this.client.sessionAnalytics;
  readonly featureUsage = this.client.featureUsage;
  readonly funnelDefinition = this.client.funnelDefinition;
  readonly funnelStage = this.client.funnelStage;
  readonly funnelResult = this.client.funnelResult;
  readonly experiment = this.client.experiment;
  readonly experimentVariant = this.client.experimentVariant;
  readonly experimentResult = this.client.experimentResult;
  readonly retentionCohort = this.client.retentionCohort;
  readonly engagementScore = this.client.engagementScore;
  readonly growthRecommendation = this.client.growthRecommendation;
  readonly forecastModel = this.client.forecastModel;
  readonly forecastResult = this.client.forecastResult;
  readonly predictionModel = this.client.predictionModel;
  readonly predictionResult = this.client.predictionResult;
  readonly strategicGoal = this.client.strategicGoal;
  readonly strategicPlan = this.client.strategicPlan;
  readonly scenarioModel = this.client.scenarioModel;
  readonly scenarioResult = this.client.scenarioResult;
  readonly budgetPlan = this.client.budgetPlan;
  readonly capacityPlan = this.client.capacityPlan;
  readonly riskForecast = this.client.riskForecast;
  readonly growthForecast = this.client.growthForecast;
  readonly dataLake = this.client.dataLake;
  readonly dataWarehouse = this.client.dataWarehouse;
  readonly dataMart = this.client.dataMart;
  readonly semanticMetric = this.client.semanticMetric;
  readonly semanticDimension = this.client.semanticDimension;
  readonly kPI = this.client.kPI;
  readonly kPIResult = this.client.kPIResult;
  readonly executiveDashboard = this.client.executiveDashboard;
  readonly warehouseJob = this.client.warehouseJob;
  readonly dataPipeline = this.client.dataPipeline;
  readonly aIModel = this.client.aIModel;
  readonly aIModelVersion = this.client.aIModelVersion;
  readonly aIModelDeployment = this.client.aIModelDeployment;
  readonly aIModelRegistry = this.client.aIModelRegistry;
  readonly aIDecision = this.client.aIDecision;
  readonly aIDecisionReason = this.client.aIDecisionReason;
  readonly aIDecisionRisk = this.client.aIDecisionRisk;
  readonly aIAuditLog = this.client.aIAuditLog;
  readonly aIComplianceRecord = this.client.aIComplianceRecord;
  readonly aIExplainabilityRecord = this.client.aIExplainabilityRecord;
  readonly modelPerformanceMetric = this.client.modelPerformanceMetric;
  readonly modelApprovalWorkflow = this.client.modelApprovalWorkflow;
  readonly securityIncident = this.client.securityIncident;
  readonly securityThreat = this.client.securityThreat;
  readonly threatDetectionRule = this.client.threatDetectionRule;
  readonly threatEvent = this.client.threatEvent;
  readonly securityRisk = this.client.securityRisk;
  readonly securityScore = this.client.securityScore;
  readonly securityAudit = this.client.securityAudit;
  readonly complianceViolation = this.client.complianceViolation;
  readonly zeroTrustPolicy = this.client.zeroTrustPolicy;
  readonly accessVerification = this.client.accessVerification;
  readonly securityAlert = this.client.securityAlert;
  readonly securityInvestigation = this.client.securityInvestigation;
  readonly serviceHealth = this.client.serviceHealth;
  readonly systemIncident = this.client.systemIncident;
  readonly incidentTimeline = this.client.incidentTimeline;
  readonly recoveryAction = this.client.recoveryAction;
  readonly uptimeMetric = this.client.uptimeMetric;
  readonly reliabilityScore = this.client.reliabilityScore;
  readonly scalingPolicy = this.client.scalingPolicy;
  readonly scalingEvent = this.client.scalingEvent;
  readonly regionHealth = this.client.regionHealth;
  readonly failoverEvent = this.client.failoverEvent;
  readonly sreAlert = this.client.sreAlert;
  readonly capacityForecast = this.client.capacityForecast;
  readonly costCenter = this.client.costCenter;
  readonly resourceUsage = this.client.resourceUsage;
  readonly costMetric = this.client.costMetric;
  readonly costForecast = this.client.costForecast;
  readonly optimizationRecommendation = this.client.optimizationRecommendation;
  readonly efficiencyScore = this.client.efficiencyScore;
  readonly performanceMetric = this.client.performanceMetric;
  readonly resourceAllocation = this.client.resourceAllocation;
  readonly finOpsPolicy = this.client.finOpsPolicy;
  readonly budgetTracking = this.client.budgetTracking;
  readonly costAlert = this.client.costAlert;
  readonly savingsOpportunity = this.client.savingsOpportunity;
  readonly dataRegion = this.client.dataRegion;
  readonly residencyPolicy = this.client.residencyPolicy;
  readonly sovereigntyRule = this.client.sovereigntyRule;
  readonly regulatoryFramework = this.client.regulatoryFramework;
  readonly complianceRequirement = this.client.complianceRequirement;
  readonly jurisdictionRule = this.client.jurisdictionRule;
  readonly dataTransferRule = this.client.dataTransferRule;
  readonly complianceAudit = this.client.complianceAudit;
  readonly regulatoryAlert = this.client.regulatoryAlert;
  readonly residencyAssignment = this.client.residencyAssignment;
  readonly dataLocation = this.client.dataLocation;
  readonly regulatoryRisk = this.client.regulatoryRisk;
  readonly dataContract = this.client.dataContract;
  readonly contractVersion = this.client.contractVersion;
  readonly apiProduct = this.client.apiProduct;
  readonly apiPlan = this.client.apiPlan;
  readonly apiSubscription = this.client.apiSubscription;
  readonly apiUsageRecord = this.client.apiUsageRecord;
  readonly apiBilling = this.client.apiBilling;
  readonly governancePolicy = this.client.governancePolicy;
  readonly apiQuota = this.client.apiQuota;
  readonly rateLimitPolicy = this.client.rateLimitPolicy;
  readonly partnerAccess = this.client.partnerAccess;
  readonly trustReport = this.client.trustReport;
  readonly securityCertification = this.client.securityCertification;
  readonly complianceArtifact = this.client.complianceArtifact;
  readonly developerAccount = this.client.developerAccount;
  readonly developerApplication = this.client.developerApplication;
  readonly apiDocumentation = this.client.apiDocumentation;
  readonly sdkPackage = this.client.sdkPackage;
  readonly externalIntegration = this.client.externalIntegration;
  readonly partnerListing = this.client.partnerListing;
  readonly marketplaceApplication = this.client.marketplaceApplication;
  readonly statusIncident = this.client.statusIncident;
  readonly ecosystemEvent = this.client.ecosystemEvent;
  readonly customerAccount = this.client.customerAccount;
  readonly customerWorkspace = this.client.customerWorkspace;
  readonly customerSubscription = this.client.customerSubscription;
  readonly billingProfile = this.client.billingProfile;
  readonly invoiceRecord = this.client.invoiceRecord;
  readonly paymentMethod = this.client.paymentMethod;
  readonly usageMetric = this.client.usageMetric;
  readonly partnerAccount = this.client.partnerAccount;
  readonly partnerWorkspace = this.client.partnerWorkspace;
  readonly partnerCommission = this.client.partnerCommission;
  readonly partnerReferral = this.client.partnerReferral;
  readonly revenueAccount = this.client.revenueAccount;
  readonly revenueContract = this.client.revenueContract;
  readonly contractAmendment = this.client.contractAmendment;
  readonly renewalSchedule = this.client.renewalSchedule;
  readonly renewalForecast = this.client.renewalForecast;
  readonly churnSignal = this.client.churnSignal;
  readonly expansionOpportunity = this.client.expansionOpportunity;
  readonly accountHealthScore = this.client.accountHealthScore;
  readonly revenueForecast = this.client.revenueForecast;
  readonly revenueEvent = this.client.revenueEvent;
  readonly vendor = this.client.vendor;
  readonly vendorContract = this.client.vendorContract;
  readonly vendorScorecard = this.client.vendorScorecard;
  readonly procurementRequest = this.client.procurementRequest;
  readonly procurementApproval = this.client.procurementApproval;
  readonly purchaseOrder = this.client.purchaseOrder;
  readonly purchaseCategory = this.client.purchaseCategory;
  readonly budgetAllocation = this.client.budgetAllocation;
  readonly spendTransaction = this.client.spendTransaction;
  readonly spendInsight = this.client.spendInsight;
  readonly costOptimizationRecommendation = this.client.costOptimizationRecommendation;
  readonly procurementEvent = this.client.procurementEvent;
  readonly supplyChainItem = this.client.supplyChainItem;
  readonly warehouse = this.client.warehouse;
  readonly warehouseZone = this.client.warehouseZone;
  readonly warehouseBin = this.client.warehouseBin;
  readonly stockBalance = this.client.stockBalance;
  readonly inventoryBatch = this.client.inventoryBatch;
  readonly inventorySerial = this.client.inventorySerial;
  readonly inventoryAudit = this.client.inventoryAudit;
  readonly inventoryMovementHistory = this.client.inventoryMovementHistory;
  readonly inventoryTransfer = this.client.inventoryTransfer;
  readonly receivingRecord = this.client.receivingRecord;
  readonly fulfillmentOrder = this.client.fulfillmentOrder;
  readonly pickingTask = this.client.pickingTask;
  readonly packingTask = this.client.packingTask;
  readonly shipment = this.client.shipment;
  readonly shipmentTrackingEvent = this.client.shipmentTrackingEvent;
  readonly carrier = this.client.carrier;
  readonly distributionCenter = this.client.distributionCenter;
  readonly routeOptimizationPlan = this.client.routeOptimizationPlan;
  readonly demandForecastModel = this.client.demandForecastModel;
  readonly demandForecastScenario = this.client.demandForecastScenario;
  readonly replenishmentPlan = this.client.replenishmentPlan;
  readonly supplyChainRisk = this.client.supplyChainRisk;
  readonly supplyChainInsight = this.client.supplyChainInsight;
  readonly supplyChainCopilotQuery = this.client.supplyChainCopilotQuery;

  readonly manufacturingPlant = this.client.manufacturingPlant;
  readonly productionLine = this.client.productionLine;
  readonly workCenter = this.client.workCenter;
  readonly factoryResource = this.client.factoryResource;
  readonly billOfMaterial = this.client.billOfMaterial;
  readonly bomComponent = this.client.bomComponent;
  readonly productionPlan = this.client.productionPlan;
  readonly productionSchedule = this.client.productionSchedule;
  readonly productionOrder = this.client.productionOrder;
  readonly productionOperation = this.client.productionOperation;
  readonly manufacturingExecutionRun = this.client.manufacturingExecutionRun;
  readonly productionMaterialRequirement = this.client.productionMaterialRequirement;
  readonly machineTelemetry = this.client.machineTelemetry;
  readonly qualityInspection = this.client.qualityInspection;
  readonly qualityIssue = this.client.qualityIssue;
  readonly maintenanceAsset = this.client.maintenanceAsset;
  readonly maintenancePrediction = this.client.maintenancePrediction;
  readonly productionCostRecord = this.client.productionCostRecord;
  readonly manufacturingMetric = this.client.manufacturingMetric;
  readonly manufacturingRisk = this.client.manufacturingRisk;
  readonly digitalTwinModel = this.client.digitalTwinModel;
  readonly digitalTwinSnapshot = this.client.digitalTwinSnapshot;
  readonly manufacturingCopilotQuery = this.client.manufacturingCopilotQuery;
  readonly manufacturingEvent = this.client.manufacturingEvent;
  readonly employee = this.client.employee;
  readonly employeeProfileExtension = this.client.employeeProfileExtension;
  readonly employeeSkill = this.client.employeeSkill;
  readonly employeeDocument = this.client.employeeDocument;
  readonly employeeHistory = this.client.employeeHistory;
  readonly employeeRelationship = this.client.employeeRelationship;
  readonly jobRequisition = this.client.jobRequisition;
  readonly jobPosting = this.client.jobPosting;
  readonly candidate = this.client.candidate;
  readonly candidateProfile = this.client.candidateProfile;
  readonly interview = this.client.interview;
  readonly interviewFeedback = this.client.interviewFeedback;
  readonly offerLetter = this.client.offerLetter;
  readonly hiringPipeline = this.client.hiringPipeline;
  readonly onboardingWorkflow = this.client.onboardingWorkflow;
  readonly onboardingTask = this.client.onboardingTask;
  readonly onboardingChecklist = this.client.onboardingChecklist;
  readonly employeeEquipment = this.client.employeeEquipment;
  readonly policyAcknowledgement = this.client.policyAcknowledgement;
  readonly attendance = this.client.attendance;
  readonly attendanceLog = this.client.attendanceLog;
  readonly leaveRequest = this.client.leaveRequest;
  readonly leaveBalance = this.client.leaveBalance;
  readonly holidayCalendar = this.client.holidayCalendar;
  readonly shiftSchedule = this.client.shiftSchedule;
  readonly performanceReview = this.client.performanceReview;
  readonly performanceGoal = this.client.performanceGoal;
  readonly performanceCycle = this.client.performanceCycle;
  readonly feedbackRecord = this.client.feedbackRecord;
  readonly developmentPlan = this.client.developmentPlan;
  readonly competencyAssessment = this.client.competencyAssessment;
  readonly course = this.client.course;
  readonly learningPath = this.client.learningPath;
  readonly enrollment = this.client.enrollment;
  readonly assessment = this.client.assessment;
  readonly certification = this.client.certification;
  readonly skillDevelopmentPlan = this.client.skillDevelopmentPlan;
  readonly compensationPlan = this.client.compensationPlan;
  readonly salaryBand = this.client.salaryBand;
  readonly bonusPlan = this.client.bonusPlan;
  readonly promotionPlan = this.client.promotionPlan;
  readonly compensationHistory = this.client.compensationHistory;
  readonly workforcePlan = this.client.workforcePlan;
  readonly headcountForecast = this.client.headcountForecast;
  readonly workforceCapacityForecast = this.client.workforceCapacityForecast;
  readonly hiringForecast = this.client.hiringForecast;
  readonly resourceForecast = this.client.resourceForecast;
  readonly talentProfile = this.client.talentProfile;
  readonly talentScore = this.client.talentScore;
  readonly successionPlan = this.client.successionPlan;
  readonly retentionRisk = this.client.retentionRisk;
  readonly leadershipCandidate = this.client.leadershipCandidate;
  readonly employeeDashboard = this.client.employeeDashboard;
  readonly careerPath = this.client.careerPath;
  readonly internalOpportunity = this.client.internalOpportunity;
  readonly employeeFeedback = this.client.employeeFeedback;
  readonly employeeEngagement = this.client.employeeEngagement;
  readonly organizationStructure = this.client.organizationStructure;
  readonly reportingLine = this.client.reportingLine;
  readonly teamAnalytics = this.client.teamAnalytics;
  readonly organizationInsight = this.client.organizationInsight;
  readonly hrCopilotQuery = this.client.hrCopilotQuery;
  readonly hrRecommendation = this.client.hrRecommendation;
  readonly enterpriseAsset = this.client.enterpriseAsset;
  readonly assetCategory = this.client.assetCategory;
  readonly assetLocation = this.client.assetLocation;
  readonly assetTag = this.client.assetTag;
  readonly assetLifecycleRecord = this.client.assetLifecycleRecord;
  readonly assetAssignment = this.client.assetAssignment;
  readonly assetDepreciationPolicy = this.client.assetDepreciationPolicy;
  readonly assetMaintenancePlan = this.client.assetMaintenancePlan;
  readonly assetMaintenanceSchedule = this.client.assetMaintenanceSchedule;
  readonly assetMaintenanceTask = this.client.assetMaintenanceTask;
  readonly assetInspection = this.client.assetInspection;
  readonly assetWorkOrder = this.client.assetWorkOrder;
  readonly workOrderTask = this.client.workOrderTask;
  readonly workOrderPart = this.client.workOrderPart;
  readonly workOrderTimeEntry = this.client.workOrderTimeEntry;
  readonly workOrderApproval = this.client.workOrderApproval;
  readonly assetHealthScore = this.client.assetHealthScore;
  readonly assetConditionSignal = this.client.assetConditionSignal;
  readonly assetRiskAssessment = this.client.assetRiskAssessment;
  readonly assetFailurePrediction = this.client.assetFailurePrediction;
  readonly assetWarranty = this.client.assetWarranty;
  readonly assetServiceContract = this.client.assetServiceContract;
  readonly assetVendorAgreement = this.client.assetVendorAgreement;
  readonly assetRenewalReminder = this.client.assetRenewalReminder;
  readonly assetCostRecord = this.client.assetCostRecord;
  readonly assetBudget = this.client.assetBudget;
  readonly assetTcoSnapshot = this.client.assetTcoSnapshot;
  readonly assetCostOptimization = this.client.assetCostOptimization;
  readonly assetIotDevice = this.client.assetIotDevice;
  readonly assetIotTelemetry = this.client.assetIotTelemetry;
  readonly assetIotAlert = this.client.assetIotAlert;
  readonly assetSensorCalibration = this.client.assetSensorCalibration;
  readonly assetMetric = this.client.assetMetric;
  readonly assetAnalyticsSnapshot = this.client.assetAnalyticsSnapshot;
  readonly assetReliabilityScore = this.client.assetReliabilityScore;
  readonly assetUtilizationRecord = this.client.assetUtilizationRecord;
  readonly assetCopilotQuery = this.client.assetCopilotQuery;
  readonly assetRecommendation = this.client.assetRecommendation;
  readonly assetInsight = this.client.assetInsight;
  readonly fieldServiceRegion = this.client.fieldServiceRegion;
  readonly fieldServiceTerritory = this.client.fieldServiceTerritory;
  readonly fieldServiceRequest = this.client.fieldServiceRequest;
  readonly fieldServiceCase = this.client.fieldServiceCase;
  readonly fieldServiceAppointment = this.client.fieldServiceAppointment;
  readonly fieldWorkOrder = this.client.fieldWorkOrder;
  readonly fieldWorkOrderTask = this.client.fieldWorkOrderTask;
  readonly fieldWorkOrderPart = this.client.fieldWorkOrderPart;
  readonly fieldWorkOrderChecklist = this.client.fieldWorkOrderChecklist;
  readonly fieldWorkOrderCompletion = this.client.fieldWorkOrderCompletion;
  readonly dispatchBoard = this.client.dispatchBoard;
  readonly dispatchAssignment = this.client.dispatchAssignment;
  readonly dispatchRule = this.client.dispatchRule;
  readonly dispatchException = this.client.dispatchException;
  readonly technicianProfile = this.client.technicianProfile;
  readonly technicianSkill = this.client.technicianSkill;
  readonly technicianCertification = this.client.technicianCertification;
  readonly technicianAvailability = this.client.technicianAvailability;
  readonly technicianPerformance = this.client.technicianPerformance;
  readonly fieldRoutePlan = this.client.fieldRoutePlan;
  readonly fieldRouteStop = this.client.fieldRouteStop;
  readonly fieldRouteOptimization = this.client.fieldRouteOptimization;
  readonly travelTimeEstimate = this.client.travelTimeEstimate;
  readonly mobileWorkSession = this.client.mobileWorkSession;
  readonly mobileDeviceRegistration = this.client.mobileDeviceRegistration;
  readonly offlineJobQueue = this.client.offlineJobQueue;
  readonly mobileSyncEvent = this.client.mobileSyncEvent;
  readonly fieldServiceSlaPolicy = this.client.fieldServiceSlaPolicy;
  readonly fieldServiceSlaCommitment = this.client.fieldServiceSlaCommitment;
  readonly fieldServiceSlaBreach = this.client.fieldServiceSlaBreach;
  readonly fieldServiceEscalation = this.client.fieldServiceEscalation;
  readonly customerServiceVisit = this.client.customerServiceVisit;
  readonly customerServiceFeedback = this.client.customerServiceFeedback;
  readonly customerServiceResolution = this.client.customerServiceResolution;
  readonly customerServiceInsight = this.client.customerServiceInsight;
  readonly fieldWorkforceMetric = this.client.fieldWorkforceMetric;
  readonly fieldWorkforceAnalyticsSnapshot = this.client.fieldWorkforceAnalyticsSnapshot;
  readonly technicianUtilizationRecord = this.client.technicianUtilizationRecord;
  readonly fieldServiceForecast = this.client.fieldServiceForecast;
  readonly fieldServiceCopilotQuery = this.client.fieldServiceCopilotQuery;
  readonly fieldServiceRecommendation = this.client.fieldServiceRecommendation;
  readonly fieldServiceRiskSignal = this.client.fieldServiceRiskSignal;


  readonly planningCycle = this.client.planningCycle;
  readonly okrObjective = this.client.okrObjective;
  readonly okrKeyResult = this.client.okrKeyResult;
  readonly okrInitiative = this.client.okrInitiative;
  readonly okrCheckIn = this.client.okrCheckIn;
  readonly okrAlignment = this.client.okrAlignment;
  readonly enterpriseStrategicPlan = this.client.enterpriseStrategicPlan;
  readonly strategyPillar = this.client.strategyPillar;
  readonly strategicTheme = this.client.strategicTheme;
  readonly strategyMilestone = this.client.strategyMilestone;
  readonly enterprisePortfolio = this.client.enterprisePortfolio;
  readonly portfolioProgram = this.client.portfolioProgram;
  readonly portfolioProject = this.client.portfolioProject;
  readonly portfolioInvestment = this.client.portfolioInvestment;
  readonly portfolioRisk = this.client.portfolioRisk;
  readonly portfolioDependency = this.client.portfolioDependency;
  readonly planningResourcePool = this.client.planningResourcePool;
  readonly resourceDemand = this.client.resourceDemand;
  readonly portfolioResourceAllocation = this.client.portfolioResourceAllocation;
  readonly resourceSkillRequirement = this.client.resourceSkillRequirement;
  readonly planningCapacityPlan = this.client.planningCapacityPlan;
  readonly capacityScenario = this.client.capacityScenario;
  readonly capacityConstraint = this.client.capacityConstraint;
  readonly capacityForecastSignal = this.client.capacityForecastSignal;
  readonly planningBudgetPlan = this.client.planningBudgetPlan;
  readonly budgetLineItem = this.client.budgetLineItem;
  readonly budgetScenario = this.client.budgetScenario;
  readonly budgetVariance = this.client.budgetVariance;
  readonly planningScenario = this.client.planningScenario;
  readonly scenarioAssumption = this.client.scenarioAssumption;
  readonly scenarioSimulation = this.client.scenarioSimulation;
  readonly scenarioDecision = this.client.scenarioDecision;
  readonly planningExecutiveDashboard = this.client.planningExecutiveDashboard;
  readonly executiveScorecard = this.client.executiveScorecard;
  readonly portfolioMetric = this.client.portfolioMetric;
  readonly portfolioAnalyticsSnapshot = this.client.portfolioAnalyticsSnapshot;
  readonly portfolioHealthScore = this.client.portfolioHealthScore;
  readonly strategyCopilotQuery = this.client.strategyCopilotQuery;
  readonly strategyRecommendation = this.client.strategyRecommendation;
  readonly strategicRiskSignal = this.client.strategicRiskSignal;
  readonly planningAuditEvent = this.client.planningAuditEvent;

  readonly customerMasterRecord = this.client.customerMasterRecord;
  readonly customerMasterProfile = this.client.customerMasterProfile;
  readonly customerMasterIdentifier = this.client.customerMasterIdentifier;
  readonly customerMasterRelationship = this.client.customerMasterRelationship;
  readonly vendorMasterRecord = this.client.vendorMasterRecord;
  readonly vendorMasterProfile = this.client.vendorMasterProfile;
  readonly vendorMasterIdentifier = this.client.vendorMasterIdentifier;
  readonly vendorMasterRelationship = this.client.vendorMasterRelationship;
  readonly productMasterRecord = this.client.productMasterRecord;
  readonly productMasterCatalog = this.client.productMasterCatalog;
  readonly productMasterAttribute = this.client.productMasterAttribute;
  readonly productMasterHierarchy = this.client.productMasterHierarchy;
  readonly employeeMasterRecord = this.client.employeeMasterRecord;
  readonly employeeMasterProfile = this.client.employeeMasterProfile;
  readonly employeeMasterIdentifier = this.client.employeeMasterIdentifier;
  readonly employeeMasterAssignment = this.client.employeeMasterAssignment;
  readonly assetMasterRecord = this.client.assetMasterRecord;
  readonly assetMasterProfile = this.client.assetMasterProfile;
  readonly assetMasterIdentifier = this.client.assetMasterIdentifier;
  readonly assetMasterHierarchy = this.client.assetMasterHierarchy;
  readonly mdmDataQualityRule = this.client.mdmDataQualityRule;
  readonly mdmDataQualityScore = this.client.mdmDataQualityScore;
  readonly mdmDataQualityIssue = this.client.mdmDataQualityIssue;
  readonly mdmDataQualityRun = this.client.mdmDataQualityRun;
  readonly mdmDuplicateRule = this.client.mdmDuplicateRule;
  readonly mdmDuplicateCandidate = this.client.mdmDuplicateCandidate;
  readonly mdmDuplicateCluster = this.client.mdmDuplicateCluster;
  readonly mdmDuplicateReview = this.client.mdmDuplicateReview;
  readonly mdmEntityResolutionRule = this.client.mdmEntityResolutionRule;
  readonly mdmEntityMatch = this.client.mdmEntityMatch;
  readonly mdmEntityResolutionRun = this.client.mdmEntityResolutionRun;
  readonly mdmEntityResolutionDecision = this.client.mdmEntityResolutionDecision;
  readonly mdmGoldenRecord = this.client.mdmGoldenRecord;
  readonly mdmGoldenRecordVersion = this.client.mdmGoldenRecordVersion;
  readonly mdmSurvivorshipRule = this.client.mdmSurvivorshipRule;
  readonly mdmMergeRequest = this.client.mdmMergeRequest;
  readonly mdmGovernancePolicy = this.client.mdmGovernancePolicy;
  readonly mdmStewardshipAssignment = this.client.mdmStewardshipAssignment;
  readonly mdmDataDomain = this.client.mdmDataDomain;
  readonly mdmComplianceControl = this.client.mdmComplianceControl;
  readonly mdmLineageRecord = this.client.mdmLineageRecord;
  readonly mdmLineageEvent = this.client.mdmLineageEvent;
  readonly mdmSourceSystem = this.client.mdmSourceSystem;
  readonly mdmDataContractLink = this.client.mdmDataContractLink;
  readonly mdmCopilotQuery = this.client.mdmCopilotQuery;
  readonly mdmRecommendation = this.client.mdmRecommendation;
  readonly mdmRiskSignal = this.client.mdmRiskSignal;
  readonly mdmAuditEvent = this.client.mdmAuditEvent;

  readonly globalIntegrationHub = this.client.globalIntegrationHub;
  readonly globalIntegrationCatalog = this.client.globalIntegrationCatalog;
  readonly globalIntegrationTenantConfig = this.client.globalIntegrationTenantConfig;
  readonly globalIntegrationConnection = this.client.globalIntegrationConnection;
  readonly salesforceConnection = this.client.salesforceConnection;
  readonly salesforceObjectMapping = this.client.salesforceObjectMapping;
  readonly salesforceSyncJob = this.client.salesforceSyncJob;
  readonly salesforceEventSubscription = this.client.salesforceEventSubscription;
  readonly sapConnection = this.client.sapConnection;
  readonly sapBapiMapping = this.client.sapBapiMapping;
  readonly sapIdocSubscription = this.client.sapIdocSubscription;
  readonly sapSyncJob = this.client.sapSyncJob;
  readonly oracleConnection = this.client.oracleConnection;
  readonly oracleObjectMapping = this.client.oracleObjectMapping;
  readonly oracleSyncJob = this.client.oracleSyncJob;
  readonly oracleEventSubscription = this.client.oracleEventSubscription;
  readonly microsoftEcosystemConnection = this.client.microsoftEcosystemConnection;
  readonly microsoftGraphSubscription = this.client.microsoftGraphSubscription;
  readonly microsoftTeamsIntegration = this.client.microsoftTeamsIntegration;
  readonly microsoftDynamicsMapping = this.client.microsoftDynamicsMapping;
  readonly googleWorkspaceConnection = this.client.googleWorkspaceConnection;
  readonly googleDirectorySync = this.client.googleDirectorySync;
  readonly googleCalendarIntegration = this.client.googleCalendarIntegration;
  readonly googleDriveMapping = this.client.googleDriveMapping;
  readonly communicationIntegrationChannel = this.client.communicationIntegrationChannel;
  readonly communicationMessageRoute = this.client.communicationMessageRoute;
  readonly communicationProviderCredential = this.client.communicationProviderCredential;
  readonly communicationDeliveryLog = this.client.communicationDeliveryLog;
  readonly paymentIntegrationProvider = this.client.paymentIntegrationProvider;
  readonly paymentIntegrationAccount = this.client.paymentIntegrationAccount;
  readonly paymentIntegrationTransaction = this.client.paymentIntegrationTransaction;
  readonly paymentReconciliationJob = this.client.paymentReconciliationJob;
  readonly cloudIntegrationProvider = this.client.cloudIntegrationProvider;
  readonly cloudStorageConnection = this.client.cloudStorageConnection;
  readonly cloudEventBridge = this.client.cloudEventBridge;
  readonly cloudSecretReference = this.client.cloudSecretReference;
  readonly enterpriseApiGateway = this.client.enterpriseApiGateway;
  readonly apiGatewayRoute = this.client.apiGatewayRoute;
  readonly apiGatewayPolicy = this.client.apiGatewayPolicy;
  readonly apiGatewayConsumer = this.client.apiGatewayConsumer;
  readonly connectivityWebhookEndpoint = this.client.connectivityWebhookEndpoint;
  readonly connectivityWebhookDelivery = this.client.connectivityWebhookDelivery;
  readonly connectivityWebhookSignature = this.client.connectivityWebhookSignature;
  readonly connectivityWebhookSubscription = this.client.connectivityWebhookSubscription;
  readonly enterpriseConnectorSdk = this.client.enterpriseConnectorSdk;
  readonly connectorSdkPackage = this.client.connectorSdkPackage;
  readonly connectorSdkExtensionPoint = this.client.connectorSdkExtensionPoint;
  readonly connectorSdkVersion = this.client.connectorSdkVersion;
  readonly integrationHealthCheck = this.client.integrationHealthCheck;
  readonly integrationSyncRun = this.client.integrationSyncRun;
  readonly integrationAlert = this.client.integrationAlert;
  readonly integrationUsageMetric = this.client.integrationUsageMetric;
  readonly integrationCopilotQuery = this.client.integrationCopilotQuery;
  readonly integrationRecommendation = this.client.integrationRecommendation;
  readonly integrationRiskSignal = this.client.integrationRiskSignal;
  readonly integrationAuditEvent = this.client.integrationAuditEvent;

  readonly securityHardeningControl = this.client.securityHardeningControl;
  readonly securityAuditFinding = this.client.securityAuditFinding;
  readonly dependencyRemediationRecord = this.client.dependencyRemediationRecord;
  readonly loadTestScenario = this.client.loadTestScenario;
  readonly loadTestRun = this.client.loadTestRun;
  readonly stressTestRun = this.client.stressTestRun;
  readonly performanceBenchmark = this.client.performanceBenchmark;
  readonly performanceOptimizationAction = this.client.performanceOptimizationAction;
  readonly performanceRegression = this.client.performanceRegression;
  readonly observabilityDashboard = this.client.observabilityDashboard;
  readonly monitoringAlertRule = this.client.monitoringAlertRule;
  readonly telemetrySignal = this.client.telemetrySignal;
  readonly backupPolicy = this.client.backupPolicy;
  readonly backupValidationRun = this.client.backupValidationRun;
  readonly recoveryPointObjective = this.client.recoveryPointObjective;
  readonly disasterRecoveryPlan = this.client.disasterRecoveryPlan;
  readonly disasterRecoveryExercise = this.client.disasterRecoveryExercise;
  readonly failoverValidation = this.client.failoverValidation;
  readonly deploymentReadinessCheck = this.client.deploymentReadinessCheck;
  readonly environmentReadinessProfile = this.client.environmentReadinessProfile;
  readonly startupValidationRecord = this.client.startupValidationRecord;
  readonly apiGovernanceReview = this.client.apiGovernanceReview;
  readonly apiPolicyAssessment = this.client.apiPolicyAssessment;
  readonly apiVersionCompliance = this.client.apiVersionCompliance;
  readonly testCoverageSnapshot = this.client.testCoverageSnapshot;
  readonly unitTestCoverageReview = this.client.unitTestCoverageReview;
  readonly integrationTestCoverageReview = this.client.integrationTestCoverageReview;
  readonly releaseCandidateChecklist = this.client.releaseCandidateChecklist;
  readonly releaseValidationRun = this.client.releaseValidationRun;
  readonly releaseApproval = this.client.releaseApproval;
  readonly enterpriseDocumentationReview = this.client.enterpriseDocumentationReview;
  readonly documentationGap = this.client.documentationGap;
  readonly documentationEvidence = this.client.documentationEvidence;
  readonly productionReadinessScore = this.client.productionReadinessScore;
  readonly productionRiskRegister = this.client.productionRiskRegister;
  readonly hardeningAuditEvent = this.client.hardeningAuditEvent;

  constructor(private readonly contextStore: RequestContextStore) {}

  async onModuleInit() {
    if (!this.client.$connect) return;

    const timeoutMs = Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10_000);

    try {
      await withTimeout(this.client.$connect(), timeoutMs, `PostgreSQL unavailable after ${timeoutMs / 1000} seconds`);
      this.logger.log('Connected to PostgreSQL');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        this.logger.error('[Development Mode] PostgreSQL unavailable.', error instanceof Error ? error.stack : undefined);
        throw error;
      }

      this.logger.error('[Production Mode] PostgreSQL unavailable. Startup failed fast.', error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client.$disconnect) await this.client.$disconnect();
  }

  tenantId(): string {
    return this.contextStore.requireTenantId();
  }

  context() {
    return this.contextStore.get();
  }
}
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}


