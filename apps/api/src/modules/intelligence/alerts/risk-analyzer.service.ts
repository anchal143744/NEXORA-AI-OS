import { Injectable } from '@nestjs/common';
@Injectable()
export class RiskAnalyzer { classify(score: number) { return score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW'; } }
