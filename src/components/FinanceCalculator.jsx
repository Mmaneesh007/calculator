// src/components/FinanceCalculator.jsx
import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FinanceCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    let result = [];
    let currentTotal = principal;
    let totalInvested = principal;
    
    for (let i = 0; i <= years; i++) {
      if (i === 0) {
        result.push({ year: i, Wealth: currentTotal, Invested: totalInvested });
        continue;
      }
      totalInvested += (monthlyContribution * 12);
      // Rough monthly compounding approx for visualization
      currentTotal = currentTotal * Math.pow(1 + (rate / 100) / 12, 12) + (monthlyContribution * ((Math.pow(1 + (rate / 100) / 12, 12) - 1) / ((rate / 100) / 12)));
      
      result.push({ year: i, Wealth: Math.round(currentTotal), Invested: Math.round(totalInvested) });
    }
    return result;
  }, [principal, monthlyContribution, rate, years]);

  const finalWealth = data[data.length - 1]?.Wealth || 0;
  const finalInvested = data[data.length - 1]?.Invested || 0;

  return (
    <div className="pro-calculator finance-mode w-full max-w-4xl">
      <h2>Wealth Projection Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="controls-panel">
          <div className="input-group">
            <label>Initial Principal (₹)</label>
            <input type="number" value={principal === 0 ? '' : principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>Monthly SIP (₹)</label>
            <input type="number" value={monthlyContribution === 0 ? '' : monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>Expected Return (%)</label>
            <input type="number" value={rate === 0 ? '' : rate} step="0.1" onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>Time Period (Years)</label>
            <input type="number" value={years === 0 ? '' : years} onChange={(e) => setYears(Number(e.target.value))} />
          </div>
          
          <div className="summary-cards">
            <div className="summary-card">
              <span className="label">Total Invested</span>
              <span className="value">₹{finalInvested.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-card gold">
              <span className="label">Projected Wealth</span>
              <span className="value">₹{finalWealth.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="chart-panel" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#475569" tickFormatter={(v) => `Yr ${v}`} />
              <YAxis stroke="#475569" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(9, 12, 19, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '14px' }}
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Area type="monotone" dataKey="Invested" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
              <Area type="monotone" dataKey="Wealth" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorWealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;
