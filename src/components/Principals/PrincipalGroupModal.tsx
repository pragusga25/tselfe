import { useCreatePrincipalGroup } from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CreatePrincipalGroupPayload } from '@/types';

export const PrincipalGroupModal = () => {
  const { mutate, isPending, isSuccess } = useCreatePrincipalGroup();

  const initCreatePayload: CreatePrincipalGroupPayload = {
    displayName: '',
    description: '',
  };

  const [payload, setPayload] =
    useState<CreatePrincipalGroupPayload>(initCreatePayload);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (payload.description?.length === 0) {
      mutate({
        ...payload,
        description: undefined,
      });
      return;
    }
    mutate(payload);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        id="createGroup"
        text="Create Group"
        className="btn-primary btn-md"
      />

      <Modal id="createGroup" title="Create Group">
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

          <div className="form-control">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              value={payload.description}
              onChange={onChange}
              className="textarea textarea-bordered w-full"
              name="description"
              placeholder="telkomsel group"
            />
          </div>

          <div className="form-control mt-3">
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
