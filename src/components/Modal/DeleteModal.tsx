import {
  Button,
  Input,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Field,
  Description,
} from '@headlessui/react';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

export const DeleteModal = ({
  onClose,
  isOpen,
  description,
  onConfirm,
  title,
}: {
  onClose: () => unknown;
  isOpen: boolean;
  description: string;
  onConfirm: () => unknown;
  title: string;
}) => {
  const [confirmText, setConfirmText] = useState('');

  const close = () => {
    onClose();
    setConfirmText('');
  };

  const confirm = () => {
    if (confirmText === 'delete') {
      onConfirm();
      close();
    } else {
      toast.error('Please type "delete" to confirm');
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
  };

  return (
    <Transition appear show={isOpen}>
      <Dialog
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 transform-[scale(95%)]"
              enterTo="opacity-100 transform-[scale(100%)]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 transform-[scale(100%)]"
              leaveTo="opacity-0 transform-[scale(95%)]"
            >
              <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-white"
                >
                  {title}
                </DialogTitle>
                <p className="mt-2 text-sm/6 text-white/50">{description}</p>

                <div className="w-full my-4">
                  <Field>
                    <Description className="text-sm/6 text-white/50">
                      Please type <strong>"delete"</strong> to confirm
                    </Description>
                    <Input
                      className="mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                      placeholder="delete"
                      onChange={onChange}
                      value={confirmText}
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-primary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                    onClick={confirm}
                    disabled={confirmText !== 'delete'}
                  >
                    Confirm
                  </Button>

                  <Button
                    className="ml-4 inline-flex items-center gap-2 rounded-md bg-error py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
