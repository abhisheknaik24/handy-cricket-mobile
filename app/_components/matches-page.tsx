import { MatchType, MatchesType, useMain } from '@/hooks/use-main-store';
import { usePointsTable } from '@/hooks/use-points-table-store';
import { useStorage } from '@/hooks/use-storage';
import { useVibrate } from '@/hooks/use-vibrate';
import { cn, shuffleArray } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Loader } from './loader';

const Header = dynamic(() => import('./header').then((mod) => mod?.Header), {
  loading: () => <Loader />,
  ssr: false,
});

const MatchPage = dynamic(
  () => import('./match-page').then((mod) => mod?.MatchPage),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const PointsTable = dynamic(
  () => import('./points-table').then((mod) => mod?.PointsTable),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

export const MatchesPage = memo(function MatchesPage() {
  const { postStorage } = useStorage();

  const { vibrate } = useVibrate();

  const {
    tournament,
    teams,
    matches,
    matchId,
    setTournament,
    setMatches,
    setMatchId,
  } = useMain();

  const { pointsTable } = usePointsTable();

  const [totalMatchesPlayedCount, setTotalMatchesPlayedCount] =
    useState<number>(0);

  const [showPointsTable, setShowPointsTable] = useState<Boolean>(false);

  const handleBackClick = () => {
    setTournament(null);

    vibrate();
  };

  const handlePointsTableClick = () => {
    setShowPointsTable((prev) => !prev);

    vibrate();
  };

  const handlePointsTableClose = () => {
    setShowPointsTable(false);

    vibrate();
  };

  const handleMatchClick = (id: number) => {
    setMatchId(id);

    vibrate();
  };

  const handleMatchesSyncClick = async () => {
    if (
      !!tournament &&
      (!matches?.length || matches?.length === totalMatchesPlayedCount) &&
      !!teams?.length
    ) {
      let no: number = 1;

      const tournamentMatches: MatchesType = [];

      teams.forEach((teamOne) => {
        teams.forEach((teamTwo) => {
          const matchExist = tournamentMatches?.find(
            (item) =>
              (item?.teamOneId === teamOne?.id &&
                item?.teamTwoId === teamTwo?.id) ||
              (item?.teamOneId === teamTwo?.id &&
                item?.teamTwoId === teamOne?.id)
          );

          if (teamOne?.id !== teamTwo?.id && !matchExist) {
            tournamentMatches.push({
              id: no,
              teamOneId: teamOne?.id,
              teamOneLogo: teamOne?.logo,
              teamOneName: teamOne?.name,
              teamTwoId: teamTwo?.id,
              teamTwoLogo: teamTwo?.logo,
              teamTwoName: teamTwo?.name,
              matchNo: 0,
              type: 'normal',
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
              winnerTeamId: null,
              losserTeamId: null,
              isMatchPlayed: false,
            });

            no += 1;
          }
        });
      });

      const shuffledMatches: MatchesType = shuffleArray(tournamentMatches);

      const data: MatchesType = shuffledMatches?.map(
        (match: MatchType, index: number) => ({
          ...match,
          matchNo: index + 1,
        })
      );

      postStorage(String(tournament?.id), data);

      setMatches(data);
    }
  };

  useEffect(() => {
    if (!!matches?.length) {
      const data: number = matches?.filter(
        (item) => item?.isMatchPlayed
      )?.length;

      setTotalMatchesPlayedCount(data);
    }
  }, [matches]);

  useEffect(() => {
    if (
      !!tournament &&
      !!teams?.length &&
      !!matches?.length &&
      !!totalMatchesPlayedCount &&
      !!pointsTable?.length
    ) {
      if (matches?.length === totalMatchesPlayedCount) {
        const topFourTeams = pointsTable?.slice(0, 4);

        const semiFinalMatches: MatchesType = matches?.filter(
          (match) => match?.type === 'semiFinal'
        );

        if (!semiFinalMatches?.length) {
          const data: MatchesType = [
            ...matches,
            {
              id: matches?.length + 1,
              teamOneId: topFourTeams?.[0]?.teamId,
              teamOneLogo: topFourTeams?.[0]?.teamLogo,
              teamOneName: topFourTeams?.[0]?.teamName,
              teamTwoId: topFourTeams?.[3]?.teamId,
              teamTwoLogo: topFourTeams?.[3]?.teamLogo,
              teamTwoName: topFourTeams?.[3]?.teamName,
              matchNo: matches?.length + 1,
              type: 'semiFinal',
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
              winnerTeamId: null,
              losserTeamId: null,
              isMatchPlayed: false,
            },
            {
              id: matches?.length + 2,
              teamOneId: topFourTeams?.[1]?.teamId,
              teamOneLogo: topFourTeams?.[1]?.teamLogo,
              teamOneName: topFourTeams?.[1]?.teamName,
              teamTwoId: topFourTeams?.[2]?.teamId,
              teamTwoLogo: topFourTeams?.[2]?.teamLogo,
              teamTwoName: topFourTeams?.[2]?.teamName,
              matchNo: matches?.length + 2,
              type: 'semiFinal',
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
              winnerTeamId: null,
              losserTeamId: null,
              isMatchPlayed: false,
            },
          ];

          postStorage(String(tournament?.id), data);

          setMatches(data);
        }

        const semiFinalMatchesPlayed: MatchesType = matches?.filter(
          (match) => match?.type === 'semiFinal' && match?.isMatchPlayed
        );

        const finalMatches: MatchesType = matches?.filter(
          (match) => match?.type === 'final'
        );

        if (semiFinalMatchesPlayed && !finalMatches?.length) {
          const semiFinalWinnersTeams: MatchesType = matches
            ?.filter(
              (match) => match?.type === 'semiFinal' && !!match?.winnerTeamId
            )
            ?.reverse();

          if (semiFinalWinnersTeams?.length === 2) {
            const data: MatchesType = [
              ...matches,
              {
                id: matches?.length + 1,
                teamOneId: semiFinalWinnersTeams?.[0]?.winnerTeamId!,
                teamOneLogo:
                  semiFinalWinnersTeams?.[0]?.teamOneId ===
                  semiFinalWinnersTeams?.[0]?.winnerTeamId
                    ? semiFinalWinnersTeams?.[0]?.teamOneLogo
                    : semiFinalWinnersTeams?.[0]?.teamTwoLogo,
                teamOneName:
                  semiFinalWinnersTeams?.[0]?.teamOneId ===
                  semiFinalWinnersTeams?.[0]?.winnerTeamId
                    ? semiFinalWinnersTeams?.[0]?.teamOneName
                    : semiFinalWinnersTeams?.[0]?.teamTwoName,
                teamTwoId: semiFinalWinnersTeams?.[1]?.winnerTeamId!,
                teamTwoLogo:
                  semiFinalWinnersTeams?.[1]?.teamOneId ===
                  semiFinalWinnersTeams?.[1]?.winnerTeamId
                    ? semiFinalWinnersTeams?.[1]?.teamOneLogo
                    : semiFinalWinnersTeams?.[1]?.teamTwoLogo,
                teamTwoName:
                  semiFinalWinnersTeams?.[1]?.teamOneId ===
                  semiFinalWinnersTeams?.[1]?.winnerTeamId
                    ? semiFinalWinnersTeams?.[1]?.teamOneName
                    : semiFinalWinnersTeams?.[1]?.teamTwoName,
                matchNo: matches?.length + 1,
                type: 'final',
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
                winnerTeamId: null,
                losserTeamId: null,
                isMatchPlayed: false,
              },
            ];

            postStorage(String(tournament?.id), data);

            setMatches(data);
          }
        }
      }
    }
  }, [tournament, teams, matches, pointsTable, totalMatchesPlayedCount, postStorage, setMatches]);

  if (!tournament || !teams?.length) {
    return null;
  }

  if (!!matchId) {
    return <MatchPage />;
  }

  return (
    <div className='p-4 pb-20'>
      <Header
        title='Matches'
        isSyncActive={
          !matches?.length || matches?.length === totalMatchesPlayedCount
        }
        handleSyncClick={handleMatchesSyncClick}
      />

      <div className='flex items-center gap-2 py-4'>
        <button className='text-2xl' onClick={handleBackClick}>
          <MdKeyboardArrowLeft />
        </button>
        <h3 className='w-1/2 font-bold capitalize truncate'>
          {tournament?.name}
        </h3>
        {!!matches?.length && (
          <button
            className='w-1/2 bg-neutral-800 p-2 font-semibold rounded-lg truncate active:bg-neutral-800/50 active:scale-95'
            onClick={handlePointsTableClick}
          >
            Points Table
          </button>
        )}
      </div>

      {!!matches?.length && (
        <div className='grid grid-cols-1 gap-2 w-full'>
          {matches
            .sort((a, b) =>
              a?.isMatchPlayed === b?.isMatchPlayed
                ? 0
                : a?.isMatchPlayed
                ? 1
                : -1
            )
            .map((match) => (
              <div
                key={match?.id}
                className={cn(
                  'flex items-center justify-around relative px-4 pt-10 pb-4 rounded-lg active:scale-95',
                  match?.isMatchPlayed
                    ? 'bg-neutral-800/50 active:bg-neutral-800'
                    : match?.type !== 'normal'
                    ? 'bg-yellow-500/50 active:bg-yellow-500'
                    : 'bg-neutral-800 active:bg-neutral-800/50'
                )}
                role='button'
                onClick={() => handleMatchClick(match?.id)}
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='relative h-16 w-16 bg-white rounded-full'>
                    <Image
                      src={match?.teamOneLogo}
                      alt={match?.teamOneName}
                      className='p-4'
                      fill
                    />
                  </div>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      match?.isMatchPlayed
                        ? match?.winnerTeamId === match?.teamOneId
                          ? 'text-green-500'
                          : 'text-red-500'
                        : 'text-neutral-300'
                    )}
                  >
                    {match?.teamOneName}
                  </p>
                </div>
                <p className='text-2xl font-bold'>VS</p>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='relative h-16 w-16 bg-white rounded-full'>
                    <Image
                      src={match?.teamTwoLogo}
                      alt={match?.teamTwoName}
                      className='p-4'
                      fill
                    />
                  </div>
                  <p
                    className={cn(
                      'text-sm font-bold',
                      match?.isMatchPlayed
                        ? match?.winnerTeamId === match?.teamTwoId
                          ? 'text-green-500'
                          : 'text-red-500'
                        : 'text-neutral-300'
                    )}
                  >
                    {match?.teamTwoName}
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
        <PointsTable handlePointsTableClose={handlePointsTableClose} />
      )}
    </div>
  );
});
