
import React, { useState } from 'react';
import ConstantHeatEx from './calc_constant_heat_exchange';
import VariableCoolantHex from './calc_variable_coolant_HX';
import IsothermalSingle from './calc_isothermal_with_single_input';
import Isothermal from './calc_isothermal_conversion';
import PressureDropCalculator from './calc_isothermal_with_single_input';
// Import other calculators here
import './style.css';

function App() {
  const [currentCalculator, setCurrentCalculator] = useState('');

  const renderCalculator = () => {
    switch (currentCalculator) {
      case 'constantHeatEx':
        return <ConstantHeatEx />;
      // Add more cases for other calculators here
      case 'variableHeatEx':
        return <VariableCoolantHex />;
      case 'Isothermal':
        return <Isothermal />;
      case 'IsothermalAlpha':
        return <PressureDropCalculator />;
      default:
        return (
          <div style={{ textAlign: 'center' }}>
            Select a calculator from the list above
          </div>
        );
    }
  };

  return (
   <div className="app-container" style={{ margin: '0 auto', maxWidth: '800px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
  <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2em', fontWeight: 'bold', marginBottom: '1em' }}>Calculator App</h1>
  <button 
      onClick={() => setCurrentCalculator('Isothermal')}
      style={{ margin: '10px',width: '100%', padding: '10px', fontSize: '1em', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
   >
    Isothermal Pressure Drop with double feed (Alpha Known)
    </button>
  <button
    onClick={() => setCurrentCalculator('IsothermalAlpha')}
    style={{ margin: '10px', width: '100%', padding: '10px', fontSize: '1em', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
  >
    Isothermal Pressure Drop Condition with single feed (Rate: 2nd order)
  </button>
  <button
    onClick={() => setCurrentCalculator('constantHeatEx')}
    style={{  margin: '10px', width: '100%', padding: '10px', fontSize: '1em', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
  >
    Constant Heat Exchange Calculator with pressure drop
  </button>
  {renderCalculator()}
</div>
  );
}

export default App;
