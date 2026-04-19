import { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Database, Plus, Trash2, ArrowRight, ArrowUpDown, Filter, ArrowUp, ArrowDown, X, Sparkles, Copy, SortAsc, SortDesc, FileBarChart, Save, FolderOpen, Clock, ChevronRight, Share2, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveDashboard, getUserDashboards, deleteDashboard, getDashboardById, subscribeToDashboard, SESSION_ID, logActivity } from '../services/firestore';
import FinancialReport from './FinancialReport';
import ActivityLog from './ActivityLog';
import AIInsightPanel from './AIInsightPanel';
import { getAIInsights } from '../services/aiService';

const PIE_COLORS = ['#8b5cf6', '#10b981', '#f43f5e', '#eab308', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];

const SAMPLE_INTERNAL_DATA = [
  { Date: '2024-01-01', Category: 'Electronics', Product: 'Laptop', Region: 'North', Sales: 120000, Cost: 85000, Quantity: 2 },
  { Date: '2024-01-05', Category: 'Software', Product: 'Cloud Subscription', Region: 'North', Sales: 45000, Cost: 10000, Quantity: 15 },
  { Date: '2024-01-10', Category: 'Electronics', Product: 'Monitor', Region: 'South', Sales: 25000, Cost: 15000, Quantity: 5 },
  { Date: '2024-01-12', Category: 'Hardware', Product: 'Printer', Region: 'East', Sales: 18000, Cost: 12000, Quantity: 3 },
  { Date: '2024-01-15', Category: 'Software', Product: 'Antivirus', Region: 'West', Sales: 5000, Cost: 500, Quantity: 10 },
  { Date: '2024-02-01', Category: 'Electronics', Product: 'Laptop', Region: 'West', Sales: 120000, Cost: 85000, Quantity: 5 },
  { Date: '2024-02-05', Category: 'Software', Product: 'Cloud Subscription', Region: 'South', Sales: 45000, Cost: 10000, Quantity: 20 },
  { Date: '2024-02-10', Category: 'Hardware', Product: 'Mouse', Region: 'North', Sales: 1200, Cost: 500, Quantity: 25 },
  { Date: '2024-03-01', Category: 'Electronics', Product: 'Laptop', Region: 'North', Sales: 120000, Cost: 85000, Quantity: 3 },
  { Date: '2024-03-10', Category: 'Software', Product: 'Cloud Subscription', Region: 'East', Sales: 45000, Cost: 10000, Quantity: 30 }
];

