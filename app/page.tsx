'use client';
import React, { useMemo, useState } from 'react';

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

const GOAL_META: Record<Goal,{label:string; hint:string}> = {
  throughput: { label:'Throughput / Cycle time', hint:'Ship more, remove blockers' },
  quality:    { label:'Quality / Rework',        hint:'Cut rework & error rates' },
  onboarding: { label:'Onboarding speed',        hint:'Faster time-to-productivity' },
  retention:  { label:'Retention',               hint:'Avoid regretted churn cost' },
  cost:       { label:'Cost',                    hint:'Tool consolidation savings' },
  upskilling: { label:'Upskilling',              hint:'Competency coverage → gains' }
};

const MATURITY_LABELS = [
  '1. Early: ad-hoc experiments; big wins from prompt basics + mapping workflows',
  '2. Few experimenters; scattered use; minimal documentation',
  '3. Pockets of use; some repeatable tasks identified',
  '4. Champions emerging; shared prompts; initial QA gates',
  '5. Team playbooks; recurring usage; savings are measurable',
  '6. Cross-team sharing; prompts/templates in daily ops',
  '7. Tooling integrated; data & guardrails; steady gains',
  '8. Automation loops active; enablement & review cadences',
  '9. AI-first workflows; advanced analytics; platform mindset',
  '10. Embedded across org; continuous improvement culture'
];

const symbol = (c:Currency)=> c==='EUR'?'€':c==='USD'?'$':'£';
const money = (n:number,c:Currency)=> new Intl.NumberFormat('en',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
const clamp = (n:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,n));
const hourlyFromSalary = (s:number)=> s/(52*40);

