import { useEffect, useRef, type ReactNode } from "react";
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-5 text-slate-700 shadow-sm backdrop:bg-slate-900/30 sm:p-8 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 "
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-800 ">
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="rounded-lg border border-slate-100 px-3 py-2 text-sm hover:bg-slate-50 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none hover:shadow-sm"
        >
          Đóng
        </button>
      </div>
      {children}
    </dialog>
  );
}
