import { useTab } from '@/hooks/use-tab-store';
import { cn } from '@/lib/utils';

export const Footer = () => {
  const { tab, setTab } = useTab();

  return (
    <div className='fixed left-0 right-0 bottom-0 w-full h-16 bg-neutral-800 grid grid-cols-2 text-lg font-semibold'>
      <button
        className={cn(
          'bg-neutral-700 active:bg-neutral-900',
          tab === 'tournaments' && 'bg-neutral-900'
        )}
        onClick={() => setTab('tournaments')}
      >
        Tournaments
      </button>
      <button
        className={cn(
          'bg-neutral-700 active:bg-neutral-900',
          tab === 'teams' && 'bg-neutral-900'
        )}
        onClick={() => setTab('teams')}
      >
        Teams
      </button>
    </div>
  );
};
