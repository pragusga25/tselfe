import {
  useDeleteAssignmentRequests,
  useListMyAssignmentRequests,
  useListPermissionSets,
  useMe,
  useMyListPermissionSets,
  useRequestAssignment,
  useUpdateUserPassword,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { useState } from 'react';
import {
  PermissionSets,
  RequestAssignmentOperation,
  RequestAssignmentStatus,
} from '@/types';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export const User = () => {
  const { data } = useMe();
  const { data: ps } = useListPermissionSets();
  const [operation, setOperations] = useState(
    RequestAssignmentOperation.ATTACH
  );
  const {
    isUpdatingPassword,
    passwordPayload,
    onChangePassword,
    onSubmitPassword,
  } = useUpdateUserPassword();
  const { data: myPs } = useMyListPermissionSets();
  const [note, setNote] = useState<undefined | string>(undefined);
  const { data: myAssignmentRequests } = useListMyAssignmentRequests();
  let options: PermissionSets =
    ps?.map((p) => ({ arn: p.arn, name: p.name ?? p.arn })) ?? [];
  const myArns = myPs?.map((p) => p.arn) ?? [];

  if (operation === RequestAssignmentOperation.ATTACH) {
    options = options.filter((p) => !myArns.includes(p.arn));
  } else {
    options = myPs ?? [];
  }

  const isOptionsEmpty = options.length === 0;

  const [selectedPermissionSets, setSelectedPermissionSets] = useState<
    {
      arn: string;
      name?: string;
    }[]
  >([]);

  const canRequest = !!data?.principalId && data.principalType;

  const { mutate: requestMutation, isPending: isRequesting } =
    useRequestAssignment();

  const { mutate: deleteAssignmentRequest, isPending: isDeleting } =
    useDeleteAssignmentRequests();

  const onRequest = () => {
    if (!data?.principalId || !data.principalType) {
      toast.error('User does not have principalId or principalType');
      return;
    }
    requestMutation({
      permissionSets: selectedPermissionSets,
      operation,
      note,
    });
    setNote(undefined);
    setSelectedPermissionSets([]);
  };
  return (
    <div className="mb-8">
      <section className="border-b-2 pb-4">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:space-x-6">
          <div className="lg:w-1/2 text-justify border-2 p-4">
            <p>
              <strong>Name:</strong> {data?.name}
            </p>
            <p>
              <strong>Username:</strong> {data?.username}
            </p>
            <p>
              <strong>Principal Id:</strong> {data?.principalId ?? '-'}
            </p>
            <p>
              <strong>Principal Type:</strong> {data?.principalType ?? '-'}
            </p>
            <p>
              <strong>Permission Sets: </strong>
              {myPs?.map((p) => p.name ?? p.arn).join(', ') ?? '-'}
            </p>
          </div>

          <form
            className="flex flex-col max-w-lg w-full lg:w-1/2 mx-auto lg:mx-0 mt-4 lg:mt-0"
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

      <section className="mt-4">
        <h2 className="text-2xl font-semibold mb-4">Assignment Requests</h2>
        <div className="flex justify-start">
          <ModalButton
            id="requestAssignment"
            text="Request Assignment"
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

                <div className="overflow-x-auto mt-2">
                  {isOptionsEmpty ? (
                    'No permission sets available for this operation.'
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPermissionSets(options);
                                  } else {
                                    setSelectedPermissionSets([]);
                                  }
                                }}
                                checked={
                                  selectedPermissionSets.length ===
                                    ps?.length &&
                                  selectedPermissionSets.length !== 0
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
                                      setSelectedPermissionSets((prev) => [
                                        ...prev,
                                        p,
                                      ]);
                                    } else {
                                      setSelectedPermissionSets((prev) =>
                                        prev.filter((ps) => ps.arn !== p.arn)
                                      );
                                    }
                                  }}
                                  checked={
                                    !!selectedPermissionSets.find(
                                      (ps) => ps.arn === p.arn
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
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
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
          <table className="table">
            <thead>
              <tr>
                <th>Permission Set</th>
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
              {myAssignmentRequests?.map((a) => {
                let badge = 'badge-accent';
                let badgeOp = 'badge-warning';
                const { status, operation } = a;
                if (status === RequestAssignmentStatus.ACCEPTED) {
                  badge = 'badge-success';
                } else if (status === RequestAssignmentStatus.REJECTED) {
                  badge = 'badge-error';
                }

                if (operation === RequestAssignmentOperation.ATTACH) {
                  badgeOp = 'badge-info';
                }

                const ableToDelete = status === RequestAssignmentStatus.PENDING;

                return (
                  <tr key={a.id}>
                    <td>{a.permissionSets.map((p) => p.name).join(', ')}</td>
                    <td className={`badge ${badgeOp} badge-outline`}>
                      {operation}
                    </td>
                    <td>{a.note}</td>
                    <td className={`badge ${badge} badge-outline`}>{status}</td>
                    <td>{formatDate(a.requestedAt)}</td>
                    <td>
                      {a.responder
                        ? `${a.responder?.name} (${a.responder?.username})`
                        : '-'}
                    </td>
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
    </div>
  );
};
