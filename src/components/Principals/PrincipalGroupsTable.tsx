import {
  useDeletePrincipal,
  useListPrincipalGroups,
  useListPrincipalUsers,
  useUpdatePrincipalGroup,
} from '@/hooks';
import { PrincipalType, UpdatePrincipalGroupPayload } from '@/types';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DeleteModal } from '../Modal/DeleteModal';

export const PrincipalGroupsTable = () => {
  const {
    isLoading: isGroupsLoading,
    error: groupsError,
    search,
    searchResult: groups,
    onSearch,
    data,
  } = useListPrincipalGroups();

  const { data: users } = useListPrincipalUsers();

  const {
    mutate: updateGroup,
    isPending: isUpdating,
    isSuccess: updated,
  } = useUpdatePrincipalGroup();

  const { mutate: deletePrincipal } = useDeletePrincipal();

  const initUpdatePayload: UpdatePrincipalGroupPayload = {
    displayName: '',
    id: '',
    description: '',
    membershipIdsToBeDeleted: undefined,
    userIdsToBeAdded: undefined,
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatePayload, setUpdatePayload] =
    useState<UpdatePrincipalGroupPayload>(initUpdatePayload);
  const [memberships, setMemberships] = useState<
    { userId: string; key: string }[]
  >([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const filteredUsers = useMemo(() => {
    const editUserIds = groups
      ?.find((group) => group.id === updatePayload.id)
      ?.memberships.map(({ userId }) => userId);

    const editUserIdsToBeAdded = updatePayload.userIdsToBeAdded;

    return users?.filter(
      ({ id }) =>
        !editUserIds?.includes(id) && !editUserIdsToBeAdded?.includes(id)
    );
  }, [
    updatePayload.membershipIdsToBeDeleted,
    updatePayload.userIdsToBeAdded,
    updatePayload.id,
    users,
  ]);

  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatePayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMembership = () => {
    setMemberships((prev) => [
      ...prev,
      {
        userId: '',
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
              userId: value,
            }
          : item
      )
    );
  };

  const resetUpdatePayload = () => {
    setUpdatePayload(initUpdatePayload);
    setMemberships([]);
  };

  useEffect(() => {
    if (updated) {
      resetUpdatePayload();
    }
  }, [updated]);

  if (isGroupsLoading) {
    return <span className="loading loading-spinner loading-md" />;
  }

  if (groupsError) {
    return <span>{groupsError.message}</span>;
  }

  const isEmpty = groups ? groups.length === 0 : true;
  const dataLen = data?.length || 0;
  const searchLen = groups?.length || 0;

  return (
    <>
      <DeleteModal
        onClose={closeDeleteModal}
        isOpen={deleteModal}
        description="Are you sure you want to delete this group?"
        onConfirm={() => {
          if (deleteId) {
            deletePrincipal({ id: deleteId, type: PrincipalType.GROUP });
            closeDeleteModal();
          }
        }}
        title="Delete Group"
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
            {/* <th>Group Id</th> */}
            <th>Display Name</th>
            <th>Description</th>
            <th className="min-w-48">Memberships (USER)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td colSpan={5} className="text-center">
                No data available
              </td>
            </tr>
          )}
          {groups?.map(
            ({ displayName, id, description: d, memberships: mems }, idx) => {
              const isUpdatingCurrentData = updatePayload.id === id;
              const description = d ?? undefined;
              const {
                displayName: payloadDisplayName,
                description: payloadDescription,
              } = updatePayload;

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
                  <td>
                    {isUpdatingCurrentData ? (
                      <div className="form-control">
                        <input
                          value={payloadDisplayName}
                          onChange={onChange}
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
                        <textarea
                          value={payloadDescription}
                          onChange={onChange}
                          className="textarea textarea-bordered w-fit"
                          name="description"
                          placeholder="telkomsel group"
                        />
                      </div>
                    ) : (
                      description
                    )}
                  </td>
                  <td>
                    <ul
                      className={`list-disc list-outside grid ${
                        isUpdatingCurrentData ? 'grid-cols-1' : 'md:grid-cols-2'
                      } `}
                    >
                      {filteredMemberships.map(
                        ({ membershipId, userDisplayName }) => (
                          <li key={membershipId} className="h-fit mb-2">
                            <span>{userDisplayName}</span>
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
                        )
                      )}
                    </ul>

                    {isUpdatingCurrentData && (
                      <>
                        {memberships.map(({ key, userId }) => (
                          <div className="form-control mt-2" key={key}>
                            <select
                              value={userId}
                              onChange={(e) => handleMembershipChange(key, e)}
                              name="membership"
                              className="select select-bordered w-full"
                            >
                              <option value="">Select User</option>
                              {filteredUsers?.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.displayName}
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
                          const membershipsLen = memberships.length;
                          updateGroup({
                            ...updatePayload,
                            description:
                              payloadDescription?.length === 0
                                ? undefined
                                : payloadDescription,
                            userIdsToBeAdded:
                              membershipsLen > 0
                                ? memberships.map(({ userId }) => userId)
                                : undefined,
                          });
                        } else {
                          setUpdatePayload({ displayName, description, id });
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
                          resetUpdatePayload();
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setDeleteId(id);
                        // deletePrincipal({ id, type: PrincipalType.GROUP });
                        openDeleteModal();
                      }}
                      // disabled={isDeletingCurrentData}
                    >
                      {/* {isDeletingCurrentData && (
                        <span className="loading loading-spinner loading-sm" />
                      )} */}
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
};
