// app/page.tsx
"use client";

import { useMemo, useState } from "react";
import BrandHero from "../components/BrandHero";

type Team =
  | "Company-wide"
  | "Marketing"
  | "Sales"
  | "Customer Support"
  | "Operations"
  | "Engineering"
  | "HR";

type Currency = "$" | "€" | "£";

type Priority =
  | "throughput"
  | "quality"
  | "onboarding"
  | "retention"
  | "upskilling";

const PRIORITY_LABEL: Record<Priority, string> = {
  throughput: "Throughput",
  quality: "Quality",
  onboarding: "Onboarding Speed",
  retention: "Retention",
  upskilling: "Upskilling",
};

const PRIORITY_HELP: Record<Priority, string> = {
  throughput: "Ship faster; reduce cycle time and context switching.",
  quality: "Fewer reworks; better first-pass yield and QA guardrails.",
  onboarding: "Ramp new hires quicker with playbooks and examples.",
  retention:
    "Reduce regretted attrition via engagement & career progression.",
  upskilling:
    "Expand AI competency coverage; make ‘good’ the default baseline.",
};

// Simple €/$/£ symbol
const symbol = (c: Currency) => (c === "$" ? "$" : c === "€" ? "€" : "£");

// AI maturity → baseline hours saved / person / week (you can tune these)
function maturityToHoursSaved(maturity: number) {
  // 1 → ~5 hrs/wk, 10 → ~8 hrs/wk (smaller marginal gains late-stage)
  const min = 5;
  const max = 8;
  const pct = (maturity - 1) / 9; // 0..1
  return +(min + (max - min) * pct).toFixed(1);
}

