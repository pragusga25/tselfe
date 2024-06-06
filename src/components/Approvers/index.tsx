import {
  useAuth,
  useCreateApprovers,
  useDeleteApprover,
  useListApprovers,
} from '@/hooks';
import { useMemo, useState } from 'react';
import { ModalButton } from '../Modal/ModalButton';
import { GroupMembershipModal } from '../Modal/GroupMembershipModal';

export const Approvers = () => {
  const { data, search, searchResult, onSearch, isLoading } =
    useListApprovers();
  const {
    auth: { user },
  } = useAuth();
  const { mutate: deleteApprover, isPending: isDeleting } = useDeleteApprover();
  const {
    mutate: createApprovers,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useCreateApprovers();

  const existingUserIds = useMemo(() => {
    const userIds = data?.map((user) => user.principalId ?? '') ?? [];

    return new Set(userIds);
  }, [data]);

  const [deleteId, setDeleteId] = useState('');

  const dataLen = data?.length ?? 0;
  const searchLen = searchResult?.length ?? 0;

  return (
    <div>
      <GroupMembershipModal
        modalId="add-approvers-modal"
        modalTitle="Add Approver"
        mutate={createApprovers}
        mutateLoading={isCreating}
        mutateSuccess={isCreated}
        submitText="Add"
        userFieldDesc="Select the users you want to make approver."
        existingUserIds={existingUserIds}
      />
      <h1 className="text-2xl font-bold mb-6">List Approvers</h1>
      <div className="flex justify-end mb-2">
        <ModalButton
          id="add-approvers-modal"
          text="Add Approver"
          className="btn btn-primary"
        />
      </div>
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
      <div className="overflow-x-auto mb-4">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Username</th>
              <th>Name</th>
              <th>Principal</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {searchResult?.map(
              (
                {
                  id,
                  name,
                  username,
                  email,
                  principalDisplayName,
                  principalId,
                },
                idx
              ) => {
                return (
                  <tr
                    key={id}
                    className={id === user?.id ? 'text-green-600' : ''}
                  >
                    <td>{idx + 1}</td>
                    <td>{email}</td>
                    <td>{username}</td>
                    <td>{name}</td>
                    <td>
                      <a
                        href={`/principals?type=USER&id=${principalId}`}
                        className="link"
                      >
                        {principalDisplayName}
                      </a>
                    </td>

                    <td className="flex flex-col">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setDeleteId(id);
                          deleteApprover({
                            userId: id,
                          });
                        }}
                        disabled={isDeleting && deleteId === id}
                      >
                        {isDeleting && deleteId === id && (
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
      </div>

      {(!data || data.length === 0) && !isLoading && (
        <div className="text-center text-gray-500 mt-5">No data available</div>
      )}
      {isLoading && (
        <div className="flex justify-center mt-5">
          <span className="loading loading-lg"></span>
        </div>
      )}
    </div>
  );
};
