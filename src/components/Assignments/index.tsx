import {
  useCreateAssignment,
  useDeleteAssignment,
  useEditAssignment,
  useListAssignments,
  useListAwsAccounts,
  useListPermissionSets,
  useListPrincipals,
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
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';

export const Assignments = () => {
  const { data, searchResult, search, onSearch, isLoading } =
    useListAssignments();
  const { data: permissionSets } = useListPermissionSets();
  const { data: principals } = useListPrincipals();
  const { data: awsAccounts } = useListAwsAccounts();

  const assignmentsSet = useMemo(() => {
    return new Set(
      data?.map(({ awsAccountId, principalType, principalId }) => {
        const key = `${awsAccountId}#${principalType}#${principalId}`;
        return key;
      })
    );
  }, [data]);

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

  const initCreatePayload: CreateAssignmentPayload = {
    principalId: '',
    principalType: PrincipalType.GROUP,
    awsAccountId: '',
    permissionSetArns: [],
  };

  const [createPayload, setCreatePayload] =
    useState<CreateAssignmentPayload>(initCreatePayload);

  const tabLists = [PrincipalType.GROUP, PrincipalType.USER];
  const [tabActive, setTabActive] = useState<PrincipalType>(
    PrincipalType.GROUP
  );
  const isGroupActive = tabActive === PrincipalType.GROUP;

  const filteredPrincipals = principals?.filter(({ principalType, id }) => {
    const key = `${createPayload.awsAccountId}#${principalType}#${id}`;
    return (
      principalType === createPayload.principalType && !assignmentsSet.has(key)
    );
  });

  const isFilteredPrincipalsEmpty = filteredPrincipals?.length === 0;

  const onChangeTabe = (tab: PrincipalType) => {
    setTabActive(tab);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreatePayload((prev) => ({ ...prev, [name]: value }));
  };

  const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(createPayload);
    createAssignment(createPayload);
  };

  const filteredAssignments = useMemo(() => {
    return searchResult?.filter(
      ({ principalType }) => principalType === tabActive
    );
  }, [data, tabActive, search]);

  const dataLen = data?.length || 0;
  const searchLen = searchResult?.length || 0;

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
      <h1 className="text-2xl font-bold mb-6">
        {isGroupActive
          ? 'Group Account Assignments'
          : 'User Account Assignments'}
      </h1>
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
                  <span className="label-text">AWS Account</span>
                </div>
                <select
                  value={createPayload.awsAccountId}
                  className="select select-bordered w-full"
                  name="awsAccountId"
                  onChange={onChange}
                >
                  <option value="" disabled hidden key="default">
                    Select AWS Account
                  </option>
                  {awsAccounts?.map((awsAccount) => (
                    <option value={awsAccount.id} key={awsAccount.id}>
                      {awsAccount.name} ({awsAccount.id})
                    </option>
                  ))}
                </select>
              </div>

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
                                createPayload.permissionSetArns.length ===
                                  permissionSetOptions?.length &&
                                createPayload.permissionSetArns.length !== 0
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
                                      permissionSetArns: [
                                        ...prev.permissionSetArns,
                                        p.arn,
                                      ],
                                    }));
                                  } else {
                                    setCreatePayload((prev) => ({
                                      ...prev,
                                      permissionSets:
                                        prev.permissionSetArns.filter(
                                          (arn) => arn !== p.arn
                                        ),
                                    }));
                                  }
                                }}
                                checked={
                                  !!createPayload.permissionSetArns.find(
                                    (arn) => arn === p.arn
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

      <div role="tablist" className="tabs tabs-boxed my-4">
        {tabLists.map((tab) => (
          <a
            role="tab"
            className={`tab ${tab === tabActive ? 'tab-active' : ''}`}
            onClick={() => onChangeTabe(tab)}
            key={tab}
          >
            {tab}
          </a>
        ))}
      </div>

      <div className="overflow-x-auto">
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
              <th>No.</th>
              <th>{isGroupActive ? 'Group Id' : 'User Id'}</th>
              <th>
                {isGroupActive ? 'Group Display Name' : 'User Display Name'}
              </th>
              <th>AWS Account Name</th>
              <th>Permission Sets</th>
              <th>Last Pushed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments?.map((assignment, idx) => (
              <tr key={assignment.id}>
                <td>{idx + 1}</td>
                <td>{assignment.principalId}</td>
                <td>{assignment.principalDisplayName}</td>
                <td>{assignment.awsAccountName}</td>

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
                              permissionSetArns: selectedPermissionSets.map(
                                (ps) => ps.arn
                              ),
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
                <td>
                  {assignment.lastPushedAt
                    ? formatDate(assignment.lastPushedAt)
                    : '-'}
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
                    {pushingOne && pushId === assignment.id ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Push'
                    )}
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
                    {deleting && deleteId === assignment.id ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!filteredAssignments || filteredAssignments.length == 0) &&
        !isLoading && (
          <h3 className="mt-5">No data available, please synchronize first.</h3>
        )}
      {isLoading && (
        <div className="flex justify-center mt-5">
          <span className="loading loading-lg"></span>
        </div>
      )}
    </div>
  );
};
