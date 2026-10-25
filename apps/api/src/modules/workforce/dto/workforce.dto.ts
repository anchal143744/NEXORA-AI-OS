import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectEmployeeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() managerEmployeeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() candidateId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobRequisitionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobPostingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() courseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cycleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
}

export class CreateEmployeeDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeAttributes?: Record<string, unknown>;
}

export class CreateEmployeeProfileExtensionDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeProfileExtensionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeProfileExtensionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeProfileExtensionAttributes?: Record<string, unknown>;
}

export class CreateEmployeeSkillDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeSkillCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeSkillOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeSkillAttributes?: Record<string, unknown>;
}

export class CreateEmployeeDocumentDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeDocumentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeDocumentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeDocumentAttributes?: Record<string, unknown>;
}

export class CreateEmployeeHistoryDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeHistoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeHistoryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeHistoryAttributes?: Record<string, unknown>;
}

export class CreateEmployeeRelationshipDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeRelationshipCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeRelationshipOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeRelationshipAttributes?: Record<string, unknown>;
}

export class CreateJobRequisitionDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() jobRequisitionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobRequisitionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() jobRequisitionAttributes?: Record<string, unknown>;
}

export class CreateJobPostingDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() jobPostingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobPostingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() jobPostingAttributes?: Record<string, unknown>;
}

export class CreateCandidateDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() candidateCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() candidateOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() candidateAttributes?: Record<string, unknown>;
}

export class CreateCandidateProfileDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() candidateProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() candidateProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() candidateProfileAttributes?: Record<string, unknown>;
}

export class CreateInterviewDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() interviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() interviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() interviewAttributes?: Record<string, unknown>;
}

export class CreateInterviewFeedbackDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() interviewFeedbackCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() interviewFeedbackOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() interviewFeedbackAttributes?: Record<string, unknown>;
}

export class CreateOfferLetterDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() offerLetterCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() offerLetterOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() offerLetterAttributes?: Record<string, unknown>;
}

export class CreateHiringPipelineDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hiringPipelineCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hiringPipelineOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() hiringPipelineAttributes?: Record<string, unknown>;
}

export class CreateOnboardingWorkflowDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingWorkflowCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingWorkflowOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() onboardingWorkflowAttributes?: Record<string, unknown>;
}

export class CreateOnboardingTaskDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingTaskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingTaskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() onboardingTaskAttributes?: Record<string, unknown>;
}

export class CreateOnboardingChecklistDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingChecklistCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() onboardingChecklistOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() onboardingChecklistAttributes?: Record<string, unknown>;
}

export class CreateEmployeeEquipmentDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeEquipmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeEquipmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeEquipmentAttributes?: Record<string, unknown>;
}

export class CreatePolicyAcknowledgementDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() policyAcknowledgementCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyAcknowledgementOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() policyAcknowledgementAttributes?: Record<string, unknown>;
}

export class CreateAttendanceDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() attendanceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attendanceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() attendanceAttributes?: Record<string, unknown>;
}

export class CreateAttendanceLogDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() attendanceLogCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attendanceLogOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() attendanceLogAttributes?: Record<string, unknown>;
}

export class CreateLeaveRequestDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() leaveRequestCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leaveRequestOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() leaveRequestAttributes?: Record<string, unknown>;
}

export class CreateLeaveBalanceDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() leaveBalanceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leaveBalanceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() leaveBalanceAttributes?: Record<string, unknown>;
}

export class CreateHolidayCalendarDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() holidayCalendarCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() holidayCalendarOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() holidayCalendarAttributes?: Record<string, unknown>;
}

export class CreateShiftScheduleDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() shiftScheduleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shiftScheduleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() shiftScheduleAttributes?: Record<string, unknown>;
}

export class CreatePerformanceReviewDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceReviewAttributes?: Record<string, unknown>;
}

export class CreatePerformanceGoalDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceGoalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceGoalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceGoalAttributes?: Record<string, unknown>;
}

export class CreatePerformanceCycleDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() performanceCycleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() performanceCycleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() performanceCycleAttributes?: Record<string, unknown>;
}

export class CreateFeedbackRecordDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() feedbackRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() feedbackRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() feedbackRecordAttributes?: Record<string, unknown>;
}

export class CreateDevelopmentPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() developmentPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() developmentPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() developmentPlanAttributes?: Record<string, unknown>;
}

export class CreateCompetencyAssessmentDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() competencyAssessmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() competencyAssessmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() competencyAssessmentAttributes?: Record<string, unknown>;
}

export class CreateCourseDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() courseCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() courseOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() courseAttributes?: Record<string, unknown>;
}

export class CreateLearningPathDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() learningPathCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() learningPathOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() learningPathAttributes?: Record<string, unknown>;
}

export class CreateEnrollmentDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enrollmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enrollmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enrollmentAttributes?: Record<string, unknown>;
}

export class CreateAssessmentDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assessmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assessmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assessmentAttributes?: Record<string, unknown>;
}

export class CreateCertificationDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() certificationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() certificationAttributes?: Record<string, unknown>;
}

export class CreateSkillDevelopmentPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() skillDevelopmentPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() skillDevelopmentPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() skillDevelopmentPlanAttributes?: Record<string, unknown>;
}

export class CreateCompensationPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() compensationPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() compensationPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() compensationPlanAttributes?: Record<string, unknown>;
}

export class CreateSalaryBandDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() salaryBandCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salaryBandOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() salaryBandAttributes?: Record<string, unknown>;
}

export class CreateBonusPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() bonusPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bonusPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() bonusPlanAttributes?: Record<string, unknown>;
}

export class CreatePromotionPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() promotionPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() promotionPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() promotionPlanAttributes?: Record<string, unknown>;
}

export class CreateCompensationHistoryDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() compensationHistoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() compensationHistoryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() compensationHistoryAttributes?: Record<string, unknown>;
}

export class CreateWorkforcePlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workforcePlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workforcePlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workforcePlanAttributes?: Record<string, unknown>;
}

export class CreateHeadcountForecastDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() headcountForecastCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headcountForecastOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() headcountForecastAttributes?: Record<string, unknown>;
}

export class CreateWorkforceCapacityForecastDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workforceCapacityForecastCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workforceCapacityForecastOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workforceCapacityForecastAttributes?: Record<string, unknown>;
}

export class CreateHiringForecastDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hiringForecastCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hiringForecastOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() hiringForecastAttributes?: Record<string, unknown>;
}

export class CreateResourceForecastDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() resourceForecastCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceForecastOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() resourceForecastAttributes?: Record<string, unknown>;
}

export class CreateTalentProfileDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() talentProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() talentProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() talentProfileAttributes?: Record<string, unknown>;
}

export class CreateTalentScoreDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() talentScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() talentScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() talentScoreAttributes?: Record<string, unknown>;
}

export class CreateSuccessionPlanDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() successionPlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successionPlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() successionPlanAttributes?: Record<string, unknown>;
}

export class CreateRetentionRiskDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() retentionRiskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() retentionRiskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() retentionRiskAttributes?: Record<string, unknown>;
}

export class CreateLeadershipCandidateDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() leadershipCandidateCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leadershipCandidateOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() leadershipCandidateAttributes?: Record<string, unknown>;
}

export class CreateEmployeeDashboardDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeDashboardCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeDashboardOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeDashboardAttributes?: Record<string, unknown>;
}

export class CreateCareerPathDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() careerPathCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() careerPathOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() careerPathAttributes?: Record<string, unknown>;
}

export class CreateInternalOpportunityDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() internalOpportunityCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() internalOpportunityOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() internalOpportunityAttributes?: Record<string, unknown>;
}

export class CreateEmployeeFeedbackDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeFeedbackCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeFeedbackOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeFeedbackAttributes?: Record<string, unknown>;
}

export class CreateEmployeeEngagementDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeEngagementCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeEngagementOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeEngagementAttributes?: Record<string, unknown>;
}

export class CreateOrganizationStructureDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() organizationStructureCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizationStructureOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() organizationStructureAttributes?: Record<string, unknown>;
}

export class CreateReportingLineDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() reportingLineCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reportingLineOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() reportingLineAttributes?: Record<string, unknown>;
}

export class CreateTeamAnalyticsDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() teamAnalyticsCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamAnalyticsOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() teamAnalyticsAttributes?: Record<string, unknown>;
}

export class CreateOrganizationInsightDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() organizationInsightCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizationInsightOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() organizationInsightAttributes?: Record<string, unknown>;
}

export class CreateHrCopilotQueryDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hrCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hrCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() hrCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateHrRecommendationDto extends CreateWorkforceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hrRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hrRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() hrRecommendationAttributes?: Record<string, unknown>;
}

