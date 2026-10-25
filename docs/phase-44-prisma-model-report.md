# Phase 44 Prisma Model Report

Version: 0.44.0
Date: 2026-06-14

## Models Added

- Employee
- EmployeeProfileExtension
- EmployeeSkill
- EmployeeDocument
- EmployeeHistory
- EmployeeRelationship
- JobRequisition
- JobPosting
- Candidate
- CandidateProfile
- Interview
- InterviewFeedback
- OfferLetter
- HiringPipeline
- OnboardingWorkflow
- OnboardingTask
- OnboardingChecklist
- EmployeeEquipment
- PolicyAcknowledgement
- Attendance
- AttendanceLog
- LeaveRequest
- LeaveBalance
- HolidayCalendar
- ShiftSchedule
- PerformanceReview
- PerformanceGoal
- PerformanceCycle
- FeedbackRecord
- DevelopmentPlan
- CompetencyAssessment
- Course
- LearningPath
- Enrollment
- Assessment
- Certification
- SkillDevelopmentPlan
- CompensationPlan
- SalaryBand
- BonusPlan
- PromotionPlan
- CompensationHistory
- WorkforcePlan
- HeadcountForecast
- WorkforceCapacityForecast
- HiringForecast
- ResourceForecast
- TalentProfile
- TalentScore
- SuccessionPlan
- RetentionRisk
- LeadershipCandidate
- EmployeeDashboard
- CareerPath
- InternalOpportunity
- EmployeeFeedback
- EmployeeEngagement
- OrganizationStructure
- ReportingLine
- TeamAnalytics
- OrganizationInsight
- HrCopilotQuery
- HrRecommendation

## Collision-Safe Reuse

- EmployeeProfile already existed from earlier HR foundations, so Phase 44 adds EmployeeProfileExtension instead of duplicating the Prisma model name.
- CapacityForecast already existed from strategic forecasting, so Phase 44 adds WorkforceCapacityForecast for HR-specific capacity planning.

## Model Count

- Previous total: 493
- Phase 44 added: 63
- Updated total: 556

## Data Contract

Each Phase 44 model includes UUID identity, tenantId, workspaceId, recordKey, lifecycle dates, HR actor/reference fields, score, confidence, riskLevel, payload, metrics, recommendations, metadata, timestamps, soft delete and enterprise indexes.