const MiniBI = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [step, setStep] = useState(1); // 1=upload, 2=transform, 3=visualize
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('query'); // 'query' | 'dax' | 'visualize'
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [currentSheet, setCurrentSheet] = useState('');

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
  
  // SaaS / Firestore states
  const { user } = useAuth();
  const [savedDashboards, setSavedDashboards] = useState([]);
  const [dashboardName, setDashboardName] = useState('Untitled Dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const [currentDashboardId, setCurrentDashboardId] = useState(null);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'saving' | 'error'
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [reportConfig, setReportConfig] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Load saved dashboards or shared links on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    if (shareId) {
      handleLoadSharedLink(shareId);
    } else if (user) {
      loadUserDashboards();
    }
  }, [user]);

  // Phase 5: Real-time Subscriber
  useEffect(() => {
    if (!currentDashboardId) return;

    const unsubscribe = subscribeToDashboard(currentDashboardId, (remoteData) => {
      console.log("Remote update detected:", remoteData);
      // Update local state with remote data
      // We skip 'data' to avoid heavy re-renders if it hasn't changed, 
      // but sync everything else
      setDashboardName(remoteData.name);
      setColumns(remoteData.columns || []);
      setActiveTab(remoteData.activeTab || 'query');
      setFilters(remoteData.filters || {});
      setDaxHistory(remoteData.daxHistory || []);
      setXAxisCol(remoteData.xAxisCol || '');
      setYAxisCol(remoteData.yAxisCol || '');
      setChartType(remoteData.chartType || 'bar');
      setData(remoteData.data || []);
      setAiInsights(remoteData.aiInsights || '');
      setLastSavedState(JSON.stringify(remoteData));
    });

    return () => unsubscribe();
  }, [currentDashboardId]);

  // Phase 5: Auto-Save Engine (Debounced)
  useEffect(() => {
    if (!user || data.length === 0) return;

    const currentState = JSON.stringify({
      name: dashboardName,
      data,
      columns,
      activeTab,
      filters,
      daxHistory,
      xAxisCol,
      yAxisCol,
      chartType,
      reportConfig,
      aiInsights
    });

    // Phase 8: Don't save if it matches the last known cloud state
    if (currentState === lastSavedState) return;

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const config = {
          id: currentDashboardId,
          name: dashboardName,
          data,
          columns,
          activeTab,
          filters,
          daxHistory,
          xAxisCol,
          yAxisCol,
          chartType,
          reportConfig,
          aiInsights,
          userName: user.displayName || user.email
        };
        
        // If no ID but we have a user and data, create initial record
        const id = await saveDashboard(user.uid, config);
        if (!currentDashboardId) {
          setCurrentDashboardId(id);
          await loadUserDashboards();
        }
        
        setLastSavedState(currentState);
        setSyncStatus('synced');
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSyncStatus('error');
      }
    }, 2000); // 2-second debounce

    return () => clearTimeout(timer);
  }, [currentDashboardId, user, dashboardName, data, columns, activeTab, filters, daxHistory, xAxisCol, yAxisCol, chartType, reportConfig, lastSavedState, aiInsights]);

  const handleLoadSharedLink = async (id) => {
    try {
      const dbData = await getDashboardById(id);
      if (dbData) {
        handleLoadSaved(dbData);
      }
    } catch (err) {
      console.error("Failed to load shared link", err);
    }
  };

  const handleShare = async () => {
    let dashboardId = currentDashboardId;
    
    if (!dashboardId) {
      if (!user) {
        alert("Please log in to share dashboards.");
        return;
      }
      
      setIsSaving(true);
      try {
        const config = {
          id: null,
          name: dashboardName,
          data,
          columns,
          activeTab,
          filters,
          daxHistory,
          xAxisCol,
          yAxisCol,
          chartType,
          reportConfig,
          aiInsights,
          userName: user.displayName || user.email
        };
        dashboardId = await saveDashboard(user.uid, config);
        setCurrentDashboardId(dashboardId);
        await loadUserDashboards();
      } catch (err) {
        console.error("Failed to auto-save before sharing:", err);
        alert("Could not save dashboard for sharing. Please try clicking Save manually.");
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    }
    
    const url = `${window.location.origin}${window.location.pathname}?mode=minibi&share=${dashboardId}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!\nAnyone with this link can view this dashboard.");
  };

  const loadUserDashboards = async () => {
    try {
      const docs = await getUserDashboards(user.uid);
      setSavedDashboards(docs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const name = prompt("Enter dashboard name:", dashboardName) || dashboardName;
      setDashboardName(name);
      
      const config = {
        id: currentDashboardId,
        name,
        data,
        columns,
        activeTab,
        filters,
        daxHistory,
        xAxisCol,
        yAxisCol,
        chartType,
        reportConfig,
        aiInsights
      };
      
      const id = await saveDashboard(user.uid, config);
      setCurrentDashboardId(id);
      await loadUserDashboards();
      alert("Dashboard saved successfully!");
    } catch (err) {
      console.error("Failed to save dashboard:", err);
      alert(`Failed to save dashboard: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSaved = (db) => {
    setCurrentDashboardId(db.id);
    setDashboardName(db.name);
    setData(db.data || []);
    setColumns(db.columns || []);
    setActiveTab(db.activeTab || 'query');
    setFilters(db.filters || {});
    setDaxHistory(db.daxHistory || []);
    setXAxisCol(db.xAxisCol || '');
    setYAxisCol(db.yAxisCol || '');
    setChartType(db.chartType || 'bar');
    setReportConfig(db.reportConfig || null);
    setAiInsights(db.aiInsights || '');
    setStep(2);
  };

  const handleDeleteSaved = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Delete this dashboard?")) return;
    try {
      await deleteDashboard(id);
      await loadUserDashboards();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDashboardName(file.name.replace(/\.[^/.]+$/, "")); // Set name from file
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        const wsname = wb.SheetNames[0];
        setCurrentSheet(wsname);
        
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

  const loadSampleData = () => {
    setData(SAMPLE_INTERNAL_DATA);
    const cols = Object.keys(SAMPLE_INTERNAL_DATA[0]);
    setColumns(cols);
    setXAxisCol(cols[1]); // Category
    setYAxisCol(cols[4]); // Sales
    setDashboardName('Sample Financial Dashboard');
    setStep(2);
    setActiveTab('visualize');
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

  // ==================== MULTI-SHEET HANDLER ====================
  const handleSheetChange = (e) => {
    const wsname = e.target.value;
    setCurrentSheet(wsname);
    try {
      const ws = workbook.Sheets[wsname];
      let jsonData = XLSX.utils.sheet_to_json(ws);
      if (jsonData.length === 0) {
        alert("Selected sheet is empty.");
        return;
      }
      let cols = Object.keys(jsonData[0]);
      if (jsonData.length > 50000) {
        jsonData = jsonData.slice(0, 50000);
        alert("Truncated to 50,000 rows for performance.");
      }
      setData(jsonData);
      setColumns(cols);
      setFilters({});
      setDaxHistory([]);
      setXAxisCol(cols[0]);
      setYAxisCol(cols[1] || cols[0]);
    } catch (err) {
      alert("Failed to parse sheet.");
    }
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

      // Phase 6: Log the formula application
      if (currentDashboardId) {
        logActivity(currentDashboardId, user, `Added computed column: ${newColName}`);
      }
    } catch (err) {
      setError(`Formula error: ${err.message}. Check column names match exactly (case-sensitive).`);
    }
  };

  // ==================== RENDER: UPLOAD ====================

  const renderUploadStep = () => (
    <div className="upload-zone fade-in">
      <div className="upload-header">
        <Database size={56} className="icon-main" style={{ color: '#8b5cf6' }} />
        <h2 style={{ border: 'none', margin: 0 }}>Data Studio</h2>
      </div>

      <div className="studio-landing">
        {/* Left Side: Upload */}
        <div className="landing-card upload-card">
          <h3>Analyze New Data</h3>
          <p>Upload Excel or CSV to start fresh</p>
          <div className="landing-button-group">
            <label className="file-upload-btn">
              Browse Files
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button className="sample-data-btn" onClick={loadSampleData}>
              <Sparkles size={16} /> Load Sample Data
            </button>
          </div>
        </div>

        {/* Right Side: Saved Dashboards */}
        <div className="landing-card saved-card">
          <div className="card-header">
            <h3>Recent Dashboards</h3>
            <FolderOpen size={18} style={{ color: '#94a3b8' }} />
          </div>
          
          <div className="saved-list">
            {savedDashboards.length > 0 ? (
              savedDashboards.map(db => (
                <div key={db.id} className="saved-item" onClick={() => handleLoadSaved(db)}>
                  <div className="saved-info">
                    <span className="saved-name">{db.name}</span>
                    <span className="saved-date">
                      <Clock size={12} /> {db.updatedAt?.toDate?.().toLocaleDateString() || 'Today'}
                    </span>
                  </div>
                  <div className="saved-actions">
                    <button onClick={(e) => handleDeleteSaved(e, db.id)} className="delete-saved">
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={18} className="chevron" />
                  </div>
                </div>
              ))
            ) : (
              <div className="no-saved">
                <p>No dashboards saved yet.</p>
                <p style={{ fontSize: '11px' }}>Your analysis will appear here once saved.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
        
        <div className="workspace-actions">
          <div className={`sync-status ${syncStatus}`}>
            {syncStatus === 'saving' ? (
              <><span className="sync-dot saving"></span> Syncing...</>
            ) : syncStatus === 'error' ? (
              <><span className="sync-dot error"></span> Sync Failed</>
            ) : (
              <><span className="sync-dot synced"></span> Cloud Synced</>
            )}
          </div>

          <button className="btn-share" onClick={handleShare}>
            <Share2 size={16} /> Share
          </button>
          
          <button className="btn-activity" onClick={() => setShowActivityLog(true)}>
            <Clock size={16} /> Activity
          </button>

          <button 
            className={`btn-ai ${isAILoading ? 'loading' : ''}`} 
            onClick={async () => {
              if (isAILoading) return;
              setIsAILoading(true);
              try {
                const insights = await getAIInsights(filteredData, columns);
                setAiInsights(insights);
                setShowAIPanel(true);
                logActivity(currentDashboardId, user, "Generated AI Data Insights");
              } catch (err) {
                alert(err.message);
              } finally {
                setIsAILoading(false);
              }
            }}
          >
            <Sparkles size={16} className={isAILoading ? 'spinning' : ''} /> 
            {isAILoading ? 'Analyzing...' : 'AI Insights'}
          </button>


          <div className="workspace-meta">
            {sheetNames.length > 1 && (
            <div className="sheet-selector">
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sheet:</span>
              <select value={currentSheet} onChange={handleSheetChange} className="sheet-dropdown">
                {sheetNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          )}
          <span className="meta-chip">{filteredData.length.toLocaleString()} rows</span>
          <span className="meta-chip">{columns.length} columns</span>
          <button className="btn-secondary btn-sm" onClick={() => { setStep(1); setData([]); setColumns([]); setFilters({}); setDaxHistory([]); setCurrentDashboardId(null); setDashboardName('Untitled Dashboard'); }}>
            New
          </button>
        </div>
      </div>
    </div>

      {/* Tab Content */}
      {activeTab === 'query' && renderPowerQuery()}
      {activeTab === 'dax' && renderDAX()}
      {activeTab === 'visualize' && renderVisualize()}
      {activeTab === 'report' && (
        <FinancialReport 
          data={filteredData} 
          columns={columns} 
          config={reportConfig} 
          onConfigChange={setReportConfig} 
          aiInsights={aiInsights}
        />
      )}
      
      {showAIPanel && (
        <AIInsightPanel 
          insights={aiInsights} 
          onClose={() => setShowAIPanel(false)} 
          isPremium={true} 
        />
      )}
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
              {filteredData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col}>{typeof row[col] === 'number' ? row[col].toLocaleString('en-IN') : String(row[col] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <p className="table-footer-note">
            Showing all {filteredData.length.toLocaleString()} filtered rows.
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
                  onClick={() => { 
                    setChartType(type); 
                    if (currentDashboardId) {
                      logActivity(currentDashboardId, user, `Changed chart type to ${type}`);
                    }
                  }}
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
