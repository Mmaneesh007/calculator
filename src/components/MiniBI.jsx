// src/components/MiniBI.jsx
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Database, Plus, Trash2, ArrowRight, ArrowUpDown, Filter, ArrowUp, ArrowDown, X, Sparkles, Copy, SortAsc, SortDesc, FileBarChart } from 'lucide-react';
import FinancialReport from './FinancialReport';

const PIE_COLORS = ['#8b5cf6', '#10b981', '#f43f5e', '#eab308', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];

const MiniBI = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [step, setStep] = useState(1); // 1=upload, 2=transform, 3=visualize
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('query'); // 'query' | 'dax' | 'visualize'

  // Power Query states
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({}); // { colName: filterValue }
  const [showFilterFor, setShowFilterFor] = useState(null);

  // DAX states
  const [newColName, setNewColName] = useState('');
  const [formula, setFormula] = useState('');
  const [daxHistory, setDaxHistory] = useState([]);

  // Visualize states
  const [xAxisCol, setXAxisCol] = useState('');
  const [yAxisCol, setYAxisCol] = useState('');
  const [chartType, setChartType] = useState('bar');

  // File upload handler
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
        if (jsonData.length === 0) throw new Error("No data found");
        let cols = Object.keys(jsonData[0]);
        if (jsonData.length > 50000) {
          jsonData = jsonData.slice(0, 50000);
          alert("Truncated to 50,000 rows for performance.");
        }
        setData(jsonData);
        setColumns(cols);
        setXAxisCol(cols[0]);
        setYAxisCol(cols[1] || cols[0]);
        setStep(2);
        setActiveTab('query');
        setError('');
      } catch (err) {
        setError('Failed to parse. Upload a valid .xlsx or .csv file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // ==================== POWER QUERY FUNCTIONS ====================

  const handleSort = (col, dir) => {
    setSortCol(col);
    setSortDir(dir);
    const sorted = [...data].sort((a, b) => {
      if (a[col] == null) return 1;
      if (b[col] == null) return -1;
      if (typeof a[col] === 'number' && typeof b[col] === 'number') {
        return dir === 'asc' ? a[col] - b[col] : b[col] - a[col];
      }
      return dir === 'asc'
        ? String(a[col]).localeCompare(String(b[col]))
        : String(b[col]).localeCompare(String(a[col]));
    });
    setData(sorted);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set();
    const unique = data.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const removed = data.length - unique.length;
    setData(unique);
    alert(`Removed ${removed} duplicate row(s). ${unique.length} rows remaining.`);
  };

  const handleRemoveBlanks = () => {
    const cleaned = data.filter(row => {
      return columns.some(col => row[col] != null && String(row[col]).trim() !== '');
    });
    const removed = data.length - cleaned.length;
    setData(cleaned);
    alert(`Removed ${removed} blank row(s). ${cleaned.length} rows remaining.`);
  };

  const handleFilterApply = (col, value) => {
    if (value === '' || value === '__all__') {
      const newFilters = { ...filters };
      delete newFilters[col];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [col]: value });
    }
    setShowFilterFor(null);
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
    const newFilters = { ...filters };
    delete newFilters[colToRemove];
    setFilters(newFilters);
    if (xAxisCol === colToRemove) setXAxisCol(updatedCols[0] || '');
    if (yAxisCol === colToRemove) setYAxisCol(updatedCols[0] || '');
  };

  // Filtered + displayed data
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([col, val]) => {
        return String(row[col]) === String(val);
      });
    });
  }, [data, filters]);

  // Get unique values for filter dropdowns
  const getUniqueValues = (col) => {
    const vals = [...new Set(data.map(r => String(r[col] ?? '')))];
    return vals.slice(0, 100); // cap for performance
  };

  // ==================== DAX FUNCTIONS ====================

  const daxTemplates = [
    { label: 'Multiply Column', formula: "row['ColumnName'] * 2" },
    { label: 'Add Two Columns', formula: "row['Col1'] + row['Col2']" },
    { label: 'Percentage', formula: "(row['Part'] / row['Total']) * 100" },
    { label: 'Conditional', formula: "row['Sales'] > 1000 ? 'High' : 'Low'" },
    { label: 'Round Value', formula: "Math.round(row['Value'] * 100) / 100" },
  ];

  const applyFormula = () => {
    if (!newColName.trim() || !formula.trim()) {
      setError('Please provide both a column name and formula.');
      return;
    }
    try {
      const updatedData = data.map(row => {
        const mathContext = new Function('row', `return ${formula}`);
        const newValue = mathContext(row);
        return { ...row, [newColName]: newValue };
      });
      setData(updatedData);
      if (!columns.includes(newColName)) {
        setColumns([...columns, newColName]);
      }
      setDaxHistory([...daxHistory, { name: newColName, formula }]);
      setNewColName('');
      setFormula('');
      setError('');
    } catch (err) {
      setError(`Formula error: ${err.message}. Check column names match exactly (case-sensitive).`);
    }
  };

  // ==================== RENDER: UPLOAD ====================

  const renderUploadStep = () => (
    <div className="upload-zone fade-in">
      <Database size={64} className="icon-main" style={{ color: '#8b5cf6', marginBottom: '24px' }} />
      <h2 style={{ border: 'none' }}>Data Studio</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6 }}>
        Upload your Excel (.xlsx) or CSV file to transform, analyze, and visualize your data — all in the browser. No data leaves your device.
      </p>
      <label className="file-upload-btn">
        Browse Files
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
      {error && <p className="error-text" style={{ color: '#fb7185', marginTop: '16px' }}>{error}</p>}
    </div>
  );

  // ==================== RENDER: WORKSPACE (TABS) ====================

  const renderWorkspace = () => (
    <div className="workspace-zone fade-in w-full">
      {/* Top Bar */}
      <div className="workspace-topbar">
        <div className="workspace-tabs">
          <button className={`ws-tab ${activeTab === 'query' ? 'active' : ''}`} onClick={() => setActiveTab('query')}>
            <Filter size={16} /> Power Query
          </button>
          <button className={`ws-tab ${activeTab === 'dax' ? 'active' : ''}`} onClick={() => setActiveTab('dax')}>
            <Sparkles size={16} /> DAX Engine
          </button>
          <button className={`ws-tab ${activeTab === 'visualize' ? 'active' : ''}`} onClick={() => setActiveTab('visualize')}>
            <ArrowUpDown size={16} /> Visualize
          </button>
          <button className={`ws-tab ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>
            <FileBarChart size={16} /> Report
          </button>
        </div>
        <div className="workspace-meta">
          <span className="meta-chip">{filteredData.length.toLocaleString()} rows</span>
          <span className="meta-chip">{columns.length} columns</span>
          <button className="btn-secondary btn-sm" onClick={() => { setStep(1); setData([]); setColumns([]); setFilters({}); setDaxHistory([]); }}>
            New File
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'query' && renderPowerQuery()}
      {activeTab === 'dax' && renderDAX()}
      {activeTab === 'visualize' && renderVisualize()}
      {activeTab === 'report' && <FinancialReport data={filteredData} columns={columns} />}
    </div>
  );

  // ==================== RENDER: POWER QUERY TAB ====================

  const renderPowerQuery = () => (
    <div className="pq-panel fade-in">
      {/* Toolbar */}
      <div className="pq-toolbar">
        <h3 style={{ margin: 0, color: '#fff' }}>Transform & Filter</h3>
        <div className="pq-actions">
          <button className="pq-btn" onClick={handleRemoveDuplicates}>
            <Copy size={14} /> Remove Duplicates
          </button>
          <button className="pq-btn" onClick={handleRemoveBlanks}>
            <X size={14} /> Remove Blanks
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="active-filters">
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Active Filters:</span>
          {Object.entries(filters).map(([col, val]) => (
            <span key={col} className="filter-chip">
              {col} = {val}
              <button onClick={() => handleFilterApply(col, '__all__')}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Data Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>
                    <div className="th-content">
                      <span className="th-label">{col}</span>
                      <div className="th-actions">
                        {/* Sort */}
                        <button
                          className={`th-btn ${sortCol === col && sortDir === 'asc' ? 'active-sort' : ''}`}
                          onClick={() => handleSort(col, 'asc')}
                          title="Sort Ascending"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          className={`th-btn ${sortCol === col && sortDir === 'desc' ? 'active-sort' : ''}`}
                          onClick={() => handleSort(col, 'desc')}
                          title="Sort Descending"
                        >
                          <ArrowDown size={12} />
                        </button>
                        {/* Filter */}
                        <button
                          className={`th-btn ${filters[col] ? 'active-filter' : ''}`}
                          onClick={() => setShowFilterFor(showFilterFor === col ? null : col)}
                          title="Filter"
                        >
                          <Filter size={12} />
                        </button>
                        {/* Delete col */}
                        <button className="th-btn danger" onClick={() => removeColumn(col)} title="Remove Column">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {/* Filter Dropdown */}
                    {showFilterFor === col && (
                      <div className="filter-dropdown">
                        <select
                          defaultValue={filters[col] || '__all__'}
                          onChange={(e) => handleFilterApply(col, e.target.value)}
                        >
                          <option value="__all__">Show All</option>
                          {getUniqueValues(col).map(val => (
                            <option key={val} value={val}>{val || '(blank)'}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 50).map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col}>{typeof row[col] === 'number' ? row[col].toLocaleString('en-IN') : String(row[col] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > 50 && (
          <p className="table-footer-note">
            Showing 50 of {filteredData.length.toLocaleString()} filtered rows.
          </p>
        )}
      </div>
    </div>
  );

  // ==================== RENDER: DAX TAB ====================

  const renderDAX = () => (
    <div className="dax-panel fade-in">
      <div className="dax-builder">
        <h3 style={{ color: '#fff', margin: '0 0 4px' }}>Calculated Column Engine (DAX)</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
          Create new computed columns using formulas that reference your data. Use <code style={{ color: '#c4b5fd' }}>row['ColumnName']</code> to access values.
        </p>

        <div className="dax-form">
          <div className="dax-form-row">
            <input
              type="text"
              placeholder="New Column Name"
              value={newColName}
              onChange={e => setNewColName(e.target.value)}
              className="dax-input"
            />
            <input
              type="text"
              placeholder="Formula (e.g., row['Price'] * 1.18)"
              value={formula}
              onChange={e => setFormula(e.target.value)}
              className="dax-input"
              style={{ flex: 2 }}
            />
            <button className="btn-compute" onClick={applyFormula}>
              <Plus size={16} /> Compute
            </button>
          </div>
          {error && <p style={{ color: '#fb7185', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
        </div>

        {/* Quick Templates */}
        <div className="dax-templates">
          <h4>Quick Templates</h4>
          <div className="template-grid">
            {daxTemplates.map((t, i) => (
              <button key={i} className="template-card" onClick={() => setFormula(t.formula)}>
                <span className="template-label">{t.label}</span>
                <code className="template-code">{t.formula}</code>
              </button>
            ))}
          </div>
        </div>

        {/* Available Columns Reference */}
        <div className="dax-ref">
          <h4>Available Columns</h4>
          <div className="col-chips">
            {columns.map(col => (
              <span key={col} className="col-chip" onClick={() => setFormula(prev => prev + `row['${col}']`)}>
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* History */}
        {daxHistory.length > 0 && (
          <div className="dax-history">
            <h4>Computed Columns</h4>
            {daxHistory.map((h, i) => (
              <div key={i} className="history-item">
                <span className="history-name">{h.name}</span>
                <code className="history-formula">{h.formula}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ==================== RENDER: VISUALIZE TAB ====================

  const renderVisualize = () => (
    <div className="viz-panel fade-in">
      <div className="dashboard-grid">
        <div className="controls-panel">
          <h3 style={{ color: '#fff', marginTop: 0 }}>Chart Configuration</h3>
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
            <label>Chart Type</label>
            <div className="chart-type-grid">
              {['bar', 'line', 'area', 'pie'].map(type => (
                <button
                  key={type}
                  className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                  onClick={() => setChartType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="summary-cards" style={{ marginTop: '24px' }}>
            <div className="summary-card">
              <span className="label">Total Rows (Filtered)</span>
              <span className="value">{filteredData.length.toLocaleString()}</span>
            </div>
            <div className="summary-card gold">
              <span className="label">Columns Available</span>
              <span className="value">{columns.length}</span>
            </div>
          </div>
        </div>

        <div className="chart-panel" style={{ height: '420px', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 16px 16px', color: '#fff' }}>{yAxisCol} by {xAxisCol}</h3>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={filteredData.slice(0, 20)}
                  dataKey={yAxisCol}
                  nameKey={xAxisCol}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredData.slice(0, 20).map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            ) : chartType === 'bar' ? (
              <BarChart data={filteredData.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey={yAxisCol} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === 'area' ? (
              <AreaChart data={filteredData.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey={yAxisCol} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            ) : (
              <LineChart data={filteredData.slice(0, 100)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xAxisCol} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#090c13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey={yAxisCol} stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pro-calculator data-studio-mode w-full max-w-4xl" style={{ minHeight: '500px' }}>
      {step === 1 && renderUploadStep()}
      {step === 2 && renderWorkspace()}
    </div>
  );
};

export default MiniBI;
