'use client';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/providers/workspace-provider';
export function OrganizationSwitcher() { const workspace = useWorkspace(); return <Button variant="ghost" className="max-w-[220px]"><Building2 className="size-4" /><span className="truncate">{workspace.organizationName}</span></Button>; }
