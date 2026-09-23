import type { ReactNode } from "react";
export const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-gradient-to-b from-sky-50 to-sky-100 px-5 py-2.5 text-sm font-medium text-sky-800 shadow-sm hover:-translate-y-0.5 hover:from-sky-100 hover:to-sky-200 hover:shadow-lg hover:shadow-sky-900/10 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 ";
export const inputClass =
  "mt-2.5 block min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200/60 focus-visible:outline-none transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none";
export function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-800 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-sm leading-7 text-slate-500 ">
        {description}
      </p>
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-12 text-center text-sm leading-7 text-slate-500 hover:border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none">
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
