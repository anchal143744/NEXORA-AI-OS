import { Injectable } from '@nestjs/common';
import { BusinessProfileDto } from '../dto/adaptive-workspace.dto';

export interface BusinessClassification {
  industry: string;
  businessType: string;
  country: string;
  revenueRange: string;
  teamSize: string;
  growthStage: string;
  goals: string[];
  operatingComplexity: 'lean' | 'standard' | 'complex' | 'global';
  recommendedDepth: 'starter' | 'growth' | 'enterprise';
}

@Injectable()
export class BusinessClassificationService {
  classify(profile: BusinessProfileDto): BusinessClassification {
    const complexTeams = ['201_1000', '1000_plus'].includes(profile.teamSize);
    const globalRevenue = ['10m_100m', '100m_plus'].includes(profile.revenueRange);
    const operatingComplexity = complexTeams && globalRevenue ? 'global' : complexTeams || globalRevenue ? 'complex' : profile.teamSize === 'solo' ? 'lean' : 'standard';
    const recommendedDepth = operatingComplexity === 'global' || operatingComplexity === 'complex' ? 'enterprise' : profile.growthStage === 'growth' || profile.growthStage === 'scale' ? 'growth' : 'starter';
    return { industry: profile.industry, businessType: profile.businessType, country: profile.country, revenueRange: profile.revenueRange, teamSize: profile.teamSize, growthStage: profile.growthStage, goals: profile.goals, operatingComplexity, recommendedDepth };
  }
}
