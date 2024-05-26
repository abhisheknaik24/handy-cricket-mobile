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
    <div className='fixed left-0 right-0 bottom-0 w-full h-4/5 p-4 bg-neutral-700 rounded-t-2xl z-10 overflow-auto'>
      <div className='relative flex items-center justify-between w-full mb-4'>
        <h3 className='text-neutral-300 font-bold'>Points Table</h3>
        <button
          className='fixed right-4 text-lg text-neutral-300'
          onClick={handleOnClose}
        >
          <CgClose />
        </button>
      </div>
      <table className='w-full'>
        <thead className='w-full'>
          <tr className='bg-neutral-900'>
            {columns?.map((column, index) => (
              <th
                key={column}
                className={cn(
                  'p-2 text-sm text-center font-semibold capitalize truncate',
                  index === 0 && 'rounded-tl-2xl',
                  index === columns?.length - 1 && 'rounded-tr-2xl'
                )}
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
                'bg-neutral-800 border border-neutral-500 active:bg-neutral-800/50',
                index === 3 && 'border-b border-b-yellow-300'
              )}
            >
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.teamName}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.totalMatches}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.matchesPlayed}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.wins}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.losses}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.points}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item.runRate.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
