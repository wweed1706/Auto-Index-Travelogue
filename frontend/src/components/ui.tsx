import type { ReactNode } from "react";
export const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50";
export const inputClass =
  "mt-2 block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100";
export function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
        {title}
      </h1>
      <p className="text-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm leading-7 text-slate-500">
      {children}
    </div>
  );
}
export function ErrorNotice({ message }: { message: string }) {
  return message ? (
    <p
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
    >
      {message}
    </p>
  ) : null;
}
