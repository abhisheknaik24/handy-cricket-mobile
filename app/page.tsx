'use client';

import { useTab } from '@/hooks/use-tab-store';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Loader } from './_components/loader';

const TournamentsPage = dynamic(
  () =>
    import('./_components/tournaments-page').then(
      (mod) => mod?.TournamentsPage
    ),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

const TeamsPage = dynamic(
  () => import('./_components/teams-page').then((mod) => mod?.TeamsPage),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);

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
