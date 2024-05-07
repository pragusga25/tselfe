type ModalButtonProps = {
  id: string;
  text: string;
  className?: string;
  overrideOnClick?: () => unknown;
  disabled?: boolean;
};

export const ModalButton = ({
  id,
  text,
  className,
  overrideOnClick,
  disabled = false,
}: ModalButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`btn ${className}`}
      onClick={() => {
        if (overrideOnClick) {
          overrideOnClick();
        } else {
          (document.getElementById(id) as any)?.showModal();
        }
      }}
    >
      {text}
    </button>
  );
};
