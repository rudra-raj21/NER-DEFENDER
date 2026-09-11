import { create } from 'zustand';

export type SidebarTab = 'risk' | 'weather' | 'roads' | 'alerts' | 'crowdsource';

interface UIState {
  activeTab: SidebarTab;
  isReportModalOpen: boolean;
  isSidebarOpen: boolean;
  setActiveTab: (tab: SidebarTab) => void;
  setReportModalOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'risk',
  isReportModalOpen: false,
  isSidebarOpen: true,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setReportModalOpen: (open) => set({ isReportModalOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
}));
