import { useMain } from '@/hooks/use-main-store';
import {
  PointsTableType,
  usePointsTable,
} from '@/hooks/use-points-table-store';
import { calculateRunRate, cn } from '@/lib/utils';
import { memo, useEffect } from 'react';
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

export const PointsTable = memo(function PointsTable({ handleOnClose }: Props) {
  const { tournament, teams, matches } = useMain();

  const { pointsTable, setPointsTable } = usePointsTable();

  useEffect(() => {
    if (!!tournament && !!teams?.length && !!matches?.length) {
      const data: PointsTableType = teams?.map((team) => {
        const wins = matches?.filter((match) => {
          if (
            (team?.id === match?.teamOneId || team?.id === match?.teamTwoId) &&
            team?.id === match?.winnerTeamId
          )
            return match;
        })?.length;

        return {
          teamId: team?.id,
          teamLogo: team?.logo,
          teamName: team?.name,
          totalMatches: matches?.filter((match) => {
            if (team?.id === match?.teamOneId || team?.id === match?.teamTwoId)
              return match;
          }).length,
          matchesPlayed: matches?.filter((match) => {
            if (
              (team?.id === match?.teamOneId ||
                team?.id === match?.teamTwoId) &&
              match?.isMatchPlayed
            )
              return match;
          }).length,
          wins: wins,
          points: wins * 2,
          losses: matches?.filter((match) => {
            if (
              (team?.id === match?.teamOneId ||
                team?.id === match?.teamTwoId) &&
              team?.id === match?.losserTeamId
            )
              return match;
          }).length,
          runRate: calculateRunRate(matches, team),
        };
      });

      data.sort((a, b) => {
        if (b?.points !== a?.points) {
          return b?.points - a?.points;
        }

        if (b?.wins !== a?.wins) {
          return b?.wins - a?.wins;
        }

        if (a?.losses !== b?.losses) {
          return a?.losses - b?.losses;
        }

        if (b?.runRate !== a?.runRate) {
          return b?.runRate - a?.runRate;
        }

        return a?.teamName?.localeCompare(b?.teamName);
      });

      setPointsTable(data);
    }
  }, [tournament, teams, matches, setPointsTable]);

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
              key={item?.teamId}
              className={cn(
                'bg-neutral-800 border border-neutral-500 active:bg-neutral-800/50',
                index === 3 && 'border-b border-b-yellow-300'
              )}
            >
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.teamName}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.totalMatches}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.matchesPlayed}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.wins}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.losses}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.points}
              </td>
              <td className='p-2 text-sm text-center capitalize truncate'>
                {item?.runRate?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
