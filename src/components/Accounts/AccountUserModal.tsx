import {
  useCreateAccountUser,
  useListAwsAccounts,
  useListPrincipals,
} from '@/hooks';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CreateAccountUserPayload, PrincipalType } from '@/types';

export const AccountUserModal = () => {
  const { mutate, isPending, isSuccess } = useCreateAccountUser();
  const { data: principals } = useListPrincipals();
  const { data: awsAccounts } = useListAwsAccounts();

  const initCreatePayload: Omit<
    CreateAccountUserPayload,
    'principalAwsAccountUsers'
  > = {
    name: '',
    username: '',
    password: '',
  };

  const [payload, setPayload] =
    useState<Omit<CreateAccountUserPayload, 'principalAwsAccountUsers'>>(
      initCreatePayload
    );

  const [principalAwsAccountUsers, setPrincipalAwsAccountUsers] = useState<
    { principal: string; awsAccountId: string; key: string }[]
  >([
    {
      principal: '',
      awsAccountId: '',
      key: new Date().getTime().toString(),
    },
  ]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      ...payload,
      principalAwsAccountUsers: principalAwsAccountUsers.map(
        ({ principal, awsAccountId }) => ({
          principalId: principal.split('#')[1],
          principalType: principal.split('#')[0] as PrincipalType,
          awsAccountId,
        })
      ),
    });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPrincipalAccountPayload = () => {
    setPrincipalAwsAccountUsers((prev) => [
      ...prev,
      {
        principal: '',
        awsAccountId: '',
        key: new Date().getTime().toString(),
      },
    ]);
  };

  const removePrincipalAccountPayload = (key: string) => {
    setPrincipalAwsAccountUsers((prev) =>
      prev.filter((item) => item.key !== key)
    );
  };

  const handlePrincipalAccountChange = (
    key: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPrincipalAwsAccountUsers((prev) =>
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
      setPayload(initCreatePayload);
      setPrincipalAwsAccountUsers([
        {
          principal: '',
          awsAccountId: '',
          key: new Date().getTime().toString(),
        },
      ]);
    }
  }, [isSuccess]);

  return (
    <>
      <Modal id="createUserModal" title="Create User">
        <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
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

          {principalAwsAccountUsers.map(({ key, principal, awsAccountId }) => (
            <div className="form-control" key={key}>
              <div className="label">
                <span className="label-text">Principal Account</span>
              </div>
              <select
                value={principal}
                onChange={(e) => handlePrincipalAccountChange(key, e)}
                name="principal"
                className="select select-bordered w-full"
              >
                <option value="">Select Principal</option>
                {principals?.map((principal) => (
                  <option
                    key={principal.id + key}
                    value={`${principal.principalType}#${principal.id}`}
                  >
                    {principal.displayName} ({principal.principalType})
                  </option>
                ))}
              </select>

              <select
                value={awsAccountId}
                onChange={(e) => handlePrincipalAccountChange(key, e)}
                name="awsAccountId"
                className="select select-bordered w-full my-3"
              >
                <option value="">Select AWS Account</option>
                {awsAccounts?.map((awsAccount) => (
                  <option key={awsAccount.id + key} value={awsAccount.id}>
                    {awsAccount.name} ({awsAccount.id})
                  </option>
                ))}
              </select>

              {principalAwsAccountUsers.length > 1 && (
                <button
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removePrincipalAccountPayload(key)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-accent"
            onClick={addPrincipalAccountPayload}
          >
            Add Principal Account
          </button>

          <div className="form-control">
            <button className="btn btn-primary" disabled={isPending}>
              {isPending && <span className="loading loading-spinner"></span>}
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
