import { MatchType, MatchesType, useMain } from '@/hooks/use-main-store';
import { useStorage } from '@/hooks/use-storage';
import { useVibrate } from '@/hooks/use-vibrate';
import dynamic from 'next/dynamic';
import { memo, useEffect, useState } from 'react';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Loader } from './loader';

const TeamDetails = dynamic(
  () => import('./team-details').then((mod) => mod?.TeamDetails),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

export const MatchPage = memo(function MatchPage() {
  const { postStorage } = useStorage();

  const { vibrate } = useVibrate();

  const { tournament, matches, matchId, setMatches, setMatchId } = useMain();

  const [showTossChoose, setShowTossChoose] = useState<boolean>(false);

  const [match, setMatch] = useState<MatchType | null>(null);

  const [isLoading, setLoading] = useState<boolean>(false);

  const handleBackClick = () => {
    setMatchId(null);

    vibrate();
  };

  const handlePlayerTeamClick = (teamId: number) => {
    if (!!matches?.length && !!matchId && !!teamId) {
      const data: MatchesType = matches?.map((item) => {
        if (item?.id === matchId) {
          return {
            ...item,
            playerTeamId: teamId,
          };
        }

        return item;
      });

      setMatches(data);

      vibrate();
    }
  };

  const handleTossClick = () => {
    setLoading(true);

    if (!!matches?.length && !!matchId && !!match?.playerTeamId) {
      const matchTeamsIds = [match?.teamOneId, match?.teamTwoId];

      const randomTeamIndex = Math.floor(Math.random() * matchTeamsIds?.length);

      if (matchTeamsIds[randomTeamIndex] !== match?.playerTeamId) {
        const toss: ['bat', 'bowl'] = ['bat', 'bowl'];

        const randomTossIndex = Math.floor(Math.random() * toss?.length);

        const data: MatchesType = matches?.map((item) => {
          if (item?.id === matchId) {
            return {
              ...item,
              tossWinnerTeamId: matchTeamsIds[randomTeamIndex],
              teamOneStatus:
                item?.teamOneId === item?.playerTeamId
                  ? toss[(randomTossIndex + 1) % 2]
                  : toss[randomTossIndex],
              teamTwoStatus:
                item?.teamTwoId === item?.playerTeamId
                  ? toss[(randomTossIndex + 1) % 2]
                  : toss[randomTossIndex],
            };
          }

          return item;
        });

        setMatches(data);
      } else {
        const data: MatchesType = matches?.map((item) => {
          if (item?.id === matchId) {
            return {
              ...item,
              tossWinnerTeamId: matchTeamsIds[randomTeamIndex],
            };
          }

          return item;
        });

        setMatches(data);

        setShowTossChoose(true);
      }

      vibrate();
    }

    setLoading(false);
  };

  const handleTossChooseClick = (tossChoose: 'bat' | 'bowl') => {
    setLoading(true);

    if (
      !!matches?.length &&
      !!matchId &&
      !!match?.playerTeamId &&
      !!match?.tossWinnerTeamId
    ) {
      const data: MatchesType = matches?.map((item) => {
        if (item?.id === matchId) {
          return {
            ...item,
            teamOneStatus:
              item?.teamOneId === item?.playerTeamId
                ? tossChoose
                : tossChoose === 'bat'
                ? 'bowl'
                : 'bat',
            teamTwoStatus:
              item?.teamTwoId === item?.playerTeamId
                ? tossChoose
                : tossChoose === 'bat'
                ? 'bowl'
                : 'bat',
          };
        }

        return item;
      });

      setMatches(data);

      setShowTossChoose(false);

      vibrate();
    }

    setLoading(false);
  };

  const handleRunClick = async (run: number) => {
    setLoading(true);

    if (!!tournament && !!matches?.length && !!matchId && !!match) {
      const oppositeTeamRun: number = Math.floor(Math.random() * 7);

      if (match?.teamOneStatus === 'bat') {
        const newTeamOneScore =
          run !== oppositeTeamRun
            ? match?.playerTeamId === match?.teamOneId
              ? match?.teamOneScore + run
              : match?.teamOneScore + oppositeTeamRun
            : match?.teamOneScore;

        const newTeamOneWickets =
          run === oppositeTeamRun
            ? match?.teamOneWickets + 1
            : match?.teamOneWickets;

        const newTeamOneBalls = match?.teamOneBalls - 1;

        if (
          match?.inning === 'first' &&
          (newTeamOneBalls < 1 || newTeamOneWickets === 10)
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'second',
                teamOneStatus: 'bowl',
                teamTwoStatus: 'bat',
                teamOneScore: newTeamOneScore,
                teamOneWickets: newTeamOneWickets,
                teamOneBalls: newTeamOneBalls,
              };
            }

            return item;
          });

          setMatches(data);
        } else if (
          match?.inning === 'second' &&
          newTeamOneScore > match?.teamTwoScore
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'over',
                teamOneScore: newTeamOneScore,
                teamOneWickets: newTeamOneWickets,
                teamOneBalls: newTeamOneBalls,
                teamTwoScore: match?.teamTwoScore,
                teamTwoWickets: match?.teamTwoWickets,
                teamTwoBalls: match?.teamTwoBalls,
                winnerTeamId: item?.teamOneId,
                losserTeamId: item?.teamTwoId,
                isMatchPlayed: true,
              };
            }

            return item;
          });

          postStorage(String(tournament?.id), data);

          setMatches(data);
        } else if (
          match?.inning === 'second' &&
          (newTeamOneBalls < 1 || newTeamOneWickets === 10)
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'over',
                teamOneScore: newTeamOneScore,
                teamOneWickets: newTeamOneWickets,
                teamOneBalls: newTeamOneBalls,
                teamTwoScore: match?.teamTwoScore,
                teamTwoWickets: match?.teamTwoWickets,
                teamTwoBalls: match?.teamTwoBalls,
                winnerTeamId: item?.teamTwoId,
                losserTeamId: item?.teamOneId,
                isMatchPlayed: true,
              };
            }

            return item;
          });

          postStorage(String(tournament?.id), data);

          setMatches(data);
        } else {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                teamOneScore: newTeamOneScore,
                teamOneWickets: newTeamOneWickets,
                teamOneBalls: newTeamOneBalls,
              };
            }

            return item;
          });

          setMatches(data);
        }
      } else if (match?.teamTwoStatus === 'bat') {
        const newTeamTwoScore =
          run !== oppositeTeamRun
            ? match?.playerTeamId === match?.teamTwoId
              ? match?.teamTwoScore + run
              : match?.teamTwoScore + oppositeTeamRun
            : match?.teamTwoScore;

        const newTeamTwoWickets =
          run === oppositeTeamRun
            ? match?.teamTwoWickets + 1
            : match?.teamTwoWickets;

        const newTeamTwoBalls = match?.teamTwoBalls - 1;

        if (
          match?.inning === 'first' &&
          (newTeamTwoBalls < 1 || newTeamTwoWickets === 10)
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'second',
                teamOneStatus: 'bat',
                teamTwoStatus: 'bowl',
                teamTwoScore: newTeamTwoScore,
                teamTwoWickets: newTeamTwoWickets,
                teamTwoBalls: newTeamTwoBalls,
              };
            }

            return item;
          });

          setMatches(data);
        } else if (
          match?.inning === 'second' &&
          newTeamTwoScore > match?.teamOneScore
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'over',
                teamOneScore: match?.teamOneScore,
                teamOneWickets: match?.teamOneWickets,
                teamOneBalls: match?.teamOneBalls,
                teamTwoScore: newTeamTwoScore,
                teamTwoWickets: newTeamTwoWickets,
                teamTwoBalls: newTeamTwoBalls,
                winnerTeamId: item?.teamTwoId,
                losserTeamId: item?.teamOneId,
                isMatchPlayed: true,
              };
            }

            return item;
          });

          postStorage(String(tournament?.id), data);

          setMatches(data);
        } else if (
          match?.inning === 'second' &&
          (newTeamTwoBalls < 1 || newTeamTwoWickets === 10)
        ) {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                inning: 'over',
                teamOneScore: match?.teamOneScore,
                teamOneWickets: match?.teamOneWickets,
                teamOneBalls: match?.teamOneBalls,
                teamTwoScore: newTeamTwoScore,
                teamTwoWickets: newTeamTwoWickets,
                teamTwoBalls: newTeamTwoBalls,
                winnerTeamId: item?.teamOneId,
                losserTeamId: item?.teamTwoId,
                isMatchPlayed: true,
              };
            }

            return item;
          });

          postStorage(String(tournament?.id), data);

          setMatches(data);
        } else {
          const data: MatchesType = matches?.map((item) => {
            if (item?.id === matchId) {
              return {
                ...item,
                teamTwoScore: newTeamTwoScore,
                teamTwoWickets: newTeamTwoWickets,
                teamTwoBalls: newTeamTwoBalls,
              };
            }

            return item;
          });

          setMatches(data);
        }
      }

      vibrate();
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSkipClick = async () => {
    setLoading(true);

    if (!!tournament && !!matches?.length && !!matchId && !!match) {
      const matchTeamsIds = [match?.teamOneId, match?.teamTwoId];

      const randomTeamIndex = Math.floor(Math.random() * matchTeamsIds?.length);

      const toss: ['bat', 'bowl'] = ['bat', 'bowl'];

      const randomTossIndex = Math.floor(Math.random() * toss?.length);

      const teamOneScore: number = Math.floor(Math.random() * 100);

      const teamOneWickets: number = Math.floor(Math.random() * 10);

      const teamTwoScore: number = Math.floor(Math.random() * 100);

      const teamTwoWickets: number = Math.floor(Math.random() * 10);

      const data: MatchesType = matches?.map((item) => {
        if (item?.id === matchId) {
          return {
            ...item,
            tossWinnerTeamId: matchTeamsIds[randomTeamIndex],
            inning: 'over',
            teamOneStatus: toss[randomTossIndex],
            teamTwoStatus: toss[(randomTossIndex + 1) % 2],
            teamOneScore: teamOneScore,
            teamOneWickets: teamOneWickets,
            teamOneBalls: 0,
            teamTwoScore: teamTwoScore,
            teamTwoWickets: teamTwoWickets,
            teamTwoBalls: 0,
            winnerTeamId:
              teamOneScore < teamTwoScore ? item?.teamTwoId : item?.teamOneId,
            losserTeamId:
              teamOneScore < teamTwoScore ? item?.teamOneId : item?.teamTwoId,
            isMatchPlayed: true,
          };
        }

        return item;
      });

      postStorage(String(tournament?.id), data);

      setMatches(data);

      vibrate();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!!matches?.length) {
      const data = matches?.find((item) => item?.id === matchId);

      if (!!data) {
        setMatch(data);
      }
    }
  }, [matches, matchId]);

  if (!tournament || !matches?.length || !matchId || !match) {
    return null;
  }

  return (
    <div className='p-4 pb-20'>
      <div className='flex items-center justify-start gap-2 w-full'>
        {(!match?.playerTeamId || match?.inning === 'over') && (
          <button className='text-2xl' onClick={handleBackClick}>
            <MdKeyboardArrowLeft />
          </button>
        )}
        <GiLaurelsTrophy className='w-16 h-16 text-6xl text-amber-500' />
        <h3 className='w-full text-lg font-bold capitalize truncate'>
          {tournament?.name}
        </h3>
      </div>

      <div className='flex items-center justify-between w-full py-4'>
        <p className='text-neutral-300 font-semibold truncate'>
          #Match {match?.matchNo}
        </p>
        {match?.type !== 'normal' && (
          <p className='text-neutral-300 font-semibold capitalize truncate'>
            #{match?.type}
          </p>
        )}
        {!match?.isMatchPlayed && !match?.playerTeamId && (
          <button
            className='bg-neutral-800 px-4 py-2 rounded-lg text-sm font-semibold active:bg-neutral-800/50 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
            disabled={isLoading}
            onClick={handleSkipClick}
          >
            Skip
          </button>
        )}
      </div>

      <div className='flex items-start justify-around w-full py-4'>
        <TeamDetails
          teamId={match?.teamOneId}
          teamLogo={match?.teamOneLogo}
          teamName={match?.teamOneName}
          teamStatus={match?.teamOneStatus}
          teamScore={match?.teamOneScore}
          teamWickets={match?.teamOneWickets}
          teamBalls={match?.teamOneBalls}
          match={match}
          handlePlayerTeamClick={handlePlayerTeamClick}
        />
        <p className='mt-20 text-2xl font-bold'>VS</p>
        <TeamDetails
          teamId={match?.teamTwoId}
          teamLogo={match?.teamTwoLogo}
          teamName={match?.teamTwoName}
          teamStatus={match?.teamTwoStatus}
          teamScore={match?.teamTwoScore}
          teamWickets={match?.teamTwoWickets}
          teamBalls={match?.teamTwoBalls}
          match={match}
          handlePlayerTeamClick={handlePlayerTeamClick}
        />
      </div>

      {!!match?.playerTeamId && !match?.tossWinnerTeamId && (
        <div className='flex items-center justify-center w-full'>
          <button
            className='bg-yellow-500 px-6 py-2 text-2xl font-semibold rounded-lg active:bg-yellow-500/50 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
            disabled={isLoading}
            onClick={handleTossClick}
          >
            Toss
          </button>
        </div>
      )}

      {!!match?.playerTeamId &&
        !!match?.tossWinnerTeamId &&
        match?.inning !== 'over' && (
          <>
            {showTossChoose && (
              <div className='flex items-center justify-center gap-2 w-full'>
                <button
                  className='bg-neutral-800 px-6 py-2 font-semibold rounded-lg active:bg-neutral-800/50 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
                  disabled={isLoading}
                  onClick={() => handleTossChooseClick('bat')}
                >
                  Bat
                </button>
                <button
                  className='bg-neutral-800 px-6 py-2 font-semibold rounded-lg active:bg-neutral-800/50 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
                  disabled={isLoading}
                  onClick={() => handleTossChooseClick('bowl')}
                >
                  Bowl
                </button>
              </div>
            )}

            {!!match?.teamOneStatus?.length &&
              !!match?.teamTwoStatus?.length && (
                <div className='flex flex-wrap items-center justify-around gap-4 w-full mt-20 px-2'>
                  {Array.from({ length: 7 }, (_, index) => (
                    <button
                      key={index}
                      className='w-16 h-16 text-xl border border-neutral-300 rounded-lg active:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50'
                      disabled={isLoading}
                      onClick={() => handleRunClick(index)}
                    >
                      {index}
                    </button>
                  ))}
                </div>
              )}
          </>
        )}
    </div>
  );
});
