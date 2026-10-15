import type { PlannerInput } from "../types";
import { usePlannerForm } from "../hooks/usePlannerForm";
import { destinations, interests } from "../services/catalog";
import { money } from "../services/utils";
import { Field, ErrorNotice, Spinner } from "./ui";
import { ArrowRight, Calendar, Sparkles } from "./Icons";
import DestinationArt from "./DestinationArt";
export default function PlannerForm({
  onSubmit,
  initial,
  destination = "",
}: {
  onSubmit: (input: PlannerInput, suggest: boolean) => Promise<boolean>;
  initial?: PlannerInput;
  destination?: string;
}) {
  const form = usePlannerForm(onSubmit, initial, destination);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
      className="card space-y-7 p-5 sm:p-8"
    >
      <ErrorNotice message={form.error} />
      <fieldset disabled={form.busy} className="space-y-7">
        {!initial && (
          <div>
            <p className="mb-4 text-xs font-medium text-slate-600">
              Một vài nơi để bắt đầu
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {destinations.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={form.input.destination === item.name}
                  onClick={() => form.setField("destination", item.name)}
                  className={`group overflow-hidden rounded-xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${form.input.destination === item.name ? "border-teal-600 ring-2 ring-teal-50" : "border-slate-200"}`}
                >
                  <DestinationArt
                    variant={item.symbol}
                    className="h-20 w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="block bg-white p-3 text-xs font-medium text-slate-700">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Điểm đến mong muốn">
            <input
              required
              list="planner-destinations"
              value={form.input.destination}
              onChange={(event) =>
                form.setField("destination", event.target.value)
              }
              placeholder="Chọn hoặc nhập điểm đến"
              className="input"
            />
            <datalist id="planner-destinations">
              {destinations.map((item) => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Số lượng người">
            <input
              required
              type="number"
              min={1}
              max={100}
              step={1}
              value={form.input.travelers}
              onChange={(event) =>
                form.setField("travelers", Number(event.target.value))
              }
              className="input"
            />
          </Field>
          <Field label="Ngày khởi hành">
            <input
              required
              type="date"
              value={form.input.startDate}
              onChange={(event) =>
                form.setField("startDate", event.target.value)
              }
              className="input"
            />
          </Field>
          <Field label="Ngày kết thúc">
            <input
              required
              type="date"
              min={form.input.startDate || undefined}
              value={form.input.endDate}
              onChange={(event) => form.setField("endDate", event.target.value)}
              className="input"
            />
          </Field>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label
              htmlFor="budget-amount"
              className="text-xs font-medium text-slate-600"
            >
              Ngân sách mỗi người
            </label>
            <span className="text-sm font-semibold text-teal-800">
              {money(form.input.budget)}
            </span>
          </div>
          <input
            aria-label="Thanh ngân sách"
            type="range"
            min={500000}
            max={30000000}
            step={500000}
            value={Math.min(30000000, form.input.budget)}
            onChange={(event) =>
              form.setField("budget", Number(event.target.value))
            }
            className="my-5 w-full accent-teal-700"
          />
          <div className="flex flex-wrap items-center gap-2">
            {[3000000, 7000000, 15000000].map((amount) => (
              <button
                type="button"
                key={amount}
                aria-pressed={form.input.budget === amount}
                onClick={() => form.setField("budget", amount)}
                className={`rounded-lg border px-3 py-2 text-[11px] transition-all duration-300 hover:-translate-y-0.5 ${form.input.budget === amount ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-500"}`}
              >
                {money(amount)}
              </button>
            ))}
            <input
              id="budget-amount"
              aria-label="Ngân sách mỗi người (VNĐ)"
              type="number"
              required
              min={100000}
              max={1000000000}
              step={1000}
              value={form.input.budget}
              onChange={(event) =>
                form.setField("budget", Number(event.target.value))
              }
              className="min-h-9 w-36 rounded-lg border border-slate-200 bg-white px-3 text-xs"
            />
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            Tổng ngân sách nhóm:{" "}
            {money(form.input.budget * form.input.travelers)}
          </p>
        </div>
        <details
          open={Boolean(initial)}
          className="rounded-xl border border-slate-200 p-5"
        >
          <summary className="cursor-pointer text-xs font-medium text-slate-600">
            Sở thích & điều cần tránh{" "}
            <span className="font-normal text-slate-400">· tùy chọn</span>
          </summary>
          <div className="mt-5 space-y-5">
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  aria-pressed={form.input.interests.includes(interest)}
                  onClick={() => form.toggleInterest(interest)}
                  className={`rounded-full border px-3 py-2 text-xs transition-all duration-300 hover:-translate-y-0.5 ${form.input.interests.includes(interest) ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-500"}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <Field label="Những điều không thích">
              <textarea
                value={form.input.dislikes}
                onChange={(event) =>
                  form.setField("dislikes", event.target.value)
                }
                rows={2}
                placeholder="Ví dụ: đồ ăn cay, lịch quá dày"
                className="input"
              />
            </Field>
          </div>
        </details>
        {!initial && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-teal-50/60 p-4">
            <input
              type="checkbox"
              checked={form.suggest}
              onChange={(event) => form.setSuggest(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-teal-700"
            />
            <span>
              <span className="block text-xs font-medium text-teal-800">
                Bắt đầu với lịch trình gợi ý
              </span>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                Dùng địa điểm demo phù hợp. Bạn có thể chỉnh lại mọi hoạt động.
              </span>
            </span>
          </label>
        )}
        <button disabled={form.busy} className="btn-primary w-full sm:w-auto">
          {form.busy ? (
            <Spinner />
          ) : initial ? (
            <Calendar className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {form.busy
            ? "Đang chuẩn bị kế hoạch…"
            : initial
              ? "Lưu tiêu chí"
              : "Tạo kế hoạch"}
          {!form.busy && <ArrowRight className="h-4 w-4" />}
        </button>
      </fieldset>
    </form>
  );
}
