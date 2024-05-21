import {
  useDeletePrincipal,
  useListPrincipalUsers,
  useUpdatePrincipalUser,
} from '@/hooks';
import { PrincipalType, UpdatePrincipalUserPayload } from '@/types';
import { useState } from 'react';

export const PrincipalUsersTable = () => {
  const {
    isLoading: isUsersLoading,
    error: usersError,
    search,
    searchResult: users,
    onSearch,
    data,
  } = useListPrincipalUsers();

  const { mutate: updateUser, isPending: isUpdating } =
    useUpdatePrincipalUser();

  const { mutate: deletePrincipal, isPending: isDeleting } =
    useDeletePrincipal();

  const initUpdatePayload: UpdatePrincipalUserPayload = {
    displayName: '',
    id: '',
    familyName: '',
    givenName: '',
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatePayload, setUpdatePayload] =
    useState<UpdatePrincipalUserPayload>(initUpdatePayload);

  if (isUsersLoading) {
    return <span className="loading loading-spinner loading-md" />;
  }

  if (usersError) {
    return <span>{usersError.message}</span>;
  }

  const isEmpty = users ? users.length === 0 : true;
  const dataLen = data?.length || 0;
  const searchLen = users?.length || 0;

  return (
    <>
      <div className="form-control">
        <input
          value={search}
          onChange={onSearch}
          type="text"
          className="input input-bordered border-green-500 w-full mb-4"
          name="search"
          placeholder="Search..."
        />
      </div>

      <div className="form-control mb-4">
        <span className="text-gray-500">
          {dataLen} data available, {searchLen} data found
        </span>
      </div>

      <table className="table table-zebra table-md">
        <thead>
          <tr>
            <th>No</th>
            <th>User Id</th>
            <th>Username</th>
            <th>Display Name</th>
            <th>Given Name</th>
            <th>Family Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={7} className="text-center">
                No data available
              </td>
            </tr>
          )}
          {users?.map((user, idx) => {
            const {
              displayName,
              id,
              name: { familyName, givenName },
              username,
            } = user;
            const isUpdatingCurrentData = updatePayload.id === id;
            const isDeletingCurrentData = deleteId === id && isDeleting;
            return (
              <tr key={id}>
                <td>{idx + 1}</td>
                <td>{id}</td>
                <td>{username}</td>
                <td>
                  {isUpdatingCurrentData ? (
                    <div className="form-control">
                      <input
                        value={updatePayload.displayName}
                        onChange={(e) => {
                          setUpdatePayload((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }));
                        }}
                        type="text"
                        className="input input-bordered w-fit"
                        name="displayName"
                        placeholder="telkomsel"
                      />
                    </div>
                  ) : (
                    displayName
                  )}
                </td>
                <td>
                  {isUpdatingCurrentData ? (
                    <div className="form-control">
                      <input
                        value={updatePayload.givenName}
                        onChange={(e) => {
                          setUpdatePayload((prev) => ({
                            ...prev,
                            givenName: e.target.value,
                          }));
                        }}
                        type="text"
                        className="input input-bordered w-fit"
                        name="givenName"
                        placeholder="telkomsel"
                      />
                    </div>
                  ) : (
                    givenName
                  )}
                </td>
                <td>
                  {isUpdatingCurrentData ? (
                    <div className="form-control">
                      <input
                        value={updatePayload.familyName}
                        onChange={(e) => {
                          setUpdatePayload((prev) => ({
                            ...prev,
                            familyName: e.target.value,
                          }));
                        }}
                        type="text"
                        className="input input-bordered w-fit"
                        name="familyName"
                        placeholder="telkomsel"
                      />
                    </div>
                  ) : (
                    familyName
                  )}
                </td>

                <td className="flex flex-col">
                  <button
                    className="btn btn-info btn-sm mb-2"
                    onClick={() => {
                      if (isUpdatingCurrentData) {
                        updateUser(updatePayload);
                        setUpdatePayload(initUpdatePayload);
                      } else {
                        setUpdatePayload({
                          displayName,
                          familyName,
                          givenName,
                          id,
                        });
                      }
                    }}
                    disabled={isUpdating && isUpdatingCurrentData}
                  >
                    {isUpdatingCurrentData && isUpdating ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Save
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                  {isUpdatingCurrentData && (
                    <button
                      className="btn btn-accent btn-sm mb-2"
                      onClick={() => {
                        setUpdatePayload(initUpdatePayload);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      setDeleteId(id);
                      deletePrincipal({ id, type: PrincipalType.USER });
                    }}
                    disabled={isDeletingCurrentData}
                  >
                    {isDeletingCurrentData && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
