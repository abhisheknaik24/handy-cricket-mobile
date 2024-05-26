import { useMain } from '@/hooks/use-main-store';
import { GiLaurelsTrophy } from 'react-icons/gi';
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
              className='bg-neutral-800 rounded-lg flex items-center justify-center p-2 active:bg-neutral-800/50 active:scale-95'
              role='button'
              onClick={() => setTournamentId(tournament?.id)}
            >
              <div className='flex flex-col items-center justify-center gap-4 w-full h-full p-2 border-2 border-neutral-500/50 rounded-lg'>
                <GiLaurelsTrophy className='w-20 h-20 text-6xl text-amber-500' />
                <p className='w-full text-sm text-center font-bold uppercase truncate'>
                  {tournament?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
