import { create } from 'zustand';

export type TabType = 'tournaments' | 'teams';

interface TabStore {
  tab: TabType | null;
  setTab: (tab: TabType) => void;
}

export const useTab = create<TabStore>((set) => ({
  tab: null,
  setTab: (tab) => set({ tab }),
}));
