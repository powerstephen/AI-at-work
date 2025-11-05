"use client";

import React, { useMemo, useState } from "react";
import BrandHero from "../components/BrandHero";

/* -----------------------------
   Types (kept minimal to avoid TS noise)
------------------------------*/
type Currency = "$" | "€" | "£";
type Dept =
  | "Company-wide"
  | "Marketing"
  | "Sales"
  | "Customer Support"
  | "Operations"
  | "Engineering"
  | "HR";

type Priority =
  | "throughput"
  | "quality"
  | "onboarding"
  | "retention"
  | "upskilling";

/* Friendly labels for priorities */
const PRIORITY_LABEL: Record<Priority, string> = {
  throughput: "Throughput",
  quality: "Quality",
  onboarding: "Onboarding",
  retention: "Retention",
  upskilling: "Upskilling",
};

/* Default priority split weights.
   If user selects N items, we normalize these weights over the selected set. */
const PRIORITY_WEIGHTS: Record<Priority, number> = {
  throughput: 0.30,
  quality: 0.20,
  onboarding: 0.20,
  retention: 0.15,
  upskilling: 0.15,
};

/* Maturity → hours saved per employee per week.
   1 = low maturity (big wins from basic AI) → ~5h/week
   10 = high maturity (already optimized) → ~1h/week
   You can adjust these easily. */
const MATURITY_HOURS: Record<number, number> = {
  1: 5.0,
  2: 4.6,
  3: 4.2,
  4: 3.8,
  5: 3.4,
  6: 3.0,
  7: 2.6,
  8: 2.2,
  9: 1.6,
  10: 1.0,
};

/* Helper formatters */
const fmt = (n: number) => n.toLocaleString();
const money = (n: number, c: Currency) =>
  `${c} ${Math.round(n).toLocaleString()}`;

/* -----------------------------
   Small UI atoms
------------------------------*/
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-blue-500/10 bg-[#0f1a3a]/40 p-6 md:p-8 ${className}`}>
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl md:text-2xl font-semibold text-white">{children}</h2>;
}

function Subtle({ children }: { children: React.ReactNode }) {
  return <p className="text-blue-200/80 text-sm md:text-[15px]">{children}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-blue-200 text-[11px] uppercase tracking-wide">{children}</div>;
}

