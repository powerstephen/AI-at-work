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

const symbol = (c:Currency)=> c==='EUR'?'€':c==='USD'?'$':'£';
const money = (n:number,c:Currency)=> new Intl.NumberFormat('en',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
const clamp = (n:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,n));
const hourlyFromSalary = (s:number)=> s/(52*40);

export default function Page(){
  return (
    <main className="container">
      <Calculator />
      <section style={{textAlign:'center',color:'#667085',fontSize:12,padding:'8px 0 24px'}}>
        Build: {new Date().toISOString()}
      </section>
    </main>
  );
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

  // choose top 3
  const [selected, setSelected] = useState<Goal[]>(['throughput','retention','upskilling']);
  const toggleGoal = (g:Goal)=> setSelected(prev=>{
    const on = prev.includes(g);
    if(on) return prev.filter(x=>x!==g);
    if(prev.length>=3) return prev;
    return [...prev,g];
  });

  // throughput
  const [tpHoursPerWeek, setTpHoursPerWeek] = useState(3);
  const [tpUtilPct, setTpUtilPct] = useState(70);

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

  // formulas
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

  const annualValue = valThroughput+valQuality+valOnboarding+valRetention+valCost+valUpskilling;
  const monthlySavings = annualValue/12;
  const roiMultiple = programCost>0 ? (annualValue/programCost) : 0;
  const paybackMonths = monthlySavings>0 ? (programCost/monthlySavings) : Infinity;

  // steps
  const steps = [
    'Basics',
    'Pick top 3 priorities',
    ...selected.map(g=>`Configure: ${GOAL_META[g].label}`),
    'Results'
  ];
  const progress = steps.length>1 ? (step/(steps.length-1)) : 0;
  const atResults = step === (2 + selected.length);

  return (
    <>
      {/* HERO */}
      <section className="hero center">
        <h1 style={{margin:0,fontSize:'1.25rem',fontWeight:900}}>AI at Work — Human Productivity ROI</h1>
        <p style={{margin:'6px 0 10px',color:'rgba(255,255,255,.92)'}}>
          Quantify time saved, payback, and retention impact from training managers and teams to work effectively with AI.
        </p>

        {/* Show static labels until Results; live values only on Results */}
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

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn-primary" onClick={()=>setStep(1)}>Continue →</button>
          </div>
        </section>
      )}

      {/* STEP 1: PICK TOP 3 */}
      {step===1 && (
        <section className="card center">
          <h3 className="h3">Pick your top 3 priorities</h3>
          <p className="help">Choose up to three. The next screens will adapt.</p>
          <div className="grid">
            {(Object.keys(GOAL_META) as Goal[]).map(g=>{
              const on = selected.includes(g);
              return (
                <div key={g} style={{border:'1px solid #E7ECF7',borderRadius:14,padding:12,background:on?'rgba(51,102,254,.06)':'#fff'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                    <button type="button"
                      onClick={()=>toggleGoal(g)}
                      className="btn"
                      style={{
                        border: `1px solid ${on?'transparent':'#E7ECF7'}`,
                        background: on?BLUE:'#fff',
                        color: on?'#fff':'#0E1320'
                      }}>
                      {GOAL_META[g].label}
                    </button>
                  </div>
                  <div style={{marginTop:8,fontSize:'.86rem',color:'#667085'}}>{GOAL_META[g].hint}</div>
                </div>
              );
            })}
          </div>

          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn-primary" onClick={()=>setStep(2)} disabled={selected.length===0}>Continue →</button>
          </div>
        </section>
      )}

      {/* DYNAMIC CONFIG STEPS */}
      {selected.map((g, idx)=>{
        const idxStep = 2+idx;
        if(step!==idxStep) return null;
        return (
          <section key={g} className="card center">
            <h3 className="h3">{GOAL_META[g].label}</h3>
            <p className="help">{GOAL_META[g].hint}</p>

            {g==='throughput' && (
              <div className="grid">
                <FieldNum label="Hours saved per person / week" v={tpHoursPerWeek} set={setTpHoursPerWeek} step={0.5}/>
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
          <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}>
            <KPI t="Total annual value" v={money(annualValue,currency)} />
            <KPI t="Annual ROI" v={`${roiMultiple.toFixed(1)}×`} />
            <KPI t="Payback" v={Number.isFinite(paybackMonths)?`${paybackMonths.toFixed(1)} mo`:'—'} />
            <KPI t="Monthly savings" v={money(monthlySavings,currency)} />
          </div>
          <div style={{marginTop:12,padding:'12px 14px',border:'1px solid #E7ECF7',borderRadius:12,background:'#F8FAFF'}}>
            <strong>Next steps:</strong>{' '}
            {selected.includes('throughput') && 'Map top workflows → prompt libraries + QA gates. '}
            {selected.includes('quality') && 'Introduce AI review checkpoints to cut rework. '}
            {selected.includes('onboarding') && 'Role playbooks + guided “first 90 days”. '}
            {selected.includes('retention') && 'AI Champions cohort; quarterly ROI reviews. '}
            {selected.includes('cost') && 'Audit overlap; pilot tool consolidation. '}
            {selected.includes('upskilling') && 'Set competency targets; measure weekly AI usage.'}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setStep(2+selected.length-1)}>← Back</button>
            <button className="btn-primary" onClick={()=>setStep(0)}>Start over</button>
          </div>
        </section>
      )}
    </>
  );
}

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
