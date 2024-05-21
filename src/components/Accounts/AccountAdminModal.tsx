import { useCreateAccountAdmin } from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CreateAccountAdminPayload } from '@/types';

export const AccountAdminModal = () => {
  const { mutate, isPending, isSuccess } = useCreateAccountAdmin();

  const initCreatePayload: CreateAccountAdminPayload = {
    name: '',
    username: '',
    password: '',
  };

  const [payload, setPayload] =
    useState<CreateAccountAdminPayload>(initCreatePayload);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(payload);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      setPayload(initCreatePayload);
    }
  }, [isSuccess]);

  return (
    <>
      <ModalButton
        id="createAdminModal"
        text="Create Admin"
        className="btn-primary btn-md"
      />

      <Modal id="createAdminModal" title="Create Admin">
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
