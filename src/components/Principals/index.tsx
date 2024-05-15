import {
  useCreatePrincipal,
  useDeletePrincipal,
  useListPrincipals,
  useUpdatePrincipal,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useState } from 'react';
import { CreatePrincipalPayload, PrincipalType } from '@/types';

export const Principals = () => {
  const { mutate, isPending, isSuccess } = useCreatePrincipal();
  const { mutate: deletePrincipal } = useDeletePrincipal();
  const {
    mutate: updatePrincipal,
    isPending: isUpdating,
    isError,
  } = useUpdatePrincipal();

  const { data: principals, isPending: isLoading } = useListPrincipals();
  const initCreatePayload = {
    displayName: '',
    type: PrincipalType.GROUP,
    username: '',
    familyName: '',
    givenName: '',
  };

  const [payload, setPayload] =
    useState<CreatePrincipalPayload>(initCreatePayload);

  const initEditPayload = {
    displayName: '',
    type: PrincipalType.GROUP,
    id: '',
  };
  const [editPayload, setEditPayload] = useState(initEditPayload);

  const editId = editPayload.id;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (payload.type === PrincipalType.USER) {
      mutate(payload);
    } else {
      mutate({
        ...payload,
        username: undefined,
        familyName: undefined,
        givenName: undefined,
      });
    }

    if (isSuccess) {
      setPayload(initCreatePayload);
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
      <h1 className="text-2xl font-bold mb-6">List Principals</h1>
      <div className="flex justify-end mb-2">
        <ModalButton
          id="createPrincipal"
          text="Create Principal"
          className="btn-primary btn-md"
        />

        <Modal id="createPrincipal" title="Create Principal">
          <>
            <div role="tablist" className="tabs tabs-boxed mb-4">
              {Object.values(PrincipalType).map((type) => (
                <a
                  role="tab"
                  className={`tab ${type === payload.type ? 'tab-active' : ''}`}
                  onClick={() => {
                    setPayload((prev) => ({
                      ...prev,
                      type,
                    }));
                  }}
                  key={type}
                >
                  {type}
                </a>
              ))}
            </div>

            <form className="flex flex-col" onSubmit={onSubmit}>
              <div className="form-control">
                <div className="label">
                  <span className="label-text">Display Name</span>
                </div>
                <input
                  value={payload.displayName}
                  onChange={onChange}
                  type="text"
                  className="grow input input-bordered w-full"
                  name="displayName"
                  placeholder="tsel"
                />
              </div>

              {payload.type === PrincipalType.USER && (
                <>
                  <div className="form-control mt-2">
                    <div className="label">
                      <span className="label-text">Username</span>
                    </div>
                    <input
                      value={payload.username}
                      onChange={onChange}
                      type="text"
                      className="grow input input-bordered w-full"
                      name="username"
                      placeholder="telkomsel"
                    />
                  </div>

                  <div className="form-control my-2">
                    <div className="label">
                      <span className="label-text">Family Name</span>
                    </div>
                    <input
                      value={payload.familyName}
                      onChange={onChange}
                      type="text"
                      className="grow input input-bordered w-full"
                      name="familyName"
                      placeholder="telkomsel"
                    />
                  </div>

                  <div className="form-control">
                    <div className="label">
                      <span className="label-text">Given Name</span>
                    </div>
                    <input
                      value={payload.givenName}
                      onChange={onChange}
                      type="text"
                      className="grow input input-bordered w-full"
                      name="givenName"
                      placeholder="telkomsel"
                    />
                  </div>
                </>
              )}

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
              <th>Id</th>
              <th>Display Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {principals?.map(({ displayName, id, principalType }, idx) => (
              <tr key={id}>
                <td>{idx + 1}</td>
                <td>{id}</td>
                <td>
                  {editId === id ? (
                    <>
                      <div className="form-control">
                        <input
                          value={editPayload.displayName}
                          onChange={(e) => {
                            setEditPayload((prev) => ({
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
                      <div className="mt-2">
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => {
                            updatePrincipal(editPayload);
                            setEditPayload(initEditPayload);
                          }}
                          disabled={isUpdating}
                        >
                          {isUpdating && (
                            <span className="loading loading-spinner"></span>
                          )}
                          Save
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => {
                            setEditPayload(initEditPayload);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    displayName
                  )}
                </td>
                <td>{principalType}</td>
                <td className="flex flex-col">
                  <button
                    className="btn btn-info btn-sm mb-2"
                    onClick={() => {
                      if (editId === id) {
                        setEditPayload(initEditPayload);
                      } else {
                        setEditPayload({
                          displayName,
                          id,
                          type: principalType,
                        });
                      }
                    }}
                  >
                    {editId === id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      deletePrincipal({ id, type: principalType });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!!principals && principals.length == 0 && (
        <h3 className="mt-5">No data available, please create a new one.</h3>
      )}
      {isLoading && (
        <span className="loading loading-spinner loading-lg"></span>
      )}
      {isError && (
        <h3 className="mt-5">
          Error fetching data, please try again later or contact developer.
        </h3>
      )}
    </div>
  );
};
