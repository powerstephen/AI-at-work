'use client';
import React, { useMemo, useState } from 'react';

function money(n: number, ccy: string) {
  return `${ccy}${Math.round(n).toLocaleString('en-US')}`;
}

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
  const hourlyCost = useMemo(() => avgSalary / 2080, [avgSalary]); // 2080 hrs/year
  const hoursPerWeekPerEmployee = useMemo(
    () => Number((5 + (5 * (maturity - 1)) / 9).toFixed(1)), // 5h at L1 → 10h at L10
    [maturity]
  );
  const weeklySavings   = useMemo(() => employees * hoursPerWeekPerEmployee * hourlyCost, [employees, hoursPerWeekPerEmployee, hourlyCost]);
  const monthlySavings  = useMemo(() => weeklySavings * 4.345, [weeklySavings]);
  const annualValue     = useMemo(() => weeklySavings * 52, [weeklySavings]);
  const totalTraining   = useMemo(() => employees * trainingCostPerEmployee, [employees, trainingCostPerEmployee]);
  const paybackMonths   = useMemo(() => (monthlySavings > 0 ? totalTraining / monthlySavings : Infinity), [totalTraining, monthlySavings]);
  const roiMultiple     = useMemo(() => (totalTraining > 0 ? annualValue / totalTraining : 0), [annualValue, totalTraining]);

  return (
    <div style={{maxWidth:1120, margin:'0 auto', padding:'24px 16px 64px', fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color:'#111827', background:'#f7f8fc' }}>
      {/* HERO */}
      <section style={{
        position:'relative', overflow:'hidden', background:'#3366fe', color:'#fff',
        borderRadius:18, padding:'28px 20px 24px', boxShadow:'0 12px 30px rgba(51,102,254,0.28)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src="/brainster-logo.png" alt="Brainster" width={160} height={40} style={{height:28, width:'auto', filter:'brightness(0) invert(1)'}} />
          <div style={{marginLeft:'auto', fontSize:12, fontWeight:800, padding:'6px 10px', borderRadius:999, background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.2)'}}>
            AI at Work
          </div>
        </div>
        <h1 style={{margin:'12px 0 4px', fontWeight:900, fontSize:32, lineHeight:1.12, letterSpacing:'-0.01em'}}>Human Productivity ROI</h1>
        <p style={{margin:0, fontSize:14, color:'rgba(255,255,255,.92)'}}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>

        {/* KPI row */}
        <div style={{
          marginTop:12, display:'grid', gap:8,
          gridTemplateColumns:'repeat(2, minmax(0, 1fr))'
        }}>
          <Stat label="Payback (months)" value={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'} />
          <Stat label="Annual ROI (×)" value={`${roiMultiple.toFixed(1)}×`} />
          <Stat label="Annual Value" value={money(annualValue, currency)} />
          <Stat label="Monthly Savings" value={money(monthlySavings, currency)} />
        </div>

        {/* What this report shows */}
        <div style={{marginTop:16}}>
          <div style={{fontSize:12, fontWeight:900, letterSpacing:'.06em', textTransform:'uppercase', opacity:.95, marginBottom:8, textAlign:'center'}}>
            What this report shows
          </div>
          <div style={{display:'grid', gap:8, gridTemplateColumns:'repeat(4, minmax(0, 1fr))'}}>
            <Bubble>🧠 Time Savings</Bubble>
            <Bubble>💰 Payback Period</Bubble>
            <Bubble>📈 ROI Multiple</Bubble>
            <Bubble>🏆 Retention Impact</Bubble>
          </div>
        </div>

        {/* Decorative */}
        <div aria-hidden style={{
          position:'absolute', inset:0,
          background:'radial-gradient(900px 600px at 10% -10%, rgba(255,255,255,.16), transparent 65%), radial-gradient(700px 420px at 90% 10%, rgba(255,255,255,.12), transparent 70%)'
        }} />
        <div aria-hidden style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)',
          backgroundSize:'28px 28px',
          maskImage:'radial-gradient(100% 70% at 50% 0%, black, transparent 80%)'
        }} />
      </section>

      {/* STEP 1 */}
      <Panel title="Step 1 — Team Basics">
        <Grid2>
          <Row label="Department">
            <select value={department} onChange={e=>setDepartment(e.target.value)} className="select">
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
            <input type="number" min={1} value={employees} onChange={e=>setEmployees(Number(e.target.value||0))} className="input" />
          </Row>
          <Row label={`Average salary (${currency})`}>
            <input type="number" min={0} step="1000" value={avgSalary} onChange={e=>setAvgSalary(Number(e.target.value||0))} className="input" />
          </Row>
          <Row label="Currency">
            <select value={currency} onChange={e=>setCurrency(e.target.value)} className="select">
              <option>€</option><option>$</option><option>£</option><option>₺</option><option>₦</option><option>₹</option>
            </select>
          </Row>
        </Grid2>
      </Panel>

      {/* STEP 2 */}
      <Panel title="Step 2 — AI Maturity">
        <div style={{display:'grid', gap:8}}>
          <label style={{fontSize:12, fontWeight:700, color:'#374151'}}>Current maturity level (1–10)</label>
          <input type="range" min={1} max={10} value={maturity} onChange={e=>setMaturity(Number(e.target.value))} style={{width:'100%'}} />
          <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#6b7280'}}>
            <span>1 — Early</span><span>10 — Embedded</span>
          </div>
          <div style={{marginTop:4, padding:'10px 12px', background:'#eef3ff', border:'1px solid #c7d4ff', color:'#0f172a', borderRadius:12, fontSize:13}}>
            <b>Level {maturity}:</b>{' '}
            {maturity <= 3 ? 'Ad-hoc experiments; big wins from prompt basics + workflow mapping.'
              : maturity <= 7 ? 'Growing usage across teams; measurable lifts in speed and quality.'
              : 'AI deeply embedded; advanced automations and governance.'}
            <br />
            <b>Estimated hours saved / employee / week:</b> {hoursPerWeekPerEmployee}h
          </div>
        </div>
      </Panel>

      {/* STEP 3 */}
      <Panel title="Step 3 — Training & ROI">
        <Grid2>
          <Row label="Program duration (weeks)">
            <input type="number" min={1} value={trainingWeeks} onChange={e=>setTrainingWeeks(Number(e.target.value||0))} className="input" />
          </Row>
          <Row label={`Training cost per employee (${currency})`}>
            <input type="number" min={0} step="10" value={trainingCostPerEmployee} onChange={e=>setTrainingCostPerEmployee(Number(e.target.value||0))} className="input" />
          </Row>
        </Grid2>

        <div style={{marginTop:14, display:'grid', gap:10, gridTemplateColumns:'repeat(2, minmax(0, 1fr))'}}>
          <Card k="Hours saved / employee / week" v={`${hoursPerWeekPerEmployee}h`} />
          <Card k="Weekly team savings" v={money(weeklySavings, currency)} />
          <Card k="Monthly savings" v={money(monthlySavings, currency)} />
          <Card k="Annual value" v={money(annualValue, currency)} />
        </div>

        <div style={{marginTop:14, display:'grid', gap:10, gridTemplateColumns:'repeat(2, minmax(0, 1fr))'}}>
          <Card k="Total training cost" v={money(totalTraining, currency)} />
          <Card k="Payback (months)" v={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '—'} />
          <Card k="Annual ROI (×)" v={`${roiMultiple.toFixed(1)}×`} />
          <Card k="Department" v={department} />
        </div>
      </Panel>

      <div style={{height:24}} />
      <style jsx global>{`
        .input, .select {
          width: 100%; height: 40px; padding: 8px 10px;
          border-radius: 10px; border: 1px solid #d1d5db; background: #fff; outline: none; font-size: 14px;
        }
        .input:focus, .select:focus { border-color: #3366fe; box-shadow: 0 0 0 3px rgba(51,102,254,.15); }
      `}</style>
    </div>
  );
}

