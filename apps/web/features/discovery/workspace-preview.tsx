'use client';

import { Eye, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function WorkspacePreview() {
  const blueprint = useDiscoveryStore((state) => state.blueprint);

  if (!blueprint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="size-4 text-gold-300" />Workspace Preview</CardTitle>
          <CardDescription>Generate a blueprint to preview the workspace before creation.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LayoutGrid className="size-4 text-gold-300" />Workspace Preview</CardTitle>
        <CardDescription>{blueprint.workspaceName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">{blueprint.navigation.map((item) => <Badge key={item} variant="neutral">{item}</Badge>)}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Layer</TableHead>
              <TableHead>Generated items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Modules', blueprint.modules.map((item) => item.label).join(', ')],
              ['KPIs', blueprint.kpis.map((item) => item.label).join(', ')],
              ['Workflows', blueprint.workflows.map((item) => item.label).join(', ')],
              ['Agents', blueprint.agents.map((item) => item.label).join(', ')],
            ].map(([layer, items]) => (
              <TableRow key={layer}>
                <TableCell className="font-semibold text-white">{layer}</TableCell>
                <TableCell>{items}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
