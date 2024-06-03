import {
  useCreateFreezeTime,
  useDeleteFreezeTimes,
  useListFreezeTimes,
  useListPermissionSets,
  useListPrincipals,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import {
  CreateFreezeTimePayload,
  FreezeTimeTarget,
  PermissionSets,
  PrincipalType,
} from '@/types';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { formatDate, getLocaleDateString } from '@/lib/utils';

export const FreezeTimes = () => {
  const { data, isLoading } = useListFreezeTimes();

  const { data: permissionSets } = useListPermissionSets();
  const {
    mutate: createFreezeTime,
    isPending,
    isSuccess,
  } = useCreateFreezeTime();
  const { data: principals } = useListPrincipals();

  const permissionSetOptions: PermissionSets =
    permissionSets?.map((p) => ({ arn: p.arn, name: p.name ?? p.arn })) ?? [];
  const isPermissionSetOptionsEmpty = permissionSetOptions.length === 0;
  const [selectedPermissionSets, setSelectedPermissionSets] = useState<
    {
      arn: string;
      name?: string;
    }[]
  >([]);

  const { mutate: deleteFreezeTimes, isPending: isDeleting } =
    useDeleteFreezeTimes();

  const initPayload = {
    endTime: getLocaleDateString(new Date(), {
      addDay: 1,
      format: 'yyyy-mm-ddThh:MM',
    }),
    name: '',
    startTime: getLocaleDateString(new Date(), {
      format: 'yyyy-mm-ddThh:MM',
      addHours: 1,
    }),
    permissionSetArns: [],
    target: FreezeTimeTarget.GROUP,
  };

  const [payload, setPayload] = useState<CreateFreezeTimePayload>(initPayload);

  const [deleteId, setDeleteId] = useState<string>('');

  const [excludedPrincipals, setExcludedPrincipals] = useState<
    {
      principal: string;
      key: string;
    }[]
  >([]);

  const filteredPrincipals = useMemo(() => {
    const excludedPrincipalsSet = new Set(
      excludedPrincipals.map((p) => p.principal)
    );
    return principals?.filter((p) => {
      const typeFilter =
        payload.target == FreezeTimeTarget.ALL ||
        p.principalType.toString() == payload.target.toString();

      const alreadyExc = excludedPrincipalsSet.has(
        p.id + '#' + p.principalType + '#' + p.displayName
      );

      return typeFilter && !alreadyExc;
    });
  }, [payload.target, principals, excludedPrincipals]);

  const onCreate = () => {
    const filteredExcludedPrincipals = excludedPrincipals
      .filter((p) => p.principal.length > 0)
      .map((p) => ({
        id: p.principal.split('#')[0],
        type: p.principal.split('#')[1] as PrincipalType,
      }));
    const useExc = filteredExcludedPrincipals.length > 0;

    createFreezeTime({
      ...payload,
      permissionSetArns: selectedPermissionSets.map((ps) => ps.arn),
      excludedPrincipals: useExc ? filteredExcludedPrincipals : undefined,
      startTime: payload.startTime.replace('T', ' '),
      endTime: payload.endTime.replace('T', ' '),
    });
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const targetName = e.target.name;
    if (targetName === 'target') {
      setExcludedPrincipals([]);
    }

    setPayload((prev) => ({
      ...prev,
      [targetName]: value,
    }));
  };

  const addExcludedPrincipals = () => {
    setExcludedPrincipals((prev) => [
      ...prev,
      {
        principal: `${filteredPrincipals?.[0]?.id}#${filteredPrincipals?.[0]?.principalType}#${filteredPrincipals?.[0]?.displayName}`,
        key: new Date().getTime().toString(),
      },
    ]);
  };

  const removeExcludedPrincipals = (key: string) => {
    setExcludedPrincipals((prev) => prev.filter((item) => item.key !== key));
  };

  const handleExcludedPrincipalsChange = (
    key: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExcludedPrincipals((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  useEffect(() => {
    if (isSuccess) {
      setPayload(initPayload);
      setSelectedPermissionSets([]);
      setExcludedPrincipals([]);
    }
  }, [isSuccess]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Freeze Times</h1>

      <div className="flex justify-end mb-2">
        {/* <button className={`btn btn-primary btn-md`}>Create</button> */}
        <ModalButton
          id="createFreezeTime"
          text="Create"
          className="btn-primary btn-md"
        />

        <Modal id="createFreezeTime" title="Create Freeze Time">
          <>
            <div className="mt-2 form-control">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                className="input input-bordered w-full"
                placeholder="Unique name"
                value={payload.name}
                name="name"
                onChange={onChange}
              />
            </div>

            <div className="form-control">
              <div className="label">
                <span className="label-text">Target</span>
              </div>
              <select
                value={payload.target}
                className="select select-bordered w-full"
                name="target"
                onChange={onChange}
              >
                {Object.values(FreezeTimeTarget).map((p) => (
                  <option value={p} key={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mt-2">
              <div className="label">
                <span className="label-text">Start Time</span>
              </div>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                name="startTime"
                value={payload.startTime}
                onChange={onChange}
              />
            </div>

            <div className="form-control mt-2">
              <div className="label">
                <span className="label-text">End Time</span>
              </div>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                name="endTime"
                value={payload.endTime}
                onChange={onChange}
              />
            </div>

            <div className="form-control mt-2">
              <div className="label">
                <span className="label-text">Excluded Principals</span>
              </div>

              {excludedPrincipals.map(({ key, principal: exp }) => {
                const isFilled = exp.length > 0;
                let [expName, expType] = ['', ''];

                if (isFilled) {
                  const [_, type, name] = exp.split('#');
                  expName = name;
                  expType = type;
                }
                return (
                  <div className="mb-4 form-control" key={key + exp}>
                    <select
                      className="select select-bordered w-full"
                      name="principal"
                      key={key + payload.target}
                      value={exp}
                      onChange={(e) => handleExcludedPrincipalsChange(key, e)}
                    >
                      <option
                        value={isFilled ? exp : ''}
                        className={isFilled ? 'hidden' : ''}
                      >
                        {isFilled
                          ? `${expName} (${expType})`
                          : 'Select Principal'}
                      </option>
                      {filteredPrincipals?.map((principal) => {
                        const val = `${principal.id}#${principal.principalType}#${principal.displayName}`;
                        return (
                          <option key={principal.id} value={val}>
                            {principal.displayName} ({principal.principalType})
                          </option>
                        );
                      })}
                    </select>
                    <button
                      type="button"
                      className="btn btn-error mt-2 w-full"
                      onClick={() => removeExcludedPrincipals(key)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                className="btn btn-accent mt-2"
                onClick={addExcludedPrincipals}
              >
                Add Principal
              </button>
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
                                setSelectedPermissionSets(permissionSetOptions);
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
              )}
            </div>

            <div className="form-control mt-3">
              <button
                className="btn btn-primary"
                disabled={isPending}
                onClick={onCreate}
              >
                {isPending && <span className="loading loading-spinner"></span>}
                Create
              </button>
            </div>
          </>
        </Modal>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Creator</th>
              <th>Permission Sets</th>
              <th>Target</th>
              <th>Excluded</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((fz, idx) => {
              const now = new Date();
              const startTime = new Date(fz.startTime);
              const endTime = new Date(fz.endTime);
              let status = 'PENDING';
              let badge = 'badge-warning';

              if (now >= endTime) {
                status = 'EXPIRED';
                badge = 'badge-error';
              } else if (now >= startTime && now < endTime) {
                status = 'ACTIVE';
                badge = 'badge-success';
              }

              return (
                <tr key={fz.id}>
                  <td>{idx + 1}</td>
                  <td>{fz.name}</td>
                  <td>{fz.creator.name}</td>
                  <td>
                    {fz.permissionSets
                      .map((ps) => {
                        if (ps.name) {
                          return ps.name;
                        }

                        return ps.arn;
                      })
                      .join(', ')}
                  </td>
                  <td>{fz.target}</td>
                  <td>
                    {fz.excludedPrincipals
                      ?.map((p) => {
                        return `${p.displayName}`;
                      })
                      .join(', ')}
                  </td>
                  <td>
                    <span className={`badge ${badge} badge-outline`}>
                      {status}
                    </span>
                  </td>
                  <td>{formatDate(fz.startTime, true)}</td>
                  <td>{formatDate(fz.endTime, true)}</td>

                  <td>
                    <button
                      className="btn btn-md btn-error"
                      onClick={() => {
                        setDeleteId(fz.id);
                        deleteFreezeTimes({ ids: [fz.id] });
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting && deleteId === fz.id && (
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
      {(!data || data.length == 0) && !isLoading && (
        <h3 className="mt-5">No data available, please create first.</h3>
      )}
      {isLoading && (
        <div className="flex justify-center mt-5">
          <span className="loading loading-lg"></span>
        </div>
      )}
    </div>
  );
};
