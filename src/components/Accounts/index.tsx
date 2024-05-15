import {
  useAuth,
  useCreateUser,
  useDeleteUsers,
  useListPrincipals,
  useListUsers,
  useUpdateUserPrincipal,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useState } from 'react';
import { CreateUserPayload, PrincipalType, Role } from '@/types';
import { formatDate } from '@/lib/utils';

export const Accounts = () => {
  const { data } = useListUsers();
  const {
    auth: { user },
  } = useAuth();

  const [role, setRole] = useState<Role>(Role.USER);
  const {
    mutate: updateUserPrincipal,
    isUpdatingPrincipal,
    principalPayload,
    setPrincipalPayloadPayload,
  } = useUpdateUserPrincipal();

  const { mutate, isPending, isSuccess } = useCreateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUsers();
  const { data: principals } = useListPrincipals();
  const [payload, setPayload] = useState<Omit<CreateUserPayload, 'role'>>({
    name: '',
    username: '',
    password: '',
    principalId: '',
    principalType: PrincipalType.GROUP,
  });

  const filteredPrincipals = principals?.filter(
    (p) => p.principalType === payload.principalType
  );

  const defaultValueUpdatePrincipal = `${principals?.[0]?.principalType}#${principals?.[0]?.id}`;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (role === Role.USER) {
      mutate({
        ...payload,
        role,
      });
    } else {
      mutate({
        ...payload,
        role,
        principalId: undefined,
        principalType: undefined,
      });
    }

    if (isSuccess) {
      setPayload({
        name: '',
        username: '',
        password: '',
        principalId: '',
        principalType: PrincipalType.GROUP,
      });
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">List Accounts</h1>
      <div className="flex justify-end mb-2">
        <ModalButton
          id="createUserModal"
          text="Create User"
          className="btn-primary btn-md"
        />

        <Modal id="createUserModal" title="Create User">
          <>
            <div role="tablist" className="tabs tabs-boxed mb-4">
              {Object.values(Role).map((r) => (
                <a
                  role="tab"
                  className={`tab ${r === role ? 'tab-active' : ''}`}
                  onClick={() => setRole(r)}
                  key={r}
                >
                  {r}
                </a>
              ))}
            </div>

            <form className="flex flex-col" onSubmit={onSubmit}>
              <div className="form-control">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  value={payload.name}
                  onChange={onChange}
                  type="text"
                  className="grow input input-bordered w-full"
                  name="name"
                  placeholder="Telkomsel"
                />
              </div>

              <div className="form-control">
                <div className="label">
                  <span className="label-text">Username</span>
                </div>
                <input
                  value={payload.username}
                  onChange={onChange}
                  type="text"
                  className="grow input input-bordered w-full"
                  name="username"
                  placeholder="tsel"
                  autoComplete="username"
                />
              </div>

              <div className="form-control">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>

                <input
                  value={payload.password}
                  onChange={onChange}
                  type="password"
                  className="grow input input-bordered w-full"
                  name="password"
                  placeholder="tsel12345"
                  autoComplete="current-password"
                />
              </div>

              {role === Role.USER ? (
                <>
                  <div className="form-control">
                    <div className="label">
                      <span className="label-text">Principal Type</span>
                    </div>
                    <select
                      value={payload.principalType}
                      className="select select-bordered w-full"
                      name="principalType"
                      onChange={onChange}
                    >
                      {Object.values(PrincipalType).map((p) => (
                        <option value={p} key={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <div className="label">
                      <span className="label-text">Principal</span>
                    </div>
                    <select
                      value={payload.principalId}
                      className="select select-bordered w-full"
                      name="principalId"
                      onChange={onChange}
                    >
                      <option value="" disabled hidden key="default">
                        Select principal
                      </option>
                      {filteredPrincipals?.map((p) => (
                        <option value={p.id} key={p.id}>
                          {p.displayName} ({p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              <div className="form-control mt-3">
                <button className="btn btn-primary" disabled={isPending}>
                  {isPending && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Create
                </button>
              </div>
            </form>
          </>
        </Modal>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Name</th>
              <th>Role</th>
              <th>Principal</th>
              <th>Updated At</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((usr, idx) => {
              const isUpdating = usr.id === principalPayload.userId;
              const value = `${principalPayload.principalType}#${principalPayload.principalId}`;
              return (
                <tr
                  key={usr.id}
                  className={usr.id === user?.id ? 'text-green-600' : ''}
                >
                  <td>{idx + 1}</td>
                  <td>{usr.username}</td>
                  <td>{usr.name}</td>
                  <td>{usr.role}</td>
                  <td>
                    {isUpdating ? (
                      <>
                        <select
                          value={value}
                          className="select select-bordered w-full"
                          name="principal"
                          defaultValue={defaultValueUpdatePrincipal}
                          onChange={(e) =>
                            setPrincipalPayloadPayload((prev) => ({
                              ...prev,
                              principalType: (e.target.value.split('#')[0] ??
                                PrincipalType.GROUP) as PrincipalType,
                              principalId: e.target.value.split('#')[1] ?? '',
                            }))
                          }
                        >
                          <option
                            value=""
                            disabled
                            hidden={(principals?.length ?? 0) > 0}
                            key="default"
                          >
                            {principals?.length === 0
                              ? 'No principals available'
                              : 'Select principal'}
                          </option>

                          {principals?.map((p) => (
                            <option value={p.id} key={p.id}>
                              {`${p.displayName} (${p.principalType}) - ${p.id}`}
                            </option>
                          ))}
                        </select>

                        <div className="mt-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setPrincipalPayloadPayload((prev) => ({
                                ...prev,
                                userId: '',
                                principalId: '',
                              }))
                            }
                            disabled={isUpdatingPrincipal}
                          >
                            Cancel
                          </button>

                          {(principals?.length ?? 0) > 0 && (
                            <button
                              className="btn btn-primary btn-sm ml-2"
                              onClick={() => {
                                {
                                  updateUserPrincipal({
                                    userId: usr.id,
                                    principalId: principalPayload.principalId,
                                    principalType:
                                      principalPayload.principalType,
                                  });

                                  setPrincipalPayloadPayload({
                                    userId: '',
                                    principalId: '',
                                    principalType: PrincipalType.GROUP,
                                  });
                                }
                              }}
                              disabled={isUpdatingPrincipal}
                            >
                              {isUpdatingPrincipal && (
                                <span className="loading loading-spinner"></span>
                              )}
                              Save
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {usr.principalId
                          ? `
                          ${usr.principalDisplayName} (${usr.principalType}) - ${usr.principalId}
                        `
                          : '-'}
                      </>
                    )}
                  </td>
                  <td>{formatDate(usr.updatedAt)}</td>
                  <td>{formatDate(usr.createdAt)}</td>
                  <td className="flex flex-col">
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={() => {
                        if (!isUpdating) {
                          setPrincipalPayloadPayload((prev) => ({
                            ...prev,
                            userId: usr.id,
                            principalId:
                              defaultValueUpdatePrincipal.split('#')[1] ?? '',
                            principalType: defaultValueUpdatePrincipal.split(
                              '#'
                            )[0] as PrincipalType,
                          }));
                        } else {
                          setPrincipalPayloadPayload({
                            userId: '',
                            principalId: '',
                            principalType: PrincipalType.GROUP,
                          });
                        }
                      }}
                      disabled={isUpdatingPrincipal}
                    >
                      {isUpdatingPrincipal && (
                        <span className="loading loading-spinner"></span>
                      )}
                      {isUpdating ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm mt-2"
                      onClick={() => {
                        deleteUser({
                          ids: [usr.id],
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
      </div>
      {(!data || data.length == 0) && (
        <h3 className="mt-5">No data available, please create a new one.</h3>
      )}
    </div>
  );
};
