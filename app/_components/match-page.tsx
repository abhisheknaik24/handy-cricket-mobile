import { useMain } from '@/hooks/use-main-store';
import { Preferences } from '@capacitor/preferences';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import tournaments from '../../data/tournaments.json';
import { TeamDetails } from './team-details';

export const MatchPage = () => {
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
    setTournamentId,
    setMatches,
    setMatchId,
    setPlayerTeamId,
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

  const [showTossChoose, setShowTossChoose] = useState(false);

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
    if (!!match) {
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

            await Preferences.set({
              key: 'matches',
              value: JSON.stringify({
                matches: data,
              }),
            });

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

            await Preferences.set({
              key: 'matches',
              value: JSON.stringify({
                matches: data,
              }),
            });

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

            await Preferences.set({
              key: 'matches',
              value: JSON.stringify({
                matches: data,
              }),
            });

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

  useEffect(() => {
    if (!!match) {
      setTeamOneScore(match.teamOneScore);
      setTeamOneWickets(match.teamOneWickets);
      setTeamOneBalls(match.teamOneBalls);
      setTeamTwoScore(match.teamTwoScore);
      setTeamTwoWickets(match.teamTwoWickets);
      setTeamTwoBalls(match.teamTwoBalls);
    }
  }, [
    match,
    setTeamOneBalls,
    setTeamOneScore,
    setTeamOneWickets,
    setTeamTwoBalls,
    setTeamTwoScore,
    setTeamTwoWickets,
  ]);

  if (!tournament || !match) {
    return null;
  }

  return (
    <div className='p-4 pb-20'>
      <div className='flex items-center gap-2 w-full'>
        {(!playerTeamId || inning === 'over') && (
          <button className='text-2xl' onClick={() => setMatchId(null)}>
            <MdKeyboardArrowLeft />
          </button>
        )}
        <div className='relative h-16 w-16 bg-white rounded-full'>
          <Image
            src={tournament.logo}
            alt={tournament.name}
            className='p-2'
            fill
          />
        </div>
        <h3 className='text-lg capitalize truncate'>{tournament.name}</h3>
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
      </div>

      <div className='flex items-start justify-around w-full py-4'>
        <TeamDetails
          teamId={match?.teamOneId}
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
            className='bg-yellow-500 px-6 py-2 text-2xl font-semibold rounded-lg active:scale-95 active:bg-yellow-500/50'
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
                className='bg-neutral-700 px-6 py-2 font-semibold rounded-lg active:scale-95 active:bg-neutral-700/50'
                onClick={() => handleTossChooseClick('bat')}
              >
                Bat
              </button>
              <button
                className='bg-neutral-700 px-6 py-2 font-semibold rounded-lg active:scale-95 active:bg-neutral-700/50'
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
                  className='w-16 h-16 text-xl border border-neutral-300 rounded-lg active:bg-neutral-700 active:scale-95'
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
