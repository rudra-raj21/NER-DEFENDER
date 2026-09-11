import { create } from 'zustand';

export interface AlertLogItem {
  id: string;
  area_name: string;
  message: string;
  timestamp: string;
}

interface AlertStoreState {
  activeModalMessage: string | null;
  alertLogs: AlertLogItem[];
  triggerAlert: (areaName: string) => void;
  clearModal: () => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  activeModalMessage: null,
  alertLogs: [
    {
      id: '1',
      area_name: 'East Khasi Hills',
      message: 'Alert sent to relevant authorities regarding East Khasi Hills',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: '2',
      area_name: 'Sonapur Active Slide Area',
      message: 'Alert sent to relevant authorities regarding Sonapur Active Slide Area',
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  triggerAlert: (areaName: string) => {
    const exactMessage = `Alert sent to relevant authorities regarding ${areaName}`;
    const newLog: AlertLogItem = {
      id: Date.now().toString(),
      area_name: areaName,
      message: exactMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    set((state) => ({
      activeModalMessage: exactMessage,
      alertLogs: [newLog, ...state.alertLogs]
    }));
  },
  clearModal: () => set({ activeModalMessage: null })
}));
