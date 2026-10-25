import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartKpiEngine } from './smart-kpi-engine';
import { AiInsightCenter } from './ai-insight-center';

export function ExecutiveDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BarChart3 className="size-4 text-gold-300" />Executive Dashboard</CardTitle>
        <CardDescription>Command-level KPIs and AI insights for the first workspace launch.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SmartKpiEngine />
        <AiInsightCenter />
      </CardContent>
    </Card>
  );
}