/* Simple error boundary (keeps blank screens away) */
class EB extends React.Component<{children:React.ReactNode},{err?:Error}>{
  constructor(p:any){ super(p); this.state={}; }
  static getDerivedStateFromError(e:Error){ return { err:e }; }
  componentDidCatch(e:Error, info:any){ console.error('Runtime error:', e, info); }
  render(){
    if(this.state.err){
      return (
        <main className="container">
          <div className="card" style={{background:'#fff5f5',border:'1px solid #ffd6d6'}}>
            <h2 style={{marginTop:0}}>Render error</h2>
            <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.err.message)}</pre>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function Page(){
  return (
    <main className="container">
      <EB><Calculator/></EB>
      <section style={{textAlign:'center',color:'#667085',fontSize:12,padding:'8px 0 24px'}}>
        Build: {new Date().toISOString()}
      </section>
    </main>
  );
}

function hoursFromMaturity(level:number){
  // 1 → ~5h/wk … 10 → ~0.75h/wk
  const map = [5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.75];
  return map[clamp(level,1,10)-1];
}

function Calculator(){
  const [step, setStep] = useState(0);

  // basics
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [team, setTeam] = useState<Team>('all');
  const [employees, setEmployees] = useState(150);
  const [avgSalary, setAvgSalary] = useState(52000);
  const [trainingPerEmployee, setTrainingPerEmployee] = useState(850);
  const [durationMonths, setDurationMonths] = useState(3);

  const hourly = useMemo(()=>hourlyFromSalary(avgSalary),[avgSalary]);
  const programCost = trainingPerEmployee * employees * (durationMonths/12);

  // maturity
  const [maturity, setMaturity] = useState(3);
  const derivedHours = hoursFromMaturity(maturity);

  // choose top 3 (checkbox tiles)
  const [selected, setSelected] = useState<Goal[]>(['throughput','retention','upskilling']);
  const toggleGoal = (g:Goal)=> setSelected(prev=>{
    const on = prev.includes(g);
    if(on) return prev.filter(x=>x!==g);
    if(prev.length>=3) return prev; // max 3
    return [...prev,g];
  });

  // throughput (prefilled from maturity; editable later)
  const [tpHoursPerWeek, setTpHoursPerWeek] = useState(derivedHours);
  const [tpUtilPct, setTpUtilPct] = useState(70);

  // keep tpHours in sync when user hasn’t edited yet
  const [tpTouched, setTpTouched] = useState(false);
  if(!tpTouched && tpHoursPerWeek !== derivedHours){
    // update silently when maturity changes
    // (this runs during render but guards on equality to avoid loops)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setTimeout(()=>{ setTpHoursPerWeek(derivedHours); }, 0);
  }

  // quality
  const [qlEventsPerPersonPerMonth, setQlEventsPerPersonPerMonth] = useState(3);
  const [qlReductionPct, setQlReductionPct] = useState(20);
  const [qlHoursPerFix, setQlHoursPerFix] = useState(1);

  // onboarding
  const [obHiresPerYear, setObHiresPerYear] = useState(24);
  const [obBaselineRamp, setObBaselineRamp] = useState(3);
  const [obImprovedRamp, setObImprovedRamp] = useState(2);

  // retention
  const [rtBaselineTurnoverPct, setRtBaselineTurnoverPct] = useState(20);
  const [rtReductionPct, setRtReductionPct] = useState(10);
  const [rtReplacementCostPct, setRtReplacementCostPct] = useState(50);

  // cost
  const [csConsolidationPerMonth, setCsConsolidationPerMonth] = useState(0);
  const [csEliminatedTools, setCsEliminatedTools] = useState(0);
  const [csAvgToolCostPerMonth, setCsAvgToolCostPerMonth] = useState(200);

  // upskilling
  const [upCoveragePct, setUpCoveragePct] = useState(60);
  const [upHoursPerWeek, setUpHoursPerWeek] = useState(2);
  const [upUtilPct, setUpUtilPct] = useState(70);

  // values per goal
  const valThroughput = selected.includes('throughput')
    ? tpHoursPerWeek*52*employees*hourly*clamp(tpUtilPct/100,0,1) : 0;

  const valQuality = selected.includes('quality')
    ? (qlEventsPerPersonPerMonth*employees*12*(qlReductionPct/100)*qlHoursPerFix)*hourly*clamp(tpUtilPct/100,0,1) : 0;

  const valOnboarding = selected.includes('onboarding')
    ? clamp(obBaselineRamp - Math.min(obBaselineRamp, obImprovedRamp),0,24)*obHiresPerYear*(avgSalary/12)*clamp(tpUtilPct/100,0,1) : 0;

  const valRetention = selected.includes('retention')
    ? (employees*(rtBaselineTurnoverPct/100)*(rtReductionPct/100))*(avgSalary*(rtReplacementCostPct/100)) : 0;

  const valCost = selected.includes('cost')
    ? (csConsolidationPerMonth + csEliminatedTools*csAvgToolCostPerMonth)*12 : 0;

  const upBase = selected.includes('upskilling')
    ? (upCoveragePct/100)*employees*upHoursPerWeek*52*hourly*clamp(upUtilPct/100,0,1) : 0;
  const valUpskilling = (selected.includes('throughput') && selected.includes('upskilling')) ? upBase*0.7 : upBase;

  const breakdown: {key:Goal; label:string; value:number}[] = [
    { key:'throughput', label:GOAL_META.throughput.label, value:valThroughput },
    { key:'quality', label:GOAL_META.quality.label, value:valQuality },
    { key:'onboarding', label:GOAL_META.onboarding.label, value:valOnboarding },
    { key:'retention', label:GOAL_META.retention.label, value:valRetention },
    { key:'cost', label:GOAL_META.cost.label, value:valCost },
    { key:'upskilling', label:GOAL_META.upskilling.label, value:valUpskilling },
  ].filter(x=>selected.includes(x.key)).sort((a,b)=>b.value-a.value);

  const annualValue = breakdown.reduce((s,b)=>s+b.value,0);
  const monthlySavings = annualValue/12;
  const roiMultiple = programCost>0 ? (annualValue/programCost) : 0;
  const paybackMonths = monthlySavings>0 ? (programCost/monthlySavings) : Infinity;

  // steps
  const steps = [
    'Basics',
    'AI Maturity',
    'Pick top 3 priorities',
    ...selected.map(g=>`Configure: ${GOAL_META[g].label}`),
    'Results'
  ];
  const progress = steps.length>1 ? (step/(steps.length-1)) : 0;
  const atResults = step === (3 + selected.length);

  return (
    <>
      {/* HERO */}
      <section className="hero center">
        <h1 style={{margin:0,fontSize:'1.25rem',fontWeight:900}}>AI at Work — Human Productivity ROI</h1>
        <p style={{margin:'6px 0 10px',color:'rgba(255,255,255,.92)'}}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>
        <div className="hero-grid">
          {!atResults ? (
            <>
              <div className="hero-stat">Payback (months): <strong>—</strong></div>
              <div className="hero-stat">Annual ROI (×): <strong>—</strong></div>
              <div className="hero-stat">Annual Value: <strong>—</strong></div>
              <div className="hero-stat">Monthly Savings: <strong>—</strong></div>
            </>
          ) : (
            <>
              <div className="hero-stat">Payback (months): <strong>{Number.isFinite(paybackMonths)?paybackMonths.toFixed(1):'—'}</strong></div>
              <div className="hero-stat">Annual ROI (×): <strong>{roiMultiple.toFixed(1)}</strong></div>
              <div className="hero-stat">Annual Value: <strong>{money(annualValue,currency)}</strong></div>
              <div className="hero-stat">Monthly Savings: <strong>{money(monthlySavings,currency)}</strong></div>
            </>
          )}
        </div>
      </section>

      {/* STEPPER */}
      <section className="card center" style={{padding:12}}>
        <div className="stepper"><span className="stepper-fill" style={{width:`${progress*100}%`}}/></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginTop:10}}>
          {steps.map((t,i)=>(
            <div key={i} className={`step-label ${i<=step?'on':''}`}>
              <div className={`step-dot ${i<=step?'on':''}`}>{i+1}</div>
              <span style={{fontWeight:800,fontSize:13}}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STEP 0: BASICS */}
      {step===0 && (
        <section className="card center">
          <h3 className="h3">Basics</h3>
          <div className="grid">
            <div>
              <label className="label">Department</label>
              <select value={team} onChange={e=>setTeam(e.target.value as Team)} className="input">
                {TEAMS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p className="help">Choose a function or “Company-wide”.</p>
            </div>
            <div>
              <label className="label">Employees in scope</label>
              <input type="number" min={1} value={employees} onChange={e=>setEmployees(Number(e.target.value||0))} className="input"/>
            </div>
            <div>
              <label className="label">Currency</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {(['EUR','USD','GBP'] as Currency[]).map(c=>(
                  <button key={c} type="button"
                    onClick={()=>setCurrency(c)}
                    className="btn"
                    style={{
                      border: `1px solid ${currency===c?'transparent':'#E7ECF7'}`,
                      background: currency===c?BLUE:'#fff',
                      color: currency===c?'#fff':'#0E1320'
                    }}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginTop:14}}>
            <h4 style={{margin:'0 0 8px',fontSize:'.95rem',fontWeight:900}}>Program cost assumptions</h4>
            <div className="grid">
              <FieldNum label={`Average annual salary (${symbol(currency)})`} v={avgSalary} set={setAvgSalary} step={1000}/>
              <FieldNum label={`Training per employee (${symbol(currency)})`} v={trainingPerEmployee} set={setTrainingPerEmployee} step={25}/>
              <FieldNum label="Program duration (months)" v={durationMonths} set={setDurationMonths} step={1}/>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <span/>
            <button className="btn-primary" onClick={()=>setStep(1)}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 1: AI MATURITY (slider + live panel) */}
      {step===1 && (
        <section className="card center">
          <h3 className="h3">AI Maturity</h3>
          <p className="help">Slide to estimate current adoption. We’ll prefill productivity assumptions and show hours saved.</p>

          <div className="twocol">
            {/* Left: slider + description */}
            <div>
              <label className="label">Current maturity level (1–10)</label>
              <div className="range-wrap">
                <input
                  className="range"
                  type="range"
                  min={1} max={10} step={1}
                  value={maturity}
                  onChange={(e)=>{ setMaturity(Number(e.target.value)); }}
                />
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#667085',marginTop:6}}>
                {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                  <span key={n} style={{width:18, textAlign:'center', fontWeight: n===maturity?900:600, color: n===maturity?BLUE:'#667085'}}>{n}</span>
                ))}
              </div>
              <div style={{marginTop:10, padding:12, border:'1px solid #E7ECF7', borderRadius:12, background:'#F8FAFF'}}>
                <strong>{MATURITY_LABELS[maturity-1]}</strong>
              </div>
              <p className="help" style={{marginTop:8}}>
                Prefill productivity for “Throughput” using this maturity. You can still tweak in its step.
              </p>
            </div>

            {/* Right: live panel */}
            <div className="live">
              <h4>Live estimate</h4>
              <div className="live-row"><span>Maturity level</span><strong>{maturity}/10</strong></div>
              <div className="live-row"><span>Hours saved / employee / week</span><strong>{derivedHours.toFixed(2)} h</strong></div>
              <div className="live-row"><span>Employees in scope</span><strong>{employees}</strong></div>
              <div className="live-row"><span>Total team hours saved / year</span><strong>{Math.round(derivedHours*52*employees).toLocaleString()}</strong></div>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn-primary" onClick={()=>setStep(2)}>Continue →</button>
          </div>
        </section>
      )}

      {/* keep tp hours synced until manually edited */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      {null}

      {/* STEP 2: PICK TOP 3 (checkbox tiles) */}
      {step===2 && (
        <section className="card center">
          <h3 className="h3">Pick your top 3 priorities</h3>
          <p className="help">Tick up to three. The next screens will adapt.</p>

          <div className="grid">
            {(Object.keys(GOAL_META) as Goal[]).map(g=>{
              const on = selected.includes(g);
              return (
                <label key={g} className={`tile ${on?'on':''}`}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={()=>toggleGoal(g)}
                  />
                  <div>
                    <div style={{fontWeight:900}}>{GOAL_META[g].label}</div>
                    <div className="help">{GOAL_META[g].hint}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn-primary" onClick={()=>setStep(3)} disabled={selected.length===0}>Continue →</button>
          </div>
        </section>
      )}

      {/* DYNAMIC CONFIG STEPS (prefill throughput hours from maturity) */}
      {selected.map((g, idx)=>{
        const idxStep = 3+idx;
        if(step!==idxStep) return null;
        return (
          <section key={g} className="card center">
            <h3 className="h3">{GOAL_META[g].label}</h3>
            <p className="help">{GOAL_META[g].hint}</p>

            {g==='throughput' && (
              <div className="grid">
                <div>
                  <label className="label">Hours saved per person / week</label>
                  <input
                    type="number"
                    value={tpHoursPerWeek}
                    step={0.25}
                    onChange={e=>{ setTpHoursPerWeek(Number(e.target.value||0)); setTpTouched(true); }}
                    className="input"
                  />
                  <p className="help">Prefilled from maturity: {hoursFromMaturity(maturity).toFixed(2)} h/wk</p>
                </div>
                <FieldNum label="Utilization factor (%)" v={tpUtilPct} set={setTpUtilPct} min={0} max={100} step={5}/>
              </div>
            )}
            {g==='quality' && (
              <div className="grid">
                <FieldNum label="Rework events / person / month" v={qlEventsPerPersonPerMonth} set={setQlEventsPerPersonPerMonth} step={1}/>
                <FieldNum label="Expected reduction (%)" v={qlReductionPct} set={setQlReductionPct} min={0} max={100} step={1}/>
                <FieldNum label="Hours per fix" v={qlHoursPerFix} set={setQlHoursPerFix} step={0.5}/>
              </div>
            )}
            {g==='onboarding' && (
              <div className="grid">
                <FieldNum label="New hires / year" v={obHiresPerYear} set={setObHiresPerYear} step={1}/>
                <FieldNum label="Baseline ramp (months)" v={obBaselineRamp} set={setObBaselineRamp} step={0.5}/>
                <FieldNum label="Improved ramp (months)" v={obImprovedRamp} set={setObImprovedRamp} step={0.5}/>
              </div>
            )}
            {g==='retention' && (
              <div className="grid">
                <FieldNum label="Baseline annual turnover (%)" v={rtBaselineTurnoverPct} set={setRtBaselineTurnoverPct} min={0} max={100} step={1}/>
                <FieldNum label="Expected reduction (%)" v={rtReductionPct} set={setRtReductionPct} min={0} max={100} step={1}/>
                <FieldNum label="Replacement cost (% of salary)" v={rtReplacementCostPct} set={setRtReplacementCostPct} min={0} max={200} step={5}/>
              </div>
            )}
            {g==='cost' && (
              <div className="grid">
                <FieldNum label={`Consolidation savings / month (${symbol(currency)})`} v={csConsolidationPerMonth} set={setCsConsolidationPerMonth} step={50}/>
                <FieldNum label="Eliminated tools (count)" v={csEliminatedTools} set={setCsEliminatedTools} step={1}/>
                <FieldNum label={`Avg tool cost / month (${symbol(currency)})`} v={csAvgToolCostPerMonth} set={setCsAvgToolCostPerMonth} step={20}/>
              </div>
            )}
            {g==='upskilling' && (
              <div className="grid">
                <FieldNum label="Competency coverage after program (%)" v={upCoveragePct} set={setUpCoveragePct} min={0} max={100} step={5}/>
                <FieldNum label="Hours saved per competent person / week" v={upHoursPerWeek} set={setUpHoursPerWeek} step={0.5}/>
                <FieldNum label="Utilization factor (%)" v={upUtilPct} set={setUpUtilPct} min={0} max={100} step={5}/>
              </div>
            )}

            <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
              <button className="btn" onClick={()=>setStep(idxStep-1)}>← Back</button>
              <button className="btn-primary" onClick={()=>setStep(idxStep+1)}>Continue →</button>
            </div>
          </section>
        );
      })}

      {/* RESULTS */}
      {atResults && (
        <section className="card center">
          <h3 className="h3">Results</h3>

          {/* KPI row */}
          <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}>
            <KPI t="Total annual value" v={money(annualValue,currency)} />
            <KPI t="Annual ROI" v={`${roiMultiple.toFixed(1)}×`} />
            <KPI t="Payback" v={Number.isFinite(paybackMonths)?`${paybackMonths.toFixed(1)} mo`:'—'} />
            <KPI t="Monthly savings" v={money(monthlySavings,currency)} />
          </div>

          {/* Breakdown + insights */}
          <div style={{display:'grid',gap:12,gridTemplateColumns:'1.2fr .8fr', marginTop:12}}>
            <div style={{border:'1px solid #E7ECF7',borderRadius:14,padding:12}}>
              <strong>Value breakdown by priority</strong>
              <div style={{marginTop:8}}>
                {breakdown.map(b=>(
                  <div key={b.key} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,padding:'8px 0',borderTop:'1px dashed #E7ECF7'}}>
                    <span>{b.label}</span>
                    <strong>{money(b.value,currency)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="live">
              <h4>Insights</h4>
              <div className="live-row">
                <span>Top driver</span>
                <strong>{breakdown.length?breakdown[0].label:'—'}</strong>
              </div>
              <div className="live-row">
                <span>% of total from top driver</span>
                <strong>
                  {breakdown.length && annualValue>0 ? Math.round((breakdown[0].value/annualValue)*100) : 0}%
                </strong>
              </div>
              <div className="live-row">
                <span>Hours saved / employee / week</span>
                <strong>{tpHoursPerWeek.toFixed(2)} h</strong>
              </div>
              <div className="live-row">
                <span>Total team hours saved / year</span>
                <strong>{Math.round(tpHoursPerWeek*52*employees).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div style={{marginTop:12,padding:'12px 14px',border:'1px solid #E7ECF7',borderRadius:12,background:'#F8FAFF'}}>
            <strong>Recommended next steps:</strong>{' '}
            {selected.includes('throughput') && 'Map top workflows → prompt libraries + QA gates. '}
            {selected.includes('quality') && 'Introduce AI review checkpoints to cut rework. '}
            {selected.includes('onboarding') && 'Role playbooks + guided “first 90 days”. '}
            {selected.includes('retention') && 'AI Champions cohort; quarterly ROI reviews. '}
            {selected.includes('cost') && 'Audit overlap; pilot tool consolidation. '}
            {selected.includes('upskilling') && 'Set competency targets; measure weekly AI usage.'}
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setStep(3+selected.length-1)}>← Back</button>
            <button className="btn-primary" onClick={()=>setStep(0)}>Start over</button>
          </div>
        </section>
      )}
    </>
  );
}

/* UI helpers */
function FieldNum({label,v,set,min,max,step}:{label:string;v:number;set:(n:number)=>void;min?:number;max?:number;step?:number}){
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" value={v} min={min} max={max} step={step}
        onChange={e=>set(Number(e.target.value||0))}
        className="input"/>
    </div>
  );
}
function KPI({t,v}:{t:string;v:string}){
  return (
    <div className="kpi">
      <div className="kpi-title">{t}</div>
      <div className="kpi-value">{v}</div>
    </div>
  );
}
