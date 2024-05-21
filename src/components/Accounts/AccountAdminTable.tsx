import { useAuth, useDeleteUsers, useListAccountAdmins } from '@/hooks';
import { formatDate } from '@/lib/utils';

export const AccountAdminTable = () => {
  const { data, isLoading } = useListAccountAdmins();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUsers();
  const {
    auth: { user },
  } = useAuth();

  return (
    <>
      <table className="table table-zebra table-md">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Name</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(({ id, name, username, createdAt }, idx) => {
            return (
              <tr key={id} className={id === user?.id ? 'text-green-600' : ''}>
                <td>{idx + 1}</td>
                <td>@{username}</td>
                <td>{name}</td>
                <td>{formatDate(createdAt)}</td>
                <td className="flex flex-col">
                  <button
                    className="btn btn-secondary btn-sm mt-2"
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
          })}
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
