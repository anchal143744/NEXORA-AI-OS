import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceRequestId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceCaseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() appointmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatcherUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() routePlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() routeStopId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() territoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slaPolicyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileDeviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() distanceKm?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() estimatedDurationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() actualDurationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() slaMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() slaRemainingMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() utilizationRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() firstTimeFixRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() serviceCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() travelCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() partsCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enRouteAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() arrivedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() breachedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() routeData?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() mobileState?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
}

export class CreateFieldServiceRegionDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRegionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRegionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceRegionAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceTerritoryDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceTerritoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceTerritoryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceTerritoryAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceRequestDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRequestCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRequestOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceRequestAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceCaseDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceCaseCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceCaseOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceCaseAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceAppointmentDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceAppointmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceAppointmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceAppointmentAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkOrderDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkOrderAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkOrderTaskDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderTaskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderTaskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkOrderTaskAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkOrderPartDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderPartCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderPartOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkOrderPartAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkOrderChecklistDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderChecklistCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderChecklistOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkOrderChecklistAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkOrderCompletionDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderCompletionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkOrderCompletionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkOrderCompletionAttributes?: Record<string, unknown>;
}

export class CreateDispatchBoardDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchBoardCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchBoardOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dispatchBoardAttributes?: Record<string, unknown>;
}

export class CreateDispatchAssignmentDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchAssignmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchAssignmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dispatchAssignmentAttributes?: Record<string, unknown>;
}

export class CreateDispatchRuleDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dispatchRuleAttributes?: Record<string, unknown>;
}

export class CreateDispatchExceptionDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchExceptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dispatchExceptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dispatchExceptionAttributes?: Record<string, unknown>;
}

export class CreateTechnicianProfileDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianProfileAttributes?: Record<string, unknown>;
}

export class CreateTechnicianSkillDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianSkillCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianSkillOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianSkillAttributes?: Record<string, unknown>;
}

export class CreateTechnicianCertificationDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianCertificationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianCertificationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianCertificationAttributes?: Record<string, unknown>;
}

export class CreateTechnicianAvailabilityDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianAvailabilityCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianAvailabilityOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianAvailabilityAttributes?: Record<string, unknown>;
}

export class CreateTechnicianPerformanceDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianPerformanceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianPerformanceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianPerformanceAttributes?: Record<string, unknown>;
}

export class CreateFieldRoutePlanDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRoutePlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRoutePlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldRoutePlanAttributes?: Record<string, unknown>;
}

export class CreateFieldRouteStopDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRouteStopCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRouteStopOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldRouteStopAttributes?: Record<string, unknown>;
}

export class CreateFieldRouteOptimizationDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRouteOptimizationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldRouteOptimizationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldRouteOptimizationAttributes?: Record<string, unknown>;
}

export class CreateTravelTimeEstimateDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() travelTimeEstimateCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() travelTimeEstimateOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() travelTimeEstimateAttributes?: Record<string, unknown>;
}

export class CreateMobileWorkSessionDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mobileWorkSessionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileWorkSessionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mobileWorkSessionAttributes?: Record<string, unknown>;
}

export class CreateMobileDeviceRegistrationDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mobileDeviceRegistrationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileDeviceRegistrationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mobileDeviceRegistrationAttributes?: Record<string, unknown>;
}

export class CreateOfflineJobQueueDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() offlineJobQueueCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() offlineJobQueueOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() offlineJobQueueAttributes?: Record<string, unknown>;
}

export class CreateMobileSyncEventDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mobileSyncEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobileSyncEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mobileSyncEventAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceSlaPolicyDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaPolicyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaPolicyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceSlaPolicyAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceSlaCommitmentDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaCommitmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaCommitmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceSlaCommitmentAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceSlaBreachDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaBreachCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceSlaBreachOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceSlaBreachAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceEscalationDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceEscalationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceEscalationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceEscalationAttributes?: Record<string, unknown>;
}

export class CreateCustomerServiceVisitDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceVisitCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceVisitOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerServiceVisitAttributes?: Record<string, unknown>;
}

export class CreateCustomerServiceFeedbackDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceFeedbackCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceFeedbackOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerServiceFeedbackAttributes?: Record<string, unknown>;
}

export class CreateCustomerServiceResolutionDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceResolutionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceResolutionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerServiceResolutionAttributes?: Record<string, unknown>;
}

export class CreateCustomerServiceInsightDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceInsightCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerServiceInsightOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerServiceInsightAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkforceMetricDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkforceMetricCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkforceMetricOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkforceMetricAttributes?: Record<string, unknown>;
}

export class CreateFieldWorkforceAnalyticsSnapshotDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkforceAnalyticsSnapshotCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldWorkforceAnalyticsSnapshotOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldWorkforceAnalyticsSnapshotAttributes?: Record<string, unknown>;
}

export class CreateTechnicianUtilizationRecordDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() technicianUtilizationRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() technicianUtilizationRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() technicianUtilizationRecordAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceForecastDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceForecastCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceForecastOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceForecastAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceCopilotQueryDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceRecommendationDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceRecommendationAttributes?: Record<string, unknown>;
}

export class CreateFieldServiceRiskSignalDto extends CreateFieldServiceRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRiskSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fieldServiceRiskSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() fieldServiceRiskSignalAttributes?: Record<string, unknown>;
}

