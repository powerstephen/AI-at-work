'use client';
import React, { useMemo, useState } from 'react';

/* ============ Types & constants ============ */
type Team = 'all'|'hr'|'ops'|'marketing'|'sales'|'support'|'product';
type Currency = 'EUR'|'USD'|'GBP';
type Goal = 'throughput'|'quality'|'onboarding'|'retention'|'cost';

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
  throughput: { label: 'Throughput / Cycle time', hint: 'Ship more with fewer blockers' },
  quality:    { label: 'Quality / Rework reduction', hint: 'Fewer errors, less rework' },
  onboarding: { label: 'Onboarding speed', hint: 'Faster time-to-productivity' },
  retention:  { label: 'Retention', hint: 'Avoid regretted churn & hiring cost' },
  cost:       { label: 'Cost', hint: 'Tool consolidation & direct savings' },
};

const symbol = (c: Currency) => (c === 'EUR' ? '€' : c === 'USD' ? '$' : '£');

/* ============ Math helpers (formulas) ============ */
function hourlyCostFromSalary(avgSalary:number) {
  return avgSalary / (52 * 40);
}

// Throughput
function throughputValueYear(opts: {
  hoursPerWeek: number; employees:number; hourlyCost:number; utilization:number;
}) {
  const { hoursPerWeek, employees, hourlyCost, utilization } = opts;
  const hours = Math.max(0, hoursPerWeek) * 52 * Math.max(0, employees);
  return hours * hourlyCost * Math.max(0, Math.min(1, utilization));
}

// Quality / rework
function qualityValueYear(opts: {
  reworkPerPersonPerMonth:number; reductionPct:number; hoursPerFix:number; employees:number; hourlyCost:number; utilization:number;
}) {
  const { reworkPerPersonPerMonth, reductionPct, hoursPerFix, employees, hourlyCost, utilization } = opts;
  const avoidedEventsPerYear = reworkPerPersonPerMonth * employees * 12 * (Math.max(0, reductionPct)/100);
  const hoursSaved = avoidedEventsPerYear * Math.max(0, hoursPerFix);
  return hoursSaved * hourlyCost * Math.max(0, Math.min(1, utilization));
}

// Onboarding
function onboardingValueYear(opts: {
  hiresPerYear:number; baselineRampMonths:number; improvedRampMonths:number; avgSalary:number; utilization:number;
}) {
  const { hiresPerYear, baselineRampMonths, improvedRampMonths, avgSalary, utilization } = opts;
  const monthsSaved = Math.max(0, baselineRampMonths - improvedRampMonths);
  const productiveValuePerMonth = (avgSalary/12) * Math.max(0, Math.min(1, utilization));
  return monthsSaved * Math.max(0, hiresPerYear) * productiveValuePerMonth;
}

// Retention
function retentionValueYear(opts: {
  employees:number; baselineTurnoverPct:number; reductionPct:number; avgSalary:number; replacementCostPct:number;
}) {
  const { employees, baselineTurnoverPct, reductionPct, avgSalary, replacementCostPct } = opts;
  const avoidedLeavers = employees * (Math.max(0, baselineTurnoverPct)/100) * (Math.max(0, reductionPct)/100);
  const replacementCost = avgSalary * (Math.max(0, replacementCostPct)/100);
  return avoidedLeavers * replacementCost;
}

// Cost (direct)
function costValueYear(opts: {
  consolidationSavingsPerMonth:number; eliminatedTools:number; avgToolCostPerMonth:number;
}) {
  const { consolidationSavingsPerMonth, eliminatedTools, avgToolCostPerMonth } = opts;
  return (Math.max(0, consolidationSavingsPerMonth) + Math.max(0, eliminatedTools) * Math.max(0, avgToolCostPerMonth)) * 12;
}

