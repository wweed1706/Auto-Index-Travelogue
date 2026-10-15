import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ToastMessage } from "../types";
import { CheckCircle, X } from "../components/Icons";
interface ToastState {
  notify: (
    message: string,
    action?: ToastMessage["action"],
    tone?: ToastMessage["tone"],
  ) => void;
}
const ToastContext = createContext<ToastState | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const notify = useCallback(
    (
      message: string,
      action?: ToastMessage["action"],
      tone: ToastMessage["tone"] = "success",
    ) =>
      setToasts((items) => [
        ...items.slice(-2),
        { id: crypto.randomUUID(), message, action, tone },
      ]),
    [],
  );
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(
        () =>
          setToasts((items) => items.filter((item) => item.id !== toast.id)),
        toast.action ? 12000 : 5000,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 left-4 right-4 z-[70] flex flex-col items-center gap-2 sm:left-auto sm:right-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4"
          >
            <CheckCircle
              className={`h-5 w-5 shrink-0 ${toast.tone === "error" ? "text-rose-600" : "text-teal-600"}`}
            />
            <span className="min-w-0 flex-1 text-sm text-slate-700">
              {toast.message}
            </span>
            {toast.action && (
              <button
                className="text-sm font-semibold text-teal-700 hover:underline"
                onClick={() => {
                  toast.action?.run();
                  setToasts((items) =>
                    items.filter((item) => item.id !== toast.id),
                  );
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button
              aria-label="Đóng thông báo"
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100"
              onClick={() =>
                setToasts((items) =>
                  items.filter((item) => item.id !== toast.id),
                )
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Thiếu ToastProvider");
  return context;
}
