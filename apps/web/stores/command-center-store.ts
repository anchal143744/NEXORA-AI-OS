'use client';

import { create } from 'zustand';
import { createWorkspaceLaunchPlan, generateActivityTimeline, generateExecutiveKpis, generateInsights, generateNotifications, generatePersonalDashboards } from '@/lib/command-center';
import type { AiCommand, ActivityTimelineEvent, AiInsight, CommandNotification, ExecutiveKpi, PersonalDashboard, WorkspaceLaunchPlan } from '@/types/command-center';

type CommandCenterState = {
  launchPlan: WorkspaceLaunchPlan;
  kpis: ExecutiveKpi[];
  insights: AiInsight[];
  notifications: CommandNotification[];
  activity: ActivityTimelineEvent[];
  dashboards: PersonalDashboard[];
  commands: AiCommand[];
  selectedDashboard: string;
  setLaunchPlan: (plan: WorkspaceLaunchPlan) => void;
  addCommand: (command: AiCommand) => void;
  setSelectedDashboard: (dashboardId: string) => void;
  markTaskComplete: (taskId: string) => void;
};

const initialPlan = createWorkspaceLaunchPlan();

export const useCommandCenterStore = create<CommandCenterState>((set) => ({
  launchPlan: initialPlan,
  kpis: generateExecutiveKpis(initialPlan),
  insights: generateInsights(initialPlan),
  notifications: generateNotifications(initialPlan),
  activity: generateActivityTimeline(),
  dashboards: generatePersonalDashboards(),
  commands: [],
  selectedDashboard: 'owner',
  setLaunchPlan: (launchPlan) => set({ launchPlan, kpis: generateExecutiveKpis(launchPlan), insights: generateInsights(launchPlan), notifications: generateNotifications(launchPlan) }),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
  setSelectedDashboard: (selectedDashboard) => set({ selectedDashboard }),
  markTaskComplete: (taskId) =>
    set((state) => ({
      launchPlan: {
        ...state.launchPlan,
        tasks: state.launchPlan.tasks.map((task) => (task.id === taskId ? { ...task, status: 'complete' } : task)),
      },
    })),
}));
