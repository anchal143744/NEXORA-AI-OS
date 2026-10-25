export type WorkforceEntity = 'employee' | 'employeeProfileExtension' | 'employeeSkill' | 'employeeDocument' | 'employeeHistory' | 'employeeRelationship' | 'jobRequisition' | 'jobPosting' | 'candidate' | 'candidateProfile' | 'interview' | 'interviewFeedback' | 'offerLetter' | 'hiringPipeline' | 'onboardingWorkflow' | 'onboardingTask' | 'onboardingChecklist' | 'employeeEquipment' | 'policyAcknowledgement' | 'attendance' | 'attendanceLog' | 'leaveRequest' | 'leaveBalance' | 'holidayCalendar' | 'shiftSchedule' | 'performanceReview' | 'performanceGoal' | 'performanceCycle' | 'feedbackRecord' | 'developmentPlan' | 'competencyAssessment' | 'course' | 'learningPath' | 'enrollment' | 'assessment' | 'certification' | 'skillDevelopmentPlan' | 'compensationPlan' | 'salaryBand' | 'bonusPlan' | 'promotionPlan' | 'compensationHistory' | 'workforcePlan' | 'headcountForecast' | 'workforceCapacityForecast' | 'hiringForecast' | 'resourceForecast' | 'talentProfile' | 'talentScore' | 'successionPlan' | 'retentionRisk' | 'leadershipCandidate' | 'employeeDashboard' | 'careerPath' | 'internalOpportunity' | 'employeeFeedback' | 'employeeEngagement' | 'organizationStructure' | 'reportingLine' | 'teamAnalytics' | 'organizationInsight' | 'hrCopilotQuery' | 'hrRecommendation';

