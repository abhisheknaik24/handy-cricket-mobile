import { TournamentType, useMain } from '@/hooks/use-main-store';
import { useStorage } from '@/hooks/use-storage';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';
import { GiLaurelsTrophy } from 'react-icons/gi';
import teams from '../../data/teams.json';
import { Loader } from './loader';

const Header = dynamic(() => import('./header').then((mod) => mod?.Header), {
  loading: () => <Loader />,
  ssr: false,
});

const AddTournament = dynamic(
  () => import('./add-tournament').then((mod) => mod?.AddTournament),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const MatchesPage = dynamic(
  () => import('./matches-page').then((mod) => mod?.MatchesPage),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

export const TournamentsPage = memo(function TournamentsPage() {
  const { getStorage } = useStorage();

  const {
    tournaments,
    tournament,
    setTournaments,
    setTournament,
    setTeams,
    setMatches,
  } = useMain();

  const [showAddTournament, setShowAddTournament] = useState<boolean>(false);

  const handleTournamentClick = async (tournamentValue: TournamentType) => {
    setTournament(tournamentValue);

    const data = await getStorage(String(tournamentValue?.id));

    if (tournamentValue?.teams === 'ipl_teams') {
      setTeams(teams?.ipl_teams);
    } else {
      setTeams(teams?.international_teams);
    }

    setMatches(data);
  };

  const handleAddTournamentClose = () => {
    setShowAddTournament(false);

    handleTournamentsSyncClick();
  };

  const handleTournamentsSyncClick = async () => {
    const data = await getStorage('tournaments');

    if (!!data?.length) {
      setTournaments(data);
    } else {
      setTournaments([]);
    }
  };

  if (!!tournament?.id) {
    return <MatchesPage />;
  }

  return (
    <div className='p-4'>
      <Header
        title='Tournaments'
        isAddTournamentActive
        isSyncActive
        handleAddTournamentClick={() => setShowAddTournament((prev) => !prev)}
        handleSyncClick={handleTournamentsSyncClick}
      />

      {!!tournaments?.length && (
        <div className='grid grid-cols-2 gap-2 my-4'>
          {tournaments?.map((tournament) => (
            <div
              key={tournament?.id}
              className='bg-neutral-800 rounded-lg flex items-center justify-center p-2 active:bg-neutral-800/50 active:scale-95'
              role='button'
              onClick={() => handleTournamentClick(tournament)}
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

      {showAddTournament && (
        <AddTournament handleAddTournamentClose={handleAddTournamentClose} />
      )}
    </div>
  );
});
