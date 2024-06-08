import { useStorage } from '@/hooks/use-storage';
import { FormEvent, memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import teams from '../../data/teams.json';

type Props = {
  handleAddTournamentClose: () => void;
};

export const AddTournament = memo(function AddTournament({
  handleAddTournamentClose,
}: Props) {
  const { getStorage, postStorage } = useStorage();

  const [tournamentTeams, setTournamentTeams] = useState<string[]>([]);

  const [formInput, setFormInput] = useState<{
    name: string;
    teams: string;
    balls: number;
  }>({
    name: '',
    teams: '',
    balls: 0,
  });

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formInput.name?.length ||
      !formInput.teams?.length ||
      !formInput.balls
    ) {
      return toast.error('Please enter the fields!');
    }

    const data = await getStorage('tournaments');

    if (!!data?.length) {
      postStorage('tournaments', [
        ...data,
        {
          id: data?.length + 1,
          name: formInput.name,
          teams: formInput.teams?.replaceAll(' ', '_'),
          balls: formInput.balls,
        },
      ]);
    } else {
      postStorage('tournaments', [
        {
          id: 1,
          name: formInput.name,
          teams: formInput.teams?.replaceAll(' ', '_'),
          balls: formInput.balls,
        },
      ]);
    }

    toast.success('Tournamet added successfully!');

    handleAddTournamentClose();
  };

  useEffect(() => {
    const data = Object.keys(teams)?.map((team) =>
      team?.toLowerCase()?.replaceAll('_', ' ')
    );

    setTournamentTeams(data);
  }, []);

  return (
    <div className='fixed left-0 right-0 bottom-0 w-full h-4/5 p-4 bg-neutral-700 rounded-t-2xl z-10 overflow-auto'>
      <div className='relative flex items-center justify-between w-full mb-4'>
        <h3 className='text-neutral-300 font-bold'>Add Tournament</h3>
        <button
          className='fixed right-4 text-lg text-neutral-300'
          onClick={handleAddTournamentClose}
        >
          <CgClose />
        </button>
      </div>
      <form onSubmit={handleOnSubmit}>
        <div className='mb-3'>
          <label className='text-lg'>Tournament Name</label>
          <input
            type='text'
            className='w-full h-full mt-1 px-4 py-2 bg-neutral-800 text-lg rounded-lg outline-neutral-800/50'
            value={formInput.name}
            placeholder='Tournament Name'
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
        </div>
        <div className='mb-3'>
          <label className='text-lg'>Teams</label>
          <select
            className='w-full h-full mt-1 px-4 py-2 bg-neutral-800 text-lg rounded-lg outline-neutral-800/50'
            value={formInput.teams}
            onChange={(e) =>
              setFormInput({
                ...formInput,
                teams: e.target.value,
              })
            }
          >
            <option value=''>Select Team</option>
            {tournamentTeams?.map((tournamentTeam) => (
              <option key={tournamentTeam} value={tournamentTeam}>
                {tournamentTeam}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-6'>
          <label className='text-lg'>Balls</label>
          <input
            type='number'
            className='w-full h-full mt-1 px-4 py-2 bg-neutral-800 text-lg rounded-lg outline-neutral-800/50'
            value={formInput.balls}
            placeholder='Balls'
            onChange={(e) =>
              setFormInput({ ...formInput, balls: Number(e.target.value) })
            }
          />
        </div>
        <div className='float-right'>
          <button
            type='submit'
            className='bg-neutral-800 px-6 py-2 font-semibold rounded-lg active:bg-neutral-800/50 active:scale-95'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
});
