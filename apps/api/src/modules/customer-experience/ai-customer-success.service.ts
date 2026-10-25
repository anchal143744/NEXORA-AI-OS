import { Injectable } from '@nestjs/common';
import { CustomerExperienceService } from './customer-experience.service';
import { CustomerSuccessService } from './customer-success.service';
import { RevenueEngagementService } from './revenue-engagement.service';
import { ServiceAutomationService } from './service-automation.service';

@Injectable()
export class AiCustomerSuccessService {
  constructor(private readonly experience: CustomerExperienceService, private readonly success: CustomerSuccessService, private readonly revenue: RevenueEngagementService, private readonly service: ServiceAutomationService) {}

  async healthInsights(customerIdentityId?: string) {
    const [risks, satisfaction, adoption] = await Promise.all([this.experience.riskDetection(customerIdentityId), this.experience.satisfaction(customerIdentityId), this.success.adoptionMonitoring(customerIdentityId)]);
    return { customerIdentityId, risks, satisfaction, adoption, insights: [{ type: 'health', recommendation: 'Prioritize customers with critical health and open service risks.' }] };
  }

  churnPredictions(customerIdentityId?: string) {
    return this.success.churnPrevention(customerIdentityId);
  }

  renewalRecommendations(customerIdentityId?: string) {
    return this.success.renewalRecommendations(customerIdentityId);
  }

  engagementRecommendations(customerIdentityId?: string) {
    return this.success.automatedFollowUps(customerIdentityId);
  }

  revenueExpansionSuggestions(customerIdentityId?: string) {
    return this.revenue.growthRecommendations(customerIdentityId);
  }

  async serviceOptimizationInsights() {
    const analytics = await this.service.serviceAnalytics();
    return { analytics, recommendations: [{ action: analytics.breachedSlaCount > 0 ? 'increase_sla_escalation_capacity' : 'maintain_service_capacity' }, { action: 'review_high_priority_ticket_paths' }] };
  }
}
