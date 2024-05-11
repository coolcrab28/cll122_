import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './style.css'


var rk4 = require('ode-rk4')


const Isothermal = () => {
  // State variables to hold input values and results
  
  const [plotData, setPlotData] = useState([]);

  const [k_, setK_] = useState(0.0266);
  const [fa0, setFa0] = useState(1.08);
  const [alpha, setAlpha] = useState(0.0166);
  const [epsilon, setEpsilon] = useState( -0.15);

  const inputs = [
    { name: 'SpecificRate(k)', state: k_, setState: setK_ },
    { name: 'InitialFLowRate of A(Fa0)', state: fa0, setState: setFa0 },
    { name: 'Alpha', state: alpha, setState: setAlpha },
    { name: 'Epsilon', state: epsilon, setState: setEpsilon },
  ];
  // Add more state variables for other input parameters

  // State variables to hold calculated results
  
function deriv(dydt, y, t) {
    dydt[0] = k_*(1-y[0])/fa0/(1+epsilon*y[0])*y[1]
    dydt[1] = -alpha*(1+epsilon*y[0])/(2*y[1])
}

var y0 = [0, 1] 
var n = 600
var t0 = 0
var dt = 0.1

var dataX = [];
var datay = [];

  // Function to handle calculation
  const calculatePressureDrop = () => {
    var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  dataX.push(integrator.y[0]);
  datay.push(integrator.y[1]);
}

    
    // ... (your calculation logic here)

    setPlotData([
        {
            x: Array.from({length: n}, (_, i) => i * dt),
            y: dataX,
            mode: 'lines',
            name: 'Conversion',
          },
          {
            x: Array.from({length: n}, (_, i) => i * dt),
            y: datay,
            mode: 'lines',
            name: 'y',
          },
     
    //   {
    //     x: Array.from({length: n}, (_, i) => i * dt),
    //     y: dataT,
    //     mode: 'lines',
    //     name: 'Conversion',
    //   },
      
    ]);
    
  };
  
  
  return (
  // <div>
  //      <h2 style={{ textAlign: 'center', color: '#333' }}>Weight of Catalyst required for given conversion.</h2>
  //      <h4> Reaction: A+0.5B - &gt; Products ;  Rate ~ P<sub>a</sub><sup>0.33</sup>* P<sub>b</sub><sup>0.67</sup> </h4>
  //      {inputs.map((input, index) => (
  //       <div className="input-field" key={index}>
  //         <label htmlFor={input.name}>{input.name}:</label>
  //         <input
  //           type="number"
  //           id={input.name}
  //           value={input.state}
  //           onChange={(e) => input.setState(e.target.value)}
  //         />
  //       </div>
  //     ))}
  //   <button 
  //       onClick={calculatePressureDrop}
  //       style={{ display: 'block', margin: '20px auto', padding: '10px', fontSize: '16px' }}
  //     >
  //       Calculate
  //     </button>
  //   <Plot
  //     data={plotData}
  //     layout={{width: 500, height: 500, title: 'Conversion(X) and y(P/P0) vs Weight of Catalyst'}}
  //   />
  // </div>


  <div>
  <h2 style={{ textAlign: 'center', color: '#333' }}>Pressure Drop Calculator Isothermal condtion</h2>
  <h2 style={{ textAlign: 'center', color: '#333' }}>A + 0.5B &rarr; P</h2>
  <h2 style={{ textAlign: 'center', color: '#333' }}> Rate ~ P<sub>a</sub><sup>0.33</sup>* P<sub>b</sub><sup>0.67</sup></h2>
  

  <h5 style={{ textAlign: 'center', color: '#333' }}>Weight of Catalyst required for given conversion</h5>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem', // Add some margin to the top
    marginBottom: '2rem', // Add some margin to the bottom
  }}>
    {inputs.map((input, index) => (
      <div className="input-field" key={index} style={{
        marginBottom: '1rem',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <label htmlFor={input.name} style={{
          marginBottom: '0.5rem',
        }}>{input.name}:</label>
        <input
          type="number"
          id={input.name}
          value={input.state}
          onChange={(e) => input.setState(parseFloat(e.target.value))}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
          }}
        />
      </div>
    ))}

    <button
      onClick={calculatePressureDrop}
      style={{ display: 'block', margin: '20px auto', padding: '10px', fontSize: '16px' }}
    >
      Calculate
    </button>
  </div>

  <div className="graph-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
    <div>
      <Plot
        data={plotData}
        layout={{ width: 500, height: 500, title: 'Conversion/y vs Weight of Catalyst' }}
      />
    </div>
    
  </div>
</div>
);
};

export default Isothermal;
