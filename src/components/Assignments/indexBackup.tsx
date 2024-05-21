import {
  useCreateAssignment,
  useDeleteAssignment,
  useEditAssignment,
  useListAssignments,
  useListPermissionSets,
  useListPrincipalsNotInDb,
  usePullAssignments,
  usePushAssignments,
  usePushOneAssignment,
} from '@/hooks';
import { formatDate } from '@/lib/utils';
import {
  CreateAssignmentPayload,
  PermissionSets,
  PrincipalType,
} from '@/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';

export const Assignments = () => {
  const { data } = useListAssignments();
  const { data: permissionSets } = useListPermissionSets();
  const { data: principalsNotInDb } = useListPrincipalsNotInDb();

  const permissionSetOptions: PermissionSets =
    permissionSets?.map((p) => ({ arn: p.arn, name: p.name ?? p.arn })) ?? [];

  const isPermissionSetOptionsEmpty = permissionSetOptions.length === 0;

  const { mutate, isPending } = usePullAssignments();
  const { mutate: push, isPending: pushing } = usePushAssignments();
  const { mutate: edit, isPending: editing } = useEditAssignment();
  const { mutate: pushOne, isPending: pushingOne } = usePushOneAssignment();
  const { mutate: deleteAssignment, isPending: deleting } =
    useDeleteAssignment();
  const {
    mutate: createAssignment,
    isPending: creating,
    isSuccess: created,
  } = useCreateAssignment();

  const [editId, setEditId] = useState<string>('');
  const [pushId, setPushId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const currentEditData = data?.find((d) => d.id === editId);
  const currentEditPermissionSets = currentEditData?.permissionSets ?? [];
  const [selectedPermissionSets, setSelectedPermissionSets] = useState<
    {
      arn: string;
      name?: string;
    }[]
  >(currentEditPermissionSets ?? []);

  const initCreatePayload = {
    principalId: '',
    principalType: PrincipalType.GROUP,
    permissionSets: [],
  };

  const [createPayload, setCreatePayload] =
    useState<CreateAssignmentPayload>(initCreatePayload);

  const filteredPrincipals = principalsNotInDb?.filter((p) => {
    return p.type === createPayload.principalType;
  });

  const isFilteredPrincipalsEmpty = filteredPrincipals?.length === 0;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreatePayload((prev) => ({ ...prev, [name]: value }));
  };

  const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAssignment(createPayload);
  };

  useEffect(() => {
    if (currentEditData) {
      setSelectedPermissionSets(currentEditPermissionSets);
    }
  }, [currentEditPermissionSets]);

  useEffect(() => {
    if (created) {
      setCreatePayload(initCreatePayload);
    }
  }, [created]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Assignments</h1>
      <div className="flex justify-end mb-2">
        <button
          className={`btn btn-secondary btn-md ${isPending && 'disabled'}`}
          onClick={async () => {
            mutate();
          }}
          disabled={isPending}
        >
          {isPending && <span className="loading loading-spinner"></span>}
          Pull
        </button>
        <button
          className={`btn btn-info btn-md mx-4 ${pushing && 'disabled'}`}
          onClick={async () => {
            push();
          }}
          disabled={pushing}
        >
          {pushing && <span className="loading loading-spinner"></span>}
          Push
        </button>
        <ModalButton
          id="createAssignment"
          text="Create"
          className="btn-primary btn-md"
        />

        <Modal id="createAssignment" title="Create Assignment">
          <>
            <form className="flex flex-col" onSubmit={onCreate}>
              <div className="form-control">
                <div className="label">
                  <span className="label-text">Principal Type</span>
                </div>
                <select
                  value={createPayload.principalType}
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
                {isFilteredPrincipalsEmpty ? (
                  <span>No principals available</span>
                ) : (
                  <select
                    value={createPayload.principalId}
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
                )}
              </div>

              <div className="form-control mt-2">
                <div className="label">
                  <span className="label-text">Permission Sets</span>
                </div>
              </div>

              <div className="overflow-x-auto mt-2">
                {isPermissionSetOptionsEmpty ? (
                  'No permission sets available.'
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <label>
                            <input
                              type="checkbox"
                              className="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCreatePayload((prev) => ({
                                    ...prev,
                                    permissionSets: permissionSetOptions,
                                  }));
                                } else {
                                  setCreatePayload((prev) => ({
                                    ...prev,
                                    permissionSets: [],
                                  }));
                                }
                              }}
                              checked={
                                createPayload.permissionSets.length ===
                                  permissionSetOptions?.length &&
                                createPayload.permissionSets.length !== 0
                              }
                            />
                          </label>
                        </th>
                        <th>Name</th>
                        <th>Arn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionSetOptions.map((p) => (
                        <tr key={p.arn}>
                          <td>
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCreatePayload((prev) => ({
                                      ...prev,
                                      permissionSets: [
                                        ...prev.permissionSets,
                                        p,
                                      ],
                                    }));
                                  } else {
                                    setCreatePayload((prev) => ({
                                      ...prev,
                                      permissionSets:
                                        prev.permissionSets.filter(
                                          (ps) => ps.arn !== p.arn
                                        ),
                                    }));
                                  }
                                }}
                                checked={
                                  !!createPayload.permissionSets.find(
                                    (ps) => ps.arn === p.arn
                                  )
                                }
                              />
                            </label>
                          </td>
                          <td>{p.name}</td>
                          <td>{p.arn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="form-control mt-3">
                <button className="btn btn-primary" disabled={creating}>
                  {creating && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Create
                </button>
              </div>
            </form>
          </>
        </Modal>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Principal Id</th>
              <th>Principal Name</th>
              <th>Principal Type</th>
              <th>Last Pushed At</th>
              <th>Permission Sets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((assignment, idx) => (
              <tr key={assignment.id}>
                <td>{idx + 1}</td>
                <td>{assignment.principalId}</td>
                <td>{assignment.principalDisplayName}</td>
                <td>{assignment.principalType}</td>
                <td>
                  {assignment.lastPushedAt
                    ? formatDate(assignment.lastPushedAt)
                    : '-'}
                </td>
                <td>
                  {assignment.permissionSets
                    .map((ps) => {
                      if (ps.name) {
                        return ps.name;
                      }

                      return ps.arn;
                    })
                    .join(', ')}

                  {editId === assignment.id && (
                    <>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPermissionSets(
                                        permissionSetOptions
                                      );
                                    } else {
                                      setSelectedPermissionSets([]);
                                    }
                                  }}
                                  checked={
                                    selectedPermissionSets.length ===
                                      permissionSetOptions?.length &&
                                    selectedPermissionSets.length !== 0
                                  }
                                />
                              </label>
                            </th>
                            <th>Name</th>
                            <th>Arn</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permissionSetOptions.map((p) => (
                            <tr key={p.arn}>
                              <td>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPermissionSets((prev) => [
                                          ...prev,
                                          p,
                                        ]);
                                      } else {
                                        setSelectedPermissionSets((prev) =>
                                          prev.filter((ps) => ps.arn !== p.arn)
                                        );
                                      }
                                    }}
                                    checked={
                                      !!selectedPermissionSets.find(
                                        (ps) => ps.arn === p.arn
                                      )
                                    }
                                  />
                                </label>
                              </td>
                              <td>{p.name}</td>
                              <td>{p.arn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <button
                          className="btn btn-sm btn-accent mr-2"
                          onClick={() => {
                            setEditId('');
                            setSelectedPermissionSets([]);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            edit({
                              id: assignment.id,
                              permissionSets: selectedPermissionSets,
                            });
                            setEditId('');
                            setSelectedPermissionSets([]);
                          }}
                          disabled={editing}
                        >
                          {editing && (
                            <span className="loading loading-spinner"></span>
                          )}
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </td>
                <td className="flex flex-col">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                      setPushId(assignment.id);
                      pushOne({ id: assignment.id });
                    }}
                    disabled={pushingOne && pushId === assignment.id}
                  >
                    {pushingOne && pushId === assignment.id && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Push
                  </button>
                  <button
                    className="btn btn-sm btn-accent my-2"
                    onClick={() => {
                      if (editId === assignment.id) {
                        setEditId('');
                        setSelectedPermissionSets([]);
                      } else {
                        setEditId(assignment.id);
                      }
                    }}
                  >
                    {editId === assignment.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      setDeleteId(assignment.id);
                      deleteAssignment({ id: assignment.id });
                    }}
                    disabled={deleting && deleteId === assignment.id}
                  >
                    {deleting && deleteId === assignment.id && (
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
        <h3 className="mt-5">No data available, please synchronize first.</h3>
      )}
    </div>
  );
};
