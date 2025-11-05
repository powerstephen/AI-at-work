// app/page.tsx
import BrandHero from "../components/BrandHero";

"use client";

import { useState } from "react";

type TeamScope = "Company-wide" | "Marketing" | "Sales" | "Customer Support" | "Operations" | "Engineering" | "HR";
type Currency = "$" | "€" | "£";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b1022] text-white">
      <BrandHero />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <StepsWizard />
      </section>
    </main>
  );
}

/** --- Minimal, safe steps wizard --- */
function StepsWizard() {
  const [step, setStep] = useState<number>(1);

  // Step 1: Team basics
  const [team, setTeam] = useState<TeamScope>("Company-wide");
  const [employees, setEmployees] = useState<number>(50);
  const [currency, setCurrency] = useState<Currency>("€");

  // Step 2: AI maturity (1..10) + auto hours saved preview
  const [maturity, setMaturity] = useState<number>(3);

  // Step 3: Priorities (multi-select)
  const PRIORITIES = [
    { key: "throughput", label: "Throughput" },
    { key: "quality", label: "Quality" },
    { key: "onboarding", label: "Onboarding" },
    { key: "retention", label: "Retention" },
    { key: "upskilling", label: "Upskilling" },
  ] as const;
  type PriKey = typeof PRIORITIES[number]["key"];
  const [selected, setSelected] = useState<PriKey[]>(["throughput", "upskilling"]);

  // Step 4: Training plan
  const [hoursPerPerson, setHoursPerPerson] = useState<number>(12);
  const [durationWeeks, setDurationWeeks] = useState<number>(8);

  // Step 5: Costs & hourly value
  const [hourlyCost, setHourlyCost] = useState<number>(50);
  const [programCost, setProgramCost] = useState<number>(5000);

  // --- Derived numbers (simple, safe defaults) ---
  // Map maturity → base hours saved per employee/week
  // (tune to your model later)
  const maturityToHours = (m: number) => {
    // Example mapping: low maturity ⇒ bigger easy wins; then taper
    if (m <= 2) return 5;
    if (m <= 4) return 4;
    if (m <= 6) return 3;
    if (m <= 8) return 2;
    return 1.5;
  };
  const hoursSavedPerEmpPerWeek = maturityToHours(maturity);
  const hoursSavedTeamPerWeek = hoursSavedPerEmpPerWeek * Math.max(0, employees);

  // Value per week (simplified: hours * hourlyCost)
  const valuePerWeek = hoursSavedTeamPerWeek * hourlyCost;

  // Simple payback (program cost / weekly value), guard divide by zero
  const paybackWeeks = valuePerWeek > 0 ? Math.ceil(programCost / valuePerWeek) : 0;

  // UI helpers
  const StepHeader = ({ index, title }: { index: number; title: string }) => (
    <div className="mb-4">
      <div className="text-xs uppercase tracking-wider text-blue-300">
        Step {index}
      </div>
      <h3 className="text-xl font-semibold text-blue-100">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 text-blue-200 text-xs">
        {["Team", "AI Benchmark", "Priorities", "Training", "Costs"].map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  active ? "bg-[#3366fe]" : "bg-blue-900"
                }`}
              />
              <span className={`${active ? "text-blue-100 font-medium" : ""}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-blue-800/40 bg-blue-950/30 p-6 backdrop-blur-sm">
        {step === 1 && (
          <>
            <StepHeader index={1} title="Team" />
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-blue-200 mb-1">Department</label>
                <select
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={team}
                  onChange={(e) => setTeam(e.target.value as TeamScope)}
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

              <div>
                <label className="block text-sm text-blue-200 mb-1">Employees in scope</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={employees}
                  onChange={(e) => setEmployees(parseInt(e.target.value || "0", 10))}
                />
              </div>

              <div>
                <label className="block text-sm text-blue-200 mb-1">Currency</label>
                <div className="flex gap-2">
                  {(["€", "$", "£"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-3 py-2 rounded-md border ${
                        currency === c
                          ? "border-[#3366fe] bg-[#0f1a3a] text-blue-100"
                          : "border-blue-700/50 bg-[#0f1a3a] text-blue-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader index={2} title="AI Benchmark" />
            <div className="grid md:grid-cols-[1fr,320px] gap-6">
              <div>
                <label className="block text-sm text-blue-200 mb-2">
                  AI Maturity (1–10)
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={maturity}
                  onChange={(e) => setMaturity(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-blue-300 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                <div className="mt-3 text-blue-100 text-sm">
                  {maturity <= 3 && (
                    <p>
                      <strong>Early:</strong> ad-hoc experiments; big wins from prompt basics and
                      workflow mapping.
                    </p>
                  )}
                  {maturity >= 4 && maturity <= 7 && (
                    <p>
                      <strong>Developing:</strong> pilots running; standardize prompts and QA
                      guardrails; measure adoption.
                    </p>
                  )}
                  {maturity >= 8 && (
                    <p>
                      <strong>Embedded:</strong> AI in most workflows; champions network; track ROI
                      by team.
                    </p>
                  )}
                </div>
              </div>

              {/* Live preview box */}
              <div className="rounded-xl border border-blue-700/50 bg-[#0f1a3a] p-4">
                <div className="text-blue-200 text-[11px] uppercase tracking-wide mb-2">
                  Live preview
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maturity</span>
                    <span className="text-blue-100 font-semibold">{maturity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employees in scope</span>
                    <span className="text-blue-100 font-semibold">
                      {employees.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours saved / employee / week</span>
                    <span className="text-blue-100 font-semibold">
                      {hoursSavedPerEmpPerWeek.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours saved / team / week</span>
                    <span className="text-blue-100 font-semibold">
                      {hoursSavedTeamPerWeek.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader index={3} title="Priorities" />
            <p className="text-sm text-blue-300 mb-3">
              Pick up to 3 priorities to focus your business case.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {PRIORITIES.map((p) => {
                const active = selected.includes(p.key);
                return (
                  <button
                    key={p.key}
                    onClick={() => {
                      if (active) {
                        setSelected(selected.filter((k) => k !== p.key));
                      } else if (selected.length < 3) {
                        setSelected([...selected, p.key]);
                      }
                    }}
                    className={`text-left rounded-lg border p-3 ${
                      active
                        ? "border-[#3366fe] bg-[#0f1a3a] text-blue-100"
                        : "border-blue-700/50 bg-[#0f1a3a] text-blue-300"
                    }`}
                  >
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {p.key === "throughput" && "Ship more, faster"}
                      {p.key === "quality" && "Fewer reworks"}
                      {p.key === "onboarding" && "Ramp new hires quickly"}
                      {p.key === "retention" && "Reduce regretted attrition"}
                      {p.key === "upskilling" && "Grow AI competency"}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <StepHeader index={4} title="Training plan" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-blue-200 mb-1">
                  Training hours per person (total)
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={hoursPerPerson}
                  onChange={(e) => setHoursPerPerson(parseInt(e.target.value || "0", 10))}
                />
              </div>
              <div>
                <label className="block text-sm text-blue-200 mb-1">Program duration (weeks)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(parseInt(e.target.value || "0", 10))}
                />
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <StepHeader index={5} title="Costs & hourly value" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-blue-200 mb-1">
                  Average fully-loaded hourly cost ({currency})
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(parseFloat(e.target.value || "0"))}
                />
              </div>
              <div>
                <label className="block text-sm text-blue-200 mb-1">
                  Program cost (training + enablement) ({currency})
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-md bg-[#0f1a3a] border border-blue-700/50 p-2"
                  value={programCost}
                  onChange={(e) => setProgramCost(parseFloat(e.target.value || "0"))}
                />
              </div>
            </div>

            {/* Simple inline summary */}
            <div className="mt-6 rounded-xl border border-blue-700/50 bg-[#0f1a3a] p-4">
              <div className="text-blue-200 text-[11px] uppercase tracking-wide mb-2">
                Summary
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Hours saved / employee / week</span>
                  <span className="text-blue-100 font-semibold">
                    {hoursSavedPerEmpPerWeek.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hours saved / team / week</span>
                  <span className="text-blue-100 font-semibold">
                    {hoursSavedTeamPerWeek.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Value / week</span>
                  <span className="text-blue-100 font-semibold">
                    {currency}
                    {valuePerWeek.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payback</span>
                  <span className="text-blue-100 font-semibold">
                    {paybackWeeks ? `${paybackWeeks} weeks` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Nav buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`px-4 py-2 rounded-md border ${
              step === 1
                ? "border-blue-900 text-blue-900 cursor-not-allowed"
                : "border-blue-700/50 text-blue-100 hover:border-[#3366fe]"
            }`}
          >
            Back
          </button>

          <div className="text-blue-300 text-xs">Step {step} of 5</div>

          <button
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            className="px-4 py-2 rounded-md bg-[#3366fe] text-white hover:opacity-90"
          >
            {step === 5 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
