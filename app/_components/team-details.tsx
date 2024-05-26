import { MatchType } from '@/hooks/use-main-store';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { memo } from 'react';
import { LuCoins, LuUser2 } from 'react-icons/lu';

type Props = {
  teamId: number;
  teamLogo: string;
  teamName: string;
  teamStatus: string | null;
  teamScore: number;
  teamWickets: number;
  teamBalls: number;
  match: MatchType;
  handlePlayerTeamClick: (teamId: number) => void;
};

export const TeamDetails = memo(function TeamDetails({
  teamId,
  teamLogo,
  teamName,
  teamStatus,
  teamScore,
  teamWickets,
  teamBalls,
  match,
  handlePlayerTeamClick,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 relative px-2 py-4 rounded-lg',
        !match?.playerTeamId &&
          !match?.isMatchPlayed &&
          'border border-green-500 active:scale-95'
      )}
      role='button'
      onClick={() =>
        !match?.playerTeamId && !match?.isMatchPlayed
          ? handlePlayerTeamClick(teamId)
          : {}
      }
    >
      {match?.winnerTeamId === teamId && (
        <div className='absolute -top-4 text-2xl text-green-500 font-bold'>
          Winner!
        </div>
      )}
      <div className='relative h-20 w-20 bg-white rounded-full'>
        <Image src={teamLogo} alt={teamName} className='p-4' fill />
        {match?.playerTeamId === teamId && (
          <LuUser2 className='absolute bottom-0 left-0 bg-green-500 rounded-full text-4xl p-2 text-white' />
        )}
        {match?.tossWinnerTeamId === teamId && (
          <LuCoins className='absolute top-0 right-0 bg-yellow-500 rounded-full text-4xl p-2 text-white z-10' />
        )}
      </div>
      <p className='text-lg font-bold capitalize truncate'>{teamName}</p>
      {!match?.playerTeamId && !match?.isMatchPlayed && (
        <p className='text-green-300 text-sm'>Select Your Team</p>
      )}
      {!!match?.tossWinnerTeamId &&
        !!teamStatus?.length &&
        !match?.isMatchPlayed && <span>({teamStatus})</span>}
      <div className='flex flex-col items-center justify-center gap-2 w-full'>
        <div className='text-4xl font-semibold mt-2'>
          {teamScore}
          <span className='mx-1'>/</span>
          {teamWickets}
        </div>
        {!!match?.playerTeamId &&
          !!match?.tossWinnerTeamId &&
          teamStatus === 'bat' &&
          !match?.isMatchPlayed && (
            <div className='text-sm w-full truncate'>
              {teamBalls} balls remainings
            </div>
          )}
      </div>
    </div>
  );
});
