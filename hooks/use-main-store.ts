import { create } from 'zustand';

export type TournamentType = {
  id: number;
  name: string;
  teams: string;
};

export type TeamsType = Array<{
  id: number;
  logo: string;
  name: string;
}>;

export type MatchType = {
  id: number;
  teamOneId: number;
  teamOneLogo: string;
  teamOneName: string;
  teamTwoId: number;
  teamTwoLogo: string;
  teamTwoName: string;
  matchNo: number;
  type: 'normal' | 'semiFinal' | 'final';
  playerTeamId: number | null;
  tossWinnerTeamId: number | null;
  inning: 'first' | 'second' | 'over';
  teamOneStatus: 'bat' | 'bowl' | null;
  teamTwoStatus: 'bat' | 'bowl' | null;
  teamOneScore: number;
  teamOneWickets: number;
  teamOneBalls: number;
  teamTwoScore: number;
  teamTwoWickets: number;
  teamTwoBalls: number;
  winnerTeamId: number | null;
  losserTeamId: number | null;
  isMatchPlayed: boolean;
};

export type MatchesType = Array<MatchType>;

interface MainStore {
  tournament: TournamentType | null;
  teams: TeamsType;
  matches: MatchesType;
  matchId: number | null;
  setTournament: (tournament: TournamentType | null) => void;
  setTeams: (teams: TeamsType) => void;
  setMatches: (matches: MatchesType) => void;
  setMatchId: (matchId: number | null) => void;
}

export const useMain = create<MainStore>((set) => ({
  tournament: null,
  teams: [],
  matches: [],
  matchId: null,
  setTournament: (tournament) => set({ tournament }),
  setTeams: (teams) => set({ teams }),
  setMatches: (matches) => set({ matches }),
  setMatchId: (matchId) => set({ matchId }),
}));
