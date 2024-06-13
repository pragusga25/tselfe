import {
  useListAccountUsers,
  useListPermissionSets,
  useUpdatePermissionSet,
} from '@/hooks';
import { getPsTagsInfo } from '@/lib/utils';
import { UpdatePermissionSetPayload } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const PermissionSets = () => {
  const { onSearch, search, data, searchResult: pss } = useListPermissionSets();
  const { mutate, isPending, isSuccess } = useUpdatePermissionSet();
  const {
    searchResult: searchResultUsers,
    search: searchUsers,
    onSearch: onSearchUsers,
  } = useListAccountUsers();

  const initUpdatePayload: UpdatePermissionSetPayload & {
    target: 'ALL USERS' | 'Specific Users';
    selectedUsers: string[];
  } = {
    arn: '',
    tags: {
      operation: 'HIDE',
      values: '',
    },
    target: 'ALL USERS',
    selectedUsers: [],
  };

  const [updatePayload, setUpdatePayload] = useState<
    UpdatePermissionSetPayload & {
      target: 'ALL USERS' | 'Specific Users';
      selectedUsers: string[];
    }
  >(initUpdatePayload);

  const resetUpdatePayload = () => {
    setUpdatePayload(initUpdatePayload);
  };

  const onEdit = () => {
    const isAll = updatePayload.target === 'ALL USERS';
    mutate({
      arn: updatePayload.arn,
      tags: {
        operation: updatePayload.tags.operation,
        values: isAll ? 'ALL USERS' : updatePayload.selectedUsers.join(';'),
      },
    });
  };

  const isEmpty = pss ? pss.length === 0 : true;
  const dataLen = data?.length || 0;
  const searchLen = pss?.length || 0;

  const selectUsersJSX = (
    <>
      <div className="form-control">
        <div className="label">
          <span className="label-text">Select Users</span>
        </div>
      </div>

      <div className="form-control">
        <input
          value={searchUsers}
          onChange={onSearchUsers}
          type="text"
          className="input input-bordered border-green-500 w-full mb-4"
          name="search"
          placeholder="Search Users..."
        />
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="table">
          <thead>
            <tr>
              <th>
                {/* <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUpdatePayload((prev) => ({
                          ...prev,
                          target: 'Specific Users',
                          selectedUsers:
                            users?.map((user) => user.username) || [],
                        }));
                      } else {
                        setUpdatePayload((prev) => ({
                          ...prev,
                          selectedUsers: [],
                        }));
                      }
                    }}
                    checked={
                      updatePayload.selectedUsers.length === usersLen &&
                      usersLen !== 0
                    }
                  />
                </label> */}
              </th>
              <th>Username</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {searchResultUsers?.map((user) => (
              <tr key={user.id}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (
                            updatePayload.selectedUsers.join(';').length +
                              user.username.length >
                            254
                          ) {
                            return toast.error('Max selected users reached');
                          }

                          setUpdatePayload((prev) => ({
                            ...prev,
                            selectedUsers: [
                              ...prev.selectedUsers,
                              user.username,
                            ],
                          }));
                        } else {
                          setUpdatePayload((prev) => ({
                            ...prev,
                            selectedUsers: prev.selectedUsers.filter(
                              (u) => u !== user.username
                            ),
                          }));
                        }
                      }}
                      checked={updatePayload.selectedUsers.includes(
                        user.username
                      )}
                    />
                  </label>
                </td>
                <td>{user.username}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  useEffect(() => {
    if (isSuccess) {
      resetUpdatePayload();
    }
  }, [isSuccess]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">List Permission Sets</h1>

      <div className="overflow-x-auto mb-4">
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
              <th>Name</th>
              <th>Arn</th>
              <th>Show to/Hide from</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty && (
              <tr>
                <td colSpan={3} className="text-center">
                  No data available
                </td>
              </tr>
            )}

            {pss?.map((ps, i) => {
              const { tags, arn } = ps;

              const { isAll, isShow, showHideValue } = getPsTagsInfo(tags);

              const isUpdatingThisData = arn === updatePayload.arn;
              const isUpdatingThisDataToServer =
                isUpdatingThisData && isPending;

              return (
                <tr key={ps.arn}>
                  <td>{i + 1}</td>
                  <td className="align-baseline">{ps.name}</td>
                  <td className="align-baseline">{ps.arn}</td>
                  <td className="md:min-w-96">
                    {isUpdatingThisData && (
                      <form className="flex flex-col space-y-2 border-b-2 mb-4 pb-2">
                        <div className="form-control">
                          <div className="label">
                            <span className="label-text">Select Operation</span>
                          </div>

                          <select
                            name="tagsOperation"
                            className="select select-bordered w-full"
                            onChange={(e) => {
                              const value = e.target.value as 'SHOW' | 'HIDE';
                              setUpdatePayload((prev) => ({
                                ...prev,
                                tags: {
                                  ...prev.tags,
                                  operation: value,
                                },
                              }));
                            }}
                            value={updatePayload.tags.operation}
                          >
                            <option value="" className="hidden">
                              Select Operation
                            </option>
                            {['SHOW', 'HIDE'].map((op) => (
                              <option key={op} value={op}>
                                {op}
                              </option>
                            ))}
                          </select>
                        </div>

                        {!!updatePayload.tags.operation && (
                          <div className="form-control">
                            <div className="label">
                              <span className="label-text">Select Target</span>
                            </div>

                            <select
                              name="tagsValue"
                              className="select select-bordered w-full"
                              onChange={(e) => {
                                const value = e.target.value as
                                  | 'ALL USERS'
                                  | 'Specific Users';

                                setUpdatePayload((prev) => ({
                                  ...prev,
                                  target: value,
                                }));
                              }}
                            >
                              <option value="" className="hidden">
                                Select Target
                              </option>
                              {['ALL USERS', 'Specific Users'].map((op) => (
                                <option key={op} value={op}>
                                  {op}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {updatePayload.target === 'Specific Users' &&
                          selectUsersJSX}
                        {updatePayload.target === 'Specific Users' && (
                          <div className="mt-3">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                if (!isUpdatingThisData) {
                                  setUpdatePayload({
                                    ...initUpdatePayload,
                                    arn: arn,
                                  });
                                } else {
                                  onEdit();
                                }
                              }}
                            >
                              {isUpdatingThisDataToServer && (
                                <span className="loading loading-spinner loading-sm" />
                              )}
                              Save
                            </button>

                            <button
                              className="btn btn-secondary btn-sm ml-2"
                              onClick={() => resetUpdatePayload()}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </form>
                    )}

                    <div>
                      <span
                        className={`badge badge-md mb-2 ${
                          isShow ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {isShow ? 'Show to' : 'Hide from'}
                      </span>

                      <ul
                        className={
                          isAll
                            ? ''
                            : 'list-disc list-outside grid-cols-1 md:grid-cols-2'
                        }
                      >
                        {showHideValue.split(';').map((v) => (
                          <li key={v}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </td>

                  <td className="flex flex-col justify-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (!isUpdatingThisData) {
                          setUpdatePayload({
                            ...initUpdatePayload,
                            arn: arn,
                          });
                        } else {
                          onEdit();
                        }
                      }}
                    >
                      {isUpdatingThisDataToServer && (
                        <span className="loading loading-spinner loading-sm" />
                      )}
                      {isUpdatingThisData ? 'Save' : 'Update'}
                    </button>

                    {isUpdatingThisData && (
                      <button
                        className="btn btn-secondary btn-sm mt-2"
                        onClick={() => resetUpdatePayload()}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
