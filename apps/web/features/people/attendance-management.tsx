'use client';

import { Clock3, LogIn, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function AttendanceManagement() {
  const attendance = usePeopleWorkspaceStore((state) => state.attendance);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Management</CardTitle>
        <CardDescription>Check in, check out, attendance history and daily reports without complexity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button size="sm"><LogIn className="size-4" />Check in</Button>
          <Button size="sm" variant="outline"><LogOut className="size-4" />Check out</Button>
        </div>
        <div className="grid gap-3 xl:grid-cols-5">
          {attendance.map((record) => (
            <article key={record.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <Clock3 className="size-4 text-gold-200" />
              <div className="mt-3 text-sm font-semibold text-white">{record.employeeName}</div>
              <div className="mt-1 text-xs text-graphite-400">{record.location}</div>
              <Badge className="mt-3" variant={record.status === 'late' ? 'warning' : record.status === 'checked_in' ? 'success' : 'neutral'}>{record.status.replace('_', ' ')}</Badge>
              <div className="mt-3 grid gap-1 text-xs text-graphite-300">
                <span>In: {record.checkIn}</span>
                <span>Out: {record.checkOut}</span>
                <span>Hours: {record.hours}</span>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