export default function Page() {
  // STEP 1 — Basics
  const [team, setTeam] = useState<Team>("Company-wide");
  const [employees, setEmployees] = useState<number>(50);
  const [currency, setCurrency] = useState<Currency>("€");

  // STEP 2 — AI Maturity (slider 1..10)
  const [maturity, setMaturity] = useState<number>(3);

  // STEP 3 — Priorities (choose up to 3)
  const [selected, setSelected] = useState<Priority[]>([
    "throughput",
    "quality",
    "onboarding",
  ]);

  // STEP 4 — Training & Duration
  const [hourlyCost, setHourlyCost] = useState<number>(35); // fully-loaded
  const [weeklyHoursInScope, setWeeklyHoursInScope] = useState<number>(40); // hrs / person / week considered "in scope"
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // derived
  const baseHoursSavedPerPersonPerWeek = useMemo(
    () => maturityToHoursSaved(maturity),
    [maturity]
  );

  // Distribute the base hours saved across priorities (weighted — tweakable)
  const distribution = useMemo(() => {
    // Equal weight across their chosen priorities; if none chosen, fallback to throughput
    const chosen = selected.length ? selected : (["throughput"] as Priority[]);
    const per = baseHoursSavedPerPersonPerWeek / chosen.length;
    const map: Record<Priority, number> = {
      throughput: 0,
      quality: 0,
      onboarding: 0,
      retention: 0,
      upskilling: 0,
    };
    chosen.forEach((p) => (map[p] = per));
    return map;
  }, [selected, baseHoursSavedPerPersonPerWeek]);

  const totals = useMemo(() => {
    const hoursPerWeekTeam =
      baseHoursSavedPerPersonPerWeek * Math.max(0, employees);
    const weeks = Math.max(1, Math.round((durationMonths * 52) / 12));
    const hoursPerYearTeam = hoursPerWeekTeam * weeks;

    const monthlySavings =
      ((hoursPerWeekTeam * hourlyCost) / 4.33) /* avg wks/month */;

    const annualSavings = hoursPerWeekTeam * hourlyCost * 12 * (1 / 4.33);

    // Payback calc (very simple): assume training cost ~ 8h/employee upfront
    const assumedTrainingHoursPerEmployee = 8;
    const trainingCost =
      assumedTrainingHoursPerEmployee * hourlyCost * Math.max(0, employees);
    const paybackMonths =
      monthlySavings > 0 ? Math.max(0.2, trainingCost / monthlySavings) : 0;

    const annualROI =
      trainingCost > 0 ? Math.max(0, annualSavings / trainingCost) : 0;

    return {
      hoursPerWeekTeam,
      hoursPerYearTeam,
      monthlySavings,
      annualSavings,
      trainingCost,
      paybackMonths,
      annualROI,
    };
  }, [
    baseHoursSavedPerPersonPerWeek,
    employees,
    hourlyCost,
    durationMonths,
  ]);

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const fmtMoney = (n: number) =>
    `${symbol(currency)}${n.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;

  const stepBadge =
    "inline-flex h-7 items-center rounded-full bg-white/10 px-3 text-sm font-medium";

  const card =
    "rounded-xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur";

  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-8">
        {/* HERO IMAGE — replaces the old blue header box */}
        <BrandHero />

        {/* PROGRESS / STEPS */}
        <div className="flex flex-wrap gap-2 text-xs md:text-sm text-white/70">
          <span className={stepBadge}>1 · Team</span>
          <span className={stepBadge}>2 · AI Maturity</span>
          <span className={stepBadge}>3 · Priorities</span>
          <span className={stepBadge}>4 · Training & Duration</span>
          <span className={stepBadge}>5 · Results</span>
        </div>

        {/* STEP 1 — Team */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Step 1 · Team</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Department
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value as Team)}
                className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 focus:outline-none"
              >
                {[
                  "Company-wide",
                  "Marketing",
                  "Sales",
                  "Customer Support",
                  "Operations",
                  "Engineering",
                  "HR",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Employees in scope */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Employees in scope
              </label>
              <input
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(+e.target.value || 0)}
                className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 focus:outline-none"
                placeholder="e.g., 50"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Currency
              </label>
              <div className="flex gap-2">
                {(["€", "$", "£"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 h-10 rounded-lg border px-3 font-medium ${
                      currency === c
                        ? "bg-white text-[#0b1022]"
                        : "bg-white/10 border-white/10 text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2 — AI Maturity */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold">
              Step 2 · AI Maturity
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Where are you today? (1–10)
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={maturity}
                onChange={(e) => setMaturity(+e.target.value)}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-white/60">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-6 text-center ${
                      i + 1 === maturity ? "text-white font-semibold" : ""
                    }`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-white/80">
                <span className="font-medium">Selected:</span> {maturity} —{" "}
                {maturity <= 3
                  ? "Early: ad-hoc experiments; big wins from prompt basics + workflow mapping."
                  : maturity <= 6
                  ? "Emerging: pockets of usage; starting to codify playbooks & guardrails."
                  : maturity <= 8
                  ? "Scaling: embedded in key workflows with QA + data hygiene."
                  : "Advanced: standardized, measurable impact; continuous improvement culture."}
              </p>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <h3 className="text-sm text-white/70 mb-2">
                Estimated hours saved
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs text-white/70">Per employee / wk</div>
                  <div className="text-2xl font-semibold">
                    {baseHoursSavedPerPersonPerWeek}
                  </div>
                </div>
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="text-xs text-white/70">Team / wk</div>
                  <div className="text-2xl font-semibold">
                    {fmt(baseHoursSavedPerPersonPerWeek * employees)}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/60">
                This is a modeled estimate based on maturity. You can refine the
                assumptions via priorities and training below.
              </p>
            </div>
          </div>
        </section>

        {/* STEP 3 — Priorities (up to 3) */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold">
              Step 3 · Priorities
            </h2>
            <p className="text-xs text-white/60">
              Choose up to 3 priority areas to focus your AI enablement.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-3">
            {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => {
              const isActive = selected.includes(p);
              const canSelectMore =
                isActive || (!isActive && selected.length < 3);
              return (
                <button
                  key={p}
                  onClick={() => {
                    if (isActive) {
                      setSelected(selected.filter((x) => x !== p));
                    } else if (canSelectMore) {
                      setSelected([...selected, p]);
                    }
                  }}
                  className={`text-left rounded-lg border p-3 transition ${
                    isActive
                      ? "bg-white text-[#0b1022] border-white"
                      : "bg-white/10 border-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <div className="font-medium">{PRIORITY_LABEL[p]}</div>
                  <div className="text-xs opacity-80 mt-1">{PRIORITY_HELP[p]}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 4 — Training & Duration */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold">
              Step 4 · Training & Duration
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Fully-loaded hourly cost ({symbol(currency)})
              </label>
              <input
                type="number"
                min={0}
                value={hourlyCost}
                onChange={(e) => setHourlyCost(+e.target.value || 0)}
                className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 focus:outline-none"
                placeholder="e.g., 35"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Hours in scope per person / week
              </label>
              <input
                type="number"
                min={1}
                value={weeklyHoursInScope}
                onChange={(e) => setWeeklyHoursInScope(+e.target.value || 0)}
                className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 focus:outline-none"
                placeholder="e.g., 40"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">
                Duration (months)
              </label>
              <input
                type="number"
                min={1}
                value={durationMonths}
                onChange={(e) => setDurationMonths(+e.target.value || 1)}
                className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 focus:outline-none"
                placeholder="e.g., 6"
              />
            </div>
          </div>
        </section>

        {/* STEP 5 — Results */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Step 5 · Results</h2>
            <p className="text-xs text-white/60">
              Modeled impact based on your inputs.
            </p>
          </div>

          {/* KPI tiles */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-white/10 p-4">
              <div className="text-xs text-white/70">Monthly savings</div>
              <div className="text-2xl font-semibold">
                {fmtMoney(totals.monthlySavings)}
              </div>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <div className="text-xs text-white/70">Payback</div>
              <div className="text-2xl font-semibold">
                {totals.paybackMonths.toFixed(1)} mo
              </div>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <div className="text-xs text-white/70">Annual ROI</div>
              <div className="text-2xl font-semibold">
                ×{totals.annualROI.toFixed(1)}
              </div>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <div className="text-xs text-white/70">Hours saved / year</div>
              <div className="text-2xl font-semibold">
                {fmt(totals.hoursPerYearTeam)}
              </div>
            </div>
          </div>

          {/* Breakdown table (readable, aligned) */}
          <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Priority</th>
                  <th className="text-left font-medium px-4 py-3">Why it matters</th>
                  <th className="text-right font-medium px-4 py-3">Hours / wk</th>
                  <th className="text-right font-medium px-4 py-3">
                    Est. Value / wk
                  </th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(PRIORITY_LABEL) as Priority[])
                  .filter((p) => selected.includes(p))
                  .map((p) => {
                    const hrs = distribution[p] * employees;
                    const val = hrs * hourlyCost;
                    return (
                      <tr
                        key={p}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-3">{PRIORITY_LABEL[p]}</td>
                        <td className="px-4 py-3 text-white/80">
                          {PRIORITY_HELP[p]}
                        </td>
                        <td className="px-4 py-3 text-right">{fmt(hrs)}</td>
                        <td className="px-4 py-3 text-right">{fmtMoney(val)}</td>
                      </tr>
                    );
                  })}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-4 py-3 font-semibold">Total</td>
                  <td className="px-4 py-3 text-white/80">—</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {fmt(baseHoursSavedPerPersonPerWeek * employees)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {fmtMoney(baseHoursSavedPerPersonPerWeek * employees * hourlyCost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Next steps */}
          <div className="mt-6 text-sm text-white/85">
            <div className="font-semibold mb-2">Suggested next steps</div>
            <ul className="list-disc pl-5 space-y-1 text-white/80">
              <li>Map top 3 workflows for {team}; publish prompt templates.</li>
              <li>Run a manager-first enablement session; measure in-task usage.</li>
              <li>Set quarterly ROI reviews; correlate usage with retention.</li>
              <li>Expand champions cohort; target 60% competency coverage.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
