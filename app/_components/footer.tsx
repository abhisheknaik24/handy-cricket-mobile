import { TabType, useTab } from '@/hooks/use-tab-store';
import { cn } from '@/lib/utils';
import { memo } from 'react';

const tabs: TabType[] = ['tournaments', 'teams'];

export const Footer = memo(function Footer() {
  const { tab, setTab } = useTab();

  return (
    <div className='fixed left-0 right-0 bottom-0 w-full h-16 bg-neutral-800 grid grid-cols-2 text-lg font-semibold'>
      {tabs?.map((item) => (
        <button
          key={item}
          className={cn(
            'bg-neutral-800 active:bg-neutral-900 active:scale-95',
            item === tab && 'bg-neutral-900'
          )}
          onClick={() => setTab(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
});