function NumberInput({
  value,
  onChange,
  min,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-40 rounded-lg bg-[#0c1633] border border-blue-500/20 px-3 py-2 text-white"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      {suffix && <span className="text-blue-200 text-sm">{suffix}</span>}
    </div>
  );
}

function CurrencyPicker({
  currency,
  onChange,
}: {
  currency: Currency;
  onChange: (c: Currency) => void;
}) {
  const items: Currency[] = ["$", "€", "£"];
  return (
    <div className="flex gap-2">
      {items.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-2 rounded-lg border ${
            currency === c
              ? "bg-blue-600/80 border-blue-400 text-white"
              : "bg-[#0c1633] border-blue-500/20 text-blue-200/90"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/* -----------------------------
   Main Page
------------------------------*/
export default function Page() {
  /* ---- Step 1: Team basics ---- */
  const [dept, setDept] = useState<Dept>("Company-wide");
  const [employees, setEmployees] = useState<number>(25);
  const [currency, setCurrency] = useState<Currency>("€");
  const [hourlyCost, setHourlyCost] = useState<number>(50); // fully loaded

  /* ---- Step 2: AI Maturity ---- */
  const [maturity, setMaturity] = useState<number>(3);

  /* ---- Step 3: Priorities ---- */
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([
    "throughput",
    "quality",
    "onboarding",
  ]);

  const togglePriority = (p: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  /* ---- Step 4: Training & Duration (incl. retention if chosen) ---- */
  const [trainingHoursPerEmployee, setTrainingHoursPerEmployee] = useState<number>(8);
  const [trainingCostPerEmployee, setTrainingCostPerEmployee] = useState<number>(300);
  const [programOneOffCost, setProgramOneOffCost] = useState<number>(2000);
  const [durationMonths, setDurationMonths] = useState<number>(12);

  // Retention specifics (only used if retention selected)
  const [baselineTurnoverPct, setBaselineTurnoverPct] = useState<number>(18);
  const [improvementPct, setImprovementPct] = useState<number>(10);
  const [replacementCostPerEmployee, setReplacementCostPerEmployee] = useState<number>(8000);

  /* -----------------------------
     Calculations
  ------------------------------*/
  // Hours saved per employee per week based on maturity
  const hoursPerEmployeePerWeek = useMemo(() => {
    const h = MATURITY_HOURS[maturity as keyof typeof MATURITY_HOURS] ?? 3;
    return h;
  }, [maturity]);

  const weeksPerMonth = 4.33;
  const teamHoursSavedPerMonth = hoursPerEmployeePerWeek * weeksPerMonth * employees;

  // Normalize weights over selected priorities
  const normalizedWeights = useMemo(() => {
    const sum = selectedPriorities.reduce((acc, p) => acc + PRIORITY_WEIGHTS[p], 0) || 1;
    const map = new Map<Priority, number>();
    selectedPriorities.forEach((p) => {
      map.set(p, PRIORITY_WEIGHTS[p] / sum);
    });
    return map;
  }, [selectedPriorities]);

  // Monetary savings (productivity)
  const monthlyProductivitySavings = teamHoursSavedPerMonth * hourlyCost;

  // Retention monthly savings (only if selected)
  const monthlyRetentionSavings = selectedPriorities.includes("retention")
    ? ((employees * (baselineTurnoverPct / 100) * (improvementPct / 100) * replacementCostPerEmployee) / 12)
    : 0;

  const monthlyGrossSavings = monthlyProductivitySavings + monthlyRetentionSavings;

  // Training amortization per month
  const trainingTotal = trainingHoursPerEmployee * hourlyCost * employees + trainingCostPerEmployee * employees + programOneOffCost;
  const monthlyAmortizedCost = durationMonths > 0 ? trainingTotal / durationMonths : trainingTotal;

  const monthlyNetSavings = Math.max(0, monthlyGrossSavings - monthlyAmortizedCost);

  // Payback & ROI
  const paybackMonths = monthlyNetSavings > 0 ? Math.ceil(trainingTotal / monthlyNetSavings) : Infinity;
  const annualROI = trainingTotal > 0 ? (monthlyNetSavings * 12) / trainingTotal : 0;

  // Breakdown table rows
  const breakdownRows = useMemo(() => {
    const rows: {
      key: Priority;
      reason: string;
      hours: number;
      value: number;
    }[] = [];

    selectedPriorities.forEach((p) => {
      const w = normalizedWeights.get(p) ?? 0;
      const hours = teamHoursSavedPerMonth * w;
      const value = hours * hourlyCost;
      let reason = "";

      switch (p) {
        case "throughput":
          reason = "Ship faster; reduce cycle time & waiting waste.";
          break;
        case "quality":
          reason = "Fewer reworks; better first-pass yield.";
          break;
        case "onboarding":
          reason = "Ramp new hires faster with guided prompts / playbooks.";
          break;
        case "upskilling":
          reason = "Grow AI confidence; expand competency coverage.";
          break;
        case "retention":
          reason = "Happier teams stay longer (plus separate retention calc).";
          break;
      }

      rows.push({ key: p, reason, hours, value });
    });

    return rows;
  }, [selectedPriorities, normalizedWeights, teamHoursSavedPerMonth, hourlyCost]);

  /* -----------------------------
     Render
  ------------------------------*/
  return (
    <div className="min-h-screen bg-[#0b1022] text-white">
      {/* HERO */}
      <div className="px-4 py-6 md:px-8 md:py-10">
        <BrandHero />
      </div>

      <main className="px-4 md:px-8 max-w-6xl mx-auto pb-16 space-y-8">

        {/* Step 1: Team */}
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 1 — Team</H2>
            <div className="text-blue-300/90 text-sm">Department, team size, currency</div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Department</Label>
              <select
                className="mt-1 w-full rounded-lg bg-[#0c1633] border border-blue-500/20 px-3 py-2 text-white"
                value={dept}
                onChange={(e) => setDept(e.target.value as Dept)}
              >
                {["Company-wide","Marketing","Sales","Customer Support","Operations","Engineering","HR"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Employees in scope</Label>
              <div className="mt-1"><NumberInput value={employees} onChange={setEmployees} min={1} /></div>
            </div>

            <div>
              <Label>Currency</Label>
              <div className="mt-1"><CurrencyPicker currency={currency} onChange={setCurrency} /></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Avg. fully-loaded hourly cost</Label>
              <div className="mt-1"><NumberInput value={hourlyCost} onChange={setHourlyCost} min={1} suffix={currency} /></div>
              <Subtle className="">Includes salary, benefits & overhead.</Subtle>
            </div>
          </div>
        </SectionCard>

        {/* Step 2: AI benchmark (maturity) */}
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 2 — AI Benchmark</H2>
            <div className="text-blue-300/90 text-sm">Where are you today?</div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Label>AI Maturity</Label>
              <div className="mt-2">
                {/* numeric slider with visible scale marks */}
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={maturity}
                  onChange={(e) => setMaturity(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="mt-1 flex justify-between text-[12px] text-blue-200/80">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-[#0c1633] border border-blue-500/20 p-4 mt-4">
                <div className="text-blue-200 text-sm mb-1">
                  Selected level: <span className="text-white font-semibold">{maturity}</span>
                </div>
                <div className="text-blue-200/90 text-sm">
                  {maturity <= 3 && "Early: ad-hoc experiments; big wins from prompt basics & workflow mapping."}
                  {maturity >= 4 && maturity <= 7 && "Developing: teams using AI in parts of their workflow; standardizing patterns now yields leverage."}
                  {maturity >= 8 && "Advanced: AI embedded across workflows; wins come from quality systems, guardrails & scale."}
                </div>
              </div>
            </div>

            {/* Live small panel */}
            <div className="rounded-xl bg-[#0c1633] border border-blue-500/20 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">Maturity</div>
                  <div className="text-white text-lg font-semibold">{maturity}/10</div>
                </div>
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">Employees in scope</div>
                  <div className="text-white text-lg font-semibold">{fmt(employees)}</div>
                </div>
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">Hours saved / employee / week</div>
                  <div className="text-white text-lg font-semibold">{hoursPerEmployeePerWeek.toFixed(1)}h</div>
                </div>
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">Hours saved / team / month</div>
                  <div className="text-white text-lg font-semibold">{fmt(Math.round(teamHoursSavedPerMonth))}h</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Step 3: Priorities */}
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 3 — Priorities</H2>
            <div className="text-blue-300/90 text-sm">Pick where improvements matter most</div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(["throughput","quality","onboarding","retention","upskilling"] as Priority[]).map((p) => {
              const active = selectedPriorities.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`text-left rounded-xl border p-4 ${
                    active
                      ? "border-blue-400 bg-blue-600/20"
                      : "border-blue-500/20 bg-[#0c1633]"
                  }`}
                >
                  <div className="text-white font-semibold">{PRIORITY_LABEL[p]}</div>
                  <div className="text-blue-200/90 text-sm mt-1">
                    {p === "throughput" && "Ship faster; reduce cycle time."}
                    {p === "quality" && "Improve first-pass yield; fewer reworks."}
                    {p === "onboarding" && "Ramp new hires quicker with guided prompts."}
                    {p === "retention" && "Boost engagement; reduce regretted attrition."}
                    {p === "upskilling" && "Increase AI competency coverage."}
                  </div>
                </button>
              );
            })}
          </div>
          <Subtle className="">
            Tip: Choose the levers you’d report on this quarter. Savings split across selections using sensible defaults.
          </Subtle>
        </SectionCard>

        {/* Step 4: Training, Duration (+ Retention specifics if chosen) */}
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 4 — Training & Duration</H2>
            <div className="text-blue-300/90 text-sm">Cost to enable + amortization</div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <Label>Training hours / employee</Label>
              <div className="mt-1"><NumberInput value={trainingHoursPerEmployee} onChange={setTrainingHoursPerEmployee} min={0} suffix="h" /></div>
            </div>
            <div>
              <Label>Training cost / employee</Label>
              <div className="mt-1"><NumberInput value={trainingCostPerEmployee} onChange={setTrainingCostPerEmployee} min={0} suffix={currency} /></div>
            </div>
            <div>
              <Label>Program one-off cost</Label>
              <div className="mt-1"><NumberInput value={programOneOffCost} onChange={setProgramOneOffCost} min={0} suffix={currency} /></div>
            </div>
            <div>
              <Label>Amortization period (months)</Label>
              <div className="mt-1"><NumberInput value={durationMonths} onChange={setDurationMonths} min={1} /></div>
            </div>
          </div>

          {selectedPriorities.includes("retention") && (
            <div className="mt-6 rounded-xl border border-blue-500/20 p-4 bg-[#0c1633]">
              <div className="text-blue-200/90 font-medium mb-3">Retention assumptions (only applied if “Retention” is selected)</div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label>Baseline annual turnover</Label>
                  <div className="mt-1"><NumberInput value={baselineTurnoverPct} onChange={setBaselineTurnoverPct} min={0} suffix="%" /></div>
                </div>
                <div>
                  <Label>Expected improvement</Label>
                  <div className="mt-1"><NumberInput value={improvementPct} onChange={setImprovementPct} min={0} suffix="%" /></div>
                </div>
                <div>
                  <Label>Replacement cost / employee</Label>
                  <div className="mt-1"><NumberInput value={replacementCostPerEmployee} onChange={setReplacementCostPerEmployee} min={0} suffix={currency} /></div>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Step 5: Results */}
        <SectionCard>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 5 — Results</H2>
            <div className="text-blue-300/90 text-sm">Summary + breakdown</div>
          </div>

          {/* KPI boxes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">Monthly savings (gross)</div>
              <div className="text-2xl font-semibold mt-1">{money(monthlyGrossSavings, currency)}</div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">Amortized training / month</div>
              <div className="text-2xl font-semibold mt-1">{money(monthlyAmortizedCost, currency)}</div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">Monthly savings (net)</div>
              <div className="text-2xl font-semibold mt-1">{money(monthlyNetSavings, currency)}</div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">Hours saved / year (team)</div>
              <div className="text-2xl font-semibold mt-1">{fmt(Math.round(teamHoursSavedPerMonth * 12))}h</div>
            </div>
          </div>

          {/* Payback & ROI line */}
          <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4 mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div className="text-blue-200/90">
              <span className="text-white font-semibold">Payback:</span>{" "}
              {Number.isFinite(paybackMonths) ? `${paybackMonths} months` : "Not reached (adjust inputs)"}
            </div>
            <div className="text-blue-200/90">
              <span className="text-white font-semibold">Annual ROI:</span>{" "}
              {annualROI > 0 ? `${annualROI.toFixed(1)}×` : "—"}
            </div>
            <div className="text-blue-200/90">
              <span className="text-white font-semibold">Program cost (one-off):</span>{" "}
              {money(trainingTotal, currency)}
            </div>
          </div>

          {/* Breakdown table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-blue-200/90">
                  <th className="py-2 pr-4 font-medium">Priority</th>
                  <th className="py-2 pr-4 font-medium">Why it matters</th>
                  <th className="py-2 pr-4 font-medium text-right">Hours / month</th>
                  <th className="py-2 pr-0 font-medium text-right">Value / month</th>
                </tr>
              </thead>
              <tbody>
                {breakdownRows.map((r) => (
                  <tr key={r.key} className="border-t border-blue-500/10">
                    <td className="py-2 pr-4 text-white">{PRIORITY_LABEL[r.key]}</td>
                    <td className="py-2 pr-4 text-blue-200/90">{r.reason}</td>
                    <td className="py-2 pr-4 text-white text-right">{fmt(Math.round(r.hours))}h</td>
                    <td className="py-2 pr-0 text-white text-right">{money(r.value, currency)}</td>
                  </tr>
                ))}
                <tr className="border-t border-blue-500/10">
                  <td className="py-2 pr-4 text-white font-semibold">Total</td>
                  <td className="py-2 pr-4" />
                  <td className="py-2 pr-4 text-white text-right font-semibold">
                    {fmt(Math.round(teamHoursSavedPerMonth))}h
                  </td>
                  <td className="py-2 pr-0 text-white text-right font-semibold">
                    {money(monthlyProductivitySavings, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mt-6 text-blue-200/80 text-sm">
            <div className="mb-1">Notes:</div>
            <ul className="list-disc ml-5 space-y-1">
              <li>Productivity savings are driven by AI maturity → hours saved/employee/week.</li>
              <li>Savings are distributed over selected priorities using default weights (editable in code).</li>
              {selectedPriorities.includes("retention") && (
                <li>Retention savings calculated from turnover improvement and replacement cost assumptions.</li>
              )}
              <li>Training costs are amortized over your selected period to show net impact and payback.</li>
            </ul>
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
