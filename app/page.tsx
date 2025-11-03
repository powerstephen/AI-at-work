'use client';
import React, { useMemo, useState } from 'react';

/* ============================================================
   Types, constants, helpers
============================================================ */
type Team = 'all'|'hr'|'ops'|'marketing'|'sales'|'support'|'product';
type Currency = 'EUR'|'USD'|'GBP';
type Goal = 'throughput'|'quality'|'onboarding'|'retention'|'cost'|'upskilling';

const BLUE = '#3366FE';

const TEAMS: {label:string; value:Team}[] = [
  { label: 'Company-wide', value: 'all' },
  { label: 'HR / People Ops', value: 'hr' },
  { label: 'Operations', value: 'ops' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Customer Support', value: 'support' },
  { label: 'Product', value: 'product' },
];

const GOAL_META: Record<Goal, {label:string; hint:string}> = {
  throughput: { label: 'Throughput / Cycle time', hint: 'Ship more, remove blockers' },
  quality:    { label: 'Quality / Rework',        hint: 'Cut rework & error rates'   },
  onboarding: { label: 'Onboarding speed',        hint: 'Faster time-to-productivity'},
  retention:  { label: 'Retention',               hint: 'Avoid regretted churn cost' },
  cost:       { label: 'Cost',                    hint: 'Tool consolidation savings' },
  upskilling: { label: 'Upskilling',              hint: 'Competency coverage → gains'},
};

const symbol = (c: Currency) => (c === 'EUR' ? '€' : c === 'USD' ? '$' : '£');
const fmtMoney = (n:number, c:Currency) => new Intl.NumberFormat('en', { style:'currency', currency:c, maximumFractionDigits:0 }).format(n);
const clamp = (n:number, lo:number, hi:number)=>Math.max(lo, Math.min(hi, n));
const hourlyFromSalary = (s:number) => s / (52 * 40);

/* ============================================================
   Error Boundary (prevents blank white screen)
============================================================ */
class EB extends React.Component<{children:React.ReactNode},{err?:Error}> {
  constructor(p:any){ super(p); this.state={}; }
  static getDerivedStateFromError(e:Error){ return { err:e }; }
  componentDidCatch(e:Error, info:any){ console.error('Crash:', e, info); }
  render(){
    if (this.state.err) {
      return (
        <main style={{ maxWidth: 1120, margin:'24px auto', padding:'0 20px' }}>
          <div style={{ background:'#fff5f5', border:'1px solid #ffd6d6', color:'#7a1f1f', borderRadius:12, padding:16 }}>
            <h2 style={{ marginTop:0 }}>Something went wrong</h2>
            <pre style={{ whiteSpace:'pre-wrap' }}>{String(this.state.err?.message||this.state.err)}</pre>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

/* ============================================================
   Main page
============================================================ */
export default function Page(){
  return (
    <EB>
      <Calculator />
    </EB>
  );
}

/* ============================================================
   Calculator
============================================================ */
function Calculator(){
  /* ------ Global/basic state ------ */
  const [step, setStep] = useState<number>(0);               // 0: Basics, 1: PickTop3, 2..4: Goal steps, last: Results
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [team, setTeam] = useState<Team>('all');
  const [employees, setEmployees] = useState<number>(150);

  // Program cost
  const [avgSalary, setAvgSalary] = useState<number>(52000);
  const [trainingPerEmployee, setTrainingPerEmployee] = useState<number>(850);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const hourly = useMemo(()=>hourlyFromSalary(avgSalary), [avgSalary]);
  const programCost = trainingPerEmployee * employees * (durationMonths/12);

  /* ------ Choose Top-3 priorities ------ */
  const [selected, setSelected] = useState<Goal[]>(['throughput','retention','upskilling']); // defaults
  const toggleGoal = (g:Goal)=>{
    setSelected(prev=>{
      const exists = prev.includes(g);
      if (exists) return prev.filter(x=>x!==g);
      if (prev.length>=3) return prev; // cap at 3
      return [...prev, g];
    });
  };
  const moveUp = (i:number)=>{
    setSelected(prev=>{
      if (i<=0) return prev;
      const copy = [...prev];
      [copy[i-1], copy[i]] = [copy[i], copy[i-1]];
      return copy;
    });
  };
  const moveDown = (i:number)=>{
    setSelected(prev=>{
      if (i>=prev.length-1) return prev;
      const copy = [...prev];
      [copy[i+1], copy[i]] = [copy[i], copy[i+1]];
      return copy;
    });
  };

  /* ------ Goal-specific tiny input slices ------ */
  // Throughput
  const [tpHoursPerWeek, setTpHoursPerWeek] = useState<number>(3.0);
  const [tpUtilPct, setTpUtilPct] = useState<number>(70);

  // Quality
  const [qlEventsPerPersonPerMonth, setQlEventsPerPersonPerMonth] = useState<number>(3);
  const [qlReductionPct, setQlReductionPct] = useState<number>(20);
  const [qlHoursPerFix, setQlHoursPerFix] = useState<number>(1);

  // Onboarding
  const [obHiresPerYear, setObHiresPerYear] = useState<number>(24);
  const [obBaselineRamp, setObBaselineRamp] = useState<number>(3);
  const [obImprovedRamp, setObImprovedRamp] = useState<number>(2);

  // Retention
  const [rtBaselineTurnoverPct, setRtBaselineTurnoverPct] = useState<number>(20);
  const [rtReductionPct, setRtReductionPct] = useState<number>(10);
  const [rtReplacementCostPct, setRtReplacementCostPct] = useState<number>(50);

  // Cost
  const [csConsolidationPerMonth, setCsConsolidationPerMonth] = useState<number>(0);
  const [csEliminatedTools, setCsEliminatedTools] = useState<number>(0);
  const [csAvgToolCostPerMonth, setCsAvgToolCostPerMonth] = useState<number>(200);

  // Upskilling
  const [upCoveragePct, setUpCoveragePct] = useState<number>(60); // % of in-scope staff who become competent
  const [upHoursPerWeek, setUpHoursPerWeek] = useState<number>(2.0);
  const [upUtilPct, setUpUtilPct] = useState<number>(70);

  /* ------ Formulas ------ */
  const valThroughput = selected.includes('throughput')
    ? tpHoursPerWeek * 52 * employees * hourly * clamp(tpUtilPct/100,0,1)
    : 0;

  const valQuality = selected.includes('quality')
    ? (qlEventsPerPersonPerMonth * employees * 12 * (qlReductionPct/100) * qlHoursPerFix) * hourly * clamp(tpUtilPct/100,0,1)
    : 0;

  const valOnboarding = selected.includes('onboarding')
    ? clamp(obBaselineRamp - Math.min(obBaselineRamp, obImprovedRamp), 0, 24) * obHiresPerYear * (avgSalary/12) * clamp(tpUtilPct/100,0,1)
    : 0;

  const valRetention = selected.includes('retention')
    ? (employees * (rtBaselineTurnoverPct/100) * (rtReductionPct/100)) * (avgSalary * (rtReplacementCostPct/100))
    : 0;

  const valCost = selected.includes('cost')
    ? (csConsolidationPerMonth + csEliminatedTools*csAvgToolCostPerMonth) * 12
    : 0;

  // Upskilling base (before overlap guard)
  const upBase = selected.includes('upskilling')
    ? (upCoveragePct/100) * employees * upHoursPerWeek * 52 * hourly * clamp(upUtilPct/100,0,1)
    : 0;
  // Overlap guard with Throughput
  const valUpskilling = (selected.includes('throughput') && selected.includes('upskilling'))
    ? upBase * 0.7
    : upBase;

  const annualValue = valThroughput + valQuality + valOnboarding + valRetention + valCost + valUpskilling;
  const monthlySavings = annualValue / 12;
  const roiMultiple = programCost>0 ? (annualValue/programCost) : 0;
  const paybackMonths = monthlySavings>0 ? (programCost / monthlySavings) : Infinity;

  // hours by goal for results table
  const hoursThroughput = selected.includes('throughput') ? tpHoursPerWeek*52*employees : 0;
  const hoursQuality = selected.includes('quality') ? qlEventsPerPersonPerMonth*employees*12*(qlReductionPct/100)*qlHoursPerFix : 0;
  const hoursUpskilling = selected.includes('upskilling')
    ? Math.round(((upCoveragePct/100)*employees*upHoursPerWeek*52) * (selected.includes('throughput') ? 0.7 : 1))
    : 0;
  const totalHours = Math.round(hoursThroughput + hoursQuality + hoursUpskilling);

  /* ------ Steps ------ */
  const steps = useMemo(()=>{
    const arr: {key:string; title:string}[] = [];
    arr.push({ key:'basics', title:'Basics' });
    arr.push({ key:'pick',   title:'Pick top 3' });
    selected.forEach(g => arr.push({ key:`goal-${g}`, title: GOAL_META[g].label }));
    arr.push({ key:'results', title:'Results' });
    return arr;
  }, [selected]);

  const gotoNext = ()=> setStep(s => clamp(s+1, 0, steps.length-1));
  const gotoPrev = ()=> setStep(s => clamp(s-1, 0, steps.length-1));

  /* ============================================================
     Styles
  ============================================================ */
  const container = { maxWidth: 1120, margin:'0 auto', padding:'24px 20px 32px', fontFamily:'Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial', boxSizing:'border-box' } as const;

  const hero = {
    background: `linear-gradient(135deg, #4B6FFF 0%, ${BLUE} 60%)`,
    color:'#fff', borderRadius:18, boxShadow:'0 18px 40px rgba(15,42,120,.25)',
    padding:18, maxWidth:980, margin:'0 auto 16px', border:'1px solid rgba(255,255,255,.24)'
  } as const;

  // ⬇️ Reverted to compact hero stats
  const heroGrid = { display:'grid', gap:8, gridTemplateColumns:'repeat(4, minmax(120px, 1fr))' } as const;
  const heroStat = { border:'1px solid rgba(255,255,255,.35)', borderRadius:12, padding:'8px 10px', background:'rgba(255,255,255,.10)', fontWeight:800, minHeight:46, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 } as const;

  const card = { background:'#fff', border:'1px solid #E7ECF7', borderRadius:16, boxShadow:'0 10px 28px rgba(12,20,38,.08)', padding:18, maxWidth:980, margin:'16px auto' } as const;
  const h3 = { margin:'0 0 .7rem', fontSize:'1.06rem', fontWeight:900, color:'#0F172A' } as const;

  // ⬇️ Robust grids to prevent overlap (min width 300px, consistent row heights)
  const gridAuto = { display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', alignItems:'start' } as const;

  const centerRow = { maxWidth:980, margin:'16px auto 0', display:'flex', gap:8, justifyContent:'space-between', flexWrap:'wrap' } as const;

  const input = { width:'100%', border:'1px solid #E2E8F5', borderRadius:12, padding:'10px 12px', display:'block', boxSizing:'border-box', minHeight:42 } as const;
  const label = { fontWeight:800, display:'block', marginBottom:6 } as const;
  const help = { fontSize:'.86rem', color:'#667085' } as const;

  const btn = { display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, fontWeight:800, border:'1px solid #E7ECF7', cursor:'pointer', background:'#fff' } as const;
  const btnPrimary = { ...btn, background:`linear-gradient(90deg,#5A7BFF,${BLUE})`, color:'#fff', borderColor:'transparent', boxShadow:'0 8px 20px rgba(31,77,255,.25)' } as const;
  const chip = (active:boolean)=>({
    display:'inline-flex', alignItems:'center', gap:8, padding:'8px 10px',
    borderRadius:999, border:`1px solid ${active?'transparent':'#E7ECF7'}`,
    background: active ? BLUE : '#fff', color: active ? '#fff' : '#0E1320', fontWeight:800, cursor:'pointer'
  } as const);

  const kpiCard = { background:'#fff', border:'1px solid #E8EEFF', borderRadius:14, padding:14, position:'relative', minHeight:84 } as const;
  const kpiTopBar = { position:'absolute', left:0, top:0, right:0, height:4, borderRadius:'14px 14px 0 0', background:`linear-gradient(90deg,#6D8BFF,${BLUE})` } as const;
  const kpiLabel = { fontSize:'.76rem', color:'#64748B', fontWeight:800, marginTop:2 } as const;
  const kpiValue = { fontWeight:900, fontSize:'1.16rem' } as const;

  const stepPct = steps.length>1 ? (step/(steps.length-1)) : 0;

  /* ============================================================
     Render
  ============================================================ */
  return (
    <main style={container}>
      {/* HERO */}
      <section style={hero}>
        <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:900 }}>AI at Work — Human Productivity ROI</h1>
        <p style={{ margin:'6px 0 10px', color:'rgba(255,255,255,.92)' }}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
        <div style={heroGrid}>
          <div style={heroStat}>Payback (months)</div>
          <div style={heroStat}>Annual ROI (×)</div>
          <div style={heroStat}>Total Annual Value</div>
          <div style={heroStat}>Total Hours Saved</div>
        </div>
      </section>

      {/* STEPPER */}
      <section style={{ ...card, padding:12 }}>
        <div style={{ height:10, background:'#E9EDFB', borderRadius:999, overflow:'hidden' }}>
          <span style={{ display:'block', height:'100%', width:`${stepPct*100}%`, background:`linear-gradient(90deg,#6D8BFF,${BLUE})` }} />
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', marginTop:10 }}>
          {steps.map((s, i)=>(
            <div key={s.key} style={{ display:'flex', alignItems:'center', gap:8, color: i<=step ? '#0F172A' : '#8892A6' }}>
              <div style={{
                width:28, height:28, borderRadius:999,
                border: i<=step ? 'none' : '2px solid #CFD8FF',
                background: i<=step ? BLUE : '#fff',
                color: i<=step ? '#fff' : '#0E1320',
                display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13
              }}>{i+1}</div>
              <span style={{ fontWeight:800, fontSize:13 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STEP 0: BASICS */}
      {steps[step]?.key==='basics' && (
        <section style={card}>
          <h3 style={h3}>Basics</h3>
          <div style={gridAuto}>
            <div style={{ minHeight:82 }}>
              <label style={label}>Department</label>
              <select value={team} onChange={e=>setTeam(e.target.value as Team)} style={input}>
                {TEAMS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p style={help}>Choose a function or “Company-wide”.</p>
            </div>

            <div style={{ minHeight:82 }}>
              <label style={label}>Employees in scope</label>
              <input type="number" min={1} value={employees} onChange={e=>setEmployees(Number(e.target.value||0))} style={input}/>
            </div>

            <div style={{ minHeight:82 }}>
              <label style={label}>Currency</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(['EUR','USD','GBP'] as Currency[]).map(c=>{
                  const active = currency===c;
                  return (
                    <button key={c} type="button" style={chip(active)} onClick={()=>setCurrency(c)}>{c}</button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop:14 }}>
            <h4 style={{ margin:'0 0 8px', fontSize:'.95rem', fontWeight:900 }}>Program cost assumptions</h4>
            <div style={gridAuto}>
              <div style={{ minHeight:82 }}><FieldNumber label={`Average annual salary (${symbol(currency)})`} value={avgSalary} onChange={setAvgSalary} step={1000}/></div>
              <div style={{ minHeight:82 }}><FieldNumber label={`Training per employee (${symbol(currency)})`} value={trainingPerEmployee} onChange={setTrainingPerEmployee} step={25}/></div>
              <div style={{ minHeight:82 }}><FieldNumber label="Program duration (months)" value={durationMonths} onChange={setDurationMonths} min={1} step={1}/></div>
            </div>
          </div>

          <div style={centerRow}>
            <div />
            <button style={btnPrimary} onClick={gotoNext}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 1: PICK TOP 3 */}
      {steps[step]?.key==='pick' && (
        <section style={card}>
          <h3 style={h3}>Pick your top 3 priorities</h3>
          <p style={help}>Choose up to three. Reorder them — we’ll build the next steps in that order.</p>

          <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))' }}>
            {(Object.keys(GOAL_META) as Goal[]).map(g=>{
              const on = selected.includes(g);
              return (
                <div key={g} style={{ border:'1px solid #E7ECF7', borderRadius:14, padding:12, background:on?'rgba(51,102,254,.06)':'#fff', minHeight:88 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                    <button type="button" style={chip(on)} onClick={()=>toggleGoal(g)}>{GOAL_META[g].label}</button>
                    {on && (
                      <div style={{ display:'inline-flex', gap:6 }}>
                        <IconBtn title="Up" onClick={()=>moveUp(selected.indexOf(g))}>↑</IconBtn>
                        <IconBtn title="Down" onClick={()=>moveDown(selected.indexOf(g))}>↓</IconBtn>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop:8, fontSize:'.86rem', color:'#667085' }}>{GOAL_META[g].hint}</div>
                </div>
              );
            })}
          </div>

          <div style={centerRow}>
            <button style={btn} onClick={gotoPrev}>← Back</button>
            <button style={btnPrimary} onClick={gotoNext} disabled={selected.length===0}>Continue →</button>
          </div>
        </section>
      )}

      {/* AUTO-GENERATED GOAL STEPS */}
      {steps[step]?.key?.startsWith('goal-') && (
        <GoalStep
          keyStr={steps[step].key}
          goal={steps[step].key.replace('goal-','') as Goal}
          currency={currency}
          employees={employees}
          hourly={hourly}
          // throughput
          tpHoursPerWeek={tpHoursPerWeek} setTpHoursPerWeek={setTpHoursPerWeek}
          tpUtilPct={tpUtilPct} setTpUtilPct={setTpUtilPct}
          // quality
          qlEventsPerPersonPerMonth={qlEventsPerPersonPerMonth} setQlEventsPerPersonPerMonth={setQlEventsPerPersonPerMonth}
          qlReductionPct={qlReductionPct} setQlReductionPct={setQlReductionPct}
          qlHoursPerFix={qlHoursPerFix} setQlHoursPerFix={setQlHoursPerFix}
          // onboarding
          obHiresPerYear={obHiresPerYear} setObHiresPerYear={setObHiresPerYear}
          obBaselineRamp={obBaselineRamp} setObBaselineRamp={setObBaselineRamp}
          obImprovedRamp={obImprovedRamp} setObImprovedRamp={setObImprovedRamp}
          // retention
          rtBaselineTurnoverPct={rtBaselineTurnoverPct} setRtBaselineTurnoverPct={setRtBaselineTurnoverPct}
          rtReductionPct={rtReductionPct} setRtReductionPct={setRtReductionPct}
          rtReplacementCostPct={rtReplacementCostPct} setRtReplacementCostPct={setRtReplacementCostPct}
          // cost
          csConsolidationPerMonth={csConsolidationPerMonth} setCsConsolidationPerMonth={setCsConsolidationPerMonth}
          csEliminatedTools={csEliminatedTools} setCsEliminatedTools={setCsEliminatedTools}
          csAvgToolCostPerMonth={csAvgToolCostPerMonth} setCsAvgToolCostPerMonth={setCsAvgToolCostPerMonth}
          // upskilling
          upCoveragePct={upCoveragePct} setUpCoveragePct={setUpCoveragePct}
          upHoursPerWeek={upHoursPerWeek} setUpHoursPerWeek={setUpHoursPerWeek}
          upUtilPct={upUtilPct} setUpUtilPct={setUpUtilPct}
          // nav
          onBack={gotoPrev}
          onNext={gotoNext}
        />
      )}

      {/* RESULTS */}
      {steps[step]?.key==='results' && (
        <section style={card}>
          <h3 style={h3}>Results</h3>

          {/* KPI ROW */}
          <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', marginBottom:10 }}>
            <div style={kpiCard}><div style={kpiTopBar}/><div style={kpiLabel}>Total annual value</div><div style={kpiValue}>{fmtMoney(annualValue, currency)}</div></div>
            <div style={kpiCard}><div style={kpiTopBar}/><div style={kpiLabel}>Annual ROI</div><div style={kpiValue}>{(roiMultiple||0).toFixed(1)}×</div></div>
            <div style={kpiCard}><div style={kpiTopBar}/><div style={kpiLabel}>Payback</div><div style={kpiValue}>{Number.isFinite(paybackMonths)?`${paybackMonths.toFixed(1)} mo`:'—'}</div></div>
            <div style={kpiCard}><div style={kpiTopBar}/><div style={kpiLabel}>Total hours saved (est.)</div><div style={kpiValue}>{totalHours.toLocaleString()}</div></div>
          </div>

          {/* BREAKDOWN TABLE — more room for Hours & Notes */}
          <BreakdownTable
            currency={currency}
            rows={buildBreakdownRows({
              currency, hourly, employees,
              // values
              valThroughput, valQuality, valOnboarding, valRetention, valCost, valUpskilling,
              // hours
              hoursThroughput, hoursQuality, hoursUpskilling,
              // flags
              selected, avgSalary, obHiresPerYear, obBaselineRamp, obImprovedRamp, rtBaselineTurnoverPct, rtReductionPct, rtReplacementCostPct, csConsolidationPerMonth, csEliminatedTools, csAvgToolCostPerMonth, upCoveragePct, upHoursPerWeek
            })}
          />

          {/* NEXT STEPS */}
          <div style={{ marginTop:16, padding:'12px 14px', border:'1px solid #E7ECF7', borderRadius:12, background:'#F8FAFF' }}>
            <strong>Next steps</strong>
            <ul style={{ margin:'8px 0 0 18px', color:'#475569' }}>
              {selected.includes('throughput') && <li>Map top 3 workflows → ship prompt templates & QA/guardrails within 2 weeks.</li>}
              {selected.includes('quality') && <li>Introduce AI review checkpoints to cut rework by {qlReductionPct}% in pilot team.</li>}
              {selected.includes('onboarding') && <li>Publish role playbooks & guided “first 90 days” to reduce ramp from {obBaselineRamp}→{obImprovedRamp} months.</li>}
              {selected.includes('retention') && <li>Launch “AI Champions” cohort; set quarterly ROI reviews; track usage to correlate with retention.</li>}
              {selected.includes('cost') && <li>Audit tool overlap; target {csEliminatedTools} eliminations and {symbol(currency)}{csConsolidationPerMonth}/mo consolidation.</li>}
              {selected.includes('upskilling') && <li>Set competency coverage target to {upCoveragePct}% and measure weekly AI-in-task usage.</li>}
            </ul>
          </div>

          <div style={centerRow}>
            <button style={btn} onClick={gotoPrev}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(0)}>Start over</button>
          </div>
        </section>
      )}

      <section style={{ textAlign:'center', color:'#667085', fontSize:12, padding:'8px 0 24px' }}>
        Build: {new Date().toISOString()}
      </section>
    </main>
  );
}

/* ============================================================
   Breakdown table (wider Hours/Notes, less cramped right side)
============================================================ */
function BreakdownTable({
  currency,
  rows
}: {
  currency: Currency;
  rows: {
    key: string;
    title: string;
    hours?: number | null;
    value: number;
    note?: string;
  }[];
}){
  const th = { fontSize:12, color:'#64748B', fontWeight:900, textTransform:'uppercase', letterSpacing:'.02em' } as const;
  const td = { padding:'8px 0', borderBottom:'1px solid #EEF2FF' } as const;

  // ⬇️ Make Hours & Notes less cramped to the right
  const colGrid = { display:'grid', gridTemplateColumns:'1.1fr .7fr .8fr 1.4fr', gap:10, alignItems:'center' } as const;

  const total = rows.reduce((s,r)=>s+r.value,0);

  return (
    <div style={{ marginTop:8 }}>
      <div style={{ ...colGrid, padding:'8px 0' }}>
        <div style={th}>Area</div>
        <div style={{ ...th, textAlign:'left' }}>Hours</div>
        <div style={{ ...th, textAlign:'right' }}>Value</div>
        <div style={th}>Notes</div>
      </div>
      {rows.map(r=>(
        <div key={r.key} style={colGrid}>
          <div style={td}><strong>{r.title}</strong></div>
          <div style={{ ...td, textAlign:'left', fontVariantNumeric:'tabular-nums' }}>{r.hours!=null ? r.hours.toLocaleString() : '—'}</div>
          <div style={{ ...td, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{fmtMoney(r.value, currency)}</div>
          <div style={{ ...td, color:'#475569' }}>{r.note||''}</div>
        </div>
      ))}
      <div style={{ ...colGrid, padding:'10px 0', borderTop:'2px solid #CBD5FF' }}>
        <div style={{ fontWeight:900 }}>Total</div>
        <div style={{ textAlign:'left', fontWeight:900, fontVariantNumeric:'tabular-nums' }}>
          {rows.every(r=>r.hours==null) ? '—' : rows.reduce((s,r)=>s + (r.hours||0),0).toLocaleString()}
        </div>
        <div style={{ textAlign:'right', fontWeight:900, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(total, currency)}</div>
        <div />
      </div>
    </div>
  );
}

function buildBreakdownRows(args: {
  currency: Currency;
  hourly: number;
  employees: number;

  valThroughput: number;
  valQuality: number;
  valOnboarding: number;
  valRetention: number;
  valCost: number;
  valUpskilling: number;

  hoursThroughput: number;
  hoursQuality: number;
  hoursUpskilling: number;

  selected: Goal[];

  avgSalary: number;
  obHiresPerYear: number;
  obBaselineRamp: number;
  obImprovedRamp: number;

  rtBaselineTurnoverPct: number;
  rtReductionPct: number;
  rtReplacementCostPct: number;

  csConsolidationPerMonth: number;
  csEliminatedTools: number;
  csAvgToolCostPerMonth: number;

  upCoveragePct: number;
  upHoursPerWeek: number;
}){
  const rows: {key:string; title:string; hours?:number|null; value:number; note?:string}[] = [];
  const s = args.selected;

  if (s.includes('throughput')) {
    rows.push({
      key:'throughput',
      title:'Throughput / Cycle time',
      hours: Math.round(args.hoursThroughput),
      value: args.valThroughput,
      note: `~${args.hoursThroughput.toLocaleString()} hrs saved/year across team via faster cycles`
    });
  }
  if (s.includes('quality')) {
    rows.push({
      key:'quality',
      title:'Quality / Rework',
      hours: Math.round(args.hoursQuality),
      value: args.valQuality,
      note: `Fewer rework loops → reclaimed time`
    });
  }
  if (s.includes('onboarding')) {
    const monthsSaved = Math.max(args.obBaselineRamp - Math.min(args.obBaselineRamp, args.obImprovedRamp), 0);
    rows.push({
      key:'onboarding',
      title:'Onboarding speed',
      hours: null,
      value: args.valOnboarding,
      note: `${args.obHiresPerYear} hires/yr, ${args.obBaselineRamp}→${args.obImprovedRamp} mo ramp`
    });
  }
  if (s.includes('retention')) {
    rows.push({
      key:'retention',
      title:'Retention',
      hours: null,
      value: args.valRetention,
      note: `Avoided replacement costs from lower regretted churn`
    });
  }
  if (s.includes('cost')) {
    rows.push({
      key:'cost',
      title:'Cost (tooling)',
      hours: null,
      value: args.valCost,
      note: `${args.csEliminatedTools} tools removed; +${symbol(args.currency)}${args.csConsolidationPerMonth}/mo consolidation`
    });
  }
  if (s.includes('upskilling')) {
    rows.push({
      key:'upskilling',
      title:'Upskilling',
      hours: Math.round(args.hoursUpskilling),
      value: args.valUpskilling,
      note: `${args.upCoveragePct}% competency coverage, ~${args.upHoursPerWeek}h/week per competent`
    });
  }
  return rows;
}

/* ============================================================
   Reusable inputs
============================================================ */
function FieldNumber({
  label, value, onChange, min, max, step
}: {
  label:string; value:number; onChange:(v:number)=>void; min?:number; max?:number; step?:number;
}){
  return (
    <div style={{ minWidth:0 }}>
      <label style={{ fontWeight:800, display:'block', marginBottom:6 }}>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e=>onChange(Number(e.target.value||0))}
        style={{ width:'100%', border:'1px solid #E2E8F5', borderRadius:12, padding:'10px 12px', display:'block', boxSizing:'border-box', minHeight:42 }}
      />
    </div>
  );
}

function IconBtn({ title, onClick, children }:{ title:string; onClick:()=>void; children:React.ReactNode }){
  return (
    <button type="button" title={title}
      onClick={onClick}
      style={{ padding:'6px 8px', borderRadius:10, border:'1px solid #E7ECF7', background:'#fff', cursor:'pointer', fontWeight:800 }}>
      {children}
    </button>
  );
}

/* ============================================================
   Goal step renderer (grids hardened to prevent overlap)
============================================================ */
function GoalStep(props: {
  keyStr:string; goal:Goal; currency:Currency; employees:number; hourly:number;
  // throughput
  tpHoursPerWeek:number; setTpHoursPerWeek:(n:number)=>void;
  tpUtilPct:number; setTpUtilPct:(n:number)=>void;
  // quality
  qlEventsPerPersonPerMonth:number; setQlEventsPerPersonPerMonth:(n:number)=>void;
  qlReductionPct:number; setQlReductionPct:(n:number)=>void;
  qlHoursPerFix:number; setQlHoursPerFix:(n:number)=>void;
  // onboarding
  obHiresPerYear:number; setObHiresPerYear:(n:number)=>void;
  obBaselineRamp:number; setObBaselineRamp:(n:number)=>void;
  obImprovedRamp:number; setObImprovedRamp:(n:number)=>void;
  // retention
  rtBaselineTurnoverPct:number; setRtBaselineTurnoverPct:(n:number)=>void;
  rtReductionPct:number; setRtReductionPct:(n:number)=>void;
  rtReplacementCostPct:number; setRtReplacementCostPct:(n:number)=>void;
  // cost
  csConsolidationPerMonth:number; setCsConsolidationPerMonth:(n:number)=>void;
  csEliminatedTools:number; setCsEliminatedTools:(n:number)=>void;
  csAvgToolCostPerMonth:number; setCsAvgToolCostPerMonth:(n:number)=>void;
  // upskilling
  upCoveragePct:number; setUpCoveragePct:(n:number)=>void;
  upHoursPerWeek:number; setUpHoursPerWeek:(n:number)=>void;
  upUtilPct:number; setUpUtilPct:(n:number)=>void;
  onBack:()=>void; onNext:()=>void;
}){
  const { goal, currency, employees, hourly, onBack, onNext } = props;
  const card = { background:'#fff', border:'1px solid #E7ECF7', borderRadius:16, boxShadow:'0 10px 28px rgba(12,20,38,.08)', padding:18, maxWidth:980, margin:'16px auto' } as const;
  const h3 = { margin:'0 0 .7rem', fontSize:'1.06rem', fontWeight:900, color:'#0F172A' } as const;
  const gridAuto = { display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', alignItems:'start' } as const;
  const help = { fontSize:'.86rem', color:'#667085' } as const;
  const btn = { display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, fontWeight:800, border:'1px solid #E7ECF7', cursor:'pointer', background:'#fff' } as const;
  const btnPrimary = { ...btn, background:`linear-gradient(90deg,#5A7BFF,${BLUE})`, color:'#fff', borderColor:'transparent', boxShadow:'0 8px 20px rgba(31,77,255,.25)' } as const;

  if (goal==='throughput') {
    const value = props.tpHoursPerWeek * 52 * employees * hourly * clamp(props.tpUtilPct/100,0,1);
    return (
      <section style={card}>
        <h3 style={h3}>Throughput / Cycle time</h3>
        <p style={help}>Estimate cycle-time gains from AI-augmented workflows.</p>
        <div style={gridAuto}>
          <div style={{ minHeight:82 }}><FieldNumber label="Hours saved per person / week" value={props.tpHoursPerWeek} onChange={props.setTpHoursPerWeek} step={0.5}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Utilization factor (%)" value={props.tpUtilPct} onChange={props.setTpUtilPct} min={0} max={100} step={5}/></div>
        </div>
        <p style={{ ...help, marginTop:10 }}>
          ≈ Value / year: <strong>{fmtMoney(value, currency)}</strong>
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={btn} onClick={onBack}>← Back</button>
          <button style={btnPrimary} onClick={onNext}>Continue →</button>
        </div>
      </section>
    );
  }

  if (goal==='quality') {
    const hours = props.qlEventsPerPersonPerMonth * employees * 12 * (props.qlReductionPct/100) * props.qlHoursPerFix;
    const value = hours * hourly * clamp(props.tpUtilPct/100,0,1);
    return (
      <section style={card}>
        <h3 style={h3}>Quality / Rework</h3>
        <p style={help}>Fewer rework cycles; better first-pass quality.</p>
        <div style={gridAuto}>
          <div style={{ minHeight:82 }}><FieldNumber label="Rework events / person / month" value={props.qlEventsPerPersonPerMonth} onChange={props.setQlEventsPerPersonPerMonth} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Expected reduction (%)" value={props.qlReductionPct} onChange={props.setQlReductionPct} min={0} max={100} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Hours per fix" value={props.qlHoursPerFix} onChange={props.setQlHoursPerFix} step={0.5}/></div>
        </div>
        <p style={{ ...help, marginTop:10 }}>
          ≈ Hours avoided / year: <strong>{Math.round(hours).toLocaleString()}</strong> · Value / year: <strong>{fmtMoney(value, currency)}</strong>
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={btn} onClick={onBack}>← Back</button>
          <button style={btnPrimary} onClick={onNext}>Continue →</button>
        </div>
      </section>
    );
  }

  if (goal==='onboarding') {
    const monthsSaved = clamp(props.obBaselineRamp - Math.min(props.obBaselineRamp, props.obImprovedRamp), 0, 24);
    return (
      <section style={card}>
        <h3 style={h3}>Onboarding speed</h3>
        <p style={help}>Faster ramp from AI playbooks & guided practice.</p>
        <div style={gridAuto}>
          <div style={{ minHeight:82 }}><FieldNumber label="New hires / year" value={props.obHiresPerYear} onChange={props.setObHiresPerYear} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Baseline ramp (months)" value={props.obBaselineRamp} onChange={props.setObBaselineRamp} step={0.5}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Improved ramp (months)" value={props.obImprovedRamp} onChange={props.setObImprovedRamp} step={0.5}/></div>
        </div>
        <p style={{ ...help, marginTop:10 }}>
          ≈ Months saved / hire: <strong>{monthsSaved.toFixed(1)}</strong>
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={btn} onClick={onBack}>← Back</button>
          <button style={btnPrimary} onClick={onNext}>Continue →</button>
        </div>
      </section>
    );
  }

  if (goal==='retention') {
    return (
      <section style={card}>
        <h3 style={h3}>Retention</h3>
        <p style={help}>Keep skilled talent; avoid replacement costs.</p>
        <div style={gridAuto}>
          <div style={{ minHeight:82 }}><FieldNumber label="Baseline annual turnover (%)" value={props.rtBaselineTurnoverPct} onChange={props.setRtBaselineTurnoverPct} min={0} max={100} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Expected reduction (%)" value={props.rtReductionPct} onChange={props.setRtReductionPct} min={0} max={100} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Replacement cost (% of salary)" value={props.rtReplacementCostPct} onChange={props.setRtReplacementCostPct} min={0} max={200} step={5}/></div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={btn} onClick={onBack}>← Back</button>
          <button style={btnPrimary} onClick={onNext}>Continue →</button>
        </div>
      </section>
    );
  }

  if (goal==='cost') {
    return (
      <section style={card}>
        <h3 style={h3}>Cost</h3>
        <p style={help}>Do more with fewer overlapping tools.</p>
        <div style={gridAuto}>
          <div style={{ minHeight:82 }}><FieldNumber label={`Consolidation savings / month (${symbol(currency)})`} value={props.csConsolidationPerMonth} onChange={props.setCsConsolidationPerMonth} step={50}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label="Eliminated tools (count)" value={props.csEliminatedTools} onChange={props.setCsEliminatedTools} step={1}/></div>
          <div style={{ minHeight:82 }}><FieldNumber label={`Avg tool cost / month (${symbol(currency)})`} value={props.csAvgToolCostPerMonth} onChange={props.setCsAvgToolCostPerMonth} step={20}/></div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
          <button style={btn} onClick={onBack}>← Back</button>
          <button style={btnPrimary} onClick={onNext}>Continue →</button>
        </div>
      </section>
    );
  }

  // UPSKILLING
  const baseHours = (props.upCoveragePct/100) * employees * props.upHoursPerWeek * 52;
  return (
    <section style={card}>
      <h3 style={h3}>Upskilling</h3>
      <p style={help}>Competency coverage after training drives steady time savings per competent employee.</p>
      <div style={gridAuto}>
        <div style={{ minHeight:82 }}><FieldNumber label="Competency coverage after program (%)" value={props.upCoveragePct} onChange={props.setUpCoveragePct} min={0} max={100} step={5}/></div>
        <div style={{ minHeight:82 }}><FieldNumber label="Hours saved per competent person / week" value={props.upHoursPerWeek} onChange={props.setUpHoursPerWeek} step={0.5}/></div>
        <div style={{ minHeight:82 }}><FieldNumber label="Utilization factor (%)" value={props.upUtilPct} onChange={props.setUpUtilPct} min={0} max={100} step={5}/></div>
      </div>
      <p style={{ ...help, marginTop:10 }}>
        ≈ Hours / year (before overlap): <strong>{Math.round(baseHours).toLocaleString()}</strong>
      </p>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
        <button style={btn} onClick={onBack}>← Back</button>
        <button style={btnPrimary} onClick={onNext}>Continue →</button>
      </div>
    </section>
  );
}
