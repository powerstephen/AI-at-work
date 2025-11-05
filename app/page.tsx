"use client";

import React, { useMemo, useState } from "react";
import BrandHero from "../components/BrandHero";

/** ————— Types & helpers ————— */
type Currency = "$" | "€" | "£";
const fmt = (n: number) => n.toLocaleString();
const money = (n: number, c: Currency) => `${c} ${Math.round(n).toLocaleString()}`;

const MATURITY_HOURS: Record<number, number> = {
  1: 5.0, 2: 4.6, 3: 4.2, 4: 3.8, 5: 3.4, 6: 3.0, 7: 2.6, 8: 2.2, 9: 1.6, 10: 1.0,
};

const PRIORITIES = [
  { key: "throughput", label: "Throughput", blurb: "Ship faster; reduce cycle time.", weight: 0.30 },
  { key: "quality",    label: "Quality",    blurb: "Fewer reworks; better first-pass yield.", weight: 0.20 },
  { key: "onboarding", label: "Onboarding", blurb: "Ramp new hires quicker.", weight: 0.20 },
  { key: "retention",  label: "Retention",  blurb: "Reduce regretted attrition.", weight: 0.15 },
  { key: "upskilling", label: "Upskilling", blurb: "Grow AI competency coverage.", weight: 0.15 },
] as const;
type PriorityKey = typeof PRIORITIES[number]["key"];

/** ————— UI atoms ————— */
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-blue-200 text-[11px] uppercase tracking-wide">{children}</div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-2xl border border-blue-500/10 bg-[#0f1430]/60 p-6 md:p-8 ${className}`}>
    {children}
  </section>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl md:text-2xl font-semibold text-white">{children}</h2>
);

