import {
  useDeletePrincipal,
  useListPrincipalGroups,
  useListPrincipalUsers,
  useUpdatePrincipalUser,
} from '@/hooks';
import { PrincipalType, UpdatePrincipalUserPayload } from '@/types';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DeleteModal } from '../Modal/DeleteModal';

export const PrincipalUsersTable = () => {
  const {
    isLoading: isUsersLoading,
    error: usersError,
    search,
    searchResult: users,
    onSearch,
    data,
  } = useListPrincipalUsers();

  const { data: groups } = useListPrincipalGroups();

  const {
    mutate: updateUser,
    isPending: isUpdating,
    isSuccess: updated,
  } = useUpdatePrincipalUser();

  const { mutate: deletePrincipal } = useDeletePrincipal();

  const initUpdatePayload: UpdatePrincipalUserPayload = {
    displayName: '',
    id: '',
    familyName: '',
    givenName: '',
    membershipIdsToBeDeleted: undefined,
    groupIdsToBeAdded: undefined,
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatePayload, setUpdatePayload] =
    useState<UpdatePrincipalUserPayload>(initUpdatePayload);
  const [memberships, setMemberships] = useState<
    { groupId: string; key: string }[]
  >([]);

  const [deleteModal, setDeleteModal] = useState(false);

  const filteredGroups = useMemo(() => {
    const editGroupIds = users
      ?.find((user) => user.id === updatePayload.id)
      ?.memberships.map(({ groupId }) => groupId);

    const editGroupIdsToBeAdded = updatePayload.groupIdsToBeAdded;

    return groups?.filter(
      ({ id }) =>
        !editGroupIds?.includes(id) && !editGroupIdsToBeAdded?.includes(id)
    );
  }, [
    updatePayload.membershipIdsToBeDeleted,
    updatePayload.groupIdsToBeAdded,
    updatePayload.id,
    users,
  ]);

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  const addMembership = () => {
    setMemberships((prev) => [
      ...prev,
      {
        groupId: '',
        key: `${new Date(new Date().getTime()).getTime()}`,
      },
    ]);
  };

  const removeMembership = (key: string) => {
    setMemberships((prev) => prev.filter((item) => item.key !== key));
  };

  const handleMembershipChange = (
    key: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;

    setMemberships((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              groupId: value,
            }
          : item
      )
    );
  };

  const resetUpdatePayload = () => {
    setUpdatePayload(initUpdatePayload);
    setMemberships([]);
  };

  const onUpdate = () => {
    const isMembershipEmpty = memberships.length === 0;
    updateUser({
      ...updatePayload,
      groupIdsToBeAdded: isMembershipEmpty
        ? undefined
        : memberships.map(({ groupId }) => groupId),
    });
  };

  useEffect(() => {
    if (updated) {
      resetUpdatePayload();
    }
  }, [updated]);

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
      <DeleteModal
        onClose={closeDeleteModal}
        isOpen={deleteModal}
        description="Are you sure you want to delete this user?"
        onConfirm={() => {
          if (deleteId) {
            deletePrincipal({ id: deleteId, type: PrincipalType.USER });
            closeDeleteModal();
          }
        }}
        title="Delete User"
      />
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
            {/* <th>User Id</th> */}
            <th>Username</th>
            <th>Display Name</th>
            <th>Given Name</th>
            <th>Family Name</th>
            <th className="min-w-48">Memberships (Groups)</th>
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
              memberships: mems,
            } = user;
            const isUpdatingCurrentData = updatePayload.id === id;

            const filteredMemberships = mems.filter(
              ({ membershipId }) =>
                !(updatePayload.membershipIdsToBeDeleted || []).includes(
                  membershipId
                )
            );

            return (
              <tr key={id}>
                <td>{idx + 1}</td>
                {/* <td>{id}</td> */}
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

                <td>
                  <ul className="list-disc list-outside grid">
                    {filteredMemberships.map(
                      ({ groupDisplayName, membershipId }) => {
                        return (
                          <li className="h-fit mb-2" key={membershipId}>
                            <span>{groupDisplayName}</span>
                            {isUpdatingCurrentData && (
                              <button
                                className="hover:bg-red-600 flex items-center justify-center bg-red-400 w-8 h-8 text-center text-white rounded-full float-right"
                                onClick={() => {
                                  setUpdatePayload((prev) => {
                                    const { membershipIdsToBeDeleted } = prev;
                                    return {
                                      ...prev,
                                      membershipIdsToBeDeleted: [
                                        ...(membershipIdsToBeDeleted || []),
                                        membershipId,
                                      ],
                                    };
                                  });
                                }}
                              >
                                <span>X</span>
                              </button>
                            )}
                          </li>
                        );
                      }
                    )}
                  </ul>
                  {isUpdatingCurrentData && (
                    <>
                      {memberships.map(({ key, groupId }) => (
                        <div className="form-control mt-2" key={key}>
                          <select
                            value={groupId}
                            onChange={(e) => handleMembershipChange(key, e)}
                            name="membership"
                            className="select select-bordered w-full"
                          >
                            <option value="">Select Group</option>
                            {filteredGroups?.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.displayName}
                              </option>
                            ))}
                          </select>

                          {memberships.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-error btn-sm mt-2"
                              onClick={() => removeMembership(key)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn btn-accent mt-4 w-full"
                        onClick={addMembership}
                      >
                        Add Membership
                      </button>
                    </>
                  )}
                </td>

                <td className="flex flex-col">
                  <button
                    className={`btn btn-sm mb-2 ${
                      isUpdatingCurrentData ? 'btn-success' : 'btn-info'
                    }`}
                    onClick={() => {
                      if (isUpdatingCurrentData) {
                        onUpdate();
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
                    {isUpdatingCurrentData && isUpdating && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    {isUpdatingCurrentData ? 'Save' : 'Update'}
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
                      openDeleteModal();
                    }}
                  >
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
