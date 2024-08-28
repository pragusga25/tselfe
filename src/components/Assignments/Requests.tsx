import {
  useAcceptAssignmentRequests,
  useAcceptAssignmentUserRequest,
  useAuth,
  useCreateTimeInHour,
  useDeleteAssignmentRequests,
  useDeleteAssignmentUserRequest,
  useDeleteTimeInHour,
  useListAssignmentRequests,
  useListAssignmentUserRequests,
  useListTimeInHours,
  useRejectAssignmentRequests,
  useRejectAssignmentUserRequest,
} from '@/hooks';
import { formatDate } from '@/lib/utils';
import { RequestAssignmentOperation, RequestAssignmentStatus } from '@/types';
import { useEffect, useState } from 'react';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { useSearchParams } from 'react-router-dom';
import { RespondModal } from '../Modal/RespondModal';

export const AssignmentRequests = () => {
  const { data, isLoading } = useListAssignmentRequests();
  const {
    auth: { user },
  } = useAuth();
  const { mutate: accept } = useAcceptAssignmentRequests();

  const { mutate: acceptUserRequest } = useAcceptAssignmentUserRequest();

  const { mutate: rejectUserRequest } = useRejectAssignmentUserRequest();

  const { mutate: deleteUserRequest, isPending: deletingUserRequest } =
    useDeleteAssignmentUserRequest();

  const { mutate: reject } = useRejectAssignmentRequests();

  const {
    data: assignmentUserRequestsData,
    isLoading: isAssignmentUserRequestsFetching,
  } = useListAssignmentUserRequests();

  const { data: timeInHoursData } = useListTimeInHours();
  const { mutate: createTimeInHour, isPending: creatingTimeInHour } =
    useCreateTimeInHour();
  const { mutate: deleteTimeInHour, isPending: deletingTimeInHour } =
    useDeleteTimeInHour();

  const { mutate: deleteAssignmentRequests, isPending: deleting } =
    useDeleteAssignmentRequests();

  const [timeInHourPayload, setTimeInHourPayload] = useState<number>(1);
  const [deleteUserReqId, setDeleteUserReqId] = useState('');

  const [searchParams] = useSearchParams();
  const [actionId, setActionId] = useState('');
  let typeParam = searchParams.get('type');
  typeParam = typeParam ?? 'GROUP';
  const isInitGroup = typeParam === 'group' || typeParam === 'GROUP';
  const isInitUser = typeParam === 'user' || typeParam === 'USER';

  const [tab, setTab] = useState(isInitGroup ? 'GROUP' : 'USER');
  const isGroupTabActive = tab === 'GROUP';

  const showPage = !!user?.isRoot || !!user?.isApprover;

  const idParam = searchParams.get('id');
  const actionParam = searchParams.get('action');

  const isAccept = actionParam === 'accept' || actionParam === 'ACCEPT';
  const isReject = actionParam === 'reject' || actionParam === 'REJECT';

  const [respondPayload, setRespondPayload] = useState<{
    type: 'regular' | 'user';
    requestId: string;
  }>({
    type: 'regular',
    requestId: '',
  });

  const [onOpen, setOnOpen] = useState(false);

  const onRespond = (requestId: string) => {
    setRespondPayload((prev) => ({
      ...prev,
      requestId,
    }));
    setOnOpen(true);
  };

  const onGroupTab = () => {
    setTab('GROUP');
    setRespondPayload((prev) => ({
      ...prev,
      type: 'regular',
    }));
  };
  const onUserTab = () => {
    setTab('USER');
    setRespondPayload((prev) => ({
      ...prev,
      type: 'user',
    }));
  };

  useEffect(() => {
    if (
      idParam &&
      !isAssignmentUserRequestsFetching &&
      !isLoading &&
      typeParam
    ) {
      const el = document.getElementById(idParam);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [idParam, isAssignmentUserRequestsFetching, isLoading, typeParam]);

  useEffect(() => {
    if ((user?.isRoot || user?.isApprover) && idParam) {
      if (isInitGroup && data) {
        const d = data?.find((d) => d.id === idParam);
        if (!d || d.status != RequestAssignmentStatus.PENDING) return;
        if (isAccept) {
          accept({
            ids: [idParam],
          });
        } else if (isReject) {
          reject({
            ids: [idParam],
          });
        }
      }
    }
  }, [idParam, actionParam, isAccept, isReject, isInitGroup, data]);

  useEffect(() => {
    if ((user?.isRoot || user?.isApprover) && idParam) {
      if (isInitUser && assignmentUserRequestsData) {
        const d = assignmentUserRequestsData?.find((d) => d.id === idParam);
        if (!d || d.status != RequestAssignmentStatus.PENDING) return;
        if (isAccept) {
          acceptUserRequest({
            id: idParam,
          });
        } else if (isReject) {
          rejectUserRequest({
            id: idParam,
          });
        }
      }
    }
  }, [
    idParam,
    actionParam,
    isAccept,
    isReject,
    isInitUser,
    assignmentUserRequestsData,
  ]);

  useEffect(() => {
    if (!showPage) {
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
    }
  }, [user?.isRoot, user?.isApprover]);

  if (!showPage) {
    return null;
  }

  if (!showPage) {
    return (
      <div className="w-full">
        <h1>
          You are not an approver. You will be redirected to the home page.
        </h1>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <RespondModal
        isOpen={onOpen}
        onClose={() => setOnOpen(false)}
        requestId={respondPayload.requestId}
        requestType={respondPayload.type}
        key={respondPayload.requestId}
      />
      <h1 className="text-2xl font-bold mb-6">Assignment Requests</h1>

      <div className="flex justify-end mb-4">
        <ModalButton
          id="createTimeInHour"
          text="Set Time"
          className="btn btn-primary"
        />

        <Modal id="createTimeInHour" title="Set Time">
          <>
            <form className="w-full">
              <div className="flex items-center w-full">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="number"
                    className="grow"
                    placeholder="Enter time in hours"
                    value={timeInHourPayload}
                    onChange={(e) => {
                      setTimeInHourPayload(Number(e.target.value));
                    }}
                  />
                  <span className="">h</span>
                </label>

                <button
                  className="btn btn-primary ml-4"
                  type="button"
                  onClick={() => {
                    createTimeInHour({ timeInHour: timeInHourPayload });
                  }}
                  disabled={creatingTimeInHour}
                >
                  Add
                </button>
              </div>
            </form>
            <div className="overflow-x-auto mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Time (in hours)</th>
                    <th>Creator</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {timeInHoursData?.map(({ timeInHour, creator }) => (
                    <tr key={timeInHour}>
                      <td>{timeInHour}</td>
                      <td>{creator?.name}</td>
                      <td>
                        <button
                          className="btn btn-error"
                          onClick={() => deleteTimeInHour({ timeInHour })}
                          disabled={deletingTimeInHour}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </Modal>
      </div>

      <div role="tablist" className="tabs tabs-boxed my-5">
        <a
          role="tab"
          className={`tab ${isGroupTabActive ? 'tab-active' : ''}`}
          onClick={onGroupTab}
        >
          GROUP
        </a>
        <a
          role="tab"
          className={`tab ${isGroupTabActive ? '' : 'tab-active'}`}
          onClick={onUserTab}
        >
          USER
        </a>
      </div>

      {!isGroupTabActive && (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Requester</th>
                  <th>Permission Set</th>
                  <th>Note</th>
                  <th>AWS Account</th>
                  <th>Status</th>
                  <th>Time (in hours)</th>
                  <th>End At</th>
                  <th>Responder</th>
                  <th>Responder Note</th>
                  <th>Responded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignmentUserRequestsData?.map((req, idx) => {
                  let badge = 'badge-warning';

                  const { status } = req;
                  if (status === RequestAssignmentStatus.ACCEPTED) {
                    badge = 'badge-success';
                  } else if (status === RequestAssignmentStatus.REJECTED) {
                    badge = 'badge-error';
                  }

                  const isPending =
                    req.status === RequestAssignmentStatus.PENDING;

                  let ableToDelete =
                    req.status !== RequestAssignmentStatus.PENDING;

                  if (
                    req.status === RequestAssignmentStatus.ACCEPTED &&
                    req.endAt &&
                    new Date() <= new Date(req.endAt)
                  ) {
                    ableToDelete = false;
                  }

                  const { name } = req.requester;
                  const deletingThisData =
                    deleteUserReqId === req.id && deletingUserRequest;

                  return (
                    <tr
                      key={req.id}
                      id={req.id}
                      className={req.id === idParam ? 'text-info' : ''}
                    >
                      <td>{idx + 1}</td>
                      <td>{name}</td>
                      <td>{req.permissionSetName}</td>
                      <td>{req.note}</td>
                      <td>{req.awsAccountName}</td>
                      <td>
                        <span className={`badge ${badge} badge-outline`}>
                          {status}
                        </span>
                      </td>
                      <td>{req.timeInHour}</td>
                      <td>{req.endAt ? formatDate(req.endAt, true) : '-'}</td>
                      <td>{req.responder ? <>{req.responder.name}</> : '-'}</td>
                      <td>{req.responderNote}</td>

                      <td className="flex flex-col">
                        {isPending && (
                          <>
                            <button
                              className="btn btn-primary mb-2"
                              onClick={() => {
                                onRespond(req.id);
                              }}
                            >
                              Respond
                            </button>
                            {/* <button
                              className="btn btn-success mb-2"
                              onClick={() => {
                                acceptUserRequest({ id: req.id });
                                setActionId(req.id);
                              }}
                              disabled={acceptingUserRequest}
                            >
                              {acceptingUserRequest ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                'Accept'
                              )}
                            </button>
                            <button
                              className="btn btn-error"
                              onClick={() => {
                                rejectUserRequest({ id: req.id });
                                setActionId(req.id);
                              }}
                              disabled={rejectingUserRequest}
                            >
                              {rejectingUserRequest ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                'Reject'
                              )}
                            </button> */}
                          </>
                        )}
                        {ableToDelete && (
                          <button
                            className="btn btn-error"
                            onClick={() => {
                              setDeleteUserReqId(req.id);
                              deleteUserRequest({ id: req.id });
                              setActionId(req.id);
                            }}
                            disabled={deletingThisData}
                          >
                            {deletingThisData ? (
                              <span className="loading loading-spinner"></span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(!assignmentUserRequestsData ||
            assignmentUserRequestsData.length == 0) &&
            !isAssignmentUserRequestsFetching && (
              <h3 className="mt-5">No data available.</h3>
            )}
          {isAssignmentUserRequestsFetching && (
            <div className="flex justify-center mt-5">
              <span className="loading loading-lg"></span>
            </div>
          )}
        </>
      )}

      {isGroupTabActive && (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Requester</th>
                  <th>AWS Account/Principal</th>
                  <th>Permission Sets</th>
                  <th>Note</th>
                  <th>Operation</th>
                  <th>Status</th>
                  <th>Requested At</th>
                  <th>Responder</th>
                  <th>Responder Note</th>
                  <th>Responded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((req, idx) => {
                  let badge = 'badge-warning';
                  let badgeOp = 'badge-accent';
                  const {
                    status,
                    operation,
                    awsAccountName,
                    principalDisplayName,
                    responderNote,
                  } = req;
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

                  const { name } = req.requester;
                  const principal = `${awsAccountName}/${principalDisplayName}`;

                  return (
                    <tr
                      key={req.id}
                      id={req.id}
                      className={req.id === idParam ? 'text-info' : ''}
                    >
                      <td>{idx + 1}</td>
                      <td>{name}</td>
                      <td>{principal}</td>
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
                      <td>{req.note}</td>
                      <td>
                        <span className={`badge ${badgeOp} badge-outline`}>
                          {operation}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${badge} badge-outline`}>
                          {status}
                        </span>
                      </td>
                      <td>{formatDate(req.requestedAt)}</td>
                      <td>{req.responder ? <>{req.responder.name}</> : '-'}</td>
                      <td>{responderNote ? responderNote : '-'}</td>
                      <td>
                        {req.respondedAt ? formatDate(req.respondedAt) : '-'}
                      </td>
                      <td className="flex flex-col">
                        {ableToDelete ? (
                          <button
                            className="btn btn-error"
                            onClick={() => {
                              deleteAssignmentRequests({ ids: [req.id] });
                              setActionId(req.id);
                            }}
                            disabled={deleting}
                          >
                            {deleting && req.id === actionId ? (
                              <span className="loading loading-spinner"></span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        ) : (
                          <>
                            <button
                              className="btn btn-primary mb-2"
                              onClick={() => {
                                onRespond(req.id);
                              }}
                            >
                              Respond
                            </button>
                            {/* <button
                              className="btn btn-success mb-2"
                              onClick={() => {
                                accept({
                                  ids: [req.id],
                                  // operation: req.operation,
                                });
                                setActionId(req.id);
                              }}
                              disabled={accepting}
                            >
                              {accepting && actionId === req.id ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                'Accept'
                              )}
                            </button>
                            <button
                              className="btn btn-error"
                              onClick={() => {
                                reject({ ids: [req.id] });
                                setActionId(req.id);
                              }}
                              disabled={rejecting}
                            >
                              {rejecting && actionId === req.id ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                'Reject'
                              )}
                            </button> */}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(!data || data.length == 0) && !isLoading && (
            <h3 className="mt-5">No data available.</h3>
          )}
          {isLoading && (
            <div className="flex justify-center mt-5">
              <span className="loading loading-lg"></span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
