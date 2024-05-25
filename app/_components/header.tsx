import { BiRefresh } from 'react-icons/bi';

type Props = {
  title: string;
  isSyncActive?: boolean;
  handleSyncClick?: () => void;
};

export const Header = ({ title, isSyncActive, handleSyncClick }: Props) => {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-4xl font-bold text-neutral-300'>{title}</h1>
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
};
