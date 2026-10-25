import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { EmployeeManagementController } from './controllers/employee-management.controller';
import { RecruitmentAtsController } from './controllers/recruitment-ats.controller';
import { EmployeeOnboardingController } from './controllers/employee-onboarding.controller';
import { AttendanceLeaveController } from './controllers/attendance-leave.controller';
import { PerformanceManagementController } from './controllers/performance-management.controller';
import { LearningManagementController } from './controllers/learning-management.controller';
import { CompensationIntelligenceController } from './controllers/compensation-intelligence.controller';
import { WorkforcePlanningController } from './controllers/workforce-planning.controller';
import { TalentIntelligenceController } from './controllers/talent-intelligence.controller';
import { EmployeeExperienceController } from './controllers/employee-experience.controller';
import { OrganizationalIntelligenceController } from './controllers/organizational-intelligence.controller';
import { AiHrCopilotController } from './controllers/ai-hr-copilot.controller';
import { WorkforceAnalyticsService } from './workforce-analytics.service';
import { WorkforceCommandService } from './workforce-command.service';
import { WorkforceCqrsService } from './workforce-cqrs.service';
import { WorkforceQueryService } from './workforce-query.service';
import { WorkforceReadinessService } from './workforce-readiness.service';
import { WorkforceService } from './workforce.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [EmployeeManagementController, RecruitmentAtsController, EmployeeOnboardingController, AttendanceLeaveController, PerformanceManagementController, LearningManagementController, CompensationIntelligenceController, WorkforcePlanningController, TalentIntelligenceController, EmployeeExperienceController, OrganizationalIntelligenceController, AiHrCopilotController],
  providers: [WorkforceService, WorkforceCommandService, WorkforceQueryService, WorkforceCqrsService, WorkforceAnalyticsService, WorkforceReadinessService],
  exports: [WorkforceService, WorkforceCommandService, WorkforceQueryService, WorkforceCqrsService, WorkforceAnalyticsService, WorkforceReadinessService],
})
export class WorkforceModule {}

