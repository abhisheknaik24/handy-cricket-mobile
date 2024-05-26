import { memo } from 'react';
import { RiLoader4Fill } from 'react-icons/ri';

export const Loader = memo(function Loader() {
  return (
    <div className='fixed inset-0 h-full w-full flex items-center justify-center bg-neutral-900 z-50'>
      <RiLoader4Fill className='animate-spin' size={48} />
    </div>
  );
});
