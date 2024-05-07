import {
  useListAssignments,
  usePullAssignments,
  usePushAssignments,
} from '@/hooks';

export const Assignments = () => {
  const { data } = useListAssignments();
  const { mutate, isPending } = usePullAssignments();
  const { mutate: push, isPending: pushing } = usePushAssignments();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Assignments</h1>
      <div className="flex justify-end mb-2">
        <button
          className={`btn btn-primary btn-md ${isPending && 'disabled'}`}
          onClick={async () => {
            mutate();
          }}
          disabled={isPending}
        >
          {isPending && <span className="loading loading-spinner"></span>}
          Pull
        </button>
        <button
          className={`btn btn-primary btn-md ml-4 ${pushing && 'disabled'}`}
          onClick={async () => {
            push();
          }}
          disabled={pushing}
        >
          {pushing && <span className="loading loading-spinner"></span>}
          Push
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Display Name</th>
              <th>Type</th>
              <th>Permission Sets</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((assignment, idx) => (
              <tr key={assignment.id}>
                <td>{idx + 1}</td>
                <td>{assignment.principalId}</td>
                <td>{assignment.principalDisplayName}</td>
                <td>{assignment.principalType}</td>
                <td>
                  {assignment.permissionSets
                    .map((ps) => {
                      if (ps.name) {
                        return ps.name;
                      }

                      return ps.arn;
                    })
                    .join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!data || data.length == 0) && (
        <h3 className="mt-5">No data available, please synchronize first.</h3>
      )}
    </div>
  );
};
