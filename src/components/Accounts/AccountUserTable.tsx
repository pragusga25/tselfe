import {
  useAuth,
  useDeleteUsers,
  useListAccountUsers,
  useResetAccountUserPassword,
} from '@/hooks';
import { useState } from 'react';

export const AccountUserTable = () => {
  const {
    auth: { user },
  } = useAuth();
  const { data, isLoading, search, searchResult, onSearch } =
    useListAccountUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUsers();
  const { mutate: resetPassword, isPending: isResetting } =
    useResetAccountUserPassword();

  const [deleteId, setDeleteId] = useState('');
  const [resetId, setResetId] = useState('');

  const dataLen = data?.length;
  const searchLen = searchResult?.length;

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

      <p className="text-info mb-4">
        The default password for user is <code>{`<username>tsel889900!`}</code>
      </p>

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
                      <br /> ({principalId})
                    </a>
                  </td>

                  <td className="flex flex-col">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setDeleteId(id);
                        deleteUser({
                          ids: [id],
                        });
                      }}
                      disabled={isDeleting && deleteId === id}
                    >
                      {isDeleting && deleteId === id && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Delete
                    </button>

                    <button
                      className="btn btn-primary btn-sm mt-3"
                      onClick={() => {
                        setResetId(id);
                        resetPassword({
                          userId: id,
                        });
                      }}
                      disabled={isResetting && resetId === id}
                    >
                      {isResetting && resetId === id && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Reset Password
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
