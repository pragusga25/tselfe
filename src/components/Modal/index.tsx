import { ReactNode } from 'react';

type ModalProps = {
  id: string;
  title: string;
  children?: ReactNode;
};
export const Modal = (props: ModalProps) => {
  const { id, children, title } = props;
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        {children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
