'use client';

import React, { useMemo, useState } from 'react';

export default function Page() {
  // ----------- Step navigation -----------
  const [step, setStep] = useState(1);
  const maxStep = 5;
  const next = () => setStep((s) => Math.min(s + 1, maxStep));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // ----------- Step 1: Team Basics -----------
  const [department, setDepartment] = useState('Company-wide');
  const [employees, setEmployees] = useState(25);
  const [avgSalary, setAvgSalary] = useState(45000);
  const [currency, setCurrency] = useState('€');

  // ----------- Step 2: Priorities (checkboxes) -----------
  const PRIORITY_OPTIONS = [
    { key: 'throughput', label: 'Throughput / Time-to-done' },
    { key: 'quality', label: 'Work quality / Error reduction' },
    { key: 'onboarding', label: 'Onboarding speed' },
    { key: 'retention', label: 'Retention / Engagement' },
    { key: 'upskilling', label: 'Upskilling & AI literacy' },
    { key: 'csat', label: 'Customer satisfaction' },
  ] as const;
  type PriorityKey = (typeof PRIORITY_OPTIONS)[number]['key'];
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityKey[]>([
    'throughput',
    'upskilling',
    'quality',
  ]);
  const togglePriority = (key: PriorityKey) =>
    setSelectedPriorities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // ----------- Step 3: AI Maturity (1..10) -----------
  const [maturity, setMaturity] = useState(3);
  // hours saved per employee per week: 5h at L1 ➝ 10h at L10 (smooth)
  const hoursPerWeekPerEmployee = useMemo(
    () => Number((5 + (5 * (maturity - 1)) / 9).toFixed(1)),
    [maturity]
  );

  // ----------- Step 4: Training & Cost -----------
  const [trainingWeeks, setTrainingWeeks] = useState(6);
  const [trainingCostPerEmployee, setTrainingCostPerEmployee] = useState(450);

  // ----------- Core calcs -----------
  const hourlyCost = useMemo(() => avgSalary / 2080, [avgSalary]); // 2080 hrs/year
  const weeklySavings = useMemo(
    () => employees * hoursPerWeekPerEmployee * hourlyCost,
    [employees, hoursPerWeekPerEmployee, hourlyCost]
  );
  const monthlySavings = useMemo(() => weeklySavings * 4.345, [weeklySavings]);
  const annualValue = useMemo(() => weeklySavings * 52, [weeklySavings]);
  const totalTrainingCost = useMemo(
    () => employees * trainingCostPerEmployee,
    [employees, trainingCostPerEmployee]
  );
  const paybackMonths = useMemo(
    () => (monthlySavings > 0 ? totalTrainingCost / monthlySavings : Infinity),
    [totalTrainingCost, monthlySavings]
  );
  const roiMultiple = useMemo(
    () => (totalTrainingCost > 0 ? annualValue / totalTrainingCost : 0),
    [annualValue, totalTrainingCost]
  );

  // Small helper
  const money = (n: number) => `${currency}${Math.round(n).toLocaleString('en-US')}`;

  // ----------- Maturity description -----------
  const maturityText =
    maturity <= 3
      ? 'Early: ad-hoc experiments; big wins from prompt basics + workflow mapping'
      : maturity <= 7
      ? 'Developing: growing usage across teams; measurable lifts in speed & quality'
      : 'Embedded: AI deep in workflows; advanced automations & governance';

  return (
    <div className="shell">
      {/* HERO */}
      <section className="hero">
        <div className="hero__wrap">
          <div className="hero__top">
            <img
              src="/brainster-logo.png"
              alt="Brainster"
              className="hero__logo"
              width={160}
              height={40}
            />
            <div className="hero__pill">AI at Work</div>
          </div>
          <h1 className="hero__title">Human Productivity ROI</h1>
          <p className="hero__subtitle">
            Quantify time saved, payback, and retention impact from training managers and teams to
            work effectively with AI.
          </p>

          {/* KPI cards – live values visible any time */}
          <div className="hero__stats">
            <Stat label="Payback (months)" value={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'} />
            <Stat label="Annual ROI (×)" value={`${roiMultiple.toFixed(1)}×`} />
            <Stat label="Annual Value" value={money(annualValue)} />
            <Stat label="Monthly Savings" value={money(monthlySavings)} />
          </div>

          <div className="hero__outputs">
            <div className="hero__outputs-title">What this report shows</div>
            <div className="hero__outputs-grid">
              <div className="hero__output">🧠 Time Savings</div>
              <div className="hero__output">💰 Payback Period</div>
              <div className="hero__output">📈 ROI Multiple</div>
              <div className="hero__output">🏆 Retention Impact</div>
            </div>
          </div>
        </div>

        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__grid" aria-hidden="true" />
      </section>

      {/* STEPPER */}
      <div className="stepper">
        {['Team', 'Priorities', 'AI Maturity', 'Training', 'Results'].map((t, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={t} className={`stepper__item ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
              <div className="stepper__dot">{n}</div>
              <div className="stepper__label">{t}</div>
            </div>
          );
        })}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Panel title="Step 1 — Team">
          <Grid2>
            <Row label="Department">
              <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option>Company-wide</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Customer Support</option>
                <option>Operations</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Engineering</option>
              </select>
            </Row>
            <Row label="Employees in scope">
              <input
                className="input"
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value || 0))}
              />
            </Row>
            <Row label={`Average salary (${currency})`}>
              <input
                className="input"
                type="number"
                min={0}
                step="1000"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value || 0))}
              />
            </Row>
            <Row label="Currency">
              <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>€</option>
                <option>$</option>
                <option>£</option>
                <option>₺</option>
                <option>₦</option>
                <option>₹</option>
              </select>
            </Row>
          </Grid2>

          <Nav backHidden onNext={next} />
        </Panel>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Panel title="Step 2 — Priorities">
          <p className="muted">Pick up to three priorities to focus your business case.</p>
          <div className="priorities">
            {PRIORITY_OPTIONS.map((p) => {
              const checked = selectedPriorities.includes(p.key);
              const disabled = !checked && selectedPriorities.length >= 3; // cap at 3
              return (
                <label key={p.key} className={`chip ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => togglePriority(p.key)}
                  />
                  <span>{p.label}</span>
                </label>
              );
            })}
          </div>

          <Nav onBack={back} onNext={next} />
        </Panel>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Panel title="Step 3 — AI Maturity">
          <div className="maturity">
            <label className="label">Current maturity level (1–10)</label>
            <input
              className="slider"
              type="range"
              min={1}
              max={10}
              value={maturity}
              onChange={(e) => setMaturity(Number(e.target.value))}
            />
            <div className="maturity__legend">
              <span>1 — Early</span>
              <span>10 — Embedded</span>
            </div>

            <div className="maturity__summary">
              <div className="maturity__level">Level {maturity}</div>
              <div className="maturity__text">{maturityText}</div>
              <div className="maturity__stats">
                <div className="stat">
                  <div className="k">Hours saved / employee / week</div>
                  <div className="v">{hoursPerWeekPerEmployee}h</div>
                </div>
                <div className="stat">
                  <div className="k">Employees in scope</div>
                  <div className="v">{employees}</div>
                </div>
                <div className="stat">
                  <div className="k">Weekly team savings</div>
                  <div className="v">{money(weeklySavings)}</div>
                </div>
              </div>
            </div>
          </div>

          <Nav onBack={back} onNext={next} />
        </Panel>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <Panel title="Step 4 — Training & Cost">
          <Grid2>
            <Row label="Program duration (weeks)">
              <input
                className="input"
                type="number"
                min={1}
                value={trainingWeeks}
                onChange={(e) => setTrainingWeeks(Number(e.target.value || 0))}
              />
            </Row>
            <Row label={`Training cost per employee (${currency})`}>
              <input
                className="input"
                type="number"
                min={0}
                step="10"
                value={trainingCostPerEmployee}
                onChange={(e) => setTrainingCostPerEmployee(Number(e.target.value || 0))}
              />
            </Row>
          </Grid2>

          <div className="results">
            <Card k="Monthly savings" v={money(monthlySavings)} />
            <Card k="Annual value" v={money(annualValue)} />
            <Card k="Total training cost" v={money(totalTrainingCost)} />
            <Card k="Payback (months)" v={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'} />
            <Card k="Annual ROI (×)" v={`${roiMultiple.toFixed(1)}×`} />
          </div>

          <Nav onBack={back} onNext={next} />
        </Panel>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <Panel title="Step 5 — Results & Download">
          <div className="summary-grid">
            <KPI label="Department" value={department} />
            <KPI label="Employees in scope" value={String(employees)} />
            <KPI label="AI maturity (1–10)" value={String(maturity)} />
            <KPI label="Hours saved / emp / week" value={`${hoursPerWeekPerEmployee}h`} />
            <KPI label="Monthly savings" value={money(monthlySavings)} />
            <KPI label="Annual value" value={money(annualValue)} />
            <KPI label="Total training cost" value={money(totalTrainingCost)} />
            <KPI label="Payback (months)" value={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'} />
            <KPI label="Annual ROI (×)" value={`${roiMultiple.toFixed(1)}×`} />
          </div>

          <div className="priorities-readout">
            <div className="h">Your selected priorities</div>
            <ul>
              {selectedPriorities.map((k) => {
                const lbl = PRIORITY_OPTIONS.find((p) => p.key === k)?.label || k;
                return <li key={k}>• {lbl}</li>;
              })}
            </ul>
          </div>

          <div className="cta-wrap">
            <button className="btn btn--primary" onClick={() => alert('Export to PDF coming soon')}>
              Download PDF Summary
            </button>
            <button className="btn" onClick={() => setStep(1)}>Start Over</button>
          </div>
        </Panel>
      )}

      <div style={{ height: 28 }} />

      {/* ------- Styles (scoped & global) ------- */}
      <style jsx>{`
        /* Container */
        .shell {
          max-width: 1120px;
          margin: 0 auto;
          padding: 28px 20px 64px;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: #111827;
          background: #f7f8fc;
        }

        /* Hero */
        .hero {
          position: relative;
          overflow: hidden;
          background: #3366fe;
          color: #fff;
          border-radius: 18px;
          padding: 28px 20px 24px;
          box-shadow: 0 12px 30px rgba(51, 102, 254, 0.28);
        }
        .hero__wrap {
          position: relative;
          z-index: 1;
        }
        .hero__top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hero__logo {
          height: 28px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        .hero__pill {
          margin-left: auto;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.2);
          letter-spacing: 0.02em;
        }
        .hero__title {
          margin: 12px 0 4px;
          font-weight: 900;
          font-size: clamp(22px, 4vw, 36px);
          line-height: 1.12;
          letter-spacing: -0.01em;
        }
        .hero__subtitle {
          margin: 0 0 14px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.92);
        }
        .hero__stats {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 980px) {
          .hero__stats {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .hero__outputs {
          margin-top: 16px;
        }
        .hero__outputs-title {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0.95;
          margin-bottom: 8px;
          text-align: center;
        }
        .hero__outputs-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 800px) {
          .hero__outputs-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .hero__output {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 800;
          text-align: center;
        }
        .hero__bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              900px 600px at 10% -10%,
              rgba(255, 255, 255, 0.16),
              transparent 65%
            ),
            radial-gradient(700px 420px at 90% 10%, rgba(255, 255, 255, 0.12), transparent 70%);
          pointer-events: none;
        }
        .hero__grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(100% 70% at 50% 0%, black, transparent 80%);
          pointer-events: none;
        }

        /* Stepper */
        .stepper {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin: 14px 0 6px;
        }
        .stepper__item {
          display: grid;
          grid-template-rows: 28px auto;
          align-items: center;
          justify-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 12px;
          text-align: center;
        }
        .stepper__dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          display: grid;
          place-items: center;
          font-weight: 800;
          background: #fff;
        }
        .stepper__item.is-active .stepper__dot {
          border-color: #3366fe;
          background: #eef3ff;
          color: #1f2937;
        }
        .stepper__item.is-done .stepper__dot {
          border-color: #22c55e;
          background: #ecfdf5;
          color: #065f46;
        }

        /* Panels & Inputs */
        .panel {
          margin-top: 10px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 18px rgba(16, 24, 40, 0.04);
        }
        .panel__title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 900;
        }
        .grid-2 {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 820px) {
          .grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .row {
          display: grid;
          gap: 6px;
        }
        .label {
          font-size: 12px;
          font-weight: 700;
          color: #374151;
        }
        .muted {
          margin: 0 0 8px;
          color: #6b7280;
          font-size: 13px;
        }
        .input,
        select.input {
          width: 100%;
          height: 40px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #fff;
          outline: none;
          font-size: 14px;
        }
        .input:focus,
        select.input:focus {
          border-color: #3366fe;
          box-shadow: 0 0 0 3px rgba(51, 102, 254, 0.15);
        }

        /* Priorities (chips) */
        .priorities {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 900px) {
          .priorities {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .chip {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
          user-select: none;
        }
        .chip input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .chip.is-checked {
          border-color: #3366fe;
          background: #eef3ff;
        }
        .chip.is-disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Maturity */
        .maturity {
          display: grid;
          gap: 10px;
        }
        .slider {
          width: 100%;
          accent-color: #3366fe;
        }
        .maturity__legend {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        }
        .maturity__summary {
          margin-top: 2px;
          background: #eef3ff;
          border: 1px solid #c7d4ff;
          border-radius: 14px;
          padding: 12px;
        }
        .maturity__level {
          font-weight: 900;
          margin-bottom: 4px;
        }
        .maturity__text {
          color: #1f2937;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .maturity__stats {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .stat {
          background: #fff;
          border: 1px solid #dbe3ff;
          border-radius: 10px;
          padding: 8px;
          text-align: center;
        }
        .stat .k {
          font-size: 11px;
          color: #6b7280;
        }
        .stat .v {
          font-size: 16px;
          font-weight: 900;
        }

        /* Results */
        .results {
          margin-top: 10px;
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (min-width: 880px) {
          .results {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 12px;
          text-align: center;
        }
        .card .k {
          font-size: 11px;
          color: #6b7280;
        }
        .card .v {
          font-size: 18px;
          font-weight: 900;
        }

        /* Summary (step 5) */
        .summary-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 860px) {
          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .kpi {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .kpi .k {
          font-size: 11px;
          color: #6b7280;
        }
        .kpi .v {
          font-size: 18px;
          font-weight: 900;
        }
        .priorities-readout {
          margin-top: 12px;
          background: #f3f6ff;
          border: 1px solid #d9e2ff;
          border-radius: 12px;
          padding: 12px;
        }
        .priorities-readout .h {
          font-weight: 900;
          margin-bottom: 6px;
        }

        /* Buttons & nav */
        .nav {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 12px;
        }
        .btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        .btn:hover {
          background: #f8fafc;
        }
        .btn--primary {
          border-color: #3366fe;
          background: #3366fe;
          color: #fff;
        }
        .btn--primary:hover {
          filter: brightness(0.98);
        }
      `}</style>
    </div>
  );
}

/* ---------- Small presentational helpers (no external imports) ---------- */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2 className="panel__title">{title}</h2>
      {children}
    </section>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid-2">{children}</div>;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="row">
      <div className="label">{label}</div>
      {children}
    </div>
  );
}
function Card({ k, v }: { k: string; v: string }) {
  return (
    <div className="card">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ background: 'rgba(255,255,255,.14)', borderColor: 'rgba(255,255,255,.22)', color: '#fff' }}>
      <div className="k" style={{ color: 'rgba(255,255,255,.9)' }}>{label}</div>
      <div className="v" style={{ color: '#fff' }}>{value}</div>
    </div>
  );
}
function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpi">
      <div className="k">{label}</div>
      <div className="v">{value}</div>
    </div>
  );
}
function Nav({
  onBack,
  onNext,
  backHidden,
}: {
  onBack?: () => void;
  onNext?: () => void;
  backHidden?: boolean;
}) {
  return (
    <div className="nav">
      {!backHidden && <button className="btn" onClick={onBack}>Back</button>}
      <button className="btn btn--primary" onClick={onNext}>Continue</button>
    </div>
  );
}
