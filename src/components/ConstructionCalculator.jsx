// src/components/ConstructionCalculator.jsx
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ConstructionCalculator = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Concrete', qty: 10, unit: 'Cubic Yard', price: 4500 },
    { id: 2, name: 'Rebar', qty: 50, unit: 'Pieces', price: 600 }
  ]);

  const [project, setProject] = useState("Residential Build");

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: 0, unit: '', price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const grandTotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Bill of Materials Estimate`, 14, 22);
    doc.setFontSize(14);
    doc.text(`Project: ${project}`, 14, 32);
    
    const tableData = items.map(item => [
      item.name || 'Unnamed Item', 
      `${item.qty} ${item.unit}`, 
      `INR ${item.price}`, 
      `INR ${(item.qty*item.price).toLocaleString('en-IN')}`
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Material', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      foot: [['', '', 'Grand Total', `INR ${grandTotal.toLocaleString('en-IN')}`]],
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }
    });
    doc.save(`BOM_${project}.pdf`);
  };

  return (
    <div className="pro-calculator bom-mode w-full max-w-4xl">
      <div className="flex-between">
        <h2>Bill of Materials (BOM)</h2>
        <button className="btn-export-small" onClick={handleExportPDF}>Export PDF</button>
      </div>

      <div className="input-group mb-6" style={{ maxWidth: '300px' }}>
        <label>Project Name</label>
        <input type="text" value={project} onChange={(e) => setProject(e.target.value)} />
      </div>

      <div className="bom-table-container">
        <div className="bom-header">
          <div className="col-name">Material</div>
          <div className="col-qty">Quantity</div>
          <div className="col-unit">Unit</div>
          <div className="col-price">Price (₹)</div>
          <div className="col-total">Line Total (₹)</div>
          <div className="col-action"></div>
        </div>

        <div className="bom-body">
          {items.map((item) => (
            <div key={item.id} className="bom-row fade-in">
              <div className="col-name">
                <input type="text" value={item.name} placeholder="Item Name" onChange={(e) => handleChange(item.id, 'name', e.target.value)} />
              </div>
              <div className="col-qty">
                <input type="number" value={item.qty === 0 ? '' : item.qty} onChange={(e) => handleChange(item.id, 'qty', Number(e.target.value))} />
              </div>
              <div className="col-unit">
                <input type="text" value={item.unit} placeholder="Unit" onChange={(e) => handleChange(item.id, 'unit', e.target.value)} />
              </div>
              <div className="col-price">
                <input type="number" value={item.price === 0 ? '' : item.price} onChange={(e) => handleChange(item.id, 'price', Number(e.target.value))} />
              </div>
              <div className="col-total">
                {(item.qty * item.price).toLocaleString('en-IN')}
              </div>
              <div className="col-action">
                <button className="btn-icon delete" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bom-footer">
        <button className="btn-add-row" onClick={handleAddItem}>
          <Plus size={16} /> Add Material
        </button>
        <div className="grand-total">
          <span>Grand Total:</span>
          <span className="total-value">₹ {grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};
export default ConstructionCalculator;
