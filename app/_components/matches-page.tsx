import { MatchesType, useMain } from '@/hooks/use-main-store';
import {
  PointsTableType,
  usePointsTable,
} from '@/hooks/use-points-table-store';
import { calculateRunRate, cn, shuffleArray } from '@/lib/utils';
import { Preferences } from '@capacitor/preferences';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import teams from '../../data/teams.json';
import tournaments from '../../data/tournaments.json';
import { Header } from './header';
import { MatchPage } from './match-page';
import { PointsTable } from './points-table';

export const MatchesPage = () => {
  const {
    tournamentId,
    matches: tournamentMatches,
    matchId,
    setTournamentId,
    setMatches,
    setMatchId,
  } = useMain();

  const { pointsTable, setPointsTable } = usePointsTable();

  const [showPointsTable, setShowPointsTable] = useState(false);

  const tournament = tournaments?.tournaments?.find(
    (tournament) => tournament?.id === tournamentId
  );

  const totalMatchesPlayedCount: number = tournamentMatches?.filter(
    (match) => match?.isMatchPlayed
  )?.length;

  const handleMatchesSyncClick = async () => {
    if (
      tournamentMatches?.length === totalMatchesPlayedCount &&
      !!teams?.teams?.length
    ) {
      let no: number = 1;

      const matches: any = [];

      teams.teams.forEach((teamOne) => {
        teams.teams.forEach((teamTwo) => {
          const matchExist = matches?.find(
            (match: any) =>
              (match?.teamOneId === teamOne?.id &&
                match?.teamTwoId === teamTwo?.id) ||
              (match?.teamOneId === teamTwo?.id &&
                match?.teamTwoId === teamOne?.id)
          );

          if (teamOne?.id !== teamTwo?.id && !matchExist) {
            matches.push({
              id: no,
              teamOneId: teamOne.id,
              teamTwoId: teamTwo.id,
              type: 'normal',
              teamOneScore: 0,
              teamOneWickets: 0,
              teamOneBalls: 30,
              teamTwoScore: 0,
              teamTwoWickets: 0,
              teamTwoBalls: 30,
              winnerTeamId: null,
              losserTeamId: null,
              isMatchPlayed: false,
            });

            no += 1;
          }
        });
      });

      const shuffledMatches: any = shuffleArray(matches);

      const data: MatchesType = shuffledMatches?.map(
        (match: any, index: number) => ({
          ...match,
          matchNo: index + 1,
        })
      );

      await Preferences.set({
        key: 'matches',
        value: JSON.stringify({
          matches: data,
        }),
      });

      setMatches(data);
    }
  };

  useEffect(() => {
    const getMatches = async () => {
      const ret = await Preferences.get({
        key: 'matches',
      });

      const data = await JSON.parse(ret?.value!);

      setMatches(data?.matches);
    };

    getMatches();
  }, [setMatches]);

  useEffect(() => {
    if (!!tournamentMatches?.length) {
      const data: PointsTableType = teams.teams.map((team) => {
        const wins = tournamentMatches.filter((match) => {
          if (
            (team.id === match.teamOneId || team.id === match.teamTwoId) &&
            team.id === match.winnerTeamId
          )
            return match;
        }).length;

        return {
          teamId: team.id,
          teamName: team.name,
          totalMatches: tournamentMatches.filter((match) => {
            if (team.id === match.teamOneId || team.id === match.teamTwoId)
              return match;
          }).length,
          matchesPlayed: tournamentMatches.filter((match) => {
            if (
              (team.id === match.teamOneId || team.id === match.teamTwoId) &&
              match.isMatchPlayed
            )
              return match;
          }).length,
          wins: wins,
          points: wins * 2,
          losses: tournamentMatches.filter((match) => {
            if (
              (team.id === match.teamOneId || team.id === match.teamTwoId) &&
              team.id === match.losserTeamId
            )
              return match;
          }).length,
          runRate: calculateRunRate(tournamentMatches, team),
        };
      });

      data.sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        if (a.losses !== b.losses) {
          return a.losses - b.losses;
        }

        if (b.runRate !== a.runRate) {
          return b.runRate - a.runRate;
        }

        return a.teamName.localeCompare(b.teamName);
      });

      setPointsTable(data);
    }
  }, [setPointsTable, tournamentMatches]);

  useEffect(() => {
    const getQualifiers = async () => {
      if (
        !!tournamentMatches?.length &&
        !!totalMatchesPlayedCount &&
        !!pointsTable?.length
      ) {
        if (tournamentMatches.length === totalMatchesPlayedCount) {
          const topFourTeams = pointsTable.slice(0, 4);

          const semiFinalMatches: MatchesType = tournamentMatches.filter(
            (match) => match.type === 'semiFinal'
          );

          if (!semiFinalMatches.length) {
            const data: MatchesType = [
              ...tournamentMatches,
              {
                id: tournamentMatches.length + 1,
                teamOneId: topFourTeams[0].teamId,
                teamTwoId: topFourTeams[3].teamId,
                matchNo: tournamentMatches.length + 1,
                type: 'semiFinal',
                teamOneScore: 0,
                teamOneWickets: 0,
                teamOneBalls: 30,
                teamTwoScore: 0,
                teamTwoWickets: 0,
                teamTwoBalls: 30,
                winnerTeamId: null,
                losserTeamId: null,
                isMatchPlayed: false,
              },
              {
                id: tournamentMatches.length + 2,
                teamOneId: topFourTeams[1].teamId,
                teamTwoId: topFourTeams[2].teamId,
                matchNo: tournamentMatches.length + 2,
                type: 'semiFinal',
                teamOneScore: 0,
                teamOneWickets: 0,
                teamOneBalls: 30,
                teamTwoScore: 0,
                teamTwoWickets: 0,
                teamTwoBalls: 30,
                winnerTeamId: null,
                losserTeamId: null,
                isMatchPlayed: false,
              },
            ];

            await Preferences.set({
              key: 'matches',
              value: JSON.stringify({
                matches: data,
              }),
            });

            setMatches(data);
          }

          const semiFinalMatchesPlayed: MatchesType = tournamentMatches.filter(
            (match) => match.type === 'semiFinal' && match.isMatchPlayed
          );

          const finalMatches: MatchesType = tournamentMatches.filter(
            (match) => match.type === 'final'
          );

          if (semiFinalMatchesPlayed && !finalMatches.length) {
            const semiFinalWinnersTeams: MatchesType = tournamentMatches.filter(
              (match) => match.type === 'semiFinal' && !!match.winnerTeamId
            );

            if (semiFinalWinnersTeams.length === 2) {
              const data: MatchesType = [
                ...tournamentMatches,
                {
                  id: tournamentMatches.length + 1,
                  teamOneId: semiFinalWinnersTeams[0].winnerTeamId!,
                  teamTwoId: semiFinalWinnersTeams[1].winnerTeamId!,
                  matchNo: tournamentMatches.length + 1,
                  type: 'final',
                  teamOneScore: 0,
                  teamOneWickets: 0,
                  teamOneBalls: 30,
                  teamTwoScore: 0,
                  teamTwoWickets: 0,
                  teamTwoBalls: 30,
                  winnerTeamId: null,
                  losserTeamId: null,
                  isMatchPlayed: false,
                },
              ];

              await Preferences.set({
                key: 'matches',
                value: JSON.stringify({
                  matches: data,
                }),
              });

              setMatches(data);
            }
          }
        }
      }
    };

    getQualifiers();
  }, [tournamentMatches, pointsTable, setMatches, totalMatchesPlayedCount]);

  if (!tournament) {
    return null;
  }

  if (!!matchId) {
    return <MatchPage />;
  }

  return (
    <div className='p-4 pb-20'>
      <Header
        title='Matches'
        isSyncActive={tournamentMatches?.length === totalMatchesPlayedCount}
        handleSyncClick={handleMatchesSyncClick}
      />

      <div className='flex items-center gap-2 py-4'>
        <button className='text-2xl' onClick={() => setTournamentId(null)}>
          <MdKeyboardArrowLeft />
        </button>
        <h3 className='w-1/2 text-lg font-bold capitalize truncate'>
          {tournament.name}
        </h3>
        <button
          className='w-1/2 bg-neutral-800 p-2 rounded-lg truncate active:bg-neutral-800/50'
          onClick={() => setShowPointsTable(true)}
        >
          Points Table
        </button>
      </div>

      {!!tournamentMatches?.length && (
        <div className='grid grid-cols-1 gap-2 w-full'>
          {tournamentMatches
            .sort((a, b) =>
              a.isMatchPlayed === b.isMatchPlayed ? 0 : a.isMatchPlayed ? 1 : -1
            )
            .map((match) => (
              <div
                key={match?.id}
                className={cn(
                  'flex items-center justify-around relative px-4 pt-10 pb-4 rounded-lg',
                  match?.isMatchPlayed
                    ? 'bg-neutral-800'
                    : match?.type !== 'normal'
                    ? 'bg-yellow-500/50 active:bg-yellow-500'
                    : 'bg-neutral-700 active:bg-neutral-800'
                )}
                role='button'
                onClick={() => setMatchId(match?.id)}
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='relative h-16 w-16 bg-white rounded-full'>
                    <Image
                      src={
                        teams?.teams?.find(
                          (team) => team?.id === match?.teamOneId
                        )?.logo!
                      }
                      alt={
                        teams?.teams?.find(
                          (team) => team?.id === match?.teamOneId
                        )?.name!
                      }
                      className='p-2'
                      fill
                    />
                  </div>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      match?.isMatchPlayed &&
                        (match?.winnerTeamId === match?.teamOneId
                          ? 'text-green-500'
                          : 'text-red-500')
                    )}
                  >
                    {
                      teams?.teams?.find(
                        (team) => team?.id === match?.teamOneId
                      )?.name
                    }
                  </p>
                </div>
                <p className='text-2xl font-bold'>VS</p>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='relative h-16 w-16 bg-white rounded-full'>
                    <Image
                      src={
                        teams?.teams?.find(
                          (team) => team?.id === match?.teamTwoId
                        )?.logo!
                      }
                      alt={
                        teams?.teams?.find(
                          (team) => team?.id === match?.teamTwoId
                        )?.name!
                      }
                      className='p-2'
                      fill
                    />
                  </div>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      match?.isMatchPlayed &&
                        (match?.winnerTeamId === match?.teamTwoId
                          ? 'text-green-500'
                          : 'text-red-500')
                    )}
                  >
                    {
                      teams?.teams?.find(
                        (team) => team?.id === match?.teamTwoId
                      )?.name
                    }
                  </p>
                </div>
                <>
                  <p className='absolute top-2 left-2 text-neutral-300 text-sm font-semibold truncate'>
                    #Match {match?.matchNo}
                  </p>
                  {match?.type !== 'normal' && (
                    <p className='absolute top-2 right-2 text-neutral-300 text-sm font-semibold capitalize truncate'>
                      #{match?.type}
                    </p>
                  )}
                </>
              </div>
            ))}
        </div>
      )}

      {showPointsTable && (
        <PointsTable handleOnClose={() => setShowPointsTable(false)} />
      )}
    </div>
  );
};
