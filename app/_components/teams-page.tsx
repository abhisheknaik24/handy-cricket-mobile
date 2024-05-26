import { cn } from '@/lib/utils';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import teams from '../../data/teams.json';
import { Header } from './header';

export const TeamsPage = memo(function TeamsPage() {
  const [tournamentTeams, setTournamentTeams] = useState<any>(null);

  const [tournamentTeamsKeys, setTournamentTeamsKeys] = useState<string[]>([]);

  const [tournamentTeamsKey, setTournamentTeamsKey] = useState<string>('');

  useEffect(() => {
    setTournamentTeams(teams as any);

    const data = Object.keys(teams)?.map((team) =>
      team?.toLowerCase()?.replaceAll('_', ' ')
    );

    setTournamentTeamsKeys(data);

    setTournamentTeamsKey(data[0]?.replaceAll(' ', '_'));
  }, []);

  return (
    <div className='p-4 pb-16'>
      <Header title='Teams' />

      {!!tournamentTeamsKeys?.length && (
        <div className='flex items-center gap-2 my-4 overflow-x-auto'>
          {tournamentTeamsKeys?.map((item) => (
            <button
              key={item}
              className={cn(
                'px-4 py-2 rounded-lg text-sm text-nowrap font-semibold uppercase active:bg-neutral-800/50 active:scale-95',
                item?.replaceAll(' ', '_') === tournamentTeamsKey
                  ? 'bg-neutral-700'
                  : 'bg-neutral-800'
              )}
              onClick={() => setTournamentTeamsKey(item?.replaceAll(' ', '_'))}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {!!tournamentTeams?.[tournamentTeamsKey]?.length && (
        <div className='grid grid-cols-2 gap-2 my-4'>
          {tournamentTeams?.[tournamentTeamsKey]?.map((team: any) => (
            <div
              key={team?.id}
              className='bg-neutral-800 rounded-lg flex flex-col gap-4 items-center justify-center p-4 active:bg-neutral-800/50 active:scale-95'
            >
              <div className='relative h-20 w-20 bg-white rounded-full'>
                <Image src={team?.logo} className='p-4' alt={team?.name} fill />
              </div>
              <p className='text-sm font-bold uppercase'>{team?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
