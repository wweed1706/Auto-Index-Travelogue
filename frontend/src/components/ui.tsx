import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";
import { Compass, Sparkles } from "./Icons";
export const buttonClass = "btn-primary";
export const inputClass = "input";
export function PageHeading({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-800 sm:text-3xl lg:text-[34px]">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}
export function EmptyState({
  children,
  title = "Một hành trình mới đang chờ",
  action,
}: {
  children?: ReactNode;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-5 py-14 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-700">
        <Compass className="h-6 w-6" />
      </span>
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      <div className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {children}
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export function ErrorNotice({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return message ? (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-semibold underline"
        >
          Thử lại
        </button>
      )}
    </div>
  ) : null;
}
export function Badge({
  children,
  demo = false,
}: {
  children: ReactNode;
  demo?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${demo ? "border-teal-100 bg-teal-50 text-teal-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}
    >
      {demo && <Sparkles className="h-3 w-3" />}
      {children}
    </span>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  const id = useId();
  const attach = (child: ReactNode): ReactNode => {
    if (
      !isValidElement<{
        children?: ReactNode;
        id?: string;
        "aria-describedby"?: string;
      }>(child)
    )
      return child;
    if (
      typeof child.type === "string" &&
      ["input", "select", "textarea"].includes(child.type)
    )
      return cloneElement(child, {
        id,
        "aria-describedby": hint ? id + "-hint" : undefined,
      });
    return child.props.children
      ? cloneElement(child, {
          children: Children.map(child.props.children, attach),
        })
      : child;
  };
  return (
    <div className="min-w-0 text-xs font-medium text-slate-600">
      <label htmlFor={id}>{label}</label>
      {Children.map(children, attach)}
      {hint && (
        <p
          id={id + "-hint"}
          className="mt-2 text-[11px] font-normal leading-5 text-slate-500"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
export function Skeleton({
  count = 3,
  label = "Đang tải dữ liệu…",
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="card overflow-hidden p-4 motion-safe:animate-pulse"
          >
            <div className="h-36 rounded-xl bg-slate-100" />
            <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
    />
  );
}
