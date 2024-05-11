import React, { useState } from 'react';
import Plot from 'react-plotly.js';


const gc= 4.17e8
// Function to calculate beta_0
function calculateG(rho_0, nu_0, Ac) {
  return (rho_0*nu_0)/Ac;
}
function calculateBeta0(G, phi, mu, D_p, rho_0) {
  return ((G*(1-phi))/(gc*rho_0*D_p*(phi**3)))*(((150*(1-phi)*mu)/D_p) +1.75*G);
}

// Function to calculate alpha
function calculateAlpha(beta_0, A_c, rho_c, phi, P_0) {
  return (2 * (beta_0/(144*14.7))) / (A_c * rho_c * (1 - phi) * P_0);
}

  
// Usage example (replace with your actual values)
// const Ac = 0.01414 // Area , input
// const L = 60; // Length , input 
// const rho_c = 120; // Solid density (SI), input  
// const D_p = 0.0208; // Particle diameter (m), input 
// const mu = 0.0673; // Viscosity (Pa*s), input 
// const nu_0 = 252.8; // Volumetric flow rate , input
// const rho_0 = 0.413; // Initial gas density (kg/m^3), input 
// const P_0 = 10; // Initial pressure (Pa), input
// const k = 100;// Rate constant (1/s), input 
// const T = 533 ; // input 
// const phi = 0.45 // input


const PressureDropCalculator = () => {
  // State variables to hold input values and results

  const [plotData, setPlotData] = useState([]);
  // Add more state variables for other input parameters
 const [Ac, setArea] = useState(0.01414);
const [L, setLength] = useState(60);
const [density_cat, setDensity_cat] = useState(120);
const [diameter_particle, setDiameter_particle] = useState(0.0208);
const [viscosity, setViscosity] = useState(0.0673);
const [volFlowRate, setVolFlowRate] = useState(252.8);
const [inGasDensity, setInGasDensity] = useState(0.413);
const [inPressure, setInPressure] = useState(10);
const [spRate, setSpRate] = useState(10); // (L/mol-s)
const [Temp, setTemp] = useState(533); // (K)
const [voidFraction, setVoidFraction] = useState(0.45);
  // State variables to hold calculated results
  
const R = 0.00289813 // SI
const C_a0 = inPressure/(R*Temp) ; // Entering concentration of A
const E = 0; // Factor depending on reaction = yA0*delta


const G = calculateG(inGasDensity, volFlowRate, Ac);
// console.log("G: " + G )
const beta_0 = calculateBeta0(G, voidFraction, viscosity, diameter_particle, inGasDensity );
// console.log("beta_0: " + beta_0 )

const alpha = calculateAlpha(beta_0, Ac, density_cat, voidFraction, inPressure);
// console.log("alpha: " + alpha )




var rk4 = require('ode-rk4')
// y[0] = P/P0 = y, y[1] = X, t = W , 
var deriv = function(dydt, y, t) {
    dydt[0] = -1*(alpha  / (2*y[0]) )* (1+E*y[1]);
    dydt[1] = ((spRate * C_a0) / (volFlowRate )) * y[0]**2 * ((1 - y[1]) / (1 + E * y[1]))**2; 
}

// Example usage of derivative functions (replace X and P with actual values)
var y0 = [1, 0] // initial conditions for y1 and y2
var n = (1-voidFraction)*density_cat*Ac*L/0.1
var t0 = 0
var dt = 0.1


var dataY0 = [];
var dataX = [];
var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  dataY0.push(integrator.y[0]);
  dataX.push(integrator.y[1]);
}
  

  // Function to handle calculation
  const calculatePressureDrop = () => {
    // ... (your calculation logic here)

    setPlotData([
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataY0,
        mode: 'lines',
        name: 'y',
      },
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataX,
        mode: 'lines',
        name: 'X',
      },
      
     
    ]);
    console.log(plotData)
  };

  const inputs = [
    { name: 'Area', state: Ac, setState: setArea },
    { name: 'Length', state: L, setState: setLength },
    { name: 'Catalyst Density', state: density_cat, setState: setDensity_cat },
    { name: 'Particle Diameter', state: diameter_particle, setState: setDiameter_particle },
    { name: 'Viscosity', state: viscosity, setState: setViscosity },
    { name: 'Volume Flow Rate', state: volFlowRate, setState: setVolFlowRate },
    { name: 'Inlet Gas Density', state: inGasDensity, setState: setInGasDensity },
    { name: 'Inlet Pressure', state: inPressure, setState: setInPressure },
    { name: 'Specific Rate (L/mol-s)', state: spRate, setState: setSpRate },
    { name: 'Temperature (K)', state: Temp, setState: setTemp },
    { name: 'Void Fraction', state: voidFraction, setState: setVoidFraction },
  ];
  return (
    // <div>
    //   <h2>Pressure Drop Calculator for PBR Reactors</h2>
    //          {inputs.map((input, index) => (
    //     <div className="input-field" key={index}>
    //       <label htmlFor={input.name}>{input.name}:</label>
    //       <input
    //         type="number"
    //         id={input.name}
    //         value={input.state}
    //         onChange={(e) => input.setState(e.target.value)}
    //       />
    //     </div>
    //   ))}
    //   {/* Add more input fields for other parameters */}
    //   {/* <button onClick={calculatePressureDrop}>Calculate</button> */}
    //   <button 
    //     onClick={calculatePressureDrop}
    //     style={{ display: 'block', margin: '20px auto', padding: '10px', fontSize: '16px' }}
    //   >
    //     Calculate
    //   </button>
    //   <Plot
    //     data={plotData}
    //     layout={{width: 500, height: 500, title: 'Conversion(X) and y(P/P0) vs Weight of Catalyst'}}
    //   />
      
    // </div>


    <div>
  <h2 style={{ textAlign: 'center', color: '#333' }}>Pressure drop in isothermal condition, calculation of alpha</h2>
  <h2 style={{ textAlign: 'center', color: '#333' }}>2A  &rarr; B</h2>
  <h2 style={{ textAlign: 'center', color: '#333' }}> Rate ~ C<sub>a</sub><sup>2</sup></h2>
  

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

export default PressureDropCalculator;



