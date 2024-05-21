import {
  useAuth,
  useDeleteUsers,
  useListAccountUsers,
  useListAwsAccounts,
  useListPrincipals,
  useUpdateAccountUser,
} from '@/hooks';
import { formatDate } from '@/lib/utils';
import { PrincipalType, UpdateAccountUserPayload } from '@/types';
import { ChangeEvent, useEffect, useState } from 'react';

export const AccountUserTable = () => {
  const {
    auth: { user },
  } = useAuth();
  const { data, isLoading } = useListAccountUsers();

  const {
    mutate: updateAccountUser,
    isPending: isUpdating,
    isSuccess: updated,
  } = useUpdateAccountUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUsers();

  const { data: principals } = useListPrincipals();
  const { data: awsAccounts } = useListAwsAccounts();

  const initUpdatePayload: Required<
    Omit<UpdateAccountUserPayload, 'principalAwsAccountsToBeAdded'>
  > = {
    id: '',
    name: '',
    username: '',
    principalAwsAccountUserIdsToBeDeleted: [],
  };

  const [updatePayload, setUpdatePayload] =
    useState<
      Required<Omit<UpdateAccountUserPayload, 'principalAwsAccountsToBeAdded'>>
    >(initUpdatePayload);

  const [principalAwsAccountUsers, setPrincipalAwsAccountUsers] = useState<
    { principal: string; awsAccountId: string; key: string }[]
  >([]);

  const onChangeUpdatePayload = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatePayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPrincipalAccountPayload = () => {
    setPrincipalAwsAccountUsers((prev) => [
      ...prev,
      {
        principal: '',
        awsAccountId: '',
        key: new Date().getTime().toString(),
      },
    ]);
  };

  const removePrincipalAccountPayload = (key: string) => {
    setPrincipalAwsAccountUsers((prev) =>
      prev.filter((item) => item.key !== key)
    );
  };

  const handlePrincipalAccountChange = (
    key: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPrincipalAwsAccountUsers((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const onUpdate = () => {
    const { principalAwsAccountUserIdsToBeDeleted } = updatePayload;
    updateAccountUser({
      ...updatePayload,
      principalAwsAccountUserIdsToBeDeleted:
        principalAwsAccountUserIdsToBeDeleted.length > 0
          ? principalAwsAccountUserIdsToBeDeleted
          : undefined,
      principalAwsAccountsToBeAdded:
        principalAwsAccountUsers.length > 0
          ? principalAwsAccountUsers.map((paaud) => {
              return {
                awsAccountId: paaud.awsAccountId,
                principalId: paaud.principal.split('#')[1],
                principalType: paaud.principal.split('#')[0] as PrincipalType,
              };
            })
          : undefined,
    });
  };

  const resetUpdateState = () => {
    setUpdatePayload(initUpdatePayload);
    setPrincipalAwsAccountUsers([]);
  };

  useEffect(() => {
    if (updated) {
      resetUpdateState();
    }
  }, [updated]);

  return (
    <>
      <table className="table table-zebra table-md">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Name</th>
            <th>Principal - AWS Account</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map(
            (
              { id, name, username, createdAt, principalAwsAccountUsers: paau },
              idx
            ) => {
              const isUpdatingThisData = updatePayload.id === id;
              const isupdatingRequest = isUpdating && isUpdatingThisData;
              const isPaauEmpty = paau.length === 0;
              return (
                <tr
                  key={id}
                  className={id === user?.id ? 'text-green-600' : ''}
                >
                  <td>{idx + 1}</td>
                  <td>
                    {isUpdatingThisData ? (
                      <input
                        value={updatePayload.username}
                        onChange={onChangeUpdatePayload}
                        className="grow input input-bordered w-full"
                        name="username"
                        placeholder="tsel"
                      />
                    ) : (
                      `@${username}`
                    )}
                  </td>
                  <td>
                    {isUpdatingThisData ? (
                      <input
                        value={updatePayload.name}
                        onChange={onChangeUpdatePayload}
                        className="grow input input-bordered w-full"
                        name="name"
                        placeholder="Telkomsel"
                      />
                    ) : (
                      name
                    )}
                  </td>
                  <td>
                    <ul className="list-disc">
                      {isPaauEmpty && !isUpdatingThisData && (
                        <span className="text-red-400">
                          This account doesnt have any principals yet.
                        </span>
                      )}
                      {paau
                        .filter((pau) => {
                          return !updatePayload.principalAwsAccountUserIdsToBeDeleted.includes(
                            pau.id
                          );
                        })
                        .map(
                          ({
                            principalDisplayName,
                            awsAccountName,
                            principalType,
                            id: pId,
                          }) => (
                            <li key={pId} className="items-center list-item">
                              <span>
                                {principalDisplayName} ({principalType}) -{' '}
                                {awsAccountName}
                              </span>
                              {isUpdatingThisData && (
                                <button
                                  className="btn btn-circle btn-error btn-sm ml-2"
                                  onClick={() => {
                                    setUpdatePayload((prev) => ({
                                      ...prev,
                                      principalAwsAccountUserIdsToBeDeleted: [
                                        ...prev.principalAwsAccountUserIdsToBeDeleted,
                                        pId,
                                      ],
                                    }));
                                  }}
                                >
                                  X
                                </button>
                              )}
                            </li>
                          )
                        )}
                    </ul>

                    {isUpdatingThisData && (
                      <>
                        {principalAwsAccountUsers.map(
                          ({ key, principal, awsAccountId }) => (
                            <div className="form-control mt-2" key={key}>
                              <select
                                value={principal}
                                onChange={(e) =>
                                  handlePrincipalAccountChange(key, e)
                                }
                                name="principal"
                                className="select select-bordered w-full"
                              >
                                <option value="">Select Principal</option>
                                {principals?.map((principal) => (
                                  <option
                                    key={principal.id + key}
                                    value={`${principal.principalType}#${principal.id}`}
                                  >
                                    {principal.displayName} (
                                    {principal.principalType})
                                  </option>
                                ))}
                              </select>

                              <select
                                value={awsAccountId}
                                onChange={(e) =>
                                  handlePrincipalAccountChange(key, e)
                                }
                                name="awsAccountId"
                                className="select select-bordered w-full my-3"
                              >
                                <option value="">Select AWS Account</option>
                                {awsAccounts?.map((awsAccount) => (
                                  <option
                                    key={awsAccount.id + key}
                                    value={awsAccount.id}
                                  >
                                    {awsAccount.name} ({awsAccount.id})
                                  </option>
                                ))}
                              </select>

                              {principalAwsAccountUsers.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    removePrincipalAccountPayload(key)
                                  }
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          )
                        )}

                        <button
                          type="button"
                          className="btn btn-accent mt-4 w-full"
                          onClick={addPrincipalAccountPayload}
                        >
                          Add Principal Account
                        </button>
                      </>
                    )}
                  </td>
                  <td>{formatDate(createdAt)}</td>
                  <td className="flex flex-col">
                    {isUpdatingThisData && (
                      <button
                        className="btn btn-success btn-sm mb-2"
                        onClick={onUpdate}
                        disabled={isupdatingRequest}
                      >
                        {isupdatingRequest ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          'Save'
                        )}
                      </button>
                    )}
                    <button
                      className="btn btn-accent btn-sm mb-2"
                      onClick={() => {
                        if (isUpdatingThisData) {
                          resetUpdateState();
                        } else {
                          setUpdatePayload({
                            id,
                            name,
                            username,
                            principalAwsAccountUserIdsToBeDeleted: [],
                          });
                        }
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdatingThisData ? 'Cancel' : 'Update'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        deleteUser({
                          ids: [id],
                        });
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {(!data || data.length === 0) && !isLoading && (
        <div className="text-center text-gray-500 mt-5">No data available</div>
      )}
      {isLoading && (
        <div className="flex justify-center mt-5">
          <span className="loading loading-lg"></span>
        </div>
      )}
    </>
  );
};
