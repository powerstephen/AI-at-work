'use client';
import React, { useMemo, useState } from 'react';
import BrandHero from '@/components/BrandHero';

type Dept =
  | 'Company-wide'
  | 'Customer Support'
  | 'Sales'
  | 'Marketing'
  | 'Operations'
  | 'HR'
  | 'Finance'
  | 'Engineering';

const CURRENCIES = ['€', '$', '£', '₺', '₦', '₹'] as const;
type Currency = typeof CURRENCIES[number];

export default function Page() {
  // -------------------
  // STATE
  // -------------------
  const [department, setDepartment] = useState<Dept>('Company-wide');
  const [employees, setEmployees] = useState<number>(25);
  const [avgSalary, setAvgSalary] = useState<number>(45000);
  const [currency, setCurrency] = useState<Currency>('€');

  // AI maturity slider (1..10)
  const [maturity, setMaturity] = useState<number>(3);

  // Training/Duration
  const [trainingWeeks, setTrainingWeeks] = useState<number>(6);
  const [trainingCostPerEmployee, setTrainingCostPerEmployee] = useState<number>(450);

  // -------------------
  // CALC
  // -------------------
  // Map maturity to hours saved / week / employee
  const hoursPerWeekPerEmployee = useMemo(() => {
    // Smooth curve: level 1 ~ 5h/wk; level 10 ~ 10h/wk
    const minH = 5;
    const maxH = 10;
    return Number((minH + (maxH - minH) * ((maturity - 1) / 9)).toFixed(1));
  }, [maturity]);

  const hourlyCost = useMemo(() => avgSalary / 2080, [avgSalary]); // 2080 hrs/yr

  const weeklySavings = useMemo(() => {
    return employees * hoursPerWeekPerEmployee * hourlyCost;
  }, [employees, hoursPerWeekPerEmployee, hourlyCost]);

  const monthlySavings = useMemo(() => weeklySavings * 4.345, [weeklySavings]);
  const annualValue = useMemo(() => weeklySavings * 52, [weeklySavings]);

  const totalTrainingCost = useMemo(
    () => employees * trainingCostPerEmployee,
    [employees, trainingCostPerEmployee]
  );

  const paybackMonths = useMemo(() => {
    if (monthlySavings <= 0) return Infinity;
    return totalTrainingCost / monthlySavings;
  }, [totalTrainingCost, monthlySavings]);

  const roiMultiple = useMemo(() => {
    if (totalTrainingCost <= 0) return 0;
    return annualValue / totalTrainingCost;
  }, [annualValue, totalTrainingCost]);

  const money = (val: number, sym: string) =>
    `${sym}${Math.round(val).toLocaleString('en-US')}`;

  // -------------------
  // RENDER
  // -------------------
  return (
    <div className="container">
      {/* HERO */}
      <BrandHero
        showResults={true}
        paybackMonths={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'}
        roiMultiple={roiMultiple.toFixed(1)}
        annualValue={money(annualValue, currency)}
        monthlySavings={money(monthlySavings, currency)}
      />

      {/* INPUT PANEL */}
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Step 1 — Basics</h2>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top
            </button>
            <button className="btn btn-primary" onClick={() => window.alert('Continue… (hook up your stepper next)')}>
              Continue
            </button>
          </div>
        </div>

        <div className="panel__grid">
          <div className="form-row">
            <label className="label">Department</label>
            <select
              className="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Dept)}
            >
              <option>Company-wide</option>
              <option>Customer Support</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Operations</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Engineering</option>
            </select>
          </div>

          <div className="form-row">
            <label className="label">Employees in scope</label>
            <input
              className="input"
              type="number"
              min={1}
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value || 0))}
            />
          </div>

          <div className="form-row">
            <label className="label">Average salary ({currency})</label>
            <input
              className="input"
              type="number"
              min={0}
              step="1000"
              value={avgSalary}
              onChange={(e) => setAvgSalary(Number(e.target.value || 0))}
            />
          </div>

          <div className="form-row">
            <label className="label">Currency</label>
            <select
              className="select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* MATURITY PANEL */}
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Step 2 — AI Maturity</h2>
        </div>

        <div className="form-row slider-wrap">
          <label className="label">Current AI maturity level (1–10)</label>
          <input
            className="slider"
            type="range"
            min={1}
            max={10}
            value={maturity}
            onChange={(e) => setMaturity(Number(e.target.value))}
          />
          <div className="scale-legend">
            <span>1 — Early</span>
            <span>10 — Embedded</span>
          </div>
          <div className="callout">
            <b>Level {maturity}:</b>{' '}
            {maturity <= 3
              ? 'Ad-hoc experiments; big wins from prompt basics and workflow mapping.'
              : maturity <= 7
              ? 'Growing usage across teams; measurable lifts in speed and quality.'
              : 'AI deeply embedded into most workflows; advanced automations and governance.'}
            <br />
            <b>Estimated hours saved per employee/week:</b> {hoursPerWeekPerEmployee}h
          </div>
        </div>
      </section>

      {/* TRAINING COST PANEL */}
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">Step 3 — Training Plan</h2>
        </div>

        <div className="panel__grid">
          <div className="form-row">
            <label className="label">Program duration (weeks)</label>
            <input
              className="input"
              type="number"
              min={1}
              value={trainingWeeks}
              onChange={(e) => setTrainingWeeks(Number(e.target.value || 0))}
            />
          </div>

          <div className="form-row">
            <label className="label">Training cost per employee ({currency})</label>
            <input
              className="input"
              type="number"
              min={0}
              step="10"
              value={trainingCostPerEmployee}
              onChange={(e) => setTrainingCostPerEmployee(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <div className="results">
          <div className="result-card">
            <div className="k">Hours saved / employee / week</div>
            <div className="v">{hoursPerWeekPerEmployee}h</div>
          </div>
          <div className="result-card">
            <div className="k">Weekly team savings</div>
            <div className="v">{money(weeklySavings, currency)}</div>
          </div>
          <div className="result-card">
            <div className="k">Monthly savings</div>
            <div className="v">{money(monthlySavings, currency)}</div>
          </div>
          <div className="result-card">
            <div className="k">Annual value</div>
            <div className="v">{money(annualValue, currency)}</div>
          </div>
        </div>

        <div className="results">
          <div className="result-card">
            <div className="k">Total training cost</div>
            <div className="v">{money(totalTrainingCost, currency)}</div>
          </div>
          <div className="result-card">
            <div className="k">Payback (months)</div>
            <div className="v">{Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'}</div>
          </div>
          <div className="result-card">
            <div className="k">Annual ROI (×)</div>
            <div className="v">{roiMultiple.toFixed(1)}×</div>
          </div>
          <div className="result-card">
            <div className="k">Department</div>
            <div className="v">{department}</div>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={() => window.alert('Generate report (link to /report)')}>
            Generate report
          </button>
          <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </div>
      </section>

      <div className="spacer" />
    </div>
  );
}
