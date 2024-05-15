import {
  useAcceptAssignmentRequests,
  useDeleteAssignmentRequests,
  useListAssignmentRequests,
  useRejectAssignmentRequests,
} from '@/hooks';
import { formatDate } from '@/lib/utils';
import { RequestAssignmentOperation, RequestAssignmentStatus } from '@/types';

export const AssignmentRequests = () => {
  const { data, refetch } = useListAssignmentRequests();
  const { mutate: accept, isPending: accepting } =
    useAcceptAssignmentRequests();
  const { mutate: reject, isPending: rejecting } =
    useRejectAssignmentRequests();

  const { mutate: deleteAssignmentRequests, isPending: deleting } =
    useDeleteAssignmentRequests();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assignment Requests</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Requester</th>
              <th>Principal</th>
              {/* <th>Principal ID</th> */}
              <th>Permission Sets</th>
              <th>Operation</th>
              <th>Note</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Responder</th>
              <th>Responded At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((req, idx) => {
              let badge = 'badge-accent';
              let badgeOp = 'badge-warning';
              const { status, operation } = req;
              if (status === RequestAssignmentStatus.ACCEPTED) {
                badge = 'badge-success';
              } else if (status === RequestAssignmentStatus.REJECTED) {
                badge = 'badge-error';
              }

              if (operation === RequestAssignmentOperation.ATTACH) {
                badgeOp = 'badge-info';
              }

              const ableToDelete =
                req.status !== RequestAssignmentStatus.PENDING;

              const {
                name,
                principalDisplayName,
                username,
                principalId,
                principalType,
              } = req.requester;

              return (
                <tr key={req.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {name} (@{username})
                  </td>
                  <td>
                    {principalDisplayName} ({principalType}) - {principalId}
                  </td>
                  {/* <td>{principalId}</td> */}
                  <td>
                    {req.permissionSets
                      .map((ps) => {
                        if (ps.name) {
                          return ps.name;
                        }

                        return ps.arn;
                      })
                      .join(', ')}
                  </td>
                  <td className={`badge ${badgeOp} badge-outline`}>
                    {operation}
                  </td>
                  <td>{req.note}</td>
                  <td className={`badge ${badge} badge-outline `}>{status}</td>
                  <td>{formatDate(req.requestedAt)}</td>
                  <td>
                    {req.responder ? (
                      <>
                        {req.responder.name} ({req.responder.username})
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{req.respondedAt ? formatDate(req.respondedAt) : '-'}</td>
                  <td className="flex flex-col">
                    {ableToDelete ? (
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          deleteAssignmentRequests({ ids: [req.id] });
                          refetch();
                        }}
                        disabled={deleting}
                      >
                        {deleting && (
                          <span className="loading loading-spinner"></span>
                        )}
                        Delete
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-success mb-2"
                          onClick={() =>
                            accept({ ids: [req.id], operation: req.operation })
                          }
                          disabled={accepting}
                        >
                          {accepting && (
                            <span className="loading loading-spinner"></span>
                          )}
                          Accept
                        </button>
                        <button
                          className="btn btn-error"
                          onClick={() => reject({ ids: [req.id] })}
                          disabled={rejecting}
                        >
                          {rejecting && (
                            <span className="loading loading-spinner"></span>
                          )}
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(!data || data.length == 0) && (
        <h3 className="mt-5">No data available.</h3>
      )}
    </div>
  );
};
