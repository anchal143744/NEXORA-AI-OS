import { create } from 'zustand';

type CopilotMode = 'floating' | 'docked';

type ShellState = {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  commandOpen: boolean;
  copilotOpen: boolean;
  copilotMinimized: boolean;
  copilotMode: CopilotMode;
  notificationsOpen: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  setMobileSidebarOpen: (value: boolean) => void;
  setCommandOpen: (value: boolean) => void;
  setCopilotOpen: (value: boolean) => void;
  setCopilotMinimized: (value: boolean) => void;
  setCopilotMode: (value: CopilotMode) => void;
  setNotificationsOpen: (value: boolean) => void;
};

export const useShellStore = create<ShellState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  commandOpen: false,
  copilotOpen: false,
  copilotMinimized: false,
  copilotMode: 'floating',
  notificationsOpen: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setCopilotOpen: (copilotOpen) => set({ copilotOpen }),
  setCopilotMinimized: (copilotMinimized) => set({ copilotMinimized }),
  setCopilotMode: (copilotMode) => set({ copilotMode }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
}));
