import { usePointsTable } from '@/hooks/use-points-table-store';
import { cn } from '@/lib/utils';
import { CgClose } from 'react-icons/cg';

const columns = [
  'Team',
  'Total Matches',
  'Matches Played',
  'Wins',
  'Losses',
  'points',
  'Run Rate',
];

type Props = {
  handleOnClose: () => void;
};

export const PointsTable = ({ handleOnClose }: Props) => {
  const { pointsTable } = usePointsTable();

  if (!pointsTable?.length) {
    return null;
  }

  return (
    <div className='fixed left-0 right-0 bottom-0 w-full h-full p-4 bg-neutral-700 rounded-t-2xl z-10 overflow-auto'>
      <div className='relative flex items-center justify-between w-full mb-4'>
        <h3 className='text-2xl text-neutral-300 font-bold'>Points Table</h3>
        <button
          className='fixed right-4 text-2xl text-neutral-300'
          onClick={handleOnClose}
        >
          <CgClose />
        </button>
      </div>
      <table className='w-full'>
        <thead className='w-full'>
          <tr className='bg-neutral-800 border border-neutral-900'>
            {columns?.map((column) => (
              <th
                key={column}
                className='p-4 text-lg text-center font-semibold capitalize truncate'
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='w-full'>
          {pointsTable.map((item, index) => (
            <tr
              key={item.teamId}
              className={cn(
                'border',
                index < 4
                  ? 'bg-yellow-500/50 border-yellow-300'
                  : 'border-neutral-800'
              )}
            >
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.teamName}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.totalMatches}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.matchesPlayed}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.wins}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.points}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.losses}
              </td>
              <td className='p-4 text-lg text-center capitalize truncate'>
                {item.runRate.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