/* --- Small helpers (kept inside this file to avoid import mismatches) --- */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{marginTop:18, background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:18, boxShadow:'0 10px 18px rgba(16,24,40,.04)'}}>
      <h2 style={{margin:'0 0 10px', fontSize:18, fontWeight:900}}>{title}</h2>
      {children}
    </section>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{marginTop:4, display:'grid', gap:12, gridTemplateColumns:'1fr'}}>
      <div className="grid-wrap">{children}</div>
      <style jsx>{`
        @media (min-width: 820px) {
          .grid-wrap { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; }
        }
      `}</style>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{display:'grid', gap:6}}>
      <label style={{fontSize:12, fontWeight:700, color:'#374151'}}>{label}</label>
      {children}
    </div>
  );
}
function Card({ k, v }: { k: string; v: string }) {
  return (
    <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:12, textAlign:'center'}}>
      <div style={{fontSize:11, color:'#6b7280'}}>{k}</div>
      <div style={{fontSize:18, fontWeight:900}}>{v}</div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.22)', borderRadius:14, padding:'10px 12px', textAlign:'center'}}>
      <div style={{fontSize:11}}>{label}</div>
      <div style={{marginTop:2, fontSize:18, fontWeight:900}}>{value}</div>
    </div>
  );
}
function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.22)', borderRadius:12, padding:'10px 12px', fontWeight:800, textAlign:'center'}}>
      {children}
    </div>
  );
}
