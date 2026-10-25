'use client';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/providers/workspace-provider';
export function WorkspaceSwitcher() { const workspace = useWorkspace(); return <Button variant="subtle" className="max-w-[240px] justify-between"><span className="truncate">{workspace.workspaceName}</span><ChevronsUpDown className="size-4" /></Button>; }