/* ============ Error boundary (avoid blank screen) ============ */
class EB extends React.Component<{children:React.ReactNode},{err?:Error}> {
  constructor(p:any){super(p); this.state={};}
  static getDerivedStateFromError(e:Error){return {err:e};}
  componentDidCatch(e:Error, info:any){console.error('Crash:', e, info);}
  render(){
    if (this.state.err) {
      return (
        <main style={{ maxWidth: 920, margin: '24px auto', padding: '0 20px' }}>
          <div style={{ background:'#fff5f5', border:'1px solid #ffd6d6', color:'#7a1f1f', borderRadius:12, padding:16 }}>
            <h2 style={{ marginTop:0 }}>Something went wrong</h2>
            <pre style={{ whiteSpace:'pre-wrap' }}>{String(this.state.err?.message || this.state.err)}</pre>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

/* ============ Main page ============ */
export default function Home() {
  return (
    <EB>
      <Calculator />
    </EB>
  );
}

/* ============ Calculator ============ */
function Calculator() {
  const [step, setStep] = useState(1);

  // Step 1 — Basics
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [team, setTeam] = useState<Team>('all');
  const [employees, setEmployees] = useState<number>(150);

  // Step 2 — Goals & Weighting
  const [selected, setSelected] = useState<Record<Goal, boolean>>({
    throughput: true,
    quality: false,
    onboarding: false,
    retention: true,
    cost: false
  });
  const [weights, setWeights] = useState<Record<Goal, number>>({
    throughput: 70,
    quality: 50,
    onboarding: 50,
    retention: 70,
    cost: 40
  });

  // Step 3 — Assumptions (only render per selected goal)
  // Common
  const [avgSalary, setAvgSalary] = useState<number>(52000);
  const [trainingPerEmployee, setTrainingPerEmployee] = useState<number>(850);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const hourly = useMemo(()=>hourlyCostFromSalary(avgSalary), [avgSalary]);

  // Throughput
  const [tpHoursPerWeek, setTpHoursPerWeek] = useState<number>(3.0);
  const [tpUtilization, setTpUtilization] = useState<number>(70); // percent

  // Quality
  const [qlReworkPerPersonPerMonth, setQlReworkPerPersonPerMonth] = useState<number>(3);
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

  // Program cost
  const programCost = trainingPerEmployee * employees * (durationMonths / 12);

  // Values per goal (only if selected)
  const valThroughput = selected.throughput
    ? throughputValueYear({
        hoursPerWeek: tpHoursPerWeek,
        employees,
        hourlyCost: hourly,
        utilization: tpUtilization/100
      })
    : 0;

  const valQuality = selected.quality
    ? qualityValueYear({
        reworkPerPersonPerMonth: qlReworkPerPersonPerMonth,
        reductionPct: qlReductionPct,
        hoursPerFix: qlHoursPerFix,
        employees,
        hourlyCost: hourly,
        utilization: tpUtilization/100 // reuse utilization for simplicity
      })
    : 0;

  const valOnboarding = selected.onboarding
    ? onboardingValueYear({
        hiresPerYear: obHiresPerYear,
        baselineRampMonths: obBaselineRamp,
        improvedRampMonths: Math.min(obBaselineRamp, obImprovedRamp),
        avgSalary,
        utilization: tpUtilization/100
      })
    : 0;

  const valRetention = selected.retention
    ? retentionValueYear({
        employees,
        baselineTurnoverPct: rtBaselineTurnoverPct,
        reductionPct: rtReductionPct,
        avgSalary,
        replacementCostPct: rtReplacementCostPct
      })
    : 0;

  const valCost = selected.cost
    ? costValueYear({
        consolidationSavingsPerMonth: csConsolidationPerMonth,
        eliminatedTools: csEliminatedTools,
        avgToolCostPerMonth: csAvgToolCostPerMonth
      })
    : 0;

  const annualValue = valThroughput + valQuality + valOnboarding + valRetention + valCost;
  const monthlySavings = annualValue / 12;
  const roiMultiple = programCost > 0 ? annualValue / programCost : 0;
  const paybackMonths = monthlySavings > 0 ? programCost / monthlySavings : Infinity;

  const money = (n:number) => new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

  /* ============ Styles (kept inline for simplicity) ============ */
  const container = { maxWidth: 1120, margin: '0 auto', padding: '24px 20px 32px', fontFamily:'Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial' } as const;
  const hero = {
    background: 'linear-gradient(135deg, #4B6FFF 0%, #3366FE 60%)',
    color: '#fff',
    borderRadius: 18,
    boxShadow: '0 18px 40px rgba(15,42,120,.25)',
    padding: 18,
    maxWidth: 980,
    margin: '0 auto 16px',
    border: '1px solid rgba(255,255,255,.25)'
  } as const;
  const heroStat = { border: '1px solid rgba(255,255,255,.35)', borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,.10)', fontWeight: 800 } as const;

  const card = { background: '#fff', border: '1px solid #E7ECF7', borderRadius: 16, boxShadow: '0 10px 28px rgba(12,20,38,.08)', padding: 18, maxWidth: 980, margin: '16px auto' } as const;
  const h3 = { margin: '0 0 .7rem', fontSize: '1.06rem', fontWeight: 900 } as const;
  const gridAuto = { display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', maxWidth: 900, margin: '0 auto' } as const;
  const twoCol = { display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'start', maxWidth: 900, margin: '0 auto' } as const;
  const centerRow = { maxWidth: 980, margin: '16px auto 0', display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' } as const;

  const input = { width: '100%', border: '1px solid #E2E8F5', borderRadius: 12, padding: '10px 12px' } as const;
  const label = { fontWeight: 800 } as const;
  const helpDark = { fontSize: '.86rem', color: '#667085' } as const;

  const btn = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, fontWeight: 800, border: '1px solid #E7ECF7', cursor: 'pointer', background: '#fff' } as const;
  const btnPrimary = { ...btn, background: 'linear-gradient(90deg,#5A7BFF,#3366FE)', color: '#fff', borderColor: 'transparent', boxShadow: '0 8px 20px rgba(31,77,255,.25)' } as const;

  const labels = ['Basics','Goals & Weighting','Assumptions','Results'];
  const pct = Math.min((step - 1) / (labels.length - 1), 1);

  return (
    <main style={container}>
      {/* Hero */}
      <section style={hero}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>AI at Work — Human Productivity ROI</h1>
        <p style={{ margin: '6px 0 10px', color: 'rgba(255,255,255,.9)' }}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
          <div style={heroStat}>Payback (months)</div>
          <div style={heroStat}>Annual ROI (×)</div>
          <div style={heroStat}>Total Annual Value</div>
          <div style={heroStat}>Total Hours Saved</div>
        </div>
      </section>

      {/* Stepper */}
      <section style={{ ...card, padding: 12 }}>
        <div style={{ height: 10, background: '#E9EDFB', borderRadius: 999, overflow: 'hidden' }}>
          <span style={{ display: 'block', height: '100%', width: `${pct*100}%`, background: 'linear-gradient(90deg,#6D8BFF,#3366FE)' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
          {labels.map((t, i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, color: i+1<=step ? '#0F172A' : '#8892A6' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                border: i+1<=step ? 'none' : '2px solid #CFD8FF',
                background: i+1<=step ? '#3366FE' : '#fff',
                color: i+1<=step ? '#fff' : '#0E1320',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13
              }}>{i+1}</div>
              <span style={{ fontWeight: 800, fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STEP 1 — Basics */}
      {step === 1 && (
        <section style={card}>
          <h3 style={{ ...h3, color: '#0F172A' }}>Basics</h3>
          <div style={gridAuto}>
            <div>
              <label style={label}>Department</label>
              <select value={team} onChange={e=>setTeam(e.target.value as Team)} style={input}>
                {TEAMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p style={helpDark}>Choose a function or “Company-wide”.</p>
            </div>

            <div>
              <label style={label}>Employees in scope</label>
              <input type="number" min={1} value={employees} onChange={e=>setEmployees(Number(e.target.value||0))} style={input}/>
            </div>

            <div>
              <label style={label}>Currency</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(['EUR','USD','GBP'] as Currency[]).map(c=>{
                  const active = currency === c;
                  return (
                    <button key={c} onClick={()=>setCurrency(c)} type="button"
                      style={{
                        padding:'8px 12px', borderRadius: 999, fontWeight: 800,
                        border: '1px solid #E7ECF7',
                        background: active ? '#3366FE' : '#fff',
                        color: active ? '#fff' : '#0E1320',
                        cursor:'pointer'
                      }}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 980, margin: '16px auto 0', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button style={btnPrimary} onClick={()=>setStep(2)}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 2 — Goals & Weighting */}
      {step === 2 && (
        <section style={card}>
          <h3 style={{ ...h3, color: '#0F172A' }}>Goals & Weighting</h3>
          <p style={helpDark}>Pick what matters. We’ll tailor assumptions and results to these goals.</p>

          <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', maxWidth:900, margin:'0 auto' }}>
            {(Object.keys(GOAL_META) as Goal[]).map(g=>{
              const m = GOAL_META[g];
              const on = selected[g];
              return (
                <div key={g} style={{ border:'1px solid #E7ECF7', borderRadius:14, padding:12, background: on ? 'rgba(51,102,254,.06)' : '#fff' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={e=>setSelected(s=>({ ...s, [g]: e.target.checked }))}
                      style={{ accentColor:'#3366FE' as any }}
                    />
                    <div>
                      <div style={{ fontWeight:900 }}>{m.label}</div>
                      <div style={{ fontSize:'.86rem', color:'#667085' }}>{m.hint}</div>
                    </div>
                  </label>

                  {/* priority slider */}
                  <div style={{ marginTop:10, opacity:on?1:.5 }}>
                    <div style={{ fontSize:12, fontWeight:800, color:'#475569', marginBottom:4 }}>Priority</div>
                    <input
                      type="range" min={0} max={100} step={5}
                      disabled={!on}
                      value={weights[g]}
                      onChange={e=>setWeights(w=>({ ...w, [g]: Number(e.target.value) }))}
                      style={{ width:'100%' }}
                    />
                    <div style={{ fontSize:12, color:'#667085' }}>{weights[g]}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={centerRow}>
            <button style={btn} onClick={()=>setStep(1)}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(3)}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 3 — Assumptions (conditional blocks) */}
      {step === 3 && (
        <section style={card}>
          <h3 style={{ ...h3, color: '#0F172A' }}>Assumptions</h3>
          <p style={helpDark}>We prefilled sensible defaults. Adjust if needed.</p>

          {/* Common */}
          <div style={gridAuto}>
            <FieldNumber label={`Average annual salary (${symbol(currency)})`} value={avgSalary} onChange={setAvgSalary} step={1000} />
            <FieldNumber label={`Training per employee (${symbol(currency)})`} value={trainingPerEmployee} onChange={setTrainingPerEmployee} step={25} />
            <FieldNumber label="Program duration (months)" value={durationMonths} onChange={setDurationMonths} min={1} step={1} />
          </div>

          {/* Throughput */}
          {selected.throughput && (
            <>
              <h4 style={{ margin:'16px auto 6px', maxWidth:900, fontSize:'.95rem', fontWeight:900, color:'#0F172A' }}>Throughput / Cycle time</h4>
              <div style={gridAuto}>
                <FieldNumber label="Hours saved per person / week" value={tpHoursPerWeek} onChange={setTpHoursPerWeek} step={0.5} />
                <FieldNumber label="Utilization factor (%)" value={tpUtilization} onChange={setTpUtilization} min={0} max={100} step={5} />
              </div>
            </>
          )}

          {/* Quality */}
          {selected.quality && (
            <>
              <h4 style={{ margin:'16px auto 6px', maxWidth:900, fontSize:'.95rem', fontWeight:900, color:'#0F172A' }}>Quality / Rework reduction</h4>
              <div style={gridAuto}>
                <FieldNumber label="Rework events per person / month" value={qlReworkPerPersonPerMonth} onChange={setQlReworkPerPersonPerMonth} step={1} />
                <FieldNumber label="Expected reduction (%)" value={qlReductionPct} onChange={setQlReductionPct} min={0} max={100} step={1} />
                <FieldNumber label="Hours per fix" value={qlHoursPerFix} onChange={setQlHoursPerFix} step={0.5} />
              </div>
            </>
          )}

          {/* Onboarding */}
          {selected.onboarding && (
            <>
              <h4 style={{ margin:'16px auto 6px', maxWidth:900, fontSize:'.95rem', fontWeight:900, color:'#0F172A' }}>Onboarding speed</h4>
              <div style={gridAuto}>
                <FieldNumber label="New hires per year" value={obHiresPerYear} onChange={setObHiresPerYear} step={1} />
                <FieldNumber label="Baseline ramp (months)" value={obBaselineRamp} onChange={setObBaselineRamp} step={0.5} />
                <FieldNumber label="Improved ramp (months)" value={obImprovedRamp} onChange={setObImprovedRamp} step={0.5} />
              </div>
            </>
          )}

          {/* Retention */}
          {selected.retention && (
            <>
              <h4 style={{ margin:'16px auto 6px', maxWidth:900, fontSize:'.95rem', fontWeight:900, color:'#0F172A' }}>Retention</h4>
              <div style={gridAuto}>
                <FieldNumber label="Baseline annual turnover (%)" value={rtBaselineTurnoverPct} onChange={setRtBaselineTurnoverPct} min={0} max={100} step={1} />
                <FieldNumber label="Expected reduction (%)" value={rtReductionPct} onChange={setRtReductionPct} min={0} max={100} step={1} />
                <FieldNumber label="Replacement cost (% of salary)" value={rtReplacementCostPct} onChange={setRtReplacementCostPct} min={0} max={200} step={5} />
              </div>
            </>
          )}

          {/* Cost */}
          {selected.cost && (
            <>
              <h4 style={{ margin:'16px auto 6px', maxWidth:900, fontSize:'.95rem', fontWeight:900, color:'#0F172A' }}>Cost (direct)</h4>
              <div style={gridAuto}>
                <FieldNumber label={`Consolidation savings / month (${symbol(currency)})`} value={csConsolidationPerMonth} onChange={setCsConsolidationPerMonth} step={50} />
                <FieldNumber label="Eliminated tools (count)" value={csEliminatedTools} onChange={setCsEliminatedTools} step={1} />
                <FieldNumber label={`Avg tool cost / month (${symbol(currency)})`} value={csAvgToolCostPerMonth} onChange={setCsAvgToolCostPerMonth} step={20} />
              </div>
            </>
          )}

          <div style={centerRow}>
            <button style={btn} onClick={()=>setStep(2)}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(4)}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 4 — Results (goal-aligned) */}
      {step === 4 && (
        <section style={card}>
          <h3 style={{ ...h3, color: '#0F172A' }}>Results</h3>

          {/* Top tiles */}
          <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(2,minmax(0,1fr))' }}>
            <KPI t="Total annual value" v={money(annualValue)} />
            <KPI t="Annual ROI" v={`${(programCost>0 ? (annualValue/programCost) : 0).toFixed(1)}×`} />
            <KPI t="Payback" v={Number.isFinite(paybackMonths) ? `${paybackMonths.toFixed(1)} mo` : '—'} />
            <KPI t="Total hours saved" v={Math.round((selected.throughput? tpHoursPerWeek*52*employees:0) + (selected.quality? qlReworkPerPersonPerMonth*employees*12*(qlReductionPct/100)*qlHoursPerFix:0)).toLocaleString()} />
          </div>

          {/* Per-goal sections, sorted by priority */}
          {([...Object.keys(selected)] as Goal[])
            .filter(g=>selected[g])
            .sort((a,b)=>weights[b]-weights[a])
            .map(g=>{
              if (g==='throughput') {
                const hoursYear = tpHoursPerWeek*52*employees;
                const value = valThroughput;
                return (
                  <GoalCard key={g} title={GOAL_META[g].label} hint="Cycle-time gains from AI-augmented workflows.">
                    <MiniKPI t="Hours / year" v={hoursYear.toLocaleString()} />
                    <MiniKPI t="Value / year" v={money(value)} />
                    <p style={{ margin:0, color:'#475569' }}>
                      Assuming {tpHoursPerWeek}h saved per person/week, {employees} employees, {Math.round(tpUtilization)}% utilization.
                    </p>
                  </GoalCard>
                );
              }
              if (g==='quality') {
                const hoursYear = qlReworkPerPersonPerMonth*employees*12*(qlReductionPct/100)*qlHoursPerFix;
                const value = valQuality;
                return (
                  <GoalCard key={g} title={GOAL_META[g].label} hint="Fewer rework cycles; better first-pass quality.">
                    <MiniKPI t="Hours avoided / year" v={Math.round(hoursYear).toLocaleString()} />
                    <MiniKPI t="Value / year" v={money(value)} />
                    <p style={{ margin:0, color:'#475569' }}>
                      {qlReworkPerPersonPerMonth}/person/month rework, {qlReductionPct}% reduction, {qlHoursPerFix}h per fix.
                    </p>
                  </GoalCard>
                );
              }
              if (g==='onboarding') {
                const monthsSaved = Math.max(0, obBaselineRamp - obImprovedRamp);
                return (
                  <GoalCard key={g} title={GOAL_META[g].label} hint="Faster ramp from AI playbooks & guided practice.">
                    <MiniKPI t="Months saved / hire" v={monthsSaved.toFixed(1)} />
                    <MiniKPI t="Value / year" v={money(valOnboarding)} />
                    <p style={{ margin:0, color:'#475569' }}>
                      {obHiresPerYear} hires/yr, {obBaselineRamp}→{obImprovedRamp} months ramp, salary {symbol(currency)}{avgSalary.toLocaleString()}.
                    </p>
                  </GoalCard>
                );
              }
              if (g==='retention') {
                return (
                  <GoalCard key={g} title={GOAL_META[g].label} hint="Keep skilled talent; avoid replacement costs.">
                    <MiniKPI t="Avoided attrition / yr" v={(employees*(rtBaselineTurnoverPct/100)*(rtReductionPct/100)).toFixed(1)} />
                    <MiniKPI t="Value / year" v={money(valRetention)} />
                    <p style={{ margin:0, color:'#475569' }}>
                      {rtBaselineTurnoverPct}% baseline turnover, {rtReductionPct}% reduction, replacement cost {rtReplacementCostPct}% of salary.
                    </p>
                  </GoalCard>
                );
              }
              // cost
              return (
                <GoalCard key={g} title={GOAL_META[g].label} hint="Do more with fewer overlapping tools.">
                  <MiniKPI t="Direct savings / year" v={money(valCost)} />
                  <p style={{ margin:0, color:'#475569' }}>
                    {symbol(currency)}{csConsolidationPerMonth.toLocaleString()}/mo consolidation, {csEliminatedTools} tools @ {symbol(currency)}{csAvgToolCostPerMonth}/mo each.
                  </p>
                </GoalCard>
              );
            })
          }

          <div style={{ marginTop:12, padding:'12px 14px', border:'1px solid #E7ECF7', borderRadius:12, background:'#F8FAFF' }}>
            <strong>Next steps (tailored):</strong>{' '}
            {selected.throughput && 'Map top 3 workflows → create prompt templates & QA gates. '}
            {selected.quality && 'Add review checklist + AI critique pass before handoff. '}
            {selected.onboarding && 'Publish role playbooks with task libraries & guided “first 90 days”. '}
            {selected.retention && 'Launch AI Champions cohort; set quarterly ROI reviews. '}
            {selected.cost && 'Audit overlapping tools; pilot consolidation with 1 team. '}
          </div>

          <div style={centerRow}>
            <button style={btn} onClick={()=>setStep(3)}>← Back</button>
            <button style={btnPrimary} onClick={()=>setStep(1)}>Start over</button>
          </div>
        </section>
      )}

      <section style={{ textAlign:'center', color:'#667085', fontSize:12, padding:'8px 0 24px' }}>
        Build: {new Date().toISOString()}
      </section>
    </main>
  );
}

/* ============ Small UI helpers ============ */
function FieldNumber({
  label, value, onChange, min, max, step, suffix, hint
}: {
  label: string; value: number; onChange: (v:number)=>void;
  min?: number; max?: number; step?: number; suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label style={{ fontWeight: 800 }}>{label}</label>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e=>onChange(Number(e.target.value||0))}
          style={{ width: '100%', border: '1px solid #E2E8F5', borderRadius: 12, padding: '10px 12px' }}
        />
        {suffix ? <span style={{ fontWeight:800, color:'#667085' }}>{suffix}</span> : null}
      </div>
      {hint ? <p style={{ fontSize: '.86rem', color: '#667085' }}>{hint}</p> : null}
    </div>
  );
}

function KPI({ t, v }: { t:string; v:string }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #E8EEFF', borderRadius:14, padding:14, position:'relative' }}>
      <div style={{ position:'absolute', left:0, top:0, right:0, height:4, borderRadius:'14px 14px 0 0', background:'linear-gradient(90deg,#6D8BFF,#3366FE)' }} />
      <div style={{ fontSize:'.76rem', color:'#64748B', fontWeight:800, marginTop:2 }}>{t}</div>
      <div style={{ fontWeight:900, fontSize:'1.16rem' }}>{v}</div>
    </div>
  );
}

function MiniKPI({ t, v }: { t:string; v:string }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #EDF2FF', borderRadius:12, padding:'8px 10px' }}>
      <div style={{ fontSize:12, color:'#64748B', fontWeight:800 }}>{t}</div>
      <div style={{ fontWeight:900 }}>{v}</div>
    </div>
  );
}

function GoalCard({ title, hint, children }: { title:string; hint?:string; children:React.ReactNode }) {
  return (
    <div style={{ marginTop:12, border:'1px solid #E7ECF7', borderRadius:14, padding:14 }}>
      <div style={{ fontWeight:900 }}>{title}</div>
      {hint && <div style={{ fontSize:12, color:'#667085', marginBottom:8 }}>{hint}</div>}
      <div style={{ display:'grid', gap:10, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))' }}>
        {children}
      </div>
    </div>
  );
}