function NumberInput(props: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
  className?: string;
}) {
  const { value, onChange, min, step = 1, suffix, className = "" } = props;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-40 rounded-lg bg-[#0c1633] border border-blue-500/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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
          className={`px-3 py-2 rounded-lg border transition ${
            currency === c
              ? "bg-blue-600/90 border-blue-400 text-white"
              : "bg-[#0c1633] border-blue-500/20 text-blue-200/90 hover:border-blue-400/50"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/** ————— Page ————— */
export default function Page() {
  /** STEP 1 — Team */
  const [dept, setDept] = useState("Company-wide");
  const [employees, setEmployees] = useState(25);
  const [currency, setCurrency] = useState<Currency>("€");
  const [hourlyCost, setHourlyCost] = useState(50);

  /** STEP 2 — AI Benchmark */
  const [maturity, setMaturity] = useState(3);
  const hoursPerEmpPerWeek = MATURITY_HOURS[maturity] ?? 3;

  /** STEP 3 — Priorities */
  const [selected, setSelected] = useState<PriorityKey[]>([
    "throughput",
    "quality",
    "onboarding",
  ]);
  const togglePriority = (k: PriorityKey) =>
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  /** STEP 4 — Training, Duration, Retention */
  const [trainingHoursPerEmp, setTrainingHoursPerEmp] = useState(8);
  const [trainingCostPerEmp, setTrainingCostPerEmp] = useState(300);
  const [programOneOff, setProgramOneOff] = useState(2000);
  const [months, setMonths] = useState(12);

  const [baselineTurnoverPct, setBaselineTurnoverPct] = useState(18);
  const [improvementPct, setImprovementPct] = useState(10);
  const [replacementCost, setReplacementCost] = useState(8000);

  /** ——— Math ——— */
  const weeksPerMonth = 4.33;
  const teamHoursPerMonth = hoursPerEmpPerWeek * weeksPerMonth * employees;
  const monthlyProdSavings = teamHoursPerMonth * hourlyCost;

  const monthlyRetention = selected.includes("retention")
    ? ((employees * (baselineTurnoverPct / 100) * (improvementPct / 100) * replacementCost) / 12)
    : 0;

  const monthlyGross = monthlyProdSavings + monthlyRetention;
  const programTotal =
    trainingHoursPerEmp * hourlyCost * employees +
    trainingCostPerEmp * employees +
    programOneOff;

  const amortized = months > 0 ? programTotal / months : programTotal;
  const net = Math.max(0, monthlyGross - amortized);
  const paybackMonths = net > 0 ? Math.ceil(programTotal / net) : Infinity;
  const annualROI = programTotal > 0 ? (net * 12) / programTotal : 0;

  const rows = useMemo(() => {
    const map = new Map<PriorityKey, number>();
    let sum = 0;
    selected.forEach((k) => {
      const w = PRIORITIES.find((p) => p.key === k)?.weight ?? 0;
      map.set(k, w);
      sum += w;
    });
    return selected.map((k) => {
      const weight = sum ? (map.get(k)! / sum) : 0;
      const hours = teamHoursPerMonth * weight;
      const value = hours * hourlyCost;
      const meta = PRIORITIES.find((p) => p.key === k)!;
      return { key: k, label: meta.label, blurb: meta.blurb, hours, value };
    });
  }, [selected, teamHoursPerMonth, hourlyCost]);

  /** ——— Render ——— */
  return (
    <div className="min-h-screen bg-[#0b1022] text-white">
      <div className="px-4 md:px-8 max-w-6xl mx-auto pt-6 md:pt-10">
        <BrandHero />
      </div>

      <main className="px-4 md:px-8 max-w-6xl mx-auto pb-16 space-y-8 mt-6">
        {/* STEP 1 — Team */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 1 — Team</H2>
            <div className="text-blue-300/90 text-sm">Department, team size, currency</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Department</Label>
              <select
                className="mt-1 w-full rounded-lg bg-[#0c1633] border border-blue-500/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                {[
                  "Company-wide",
                  "Marketing",
                  "Sales",
                  "Customer Support",
                  "Operations",
                  "Engineering",
                  "HR",
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Employees in scope</Label>
              <NumberInput className="mt-1" value={employees} onChange={setEmployees} min={1} />
            </div>
            <div>
              <Label>Currency</Label>
              <div className="mt-1">
                <CurrencyPicker currency={currency} onChange={setCurrency} />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Avg. fully-loaded hourly cost</Label>
              <NumberInput
                className="mt-1"
                value={hourlyCost}
                onChange={setHourlyCost}
                min={1}
                suffix={currency}
              />
              <p className="text-blue-200/80 text-sm mt-1">
                Includes salary, benefits & overhead.
              </p>
            </div>
          </div>
        </Card>

        {/* STEP 2 — AI Benchmark */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 2 — AI Benchmark</H2>
            <div className="text-blue-300/90 text-sm">Where are you today?</div>
          </div>
          <div>
            <Label>AI Maturity (1–10)</Label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={maturity}
              onChange={(e) => setMaturity(parseInt(e.target.value))}
              className="w-full accent-blue-500 mt-3"
            />
            <div className="mt-1 flex justify-between text-[12px] text-blue-200/80">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i + 1}>{i + 1}</span>
              ))}
            </div>

            <div className="rounded-xl bg-[#0c1633] border border-blue-500/20 p-4 mt-4">
              <div className="text-blue-200 text-sm mb-1">
                Selected level: <span className="text-white font-semibold">{maturity}</span>
              </div>
              <div className="text-blue-200/90 text-sm">
                {maturity <= 3 &&
                  "Early: ad-hoc experiments; big wins from prompt basics & workflow mapping."}
                {maturity >= 4 &&
                  maturity <= 7 &&
                  "Developing: AI used in parts of the workflow; standardization yields leverage."}
                {maturity >= 8 &&
                  "Advanced: AI embedded across workflows; focus on quality systems & scale."}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                    Hours / emp / week
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {hoursPerEmpPerWeek.toFixed(1)}h
                  </div>
                </div>
                <div className="rounded-lg border border-blue-400/20 p-3 bg-[#0f1a3a]/60">
                  <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                    Team hours / month
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {fmt(Math.round(hoursPerEmpPerWeek * 4.33 * employees))}h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* STEP 3 — Priorities */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 3 — Priorities</H2>
            <div className="text-blue-300/90 text-sm">Pick where improvements matter most</div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PRIORITIES.map((p) => {
              const active = selected.includes(p.key);
              return (
                <button
                  key={p.key}
                  onClick={() => togglePriority(p.key)}
                  className={`text-left rounded-xl border p-4 transition ${
                    active
                      ? "border-blue-400 bg-blue-600/20"
                      : "border-blue-500/20 bg-[#0c1633] hover:border-blue-400/40"
                  }`}
                >
                  <div className="text-white font-semibold">{p.label}</div>
                  <div className="text-blue-200/90 text-sm mt-1">{p.blurb}</div>
                </button>
              );
            })}
          </div>
          <p className="text-blue-200/80 text-sm mt-2">
            Tip: choose the levers you’d report on this quarter. Savings split across selections
            using sensible defaults.
          </p>
        </Card>

        {/* STEP 4 — Training & Duration (+ optional retention) */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 4 — Training & Duration</H2>
            <div className="text-blue-300/90 text-sm">Cost to enable + amortization</div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <Label>Training hours / employee</Label>
              <NumberInput
                className="mt-1"
                value={trainingHoursPerEmp}
                onChange={setTrainingHoursPerEmp}
                min={0}
                suffix="h"
              />
            </div>
            <div>
              <Label>Training cost / employee</Label>
              <NumberInput
                className="mt-1"
                value={trainingCostPerEmp}
                onChange={setTrainingCostPerEmp}
                min={0}
                suffix={currency}
              />
            </div>
            <div>
              <Label>Program one-off cost</Label>
              <NumberInput
                className="mt-1"
                value={programOneOff}
                onChange={setProgramOneOff}
                min={0}
                suffix={currency}
              />
            </div>
            <div>
              <Label>Amortization (months)</Label>
              <NumberInput className="mt-1" value={months} onChange={setMonths} min={1} />
            </div>
          </div>

          {selected.includes("retention") && (
            <div className="mt-6 rounded-xl border border-blue-500/20 p-4 bg-[#0c1633]">
              <div className="text-blue-200/90 font-medium mb-3">
                Retention assumptions (only if “Retention” is selected)
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label>Baseline turnover (annual)</Label>
                  <NumberInput
                    className="mt-1"
                    value={baselineTurnoverPct}
                    onChange={setBaselineTurnoverPct}
                    min={0}
                    suffix="%"
                  />
                </div>
                <div>
                  <Label>Expected improvement</Label>
                  <NumberInput
                    className="mt-1"
                    value={improvementPct}
                    onChange={setImprovementPct}
                    min={0}
                    suffix="%"
                  />
                </div>
                <div>
                  <Label>Replacement cost / employee</Label>
                  <NumberInput
                    className="mt-1"
                    value={replacementCost}
                    onChange={setReplacementCost}
                    min={0}
                    suffix={currency}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* STEP 5 — Results */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <H2>Step 5 — Results</H2>
            <div className="text-blue-300/90 text-sm">Summary + breakdown</div>
          </div>

          {/* KPI boxes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                Monthly savings (gross)
              </div>
              <div className="text-2xl font-semibold mt-1">
                {money(monthlyGross, currency)}
              </div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                Amortized training / month
              </div>
              <div className="text-2xl font-semibold mt-1">{money(amortized, currency)}</div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                Monthly savings (net)
              </div>
              <div className="text-2xl font-semibold mt-1">{money(net, currency)}</div>
            </div>
            <div className="rounded-xl border border-blue-400/20 bg-[#0f1a3a]/60 p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide">
                Hours saved / year (team)
              </div>
              <div className="text-2xl font-semibold mt-1">
                {fmt(Math.round(hoursPerEmpPerWeek * 4.33 * employees * 12))}h
              </div>
            </div>
          </div>

          {/* Payback & ROI */}
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
              {money(programTotal, currency)}
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
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-blue-500/10">
                    <td className="py-2 pr-4 text-white">{r.label}</td>
                    <td className="py-2 pr-4 text-blue-200/90">{r.blurb}</td>
                    <td className="py-2 pr-4 text-white text-right">
                      {fmt(Math.round(r.hours))}h
                    </td>
                    <td className="py-2 pr-0 text-white text-right">
                      {money(r.value, currency)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-blue-500/10">
                  <td className="py-2 pr-4 text-white font-semibold">Total</td>
                  <td className="py-2 pr-4" />
                  <td className="py-2 pr-4 text-white text-right font-semibold">
                    {fmt(Math.round(teamHoursPerMonth))}h
                  </td>
                  <td className="py-2 pr-0 text-white text-right font-semibold">
                    {money(monthlyProdSavings, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
