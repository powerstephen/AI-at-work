'use client';
import React, { useMemo, useState } from 'react';
import BrandHero from '@/components/BrandHero';

export default function Page() {
  // ====== BASIC INPUTS ======
  const [department, setDepartment] = useState('Company-wide');
  const [employees, setEmployees] = useState(25);
  const [avgSalary, setAvgSalary] = useState(45000);
  const [currency, setCurrency] = useState('€');

  // ====== MATURITY (1..10) ======
  const [maturity, setMaturity] = useState(3);

  // ====== TRAINING ======
  const [trainingWeeks, setTrainingWeeks] = useState(6);
  const [trainingCostPerEmployee, setTrainingCostPerEmployee] = useState(450);

  // ====== CALCS ======
  const hourlyCost = useMemo(() => avgSalary / 2080, [avgSalary]); // 2080 hrs/year (40*52)
  const hoursPerWeekPerEmployee = useMemo(() => {
    // Level 1 ≈ 5h/week → Level 10 ≈ 10h/week (smooth)
    return Number((5 + (5 * (maturity - 1)) / 9).toFixed(1));
  }, [maturity]);

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

  const money = (val: number) => `${currency}${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className="container">
      {/* HERO */}
      <BrandHero
        showResults={true}
        paybackMonths={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'}
        roiMultiple={roiMultiple.toFixed(1)}
        annualValue={money(annualValue)}
        monthlySavings={money(monthlySavings)}
      />

      {/* STEP 1 */}
      <section className="panel">
        <h2 className="panel__title">Step 1 — Team Basics</h2>
        <div className="panel__grid">
          <div className="form-row">
            <label className="label">Department</label>
            <select
              className="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option>Company-wide</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Customer Support</option>
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
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>€</option>
              <option>$</option>
              <option>£</option>
              <option>₺</option>
              <option>₦</option>
              <option>₹</option>
            </select>
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section className="panel">
        <h2 className="panel__title">Step 2 — AI Maturity</h2>
        <div className="form-row slider-wrap">
          <label className="label">Current maturity level (1–10)</label>
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
              ? 'Ad-hoc experiments; big wins from prompt basics + workflow mapping.'
              : maturity <= 7
              ? 'Growing usage across teams; measurable lifts in speed and quality.'
              : 'AI deeply embedded; advanced automations and governance.'}
            <br />
            <b>Estimated hours saved per employee/week:</b> {hoursPerWeekPerEmployee}h
          </div>
        </div>
      </section>

      {/* STEP 3 */}
      <section className="panel">
        <h2 className="panel__title">Step 3 — Training & ROI</h2>
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
              onChange={(e) =>
                setTrainingCostPerEmployee(Number(e.target.value || 0))
              }
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
            <div className="v">{money(weeklySavings)}</div>
          </div>
          <div className="result-card">
            <div className="k">Monthly savings</div>
            <div className="v">{money(monthlySavings)}</div>
          </div>
          <div className="result-card">
            <div className="k">Annual value</div>
            <div className="v">{money(annualValue)}</div>
          </div>
        </div>

        <div className="results">
          <div className="result-card">
            <div className="k">Total training cost</div>
            <div className="v">{money(totalTrainingCost)}</div>
          </div>
          <div className="result-card">
            <div className="k">Payback (months)</div>
            <div className="v">
              {Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'}
            </div>
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
      </section>

      <div className="spacer" />
    </div>
  );
}
