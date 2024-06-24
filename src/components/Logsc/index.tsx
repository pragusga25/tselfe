import { useListLogs } from '@/hooks';
import { formatDateId } from '@/lib/utils';
import { Fragment } from 'react';
import { InView } from 'react-intersection-observer';

export const Logs = () => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    onChangeTime,
    resetFilterTime,
    time,
  } = useListLogs();

  return (
    <div className="pb-12">
      <h1 className="text-2xl font-bold mb-6">Logs Activity</h1>

      <form className="flex flex-col md:flex-row md:items-end gap-y-4 md:gap-y-0 md:gap-x-4 ">
        <div className="form-control">
          <div className="label">
            <span className="label-text">From</span>
          </div>
          <input
            type="datetime-local"
            name="from"
            className="input input-bordered"
            onChange={onChangeTime}
            value={time.from}
          />
        </div>

        <div className="form-control">
          <div className="label">
            <span className="label-text">To</span>
          </div>
          <input
            type="datetime-local"
            name="to"
            className="input input-bordered"
            onChange={onChangeTime}
            value={time.to}
          />
        </div>

        <button
          type="button"
          className="btn btn-error"
          onClick={resetFilterTime}
        >
          Reset Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Log</th>
              <th className="sm:min-w-[180px]">Time</th>
            </tr>
          </thead>
          <tbody>
            {data?.pages?.map((group, i) => {
              return (
                <Fragment key={i}>
                  {group.result.map(({ id, createdAt, message }, idx) => {
                    return (
                      <tr key={id}>
                        <td>{i * 50 + idx + 1}</td>
                        <td>{message}</td>
                        <td>{formatDateId(createdAt, true)}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {(!data || data.pages.length == 0) && !isFetching && (
        <h3 className="mt-5">No data available.</h3>
      )}
      <InView
        as="div"
        onChange={async (inView) => {
          if (inView) {
            await fetchNextPage();
          }
        }}
      />

      {(isFetching || isFetchingNextPage) && (
        <div className="flex justify-center mt-5">
          <span className="loading loading-lg"></span>
        </div>
      )}
    </div>
  );
};
