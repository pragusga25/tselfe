import {
  useAcceptAssignmentRequests,
  useAcceptAssignmentUserRequest,
  useRejectAssignmentRequests,
  useRejectAssignmentUserRequest,
} from '@/hooks';
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

export const RespondModal = ({
  onClose,
  isOpen,
  requestId,
  requestType,
}: {
  onClose: () => unknown;
  isOpen: boolean;
  requestId: string;
  requestType: 'regular' | 'user';
}) => {
  const { mutate: accept, isPending: accepting } =
    useAcceptAssignmentRequests();

  const { mutate: acceptUserRequest, isPending: acceptingUserRequest } =
    useAcceptAssignmentUserRequest();

  const { mutate: rejectUserRequest, isPending: rejectingUserRequest } =
    useRejectAssignmentUserRequest();

  const { mutate: reject, isPending: rejecting } =
    useRejectAssignmentRequests();

  const isLoading =
    accepting || rejecting || acceptingUserRequest || rejectingUserRequest;

  const [responderNote, setResponderNote] = useState('');

  const respondAccept = () => {
    if (requestType === 'regular') {
      accept({
        ids: [requestId],
        responderNote,
      });
    } else {
      acceptUserRequest({
        id: requestId,
        responderNote,
      });
    }

    setResponderNote('');
    close();
  };

  const respondReject = () => {
    if (requestType === 'regular') {
      reject({
        ids: [requestId],
        responderNote,
      });
    } else {
      rejectUserRequest({
        id: requestId,
        responderNote,
      });
    }
    setResponderNote('');
    close();
  };

  const close = () => {
    onClose();
    setResponderNote('');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResponderNote(e.target.value);
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
              <DialogPanel className="w-full max-w-md rounded-xl bg-black/80 p-6 backdrop-blur-2xl">
                <DialogTitle as="h3" className="font-medium text-white">
                  Respond to Request
                </DialogTitle>

                <div className="w-full my-4">
                  <Field>
                    <Description className="text-sm/6 text-white/50">
                      Please type a note to the requester
                    </Description>
                    <Input
                      className="mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                      placeholder="Type a note"
                      onChange={onChange}
                      value={responderNote}
                    />
                  </Field>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <Button
                      className="inline-flex items-center mr-2 rounded-md bg-primary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={respondAccept}
                      disabled={isLoading}
                    >
                      Accept
                    </Button>

                    <Button
                      className="inline-flex items-center rounded-md bg-secondary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={respondReject}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>

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
