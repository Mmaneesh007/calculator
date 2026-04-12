import { useState, useEffect } from 'react';

const Calculator = ({ isPremium, onEqualPress, pendingCalculation, singleUnlockTrigger, onSingleUnlockConsumed }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewInput, setIsNewInput] = useState(true);
  const [isHiddenMode, setIsHiddenMode] = useState(false);

  useEffect(() => {
    if (singleUnlockTrigger && isHiddenMode && pendingCalculation !== null) {
      setDisplay(String(pendingCalculation));
      setIsHiddenMode(false);
      onSingleUnlockConsumed();
    } else if (isPremium && isHiddenMode && pendingCalculation !== null) {
      setDisplay(String(pendingCalculation));
      setIsHiddenMode(false);
    }
  }, [isPremium, isHiddenMode, pendingCalculation, singleUnlockTrigger, onSingleUnlockConsumed]);

  const handleNumber = (num) => {
    if (isNewInput) {
      setDisplay(num);
      setIsNewInput(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
    if (isHiddenMode) setIsHiddenMode(false);
  };

  const handleOperator = (op) => {
    if (!isNewInput) {
      calculateInternally();
    }
    setExpression(display + ' ' + op);
    setIsNewInput(true);
    if (isHiddenMode) setIsHiddenMode(false);
  };

  const calculateInternally = () => {
    if (!expression) return parseFloat(display);
    
    // simple internal logic
    const prev = parseFloat(expression.split(' ')[0]);
    const current = parseFloat(display);
    const op = expression.split(' ')[1];
    
    let res = 0;
    switch (op) {
      case '+': res = prev + current; break;
      case '-': res = prev - current; break;
      case '*': res = prev * current; break;
      case '÷': res = prev / current; break;
      default: return current;
    }
    return res;
  };

  const calculate = () => {
    if (!expression) return;
    
    const res = calculateInternally();
    
    setExpression(expression + ' ' + display + ' =');
    setIsNewInput(true);

    const canShow = onEqualPress(res);
    if (canShow) {
      setDisplay(String(res));
    } else {
      setIsHiddenMode(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setIsNewInput(true);
    setIsHiddenMode(false);
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-container">
        {isPremium && <div className="premium-badge">PRO</div>}
        
        <div className="display">
          <div className="expression">{expression}</div>
          <div className={`result ${isHiddenMode ? 'blurred' : ''}`}>
            {isHiddenMode ? '???' : display}
          </div>
        </div>

        <div className="keypad">
          <button className="btn clear" onClick={clear}>C</button>
          <button className="btn operator" onClick={() => handleOperator('÷')}>÷</button>
          <button className="btn operator" onClick={() => handleOperator('*')}>×</button>
          <button className="btn operator" onClick={() => handleOperator('-')}>−</button>
          
          <button className="btn" onClick={() => handleNumber('7')}>7</button>
          <button className="btn" onClick={() => handleNumber('8')}>8</button>
          <button className="btn" onClick={() => handleNumber('9')}>9</button>
          <button className="btn operator" onClick={() => handleOperator('+')} style={{ gridRow: 'span 2', height: '156px' }}>+</button>
          
          <button className="btn" onClick={() => handleNumber('4')}>4</button>
          <button className="btn" onClick={() => handleNumber('5')}>5</button>
          <button className="btn" onClick={() => handleNumber('6')}>6</button>
          
          <button className="btn" onClick={() => handleNumber('1')}>1</button>
          <button className="btn" onClick={() => handleNumber('2')}>2</button>
          <button className="btn" onClick={() => handleNumber('3')}>3</button>
          <button className="btn equals" onClick={calculate} style={{ gridRow: 'span 2', height: '156px' }}>=</button>
          
          <button className="btn" onClick={() => handleNumber('0')} style={{ gridColumn: 'span 2', width: '100%' }}>0</button>
          <button className="btn" onClick={() => handleNumber('.')}>.</button>
        </div>
      </div>
    </div>
  );
};
export default Calculator;
