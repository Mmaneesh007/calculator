// src/components/FinancialReport.jsx
import { useMemo, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, FileText, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#0ea5e9', '#14b8a6', '#10b981'];

const FinancialReport = ({ data, columns }) => {
  const reportRef = useRef(null);
  const [categoryCol, setCategoryCol] = useState('');
  const [periodCol, setPeriodCol] = useState('');
  const [valueCol, setValueCol] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  // Detect numeric columns
  const numericCols = useMemo(() => {
    if (!data.length) return [];
    return columns.filter(col => {
      const sample = data.find(r => r[col] != null);
      return sample && typeof sample[col] === 'number';
    });
  }, [data, columns]);

  // Detect string/category columns
  const textCols = useMemo(() => {
    if (!data.length) return [];
    return columns.filter(col => {
      const sample = data.find(r => r[col] != null);
      return sample && typeof sample[col] !== 'number';
    });
  }, [data, columns]);

  // Auto-configure on mount
  useMemo(() => {
    if (textCols.length >= 2 && numericCols.length >= 1 && !isConfigured) {
      setCategoryCol(textCols[0]);
      setPeriodCol(textCols[1] || textCols[0]);
      setValueCol(numericCols[0]);
    }
  }, [textCols, numericCols]);

  // KPI Summary: sum of all numeric columns
  const kpiData = useMemo(() => {
    return numericCols.slice(0, 4).map(col => {
      const total = data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
      const avg = total / data.length;
      return { name: col, total, avg, count: data.length };
    });
  }, [data, numericCols]);

  // Mini charts for each KPI: group by period
  const kpiCharts = useMemo(() => {
    if (!periodCol || !numericCols.length) return {};
    const charts = {};
    numericCols.slice(0, 4).forEach(col => {
      const grouped = {};
      data.forEach(row => {
        const period = String(row[periodCol] || 'Other');
        grouped[period] = (grouped[period] || 0) + (Number(row[col]) || 0);
      });
      charts[col] = Object.entries(grouped).slice(0, 8).map(([key, val]) => ({ period: key, value: val }));
    });
    return charts;
  }, [data, periodCol, numericCols]);

  // Segment Table: Category × Period breakdown
  const segmentTable = useMemo(() => {
    if (!categoryCol || !periodCol || !valueCol) return { categories: [], periods: [], matrix: {} };

    const categories = [...new Set(data.map(r => String(r[categoryCol] || 'Other')))].slice(0, 20);
    const periods = [...new Set(data.map(r => String(r[periodCol] || 'Other')))].slice(0, 8);

    const matrix = {};
    categories.forEach(cat => {
      matrix[cat] = {};
      periods.forEach(per => { matrix[cat][per] = 0; });
    });

    data.forEach(row => {
      const cat = String(row[categoryCol] || 'Other');
      const per = String(row[periodCol] || 'Other');
      if (matrix[cat] && matrix[cat][per] !== undefined) {
        matrix[cat][per] += Number(row[valueCol]) || 0;
      }
    });

    return { categories, periods, matrix };
  }, [data, categoryCol, periodCol, valueCol]);

  // Period totals for segment table
  const periodTotals = useMemo(() => {
    const totals = {};
    segmentTable.periods.forEach(per => {
      totals[per] = segmentTable.categories.reduce((sum, cat) => sum + (segmentTable.matrix[cat]?.[per] || 0), 0);
    });
    return totals;
  }, [segmentTable]);

  // Format number
  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const fmtTable = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  // Download as Image
  const downloadImage = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#090c13',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'financial_report.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download as PDF
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#090c13',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('financial_report.pdf');
  };

  const handleGenerate = () => {
    if (categoryCol && periodCol && valueCol) {
      setIsConfigured(true);
    }
  };

  if (!isConfigured) {
    return (
      <div className="report-config fade-in">
        <h3 style={{ color: '#fff', marginBottom: '8px' }}>Configure Financial Report</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
          Map your data columns to generate a professional financial analysis dashboard.
        </p>

        <div className="config-grid">
          <div className="input-group">
            <label>Category / Segment Column</label>
            <select value={categoryCol} onChange={e => setCategoryCol(e.target.value)}>
              <option value="">Select...</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Period / Quarter Column</label>
            <select value={periodCol} onChange={e => setPeriodCol(e.target.value)}>
              <option value="">Select...</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Value / Amount Column</label>
            <select value={valueCol} onChange={e => setValueCol(e.target.value)}>
              <option value="">Select...</option>
              {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button className="btn-next" style={{ marginTop: '24px' }} onClick={handleGenerate}>
          Generate Dashboard
        </button>
      </div>
    );
  }

  const grandTotal = kpiData.length > 0 ? kpiData[0].total : 0;

  return (
    <div className="report-wrapper fade-in">
      {/* Download Toolbar */}
      <div className="report-toolbar">
        <h3 style={{ color: '#fff', margin: 0 }}>Financial Analysis Dashboard</h3>
        <div className="download-actions">
          <button className="btn-secondary" onClick={() => setIsConfigured(false)}>Reconfigure</button>
          <button className="download-btn pdf" onClick={downloadPDF}>
            <FileText size={16} /> Download PDF
          </button>
          <button className="download-btn img" onClick={downloadImage}>
            <Image size={16} /> Download Image
          </button>
        </div>
      </div>

      {/* The actual report area (captured for download) */}
      <div ref={reportRef} className="report-canvas">
        {/* KPI Summary Cards */}
        <div className="kpi-row">
          {kpiData.map((kpi, idx) => (
            <div className="kpi-card" key={kpi.name}>
              <div className="kpi-header">
                <span className="kpi-title">{kpi.name}</span>
              </div>
              <div className="kpi-total">{fmt(kpi.total)}</div>
              <div className="kpi-chart">
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart data={kpiCharts[kpi.name] || []}>
                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                      {(kpiCharts[kpi.name] || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[idx % COLORS.length]} fillOpacity={0.4 + (i * 0.1)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="kpi-sub-metrics">
                <div className="kpi-sub">
                  <span className="kpi-sub-value">{fmt(kpi.avg)}</span>
                  <span className="kpi-sub-label">Average</span>
                </div>
                <div className="kpi-sub">
                  <span className="kpi-sub-value">{kpi.count}</span>
                  <span className="kpi-sub-label">Records</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Segment Revenue Table */}
        <div className="segment-block">
          <div className="segment-header">
            <span className="segment-title">Segment {valueCol} | By {categoryCol} | Grouped by {periodCol}</span>
          </div>

          <div className="segment-table-wrapper">
            <table className="segment-table">
              <thead>
                <tr>
                  <th className="seg-col-label">{categoryCol}</th>
                  {segmentTable.periods.map(per => (
                    <th key={per}>
                      <div className="seg-period-header">{per}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {segmentTable.categories.map(cat => (
                  <tr key={cat}>
                    <td className="seg-category">{cat}</td>
                    {segmentTable.periods.map(per => (
                      <td key={per} className="seg-value">{fmtTable(segmentTable.matrix[cat]?.[per] || 0)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="seg-totals-row">
                  <td className="seg-category"><strong>Totals</strong></td>
                  {segmentTable.periods.map(per => (
                    <td key={per} className="seg-value seg-total-value"><strong>{fmtTable(periodTotals[per] || 0)}</strong></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
