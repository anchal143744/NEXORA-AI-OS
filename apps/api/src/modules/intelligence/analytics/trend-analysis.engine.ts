import { Injectable } from '@nestjs/common';
@Injectable()
export class TrendAnalysisEngine { analyze(values: number[]) { if (!values.length) return { direction: 'flat', change: 0, slope: 0 }; const first = values[0]; const last = values[values.length-1]; const change = first === 0 ? 0 : Number((((last-first)/Math.abs(first))*100).toFixed(2)); return { direction: change > 2 ? 'up' : change < -2 ? 'down' : 'flat', change, slope: Number(((last-first)/Math.max(values.length-1,1)).toFixed(2)) }; } }
