import { memo } from 'react';
import { BiLoader } from 'react-icons/bi';

export const Loader = memo(function Loader() {
  return (
    <div className='fixed inset-0 h-full w-full flex items-center justify-center bg-background z-50'>
      <BiLoader className='text-foreground animate-spin' />
    </div>
  );
});
