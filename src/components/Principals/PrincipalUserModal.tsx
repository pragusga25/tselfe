import { useCreatePrincipalUser } from '@/hooks';
import { ModalButton } from '../Modal/ModalButton';
import { Modal } from '../Modal';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CreatePrincipalUserPayload } from '@/types';

const inputs: {
  name: keyof CreatePrincipalUserPayload;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  {
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    placeholder: 'tsel',
  },
  {
    name: 'familyName',
    label: 'Family Name',
    type: 'text',
    placeholder: 'telkomsel',
  },
  {
    name: 'givenName',
    label: 'Given Name',
    type: 'text',
    placeholder: 'telkomsel',
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'telkomsel',
  },
];

export const PrincipalUserModal = () => {
  const { mutate, isPending, isSuccess } = useCreatePrincipalUser();

  const initCreatePayload: CreatePrincipalUserPayload = {
    displayName: '',
    familyName: '',
    givenName: '',
    username: '',
  };

  const [payload, setPayload] =
    useState<CreatePrincipalUserPayload>(initCreatePayload);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        id="createUser"
        text="Create User"
        className="btn-primary btn-md"
      />

      <Modal id="createUser" title="Create User">
        <form className="flex flex-col" onSubmit={onSubmit}>
          {inputs.map(({ label, name, placeholder, type }) => (
            <div className="form-control" key={name}>
              <div className="label">
                <span className="label-text">{label}</span>
              </div>
              <input
                value={payload[name]}
                onChange={onChange}
                type={type}
                className="grow input input-bordered w-full"
                name={name}
                placeholder={placeholder}
              />
            </div>
          ))}

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
