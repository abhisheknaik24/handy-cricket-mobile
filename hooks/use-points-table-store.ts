import { create } from 'zustand';

export type PointsTableType = Array<{
  teamId: number;
  teamName: string;
  totalMatches: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  runRate: number;
}>;

interface PointsTableStore {
  pointsTable: PointsTableType;
  setPointsTable: (pointsTable: PointsTableType) => void;
}

export const usePointsTable = create<PointsTableStore>((set) => ({
  pointsTable: [],
  setPointsTable: (pointsTable) => set({ pointsTable }),
}));
