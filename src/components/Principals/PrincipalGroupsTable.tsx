import {
  useDeletePrincipal,
  useListPrincipalGroups,
  useUpdatePrincipalGroup,
} from '@/hooks';
import { PrincipalType, UpdatePrincipalGroupPayload } from '@/types';
import { ChangeEvent, useState } from 'react';

export const PrincipalGroupsTable = () => {
  const {
    isLoading: isGroupsLoading,
    error: groupsError,
    search,
    searchResult: groups,
    onSearch,
    data,
  } = useListPrincipalGroups();

  const { mutate: updateGroup, isPending: isUpdating } =
    useUpdatePrincipalGroup();

  const { mutate: deletePrincipal, isPending: isDeleting } =
    useDeletePrincipal();

  const initUpdatePayload: UpdatePrincipalGroupPayload = {
    displayName: '',
    id: '',
    description: '',
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatePayload, setUpdatePayload] =
    useState<UpdatePrincipalGroupPayload>(initUpdatePayload);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatePayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            <th>Group Id</th>
            <th>Group Name</th>
            <th>Description</th>
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
          {groups?.map(({ displayName, id, description: d }, idx) => {
            const isUpdatingCurrentData = updatePayload.id === id;
            const description = d ?? undefined;
            const isDeletingCurrentData = deleteId === id && isDeleting;
            const {
              displayName: payloadDisplayName,
              description: payloadDescription,
            } = updatePayload;
            return (
              <tr key={id}>
                <td>{idx + 1}</td>
                <td>{id}</td>
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
                <td className="flex flex-col">
                  <button
                    className="btn btn-info btn-sm mb-2"
                    onClick={() => {
                      if (isUpdatingCurrentData) {
                        updateGroup({
                          ...updatePayload,
                          description:
                            payloadDescription?.length === 0
                              ? undefined
                              : payloadDescription,
                        });
                        setUpdatePayload(initUpdatePayload);
                      } else {
                        setUpdatePayload({ displayName, description, id });
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
                      deletePrincipal({ id, type: PrincipalType.GROUP });
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
