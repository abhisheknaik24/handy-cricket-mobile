import { useMain } from '@/hooks/use-main-store';
import Image from 'next/image';
import tournaments from '../../data/tournaments.json';
import { Header } from './header';
import { MatchesPage } from './matches-page';

export const TournamentsPage = () => {
  const { tournamentId, setTournamentId } = useMain();

  if (!!tournamentId) {
    return <MatchesPage />;
  }

  return (
    <div className='p-4'>
      <Header title='Tournaments' />

      {!!tournaments?.tournaments?.length && (
        <div className='grid grid-cols-2 gap-2 my-4'>
          {tournaments?.tournaments?.map((tournament) => (
            <div
              key={tournament?.id}
              className='bg-neutral-700 rounded-lg flex flex-col gap-4 items-center justify-center p-4'
              role='button'
              onClick={() => setTournamentId(tournament?.id)}
            >
              <div className='relative h-24 w-full bg-white'>
                <Image src={tournament?.logo} alt={tournament?.name} fill />
              </div>
              <p className='text-sm font-bold capitalize truncate w-full'>
                {tournament?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
