import { useMain } from '@/hooks/use-main-store';
import { useStorage } from '@/hooks/use-storage';
import { useEffect, useState } from 'react';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import tournaments from '../../data/tournaments.json';
import { TeamDetails } from './team-details';

export const MatchPage = () => {
  const { postStorage } = useStorage();

  const {
    tournamentId,
    matches,
    matchId,
    playerTeamId,
    tossWinnerTeamId,
    inning,
    teamOneStatus,
    teamTwoStatus,
    teamOneScore,
    teamOneWickets,
    teamOneBalls,
    teamTwoScore,
    teamTwoWickets,
    teamTwoBalls,
    setMatches,
    setMatchId,
    setTossWinnerTeamId,
    setInning,
    setTeamsStatus,
    setTeamOneScore,
    setTeamOneWickets,
    setTeamOneBalls,
    setTeamTwoScore,
    setTeamTwoWickets,
    setTeamTwoBalls,
  } = useMain();

  const [showTossChoose, setShowTossChoose] = useState<Boolean>(false);

  const tournament = tournaments?.tournaments?.find(
    (tournament) => tournament?.id === tournamentId
  );

  const match = matches?.find((match) => match?.id === matchId);

  const handleTossClick = () => {
    if (!!match && !!playerTeamId) {
      const matchTeamsIds = [match.teamOneId, match.teamTwoId];

      const randomTeamIndex = Math.floor(Math.random() * matchTeamsIds.length);

      setTossWinnerTeamId(matchTeamsIds[randomTeamIndex]);

      if (matchTeamsIds[randomTeamIndex] !== playerTeamId) {
        const toss: ['bat', 'bowl'] = ['bat', 'bowl'];

        const randomTossIndex = Math.floor(Math.random() * toss.length);

        if (match.teamOneId === playerTeamId) {
          setTeamsStatus(
            toss[(randomTossIndex + 1) % 2],
            toss[randomTossIndex]
          );
        } else if (match.teamTwoId === playerTeamId) {
          setTeamsStatus(
            toss[randomTossIndex],
            toss[(randomTossIndex + 1) % 2]
          );
        }
      } else {
        setShowTossChoose(true);
      }
    }
  };

  const handleTossChooseClick = (tossChoose: 'bat' | 'bowl') => {
    if (!!match && !!playerTeamId && !!tossWinnerTeamId) {
      if (match.teamOneId === playerTeamId) {
        setTeamsStatus(tossChoose, tossChoose === 'bat' ? 'bowl' : 'bat');
      } else if (match.teamTwoId === playerTeamId) {
        setTeamsStatus(tossChoose === 'bat' ? 'bowl' : 'bat', tossChoose);
      }

      setShowTossChoose(false);
    }
  };

  const handleRunClick = async (run: number) => {
    if (!!tournament && !!match) {
      const oppositeTeamRun: number = Math.floor(Math.random() * 7);

      if (teamOneStatus === 'bat') {
        const newTeamOneScore =
          run !== oppositeTeamRun
            ? playerTeamId === match.teamOneId
              ? teamOneScore + run
              : teamOneScore + oppositeTeamRun
            : teamOneScore;

        const newTeamOneWickets =
          run === oppositeTeamRun ? teamOneWickets + 1 : teamOneWickets;

        const newTeamOneBalls = teamOneBalls - 1;

        setTeamOneScore(newTeamOneScore);

        setTeamOneWickets(newTeamOneWickets);

        setTeamOneBalls(newTeamOneBalls);

        if (inning === 'first') {
          if (newTeamOneBalls < 1 || newTeamOneWickets === 10) {
            setInning('second');

            setTeamsStatus('bowl', 'bat');
          }
        } else if (inning === 'second') {
          if (newTeamOneScore > teamTwoScore) {
            setInning('over');

            const data = matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  teamOneScore: newTeamOneScore,
                  teamOneWickets: newTeamOneWickets,
                  teamOneBalls: newTeamOneBalls,
                  teamTwoScore: teamTwoScore,
                  teamTwoWickets: teamTwoWickets,
                  teamTwoBalls: teamTwoBalls,
                  winnerTeamId: match.teamOneId,
                  losserTeamId: match.teamTwoId,
                  isMatchPlayed: true,
                };
              }

              return match;
            });

            postStorage(String(tournament.id), data);

            setMatches(data);
          } else if (newTeamOneBalls < 1 || newTeamOneWickets === 10) {
            setInning('over');

            const data = matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  teamOneScore: newTeamOneScore,
                  teamOneWickets: newTeamOneWickets,
                  teamOneBalls: newTeamOneBalls,
                  teamTwoScore: teamTwoScore,
                  teamTwoWickets: teamTwoWickets,
                  teamTwoBalls: teamTwoBalls,
                  winnerTeamId: match.teamTwoId,
                  losserTeamId: match.teamOneId,
                  isMatchPlayed: true,
                };
              }

              return match;
            });

            postStorage(String(tournament.id), data);

            setMatches(data);
          }
        }
      } else if (teamTwoStatus === 'bat') {
        const newTeamTwoScore =
          run !== oppositeTeamRun
            ? playerTeamId === match.teamTwoId
              ? teamTwoScore + run
              : teamTwoScore + oppositeTeamRun
            : teamTwoScore;

        const newTeamTwoWickets =
          run === oppositeTeamRun ? teamTwoWickets + 1 : teamTwoWickets;

        const newTeamTwoBalls = teamTwoBalls - 1;

        setTeamTwoScore(newTeamTwoScore);

        setTeamTwoWickets(newTeamTwoWickets);

        setTeamTwoBalls(newTeamTwoBalls);

        if (inning === 'first') {
          if (newTeamTwoBalls < 1 || newTeamTwoWickets === 10) {
            setInning('second');

            setTeamsStatus('bat', 'bowl');
          }
        } else if (inning === 'second') {
          if (newTeamTwoScore > teamOneScore) {
            setInning('over');

            const data = matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  teamOneScore: teamOneScore,
                  teamOneWickets: teamOneWickets,
                  teamOneBalls: teamOneBalls,
                  teamTwoScore: newTeamTwoScore,
                  teamTwoWickets: newTeamTwoWickets,
                  teamTwoBalls: newTeamTwoBalls,
                  winnerTeamId: match.teamTwoId,
                  losserTeamId: match.teamOneId,
                  isMatchPlayed: true,
                };
              }

              return match;
            });

            postStorage(String(tournament.id), data);

            setMatches(data);
          } else if (newTeamTwoBalls < 1 || newTeamTwoWickets === 10) {
            setInning('over');

            const data = matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  teamOneScore: teamOneScore,
                  teamOneWickets: teamOneWickets,
                  teamOneBalls: teamOneBalls,
                  teamTwoScore: newTeamTwoScore,
                  teamTwoWickets: newTeamTwoWickets,
                  teamTwoBalls: newTeamTwoBalls,
                  winnerTeamId: match.teamOneId,
                  losserTeamId: match.teamTwoId,
                  isMatchPlayed: true,
                };
              }

              return match;
            });

            postStorage(String(tournament.id), data);

            setMatches(data);
          }
        }
      }
    }
  };

  const handleSkipClick = async () => {
    if (!!tournament && !!match) {
      const matchTeamsIds = [match.teamOneId, match.teamTwoId];

      const randomTeamIndex = Math.floor(Math.random() * matchTeamsIds.length);

      setTossWinnerTeamId(matchTeamsIds[randomTeamIndex]);

      const toss: ['bat', 'bowl'] = ['bat', 'bowl'];

      const randomTossIndex = Math.floor(Math.random() * toss.length);

      setTeamsStatus(toss[randomTossIndex], toss[(randomTossIndex + 1) % 2]);

      const teamOneScore: number = Math.floor(Math.random() * 100);

      const teamOneWickets: number = Math.floor(Math.random() * 10);

      const teamTwoScore: number = Math.floor(Math.random() * 100);

      const teamTwoWickets: number = Math.floor(Math.random() * 10);

      const data = matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            teamOneScore: teamOneScore,
            teamOneWickets: teamOneWickets,
            teamOneBalls: 0,
            teamTwoScore: teamTwoScore,
            teamTwoWickets: teamTwoWickets,
            teamTwoBalls: 0,
            winnerTeamId:
              teamOneScore < teamTwoScore ? match.teamTwoId : match.teamOneId,
            losserTeamId:
              teamOneScore < teamTwoScore ? match.teamOneId : match.teamTwoId,
            isMatchPlayed: true,
          };
        }

        return match;
      });

      postStorage(String(tournament.id), data);

      setMatches(data);
    }
  };

  useEffect(() => {
    if (!!match) {
      setTeamOneScore(match.teamOneScore);
      setTeamOneWickets(match.teamOneWickets);
      setTeamOneBalls(match.teamOneBalls);
      setTeamTwoScore(match.teamTwoScore);
      setTeamTwoWickets(match.teamTwoWickets);
      setTeamTwoBalls(match.teamTwoBalls);
    }
  }, [match]);

  if (!tournament || !match) {
    return null;
  }

  return (
    <div className='p-4 pb-20'>
      <div className='flex items-center justify-start gap-2 w-full'>
        {(!playerTeamId || inning === 'over') && (
          <button className='text-2xl' onClick={() => setMatchId(null)}>
            <MdKeyboardArrowLeft />
          </button>
        )}
        <GiLaurelsTrophy className='w-16 h-16 text-6xl text-amber-500' />
        <h3 className='w-full text-lg font-bold capitalize truncate'>
          {tournament.name}
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
        {!match?.isMatchPlayed && !playerTeamId && (
          <button
            className='bg-neutral-800 px-4 py-2 rounded-lg text-sm font-semibold active:bg-neutral-800/50 active:scale-95'
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
          teamStatus={teamOneStatus}
          teamScore={teamOneScore}
          teamWickets={teamOneWickets}
          teamBalls={teamOneBalls}
          isWinner={match.winnerTeamId === match?.teamOneId}
          isMatchPlayed={match.isMatchPlayed}
        />
        <p className='mt-20 text-2xl font-bold'>VS</p>
        <TeamDetails
          teamId={match?.teamTwoId}
          teamLogo={match?.teamTwoLogo}
          teamName={match?.teamTwoName}
          teamStatus={teamTwoStatus}
          teamScore={teamTwoScore}
          teamWickets={teamTwoWickets}
          teamBalls={teamTwoBalls}
          isWinner={match.winnerTeamId === match?.teamTwoId}
          isMatchPlayed={match.isMatchPlayed}
        />
      </div>

      {!!playerTeamId && !tossWinnerTeamId && (
        <div className='flex items-center justify-center w-full'>
          <button
            className='bg-yellow-500 px-6 py-2 text-2xl font-semibold rounded-lg active:bg-yellow-500/50 active:scale-95'
            onClick={handleTossClick}
          >
            Toss
          </button>
        </div>
      )}

      {!!playerTeamId && !!tossWinnerTeamId && inning !== 'over' && (
        <>
          {showTossChoose && (
            <div className='flex items-center justify-center gap-2 w-full'>
              <button
                className='bg-neutral-800 px-6 py-2 font-semibold rounded-lg active:bg-neutral-800/50 active:scale-95'
                onClick={() => handleTossChooseClick('bat')}
              >
                Bat
              </button>
              <button
                className='bg-neutral-800 px-6 py-2 font-semibold rounded-lg active:bg-neutral-800/50 active:scale-95'
                onClick={() => handleTossChooseClick('bowl')}
              >
                Bowl
              </button>
            </div>
          )}

          {!!teamOneStatus?.length && !!teamTwoStatus?.length && (
            <div className='flex flex-wrap items-center justify-around gap-4 w-full mt-20 px-2'>
              {Array.from({ length: 7 }, (_, index) => (
                <button
                  key={index}
                  className='w-16 h-16 text-xl border border-neutral-300 rounded-lg active:bg-neutral-800 active:scale-95'
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
};
