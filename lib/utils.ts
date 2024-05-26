import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const calculateRunRate = (matches: any, team: any): number => {
  let totalRuns: number = matches.reduce((total: number, match: any) => {
    let data = 0;

    if (team.id === match.teamOneId) {
      data += match.teamOneScore || 0;
    }

    if (team.id === match.teamTwoId) {
      data += match.teamTwoScore || 0;
    }

    return total + data;
  }, 0);

  let totalWickets: number = matches.reduce((total: number, match: any) => {
    let data = 0;

    if (team.id === match.teamOneId) {
      data += match.teamOneWickets || 0;
    }

    if (team.id === match.teamTwoId) {
      data += match.teamTwoWickets || 0;
    }

    return total + data;
  }, 0);

  return totalRuns / totalWickets;
};
