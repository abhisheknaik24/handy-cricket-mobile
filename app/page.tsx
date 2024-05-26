'use client';

import { useTab } from '@/hooks/use-tab-store';
import { useEffect } from 'react';
import { TeamsPage } from './_components/teams-page';
import { TournamentsPage } from './_components/tournaments-page';

const HomePage = () => {
  const { tab, setTab } = useTab();

  useEffect(() => {
    if (!tab?.length) {
      setTab('tournaments');
    }
  }, [tab, setTab]);

  if (tab === 'tournaments') {
    return <TournamentsPage />;
  }

  if (tab === 'teams') {
    return <TeamsPage />;
  }

  return null;
};

export default HomePage;
