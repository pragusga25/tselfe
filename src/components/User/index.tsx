import {
  useCreateAssignmentUserRequest,
  useDeleteAssignmentRequests,
  useGetAssignmentUserRequestsFormData,
  useListAwsAccounts,
  useListMyAssignmentRequests,
  useListPermissionSets,
  useMe,
  useMyListPermissionSets,
  useRequestAssignment,
  useUpdateUserPassword,
  useDeleteAssignmentUserRequest,
  useListMyAssignmentUserRequests,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { useEffect, useMemo, useState } from 'react';
import {
  CreateAssignmentUserRequestPayload,
  RequestAssignmentOperation,
  RequestAssignmentPayload,
  RequestAssignmentStatus,
} from '@/types';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export const User = () => {
  const { data } = useMe();
  const { data: myPs } = useMyListPermissionSets();
  const { data: ps } = useListPermissionSets();
  const { data: awsAccounts } = useListAwsAccounts();
  const { data: userRequestFormData } = useGetAssignmentUserRequestsFormData();
  const { data: assignmentUserRequestsData } =
    useListMyAssignmentUserRequests();
  const [operation, setOperations] = useState(
    RequestAssignmentOperation.ATTACH
  );
  const {
    isUpdatingPassword,
    passwordPayload,
    onChangePassword,
    onSubmitPassword,
  } = useUpdateUserPassword();
  const {
    mutate: createUserRequestMutate,
    isPending: createUserRequestPending,
  } = useCreateAssignmentUserRequest();
  const {
    mutate: deleteUserRequestMutate,
    isPending: deleteUserRequestPending,
  } = useDeleteAssignmentUserRequest();

  const [showAccountInfo, setShowAccountInfo] = useState(true);
  const initCreateUserRequestPayload: CreateAssignmentUserRequestPayload = {
    awsAccountId: '',
    permissionSetArn: '',
    timeInHour: -1,
    note: '',
  };
  const [createUserRequestPayload, setCreateUserRequestPayload] = useState(
    initCreateUserRequestPayload
  );

  const onChnageCreateUserRequest = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    let value: number | string = e.target.value;

    if (name === 'timeInHour') {
      value = parseInt(value, 10);
    }

    setCreateUserRequestPayload((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const initRequestPayload: Required<RequestAssignmentPayload> = {
    operation: RequestAssignmentOperation.ATTACH,
    permissionSetArns: [],
    principalGroupId: data?.memberships[0]?.groupId ?? '',
    note: '',
    awsAccountId: awsAccounts?.[0]?.id ?? '',
  };

  const [requestPayload, setRequestPayload] =
    useState<Required<RequestAssignmentPayload>>(initRequestPayload);

  const filteredAwsAccounts = useMemo(() => {
    const currentAwsAccounts =
      myPs?.map((p) => {
        return p.awsAccountId;
      }) ?? [];

    const currentAwsAccountsSet = new Set(currentAwsAccounts);

    if (operation === RequestAssignmentOperation.DETACH) {
      return awsAccounts?.filter((a) => currentAwsAccountsSet.has(a.id)) ?? [];
    }

    return awsAccounts ?? [];
  }, [awsAccounts, operation]);

  const { data: myAssignmentRequests } = useListMyAssignmentRequests();

  const canRequest = (data?.memberships.length ?? 0) > 0;

  const options = ps ?? [];

  const isOptionsEmpty = options.length === 0;

  const toggleShowAccountInfo = () => setShowAccountInfo((prev) => !prev);

  const {
    mutate: requestMutation,
    isPending: isRequesting,
    isSuccess: requested,
  } = useRequestAssignment();

  const { mutate: deleteAssignmentRequest, isPending: isDeleting } =
    useDeleteAssignmentRequests();

  const onRequest = () => {
    requestMutation({
      ...requestPayload,
      operation,
      note: requestPayload.note.length > 0 ? requestPayload.note : undefined,
    });
  };

  const [tab, setTab] = useState('GROUP');
  const isGroupTabActive = tab === 'GROUP';
  const onGroupTab = () => setTab('GROUP');
  const onUserTab = () => setTab('USER');

  useEffect(() => {
    if (requested) {
      setRequestPayload(initRequestPayload);
    }
  }, [requested]);

  useEffect(() => {
    setCreateUserRequestPayload((prev) => ({
      ...prev,
      timeInHour: userRequestFormData?.times?.[0] ?? -1,
    }));
  }, [userRequestFormData?.times]);
  return (
    <div className="mb-8">
      <button
        onClick={toggleShowAccountInfo}
        className={`btn btn-sm mb-4 flex justify-start ${
          showAccountInfo ? 'btn-error' : 'btn-primary'
        }`}
      >
        {showAccountInfo ? 'Hide Account' : 'Show Account'}
      </button>
      {showAccountInfo && (
        <section className="border-b-2 pb-4">
          <h2 className="text-2xl font-semibold mb-4">Account</h2>
          <div className="flex flex-col gap-y-4">
            <div className="w-full text-justify border-2 p-4 flex flex-col gap-y-4">
              <p>
                <strong>Email:</strong> {data?.email}
              </p>
              <p>
                <strong>Name:</strong> {data?.name}
              </p>
              <p>
                <strong>Username:</strong> {data?.username}
              </p>
              <p>
                <strong>Principal Id:</strong> {data?.principalUserId}
              </p>
              <div>
                <p>
                  <strong>Memberships:</strong> {canRequest ? '' : '-'}
                </p>
                <div className="overflow-x-auto mt-5">
                  <table className="table table-zebra table-md">
                    <thead>
                      <tr>
                        <th>Membership ID</th>
                        <th>Group Name</th>
                        <th>Group Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.memberships.map(
                        ({ groupDisplayName, groupId, membershipId }) => {
                          return (
                            <tr key={membershipId}>
                              <td>{membershipId}</td>
                              <td>{groupDisplayName}</td>
                              <td>{groupId}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p>
                  <strong>My Permission Sets:</strong> {canRequest ? '' : '-'}
                </p>
                <div className="overflow-x-auto mt-5">
                  <table className="table table-zebra table-md">
                    <thead>
                      <tr>
                        <th>Principal</th>
                        <th>AWS Account</th>
                        <th>Permission Sets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPs?.map(
                        ({
                          awsAccountName,
                          permissionSets,
                          principalDisplayName,
                          principalType,
                        }) => {
                          return (
                            <tr key={principalDisplayName + awsAccountName}>
                              <td>
                                ({principalType}) {principalDisplayName}
                              </td>
                              <td>{awsAccountName}</td>
                              <td>
                                {permissionSets.map((ps) => ps.name).join(', ')}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <form
              className="flex flex-col w-full max-w-lg mx-auto mt-5"
              onSubmit={onSubmitPassword}
            >
              <h3>Change Password</h3>
              <div className="form-control">
                <div className="label">
                  <span className="label-text">Current Password</span>
                </div>
                <input
                  value={passwordPayload.oldPassword}
                  onChange={onChangePassword}
                  type="password"
                  className="grow input input-bordered w-full"
                  name="oldPassword"
                  placeholder="Your current password"
                  autoComplete="current-password"
                />
              </div>
              <div className="form-control">
                <div className="label">
                  <span className="label-text">New Password</span>
                </div>
                <input
                  value={passwordPayload.newPassword}
                  onChange={onChangePassword}
                  type="password"
                  className="grow input input-bordered w-full"
                  name="newPassword"
                  placeholder="Your new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-control mt-3">
                <button
                  className="btn btn-primary"
                  disabled={isUpdatingPassword}
                  type="submit"
                >
                  {isUpdatingPassword && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <div role="tablist" className="tabs tabs-boxed mt-5">
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
          My User
        </a>
      </div>

      {!isGroupTabActive && (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">
            Assignment User Requests
          </h2>
          <div className="flex justify-start">
            <ModalButton
              id="requestMyAssignment"
              text="Request My Assignment"
              className={`btn-md btn-primary`}
            />

            <Modal id="requestMyAssignment" title="Request My Assignment">
              <>
                <div className="form-control">
                  <div className="label">
                    <span className="label-text">AWS Account</span>
                  </div>
                  <select
                    value={createUserRequestPayload.awsAccountId}
                    className="select select-bordered w-full"
                    name="awsAccountId"
                    onChange={onChnageCreateUserRequest}
                  >
                    <option value="" disabled hidden key="default">
                      Select AWS Account
                    </option>
                    {userRequestFormData?.awsAccounts?.map(({ id, name }) => {
                      const value = id;
                      return (
                        <option value={value} key={value}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-control">
                  <div className="label">
                    <span className="label-text">Permission Set</span>
                  </div>
                  <select
                    value={createUserRequestPayload.permissionSetArn}
                    className="select select-bordered w-full"
                    name="permissionSetArn"
                    onChange={onChnageCreateUserRequest}
                  >
                    <option value="" disabled hidden key="default">
                      Select Permission Set
                    </option>
                    {userRequestFormData?.permissionSets?.map(
                      ({ name, arn }) => {
                        return (
                          <option value={arn} key={arn}>
                            {name}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>

                <div className="form-control">
                  <div className="label">
                    <span className="label-text">Time</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={createUserRequestPayload.timeInHour}
                    name="timeInHour"
                    onChange={onChnageCreateUserRequest}
                  >
                    <option value="" disabled hidden key="default">
                      Select how long your account will be assigned
                    </option>
                    {userRequestFormData?.times?.map((v) => {
                      return (
                        <option value={v} key={v}>
                          {v}h
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-control">
                  <div className="label">
                    <span className="label-text">Note</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Note"
                    name="note"
                    value={createUserRequestPayload.note}
                    onChange={onChnageCreateUserRequest}
                  ></textarea>
                </div>

                <button
                  className="btn btn-primary mt-2 w-full"
                  type="button"
                  onClick={() => {
                    createUserRequestMutate(createUserRequestPayload);
                  }}
                >
                  {createUserRequestPending && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Request
                </button>
              </>
            </Modal>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Permission Set</th>
                  <th>AWS Account</th>
                  <th>Note</th>
                  <th>Time (in hours) / End At</th>
                  <th>Status</th>
                  <th>Responder</th>
                  <th>Responder Note</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assignmentUserRequestsData?.map((d, idx) => {
                  let badge = 'badge-warning';

                  const { status, responderNote } = d;
                  const ableToDelete =
                    status == RequestAssignmentStatus.PENDING;
                  if (status === RequestAssignmentStatus.ACCEPTED) {
                    badge = 'badge-success';
                  } else if (status === RequestAssignmentStatus.REJECTED) {
                    badge = 'badge-error';
                  }

                  const endAt = d.endAt ? formatDate(d.endAt, true) : '-';

                  return (
                    <tr key={d.id}>
                      <td>{idx + 1}</td>
                      <td>{d.permissionSetName}</td>
                      <td>{d.awsAccountName}</td>
                      <td>{d.note}</td>
                      <td>
                        {d.timeInHour} / {endAt}
                      </td>
                      <td>
                        <span className={`badge ${badge} badge-outline`}>
                          {d.status}
                        </span>
                      </td>
                      <td>{d.responder?.name}</td>
                      <td>{responderNote}</td>
                      {ableToDelete && (
                        <td>
                          <button
                            className="btn btn-error"
                            onClick={() => {
                              deleteUserRequestMutate({
                                id: d.id,
                              });
                            }}
                            disabled={deleteUserRequestPending}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {isGroupTabActive && (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">
            Assignment Group Requests
          </h2>
          <div className="flex justify-start">
            <ModalButton
              id="requestAssignment"
              text="Request Group Assignment"
              className={`btn-md ${canRequest ? 'btn-primary' : 'btn-error'}`}
              overrideOnClick={
                !canRequest
                  ? () => {
                      toast.error(
                        'User does not have principalId or principalType'
                      );
                    }
                  : undefined
              }
            />

            {canRequest ? (
              <Modal id="requestAssignment" title="Request Assignment">
                <>
                  <div className="mt-2">
                    <div className="label">
                      <span className="label-text">Choose operation</span>
                    </div>
                    <select
                      value={operation}
                      className="select select-bordered w-full"
                      name="operation"
                      onChange={(e) => {
                        setOperations(
                          e.target.value as RequestAssignmentOperation
                        );
                      }}
                    >
                      {Object.values(RequestAssignmentOperation).map((p) => (
                        <option value={p} key={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control mt-2">
                    <div className="label">
                      <span className="label-text">Group</span>
                    </div>
                    <select
                      value={requestPayload.principalGroupId}
                      className="select select-bordered w-full"
                      name="principalGroupId"
                      onChange={(e) => {
                        setRequestPayload((prev) => ({
                          ...prev,
                          principalGroupId: e.target.value,
                        }));
                      }}
                    >
                      <option value="" disabled hidden key="default">
                        Select Group
                      </option>
                      {data?.memberships.map(
                        ({ groupDisplayName, groupId }) => {
                          const value = groupId;
                          return (
                            <option value={value} key={value}>
                              {groupDisplayName}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>

                  <div className="form-control">
                    <div className="label">
                      <span className="label-text">AWS Account</span>
                    </div>
                    <select
                      value={requestPayload.awsAccountId}
                      className="select select-bordered w-full"
                      name="awsAccountId"
                      onChange={(e) => {
                        setRequestPayload((prev) => ({
                          ...prev,
                          awsAccountId: e.target.value,
                        }));
                      }}
                    >
                      <option value="" disabled hidden key="default">
                        Select AWS Account
                      </option>
                      {filteredAwsAccounts?.map(({ id, name }) => {
                        const value = id;
                        return (
                          <option value={value} key={value}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="label mt-2">
                    <span className="label-text">Choose Permission Sets</span>
                  </div>

                  <div className="overflow-x-auto mt-2">
                    {isOptionsEmpty ? (
                      'No permission sets available for this operation.'
                    ) : (
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setRequestPayload((prev) => ({
                                        ...prev,
                                        permissionSetArns: options.map(
                                          (p) => p.arn
                                        ),
                                      }));
                                    } else {
                                      setRequestPayload((prev) => ({
                                        ...prev,
                                        permissionSetArns: [],
                                      }));
                                    }
                                  }}
                                  checked={
                                    requestPayload.permissionSetArns.length ===
                                      ps?.length &&
                                    requestPayload.permissionSetArns.length !==
                                      0
                                  }
                                />
                              </label>
                            </th>
                            <th>Name</th>
                            <th>Arn</th>
                          </tr>
                        </thead>
                        <tbody>
                          {options.map((p) => (
                            <tr key={p.arn}>
                              <td>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setRequestPayload((prev) => ({
                                          ...prev,
                                          permissionSetArns: [
                                            ...prev.permissionSetArns,
                                            p.arn,
                                          ],
                                        }));
                                      } else {
                                        setRequestPayload((prev) => ({
                                          ...prev,
                                          permissionSetArns:
                                            prev.permissionSetArns.filter(
                                              (ps) => ps !== p.arn
                                            ),
                                        }));
                                      }
                                    }}
                                    checked={
                                      !!requestPayload.permissionSetArns.find(
                                        (arn) => arn === p.arn
                                      )
                                    }
                                  />
                                </label>
                              </td>
                              <td>{p.name}</td>
                              <td>{p.arn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="label">
                      <span className="label-text">Note</span>
                    </div>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Note"
                      value={requestPayload.note}
                      onChange={(e) => {
                        setRequestPayload((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }));
                      }}
                    ></textarea>
                  </div>

                  <button
                    className="btn btn-primary mt-2 w-full"
                    disabled={isRequesting}
                    onClick={onRequest}
                  >
                    {isRequesting && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Request
                  </button>
                </>
              </Modal>
            ) : null}
          </div>

          <div className="mt-4">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>AWS Account/Principal</th>
                  <th>Permission Set</th>
                  <th>Operation</th>
                  <th>Note</th>
                  <th>Status</th>
                  <th>Requested At</th>
                  <th>Responder</th>
                  <th>Responder Note</th>
                  <th>Responded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myAssignmentRequests?.map((a) => {
                  let badge = 'badge-warning';
                  let badgeOp = 'badge-accent';
                  const { status, operation } = a;
                  if (status === RequestAssignmentStatus.ACCEPTED) {
                    badge = 'badge-success';
                  } else if (status === RequestAssignmentStatus.REJECTED) {
                    badge = 'badge-error';
                  }

                  if (operation === RequestAssignmentOperation.ATTACH) {
                    badgeOp = 'badge-info';
                  }

                  const ableToDelete =
                    status == RequestAssignmentStatus.PENDING;

                  const principal = `${a.awsAccountName}/${a.principalDisplayName}`;

                  return (
                    <tr key={a.id}>
                      <td>{principal}</td>
                      <td>{a.permissionSets.map((p) => p.name).join(', ')}</td>
                      <td>
                        <span className={`badge ${badgeOp} badge-outline`}>
                          {operation}
                        </span>
                      </td>
                      <td>{a.note}</td>
                      <td>
                        <span className={`badge ${badge} badge-outline`}>
                          {status}
                        </span>
                      </td>
                      <td>{formatDate(a.requestedAt)}</td>
                      <td>{a.responder ? `${a.responder?.name}` : '-'}</td>
                      <td>{a.responderNote}</td>
                      <td>{a.respondedAt ? formatDate(a.respondedAt) : '-'}</td>
                      <td>
                        {ableToDelete && (
                          <button
                            className="btn btn-error"
                            onClick={() => {
                              deleteAssignmentRequest({ ids: [a.id] });
                            }}
                            disabled={isDeleting}
                          >
                            {isDeleting && (
                              <span className="loading loading-spinner"></span>
                            )}
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
