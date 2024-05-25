import Image from 'next/image';
import teams from '../../data/teams.json';
import { Header } from './header';

export const TeamsPage = () => {
  return (
    <div className='p-4 pb-16'>
      <Header title='Teams' />

      {!!teams?.teams?.length && (
        <div className='grid grid-cols-2 gap-2 my-4'>
          {teams?.teams?.map((team) => (
            <div
              key={team?.id}
              className='bg-neutral-700 rounded-lg flex flex-col gap-4 items-center justify-center p-4 active:bg-neutral-800'
            >
              <div className='relative h-20 w-20 bg-white rounded-full'>
                <Image src={team?.logo} className='p-2' alt={team?.name} fill />
              </div>
              <p className='text-sm font-bold'>{team?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
