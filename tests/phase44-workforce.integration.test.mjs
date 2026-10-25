import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/workforce-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 44 Prisma schema includes required workforce model surface', () => {
  const required = ["Employee","EmployeeProfileExtension","EmployeeSkill","EmployeeDocument","EmployeeHistory","EmployeeRelationship","JobRequisition","JobPosting","Candidate","CandidateProfile","Interview","InterviewFeedback","OfferLetter","HiringPipeline","OnboardingWorkflow","OnboardingTask","OnboardingChecklist","EmployeeEquipment","PolicyAcknowledgement","Attendance","AttendanceLog","LeaveRequest","LeaveBalance","HolidayCalendar","ShiftSchedule","PerformanceReview","PerformanceGoal","PerformanceCycle","FeedbackRecord","DevelopmentPlan","CompetencyAssessment","Course","LearningPath","Enrollment","Assessment","Certification","SkillDevelopmentPlan","CompensationPlan","SalaryBand","BonusPlan","PromotionPlan","CompensationHistory","WorkforcePlan","HeadcountForecast","WorkforceCapacityForecast","HiringForecast","ResourceForecast","TalentProfile","TalentScore","SuccessionPlan","RetentionRisk","LeadershipCandidate","EmployeeDashboard","CareerPath","InternalOpportunity","EmployeeFeedback","EmployeeEngagement","OrganizationStructure","ReportingLine","TeamAnalytics","OrganizationInsight","HrCopilotQuery","HrRecommendation"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 44 module, API map and audit events are registered', () => {
  assert.match(appModule, /WorkforceModule/);
  for (const apiPath of ["/v1/employee-management","/v1/recruitment-ats","/v1/employee-onboarding","/v1/attendance-leave","/v1/performance-management","/v1/learning-management","/v1/compensation-intelligence","/v1/workforce-planning","/v1/talent-intelligence","/v1/employee-experience","/v1/organizational-intelligence","/v1/ai-hr-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['EMPLOYEE_CREATED', 'JOB_POSTED', 'CANDIDATE_APPLIED', 'INTERVIEW_COMPLETED', 'RETENTION_RISK_DETECTED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});

