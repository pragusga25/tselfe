import {
  useCreateFreezeTime,
  useDeleteFreezeTimes,
  useListFreezeTimes,
  useListPermissionSets,
} from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import {
  CreateFreezeTimePayload,
  FreezeTimeTarget,
  PermissionSets,
} from '@/types';
import { ChangeEvent, useState } from 'react';
import { formatDate } from '@/lib/utils';

export const FreezeTimes = () => {
  const { data } = useListFreezeTimes();

  const { data: permissionSets } = useListPermissionSets();
  const {
    mutate: createFreezeTime,
    isPending,
    isSuccess,
  } = useCreateFreezeTime();
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

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const [payload, setPayload] = useState<CreateFreezeTimePayload>({
    endTime: tomorrowDate.toISOString().split('T')[0],
    note: '',
    startTime: new Date().toISOString().split('T')[0],
    permissionSets: [],
    target: FreezeTimeTarget.GROUP,
  });

  const onCreate = () => {
    createFreezeTime({
      ...payload,
      permissionSets: selectedPermissionSets,
      note: payload.note?.length === 0 ? undefined : payload.note,
    });

    if (isSuccess) {
      setPayload({
        endTime: new Date().toDateString(),
        note: '',
        startTime: new Date().toDateString(),
        permissionSets: [],
        target: FreezeTimeTarget.GROUP,
      });

      setSelectedPermissionSets([]);
    }
  };

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setPayload((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
                <span className="label-text">Start Date</span>
              </div>
              <input
                type="date"
                className="input input-bordered w-full"
                name="startTime"
                value={payload.startTime}
                onChange={onChange}
              />
            </div>

            <div className="form-control mt-2">
              <div className="label">
                <span className="label-text">End Date</span>
              </div>
              <input
                type="date"
                className="input input-bordered w-full"
                name="endTime"
                value={payload.endTime}
                onChange={onChange}
              />
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

            <div className="mt-2">
              <div className="label">
                <span className="label-text">Note</span>
              </div>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Note"
                value={payload.note}
                name="note"
                onChange={onChange}
              ></textarea>
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
              <th>Creator</th>
              <th>Permission Sets</th>
              <th>Target</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Note</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((fz, idx) => {
              const now = new Date();
              const startTime = new Date(fz.startTime);
              const endTime = new Date(fz.endTime);
              let status = 'PENDING';

              if (now >= startTime && now < endTime) {
                status = 'ACTIVE';
              } else if (now > endTime) {
                status = 'EXPIRED';
              }
              return (
                <tr key={fz.id}>
                  <td>{idx + 1}</td>
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
                  <td>{formatDate(fz.startTime, false)}</td>
                  <td>{formatDate(fz.endTime, false)}</td>
                  <td>
                    <span className={`badge badge-${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td>{fz.note ?? '-'}</td>
                  <td>{formatDate(fz.createdAt)}</td>
                  <td>{formatDate(fz.updatedAt)}</td>
                  <td>
                    <button
                      className="btn btn-md btn-error"
                      onClick={() => deleteFreezeTimes({ ids: [fz.id] })}
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
        <h3 className="mt-5">No data available, please create first.</h3>
      )}
    </div>
  );
};
