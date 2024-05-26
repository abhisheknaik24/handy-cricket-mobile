import { create } from 'zustand';

export type TeamsType = Array<{
  id: number;
  logo: string;
  name: string;
}>;

export type MatchesType = Array<{
  id: number;
  teamOneId: number;
  teamOneLogo: string;
  teamOneName: string;
  teamTwoId: number;
  teamTwoLogo: string;
  teamTwoName: string;
  matchNo: number;
  type: 'normal' | 'semiFinal' | 'final';
  teamOneScore: number;
  teamOneWickets: number;
  teamOneBalls: number;
  teamTwoScore: number;
  teamTwoWickets: number;
  teamTwoBalls: number;
  winnerTeamId: number | null;
  losserTeamId: number | null;
  isMatchPlayed: boolean;
}>;

interface MainStore {
  tournamentId: number | null;
  teams: TeamsType;
  matches: MatchesType;
  matchId: number | null;
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
  setTournamentId: (tournamentId: number | null) => void;
  setTeams: (matches: TeamsType) => void;
  setMatches: (matches: MatchesType) => void;
  setMatchId: (tournamentId: number | null) => void;
  setPlayerTeamId: (playerTeamId: number) => void;
  setTossWinnerTeamId: (tossWinnerTeamId: number) => void;
  setInning: (inning: 'first' | 'second' | 'over') => void;
  setTeamsStatus: (
    teamOneStatus: 'bat' | 'bowl',
    teamTwoStatus: 'bat' | 'bowl'
  ) => void;
  setTeamOneScore: (teamOneScore: number) => void;
  setTeamOneWickets: (teamOneWickets: number) => void;
  setTeamOneBalls: (teamOneBalls: number) => void;
  setTeamTwoScore: (teamTwoScore: number) => void;
  setTeamTwoWickets: (teamTwoWickets: number) => void;
  setTeamTwoBalls: (teamTwoBalls: number) => void;
}

export const useMain = create<MainStore>((set) => ({
  tournamentId: null,
  teams: [],
  matches: [],
  matchId: null,
  playerTeamId: null,
  tossWinnerTeamId: null,
  inning: 'first',
  teamOneStatus: null,
  teamTwoStatus: null,
  teamOneScore: 0,
  teamOneWickets: 0,
  teamOneBalls: 30,
  teamTwoScore: 0,
  teamTwoWickets: 0,
  teamTwoBalls: 30,
  setTournamentId: (tournamentId) => set({ tournamentId }),
  setTeams: (teams) => set({ teams }),
  setMatches: (matches) => set({ matches }),
  setMatchId: (matchId) =>
    set({
      matchId,
      playerTeamId: null,
      tossWinnerTeamId: null,
      inning: 'first',
      teamOneStatus: null,
      teamTwoStatus: null,
      teamOneScore: 0,
      teamOneWickets: 0,
      teamOneBalls: 30,
      teamTwoScore: 0,
      teamTwoWickets: 0,
      teamTwoBalls: 30,
    }),
  setPlayerTeamId: (playerTeamId) => set({ playerTeamId }),
  setTossWinnerTeamId: (tossWinnerTeamId) => set({ tossWinnerTeamId }),
  setInning: (inning) => set({ inning }),
  setTeamsStatus: (teamOneStatus, teamTwoStatus) =>
    set({ teamOneStatus, teamTwoStatus }),
  setTeamOneScore: (teamOneScore) => set({ teamOneScore }),
  setTeamOneWickets: (teamOneWickets) => set({ teamOneWickets }),
  setTeamOneBalls: (teamOneBalls) => set({ teamOneBalls }),
  setTeamTwoScore: (teamTwoScore) => set({ teamTwoScore }),
  setTeamTwoWickets: (teamTwoWickets) => set({ teamTwoWickets }),
  setTeamTwoBalls: (teamTwoBalls) => set({ teamTwoBalls }),
}));
