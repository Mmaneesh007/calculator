// src/components/DeveloperCalculator.jsx
import { useState } from 'react';

const DeveloperCalculator = () => {
  const [dec, setDec] = useState('0');
  const [hex, setHex] = useState('0');
  const [bin, setBin] = useState('0');
  const [oct, setOct] = useState('0');

  const updateValues = (value, radix) => {
    let decimalValue = parseInt(value, radix);
    if (isNaN(decimalValue)) decimalValue = 0;
    
    setDec(decimalValue.toString(10));
    setHex(decimalValue.toString(16).toUpperCase());
    setBin(decimalValue.toString(2));
    setOct(decimalValue.toString(8));
  };

  const handleDecChange = (e) => {
    setDec(e.target.value);
    updateValues(e.target.value, 10);
  };
  
  const handleHexChange = (e) => {
    setHex(e.target.value);
    updateValues(e.target.value, 16);
  };

  const handleBinChange = (e) => {
    setBin(e.target.value);
    updateValues(e.target.value, 2);
  };
  
  const handleOctChange = (e) => {
    setOct(e.target.value);
    updateValues(e.target.value, 8);
  };

  return (
    <div className="pro-calculator developer-mode">
      <h2>Developer Mode</h2>
      <div className="input-group">
        <label>HEX</label>
        <input type="text" value={hex} onChange={handleHexChange} />
      </div>
      <div className="input-group">
        <label>DEC</label>
        <input type="number" value={dec} onChange={handleDecChange} />
      </div>
      <div className="input-group">
        <label>OCT</label>
        <input type="text" value={oct} onChange={handleOctChange} />
      </div>
      <div className="input-group">
        <label>BIN</label>
        <input type="text" value={bin} onChange={handleBinChange} />
      </div>

      <div className="bitwise-operations">
        <h3>Bitwise Operations (Based on DEC)</h3>
        <div className="btn-group">
          <button onClick={() => updateValues(parseInt(dec) << 1, 10)}>Left Shift (&lt;&lt; 1)</button>
          <button onClick={() => updateValues(parseInt(dec) >> 1, 10)}>Right Shift (&gt;&gt; 1)</button>
          <button onClick={() => updateValues(~parseInt(dec), 10)}>NOT (~)</button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCalculator;
