import { memo } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsPlusSquare } from 'react-icons/bs';

type Props = {
  title: string;
  isAddTournamentActive?: boolean;
  isSyncActive?: boolean;
  handleAddTournamentClick?: () => void;
  handleSyncClick?: () => void;
};

export const Header = memo(function Header({
  title,
  isAddTournamentActive,
  isSyncActive,
  handleAddTournamentClick,
  handleSyncClick,
}: Props) {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-4xl font-bold text-neutral-300'>{title}</h1>
      {isAddTournamentActive && (
        <button
          className='text-4xl text-neutral-500 active:scale-105'
          onClick={handleAddTournamentClick}
        >
          <BsPlusSquare />
        </button>
      )}
      {isSyncActive && (
        <button
          className='text-4xl text-neutral-500 active:scale-105'
          onClick={handleSyncClick}
        >
          <BiRefresh className='active:animate-spin' />
        </button>
      )}
    </div>
  );
});