export interface WorkforceEntityDefinition {
  entity: WorkforceEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const WORKFORCE_ENTITIES: WorkforceEntityDefinition[] = [
  { entity: 'employee', model: 'Employee', delegate: 'employee', route: 'employees', group: 'Employee Management', event: 'EMPLOYEE_CREATED' },
  { entity: 'employeeProfileExtension', model: 'EmployeeProfileExtension', delegate: 'employeeProfileExtension', route: 'employee-profile-extensions', group: 'Employee Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeSkill', model: 'EmployeeSkill', delegate: 'employeeSkill', route: 'employee-skills', group: 'Employee Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeDocument', model: 'EmployeeDocument', delegate: 'employeeDocument', route: 'employee-documents', group: 'Employee Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeHistory', model: 'EmployeeHistory', delegate: 'employeeHistory', route: 'employee-history', group: 'Employee Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeRelationship', model: 'EmployeeRelationship', delegate: 'employeeRelationship', route: 'employee-relationships', group: 'Employee Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'jobRequisition', model: 'JobRequisition', delegate: 'jobRequisition', route: 'job-requisitions', group: 'Recruitment ATS', event: 'JOB_POSTED' },
  { entity: 'jobPosting', model: 'JobPosting', delegate: 'jobPosting', route: 'job-postings', group: 'Recruitment ATS', event: 'JOB_POSTED' },
  { entity: 'candidate', model: 'Candidate', delegate: 'candidate', route: 'candidates', group: 'Recruitment ATS', event: 'CANDIDATE_APPLIED' },
  { entity: 'candidateProfile', model: 'CandidateProfile', delegate: 'candidateProfile', route: 'candidate-profiles', group: 'Recruitment ATS', event: 'CANDIDATE_APPLIED' },
  { entity: 'interview', model: 'Interview', delegate: 'interview', route: 'interviews', group: 'Recruitment ATS', event: 'INTERVIEW_COMPLETED' },
  { entity: 'interviewFeedback', model: 'InterviewFeedback', delegate: 'interviewFeedback', route: 'interview-feedback', group: 'Recruitment ATS', event: 'INTERVIEW_COMPLETED' },
  { entity: 'offerLetter', model: 'OfferLetter', delegate: 'offerLetter', route: 'offer-letters', group: 'Recruitment ATS', event: 'CANDIDATE_APPLIED' },
  { entity: 'hiringPipeline', model: 'HiringPipeline', delegate: 'hiringPipeline', route: 'hiring-pipelines', group: 'Recruitment ATS', event: 'CANDIDATE_APPLIED' },
  { entity: 'onboardingWorkflow', model: 'OnboardingWorkflow', delegate: 'onboardingWorkflow', route: 'onboarding-workflows', group: 'Employee Onboarding', event: 'EMPLOYEE_ONBOARDED' },
  { entity: 'onboardingTask', model: 'OnboardingTask', delegate: 'onboardingTask', route: 'onboarding-tasks', group: 'Employee Onboarding', event: 'EMPLOYEE_ONBOARDED' },
  { entity: 'onboardingChecklist', model: 'OnboardingChecklist', delegate: 'onboardingChecklist', route: 'onboarding-checklists', group: 'Employee Onboarding', event: 'EMPLOYEE_ONBOARDED' },
  { entity: 'employeeEquipment', model: 'EmployeeEquipment', delegate: 'employeeEquipment', route: 'employee-equipment', group: 'Employee Onboarding', event: 'EMPLOYEE_ONBOARDED' },
  { entity: 'policyAcknowledgement', model: 'PolicyAcknowledgement', delegate: 'policyAcknowledgement', route: 'policy-acknowledgements', group: 'Employee Onboarding', event: 'EMPLOYEE_ONBOARDED' },
  { entity: 'attendance', model: 'Attendance', delegate: 'attendance', route: 'attendance', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'attendanceLog', model: 'AttendanceLog', delegate: 'attendanceLog', route: 'attendance-logs', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'leaveRequest', model: 'LeaveRequest', delegate: 'leaveRequest', route: 'leave-requests', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'leaveBalance', model: 'LeaveBalance', delegate: 'leaveBalance', route: 'leave-balances', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'holidayCalendar', model: 'HolidayCalendar', delegate: 'holidayCalendar', route: 'holiday-calendars', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'shiftSchedule', model: 'ShiftSchedule', delegate: 'shiftSchedule', route: 'shift-schedules', group: 'Attendance and Leave Management', event: 'EMPLOYEE_UPDATED' },
  { entity: 'performanceReview', model: 'PerformanceReview', delegate: 'performanceReview', route: 'performance-reviews', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'performanceGoal', model: 'PerformanceGoal', delegate: 'performanceGoal', route: 'performance-goals', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'performanceCycle', model: 'PerformanceCycle', delegate: 'performanceCycle', route: 'performance-cycles', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'feedbackRecord', model: 'FeedbackRecord', delegate: 'feedbackRecord', route: 'feedback-records', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'developmentPlan', model: 'DevelopmentPlan', delegate: 'developmentPlan', route: 'development-plans', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'competencyAssessment', model: 'CompetencyAssessment', delegate: 'competencyAssessment', route: 'competency-assessments', group: 'Performance Management', event: 'PERFORMANCE_REVIEW_COMPLETED' },
  { entity: 'course', model: 'Course', delegate: 'course', route: 'courses', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'learningPath', model: 'LearningPath', delegate: 'learningPath', route: 'learning-paths', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'enrollment', model: 'Enrollment', delegate: 'enrollment', route: 'enrollments', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'assessment', model: 'Assessment', delegate: 'assessment', route: 'assessments', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'certification', model: 'Certification', delegate: 'certification', route: 'certifications', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'skillDevelopmentPlan', model: 'SkillDevelopmentPlan', delegate: 'skillDevelopmentPlan', route: 'skill-development-plans', group: 'Learning Management System', event: 'COURSE_COMPLETED' },
  { entity: 'compensationPlan', model: 'CompensationPlan', delegate: 'compensationPlan', route: 'compensation-plans', group: 'Compensation Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'salaryBand', model: 'SalaryBand', delegate: 'salaryBand', route: 'salary-bands', group: 'Compensation Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'bonusPlan', model: 'BonusPlan', delegate: 'bonusPlan', route: 'bonus-plans', group: 'Compensation Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'promotionPlan', model: 'PromotionPlan', delegate: 'promotionPlan', route: 'promotion-plans', group: 'Compensation Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'compensationHistory', model: 'CompensationHistory', delegate: 'compensationHistory', route: 'compensation-history', group: 'Compensation Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'workforcePlan', model: 'WorkforcePlan', delegate: 'workforcePlan', route: 'workforce-plans', group: 'Workforce Planning', event: 'EMPLOYEE_UPDATED' },
  { entity: 'headcountForecast', model: 'HeadcountForecast', delegate: 'headcountForecast', route: 'headcount-forecasts', group: 'Workforce Planning', event: 'EMPLOYEE_UPDATED' },
  { entity: 'workforceCapacityForecast', model: 'WorkforceCapacityForecast', delegate: 'workforceCapacityForecast', route: 'workforce-capacity-forecasts', group: 'Workforce Planning', event: 'EMPLOYEE_UPDATED' },
  { entity: 'hiringForecast', model: 'HiringForecast', delegate: 'hiringForecast', route: 'hiring-forecasts', group: 'Workforce Planning', event: 'EMPLOYEE_UPDATED' },
  { entity: 'resourceForecast', model: 'ResourceForecast', delegate: 'resourceForecast', route: 'resource-forecasts', group: 'Workforce Planning', event: 'EMPLOYEE_UPDATED' },
  { entity: 'talentProfile', model: 'TalentProfile', delegate: 'talentProfile', route: 'talent-profiles', group: 'Talent Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'talentScore', model: 'TalentScore', delegate: 'talentScore', route: 'talent-scores', group: 'Talent Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'successionPlan', model: 'SuccessionPlan', delegate: 'successionPlan', route: 'succession-plans', group: 'Talent Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'retentionRisk', model: 'RetentionRisk', delegate: 'retentionRisk', route: 'retention-risks', group: 'Talent Intelligence', event: 'RETENTION_RISK_DETECTED' },
  { entity: 'leadershipCandidate', model: 'LeadershipCandidate', delegate: 'leadershipCandidate', route: 'leadership-candidates', group: 'Talent Intelligence', event: 'PROMOTION_APPROVED' },
  { entity: 'employeeDashboard', model: 'EmployeeDashboard', delegate: 'employeeDashboard', route: 'employee-dashboards', group: 'Employee Experience Platform', event: 'EMPLOYEE_UPDATED' },
  { entity: 'careerPath', model: 'CareerPath', delegate: 'careerPath', route: 'career-paths', group: 'Employee Experience Platform', event: 'EMPLOYEE_UPDATED' },
  { entity: 'internalOpportunity', model: 'InternalOpportunity', delegate: 'internalOpportunity', route: 'internal-opportunities', group: 'Employee Experience Platform', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeFeedback', model: 'EmployeeFeedback', delegate: 'employeeFeedback', route: 'employee-feedback', group: 'Employee Experience Platform', event: 'EMPLOYEE_UPDATED' },
  { entity: 'employeeEngagement', model: 'EmployeeEngagement', delegate: 'employeeEngagement', route: 'employee-engagement', group: 'Employee Experience Platform', event: 'EMPLOYEE_UPDATED' },
  { entity: 'organizationStructure', model: 'OrganizationStructure', delegate: 'organizationStructure', route: 'organization-structures', group: 'Organizational Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'reportingLine', model: 'ReportingLine', delegate: 'reportingLine', route: 'reporting-lines', group: 'Organizational Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'teamAnalytics', model: 'TeamAnalytics', delegate: 'teamAnalytics', route: 'team-analytics', group: 'Organizational Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'organizationInsight', model: 'OrganizationInsight', delegate: 'organizationInsight', route: 'organization-insights', group: 'Organizational Intelligence', event: 'EMPLOYEE_UPDATED' },
  { entity: 'hrCopilotQuery', model: 'HrCopilotQuery', delegate: 'hrCopilotQuery', route: 'queries', group: 'AI HR Copilot', event: 'HR_COPILOT_QUERIED' },
  { entity: 'hrRecommendation', model: 'HrRecommendation', delegate: 'hrRecommendation', route: 'recommendations', group: 'AI HR Copilot', event: 'HR_RECOMMENDATION_CREATED' },
];

export const WORKFORCE_GROUPS = {
  'Employee Management': { apiGroup: '/v1/employee-management', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Employee Management') },
  'Recruitment ATS': { apiGroup: '/v1/recruitment-ats', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Recruitment ATS') },
  'Employee Onboarding': { apiGroup: '/v1/employee-onboarding', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Employee Onboarding') },
  'Attendance and Leave Management': { apiGroup: '/v1/attendance-leave', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Attendance and Leave Management') },
  'Performance Management': { apiGroup: '/v1/performance-management', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Performance Management') },
  'Learning Management System': { apiGroup: '/v1/learning-management', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Learning Management System') },
  'Compensation Intelligence': { apiGroup: '/v1/compensation-intelligence', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Compensation Intelligence') },
  'Workforce Planning': { apiGroup: '/v1/workforce-planning', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Workforce Planning') },
  'Talent Intelligence': { apiGroup: '/v1/talent-intelligence', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Talent Intelligence') },
  'Employee Experience Platform': { apiGroup: '/v1/employee-experience', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Employee Experience Platform') },
  'Organizational Intelligence': { apiGroup: '/v1/organizational-intelligence', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'Organizational Intelligence') },
  'AI HR Copilot': { apiGroup: '/v1/ai-hr-copilot', entities: WORKFORCE_ENTITIES.filter((entity) => entity.group === 'AI HR Copilot') },
} as const;

export function getWorkforceEntity(entity: WorkforceEntity) {
  const definition = WORKFORCE_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown workforce entity: ' + entity);
  return definition;
}

