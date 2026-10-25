import { Injectable } from '@nestjs/common';
@Injectable()
export class PredictionEngine { scoreRisk(current: number, trendPercent: number, threshold: number) { const thresholdRisk = current < threshold ? 50 : 0; const trendRisk = trendPercent < 0 ? Math.min(50, Math.abs(trendPercent)) : 0; return Math.min(100, Math.round(thresholdRisk + trendRisk)); } }
