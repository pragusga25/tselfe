import {
  useAuth,
  useCreateUser,
  useDeleteUsers,
  useListPrincipals,
  useListUsers,
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
              <th>Principal Id</th>
              <th>Principal Type</th>
              <th>Updated At</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((usr, idx) => (
              <tr
                key={usr.id}
                className={usr.id === user?.id ? 'text-green-600' : ''}
              >
                <td>{idx + 1}</td>
                <td>{usr.username}</td>
                <td>{usr.name}</td>
                <td>{usr.role}</td>
                <td>{usr.principalId}</td>
                <td>{usr.principalType}</td>
                <td>{formatDate(usr.updatedAt)}</td>
                <td>{formatDate(usr.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      deleteUser({
                        ids: [usr.id],
                      })
                    }
                    disabled={isDeleting}
                  >
                    {isDeleting && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!data || data.length == 0) && (
        <h3 className="mt-5">No data available, please create a new one.</h3>
      )}
    </div>
  );
};
