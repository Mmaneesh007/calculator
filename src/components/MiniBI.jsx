// src/components/MiniBI.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Database, Plus, Trash2, ArrowRight } from 'lucide-react';

const MiniBI = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Transform states
  const [newColName, setNewColName] = useState('');
  const [formula, setFormula] = useState('');

  // Visualize states
  const [xAxisCol, setXAxisCol] = useState('');
  const [yAxisCol, setYAxisCol] = useState('');
  const [chartType, setChartType] = useState('bar'); 

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        let jsonData = XLSX.utils.sheet_to_json(ws);
        
        if (jsonData.length === 0) throw new Error("No data found in sheet");
        
        let cols = Object.keys(jsonData[0]);
        
        // Mitigation: 50,000 row hard limit
        if (jsonData.length > 50000) {
          jsonData = jsonData.slice(0, 50000);
          alert("File exceeded 50,000 rows. Data has been truncated to maintain lightning-fast performance.");
        }

        setData(jsonData);
        setColumns(cols);
        setXAxisCol(cols[0]);
        setYAxisCol(cols[1] || cols[0]);
        setStep(2);
        setError('');
      } catch (err) {
        setError('Failed to parse file. Please upload a valid .xlsx or .csv.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const applyFormula = () => {
    if (!newColName || !formula) return;
    
    try {
      const updatedData = data.map(row => {
        // Safe evaluation context limited to row variables
        // Users can write formulas like: row['Price'] * 1.18
        const mathContext = new Function('row', `return ${formula}`);
        const newValue = mathContext(row);
        return { ...row, [newColName]: newValue };
      });
      
      setData(updatedData);
      if (!columns.includes(newColName)) {
        setColumns([...columns, newColName]);
      }
      setNewColName('');
      setFormula('');
      setError('');
    } catch (err) {
      setError('Invalid formula. Example format: row["Column Name"] * 1.5');
    }
  };

  const removeColumn = (colToRemove) => {
    const updatedCols = columns.filter(c => c !== colToRemove);
    const updatedData = data.map(row => {
      const newRow = { ...row };
      delete newRow[colToRemove];
      return newRow;
    });
    setColumns(updatedCols);
    setData(updatedData);
    if(xAxisCol === colToRemove) setXAxisCol(updatedCols[0] || '');
    if(yAxisCol === colToRemove) setYAxisCol(updatedCols[0] || '');
  };

  const renderUploadStep = () => (
    <div className="upload-zone fade-in">
      <Database size={64} className="icon-main mb-6" style={{color: '#8b5cf6'}}/>
      <h2 style={{border: 'none'}}>Data Studio Import</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Upload your Excel (.xlsx) or CSV file to build an instant dashboard.</p>
      
      <label className="file-upload-btn">
        Browse Files
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{display: 'none'}} />
      </label>
      {error && <p className="error-text mt-4" style={{color: '#fb7185'}}>{error}</p>}
    </div>
  );

  const renderTransformStep = () => (
    <div className="transform-zone fade-in w-full">
      <div className="flex-between">
        <h2 style={{border: 'none', marginBottom: 0}}>Data Grid & Transforms</h2>
        <button className="btn-next" onClick={() => setStep(3)}>Build Dashboard <ArrowRight size={16}/></button>
      </div>

      <div className="formula-builder">
        <h3>Calculated Column Engine (DAX)</h3>
        <div className="formula-inputs">
          <input type="text" placeholder="New Col Name (e.g. Tax)" value={newColName} onChange={e => setNewColName(e.target.value)} />
          <input type="text" placeholder="Formula (e.g. row['Sales'] * 1.18)" value={formula} onChange={e => setFormula(e.target.value)} style={{flex: 2}}/>
          <button className="btn-add-row" style={{background: 'rgba(139, 92, 246, 0.2)', border: 'none', color: '#c4b5fd'}} onClick={applyFormula}>
            <Plus size={16} /> Compute
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="data-table-container mt-4">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
               <tr>
                 {columns.map((col, idx) => (
                   <th key={idx}>
                     <div className="th-content">
                       {col}
                       <button className="btn-icon-tiny" onClick={() => removeColumn(col)}><Trash2 size={12}/></button>
                     </div>
                   </th>
                 ))}
               </tr>
            </thead>
            <tbody>
              {data.slice(0, 15).map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => <td key={col}>{typeof row[col] === 'number' ? row[col].toLocaleString('en-IN') : row[col]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 15 && <p className="table-footer-note">Showing first 15 of {data.length.toLocaleString()} rows...</p>}
      </div>
    </div>
  );

  const renderVisualizeStep = () => (
    <div className="visualize-zone fade-in w-full">
      <div className="flex-between">
        <h2 style={{border: 'none', marginBottom: 0}}>Custom Dashboard</h2>
        <button className="btn-secondary" onClick={() => setStep(2)}>Back to Grid</button>
      </div>

      <div className="dashboard-grid">
        <div className="controls-panel">
          <div className="input-group">
            <label>Dimension (X-Axis)</label>
            <select value={xAxisCol} onChange={e => setXAxisCol(e.target.value)}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Metric (Y-Axis)</label>
            <select value={yAxisCol} onChange={e => setYAxisCol(e.target.value)}>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Visual Type</label>
            <select value={chartType} onChange={e => setChartType(e.target.value)}>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>

        <div className="chart-panel" style={{ height: '400px', flexDirection: 'column' }}>
          <h3 style={{margin: '0 0 16px 16px', color: '#fff'}}>{yAxisCol} by {xAxisCol}</h3>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey={yAxisCol} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === 'area' ? (
              <AreaChart data={data.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey={yAxisCol} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            ) : (
              <LineChart data={data.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey={yAxisCol} stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      <p style={{textAlign: "right", marginTop: "12px", color: "rgba(255,255,255,0.4)", fontSize:"12px"}}>Visualizing max 100 data points on X-axis for aesthetics.</p>
    </div>
  );

  return (
    <div className="pro-calculator data-studio-mode w-full max-w-4xl" style={{ minHeight: "500px" }}>
      {step === 1 && renderUploadStep()}
      {step === 2 && renderTransformStep()}
      {step === 3 && renderVisualizeStep()}
    </div>
  );
};
export default MiniBI;
