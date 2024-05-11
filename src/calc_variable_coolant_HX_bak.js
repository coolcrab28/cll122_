import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './style.css'

var rk4 = require('ode-rk4')

// function Kc (T){
//   return 1000*Math.exp(-Hr/1.987*(1/303-1/T))
// }
// function ka (T)  {
//   return 0.002*Math.exp(25000/1.987*(1/310-1/T))
// }

// const Ca = (T, y, X) => {
//   return 0.1*(1-X)*y*325/T
// }

// const Cb = (T, y, X) => {
//   return 0.1*(2-X)*y*325/T
// }
// const Cc = (T, y, X) => {
//   return 0.1*2*X*y*325/T
// }

// function T(X){
//   return 325+200*X
// }

// function ra(ka, Ca, Cb, Cc, Kc){
//   return -ka*(Ca*Cb - Cc*Cc/Kc)
// }
// var deriv = function(dydt, y, t) {
//     dydt[0] = -ra(ka(T(y[0])), Ca(T(y[0]), y[1], y[0]), Cb(T(y[0]), y[1], y[0]), Cc(T(y[0]), y[1], y[0]), Kc(y[0]))/fa0
//     dydt[1] = -alpha/2/y[1]*(T(y[0])/325)
// }

var deriv = function(dydt, y, t) {
//   var T0 = 450
//   var v0 = 20
//   var Uarho = 0.08
//   var Ta = 293
//   var P0 = 1013250
//   var Ca0 = P0/8.314/T0
//   var Ca = Ca0*(1-y[0])/(1+y[0])*T0/y[1]
//   var k = 0.133*Math.exp(31400/8.314*(1/T0 - 1/y[1])) 
//   var ra = -k*Ca
//   dydt[0] = k*(1-y[0])/(1+y[0])*T0/y[1]/v0
//   dydt[1] = (Uarho*(Ta-y[1]) + ra*20000)/v0/Ca0/40
    var T0 = 330
    var Uarho = 0.5
    var Mc = 1000
    var Cpmc = 18
    var alpha = 0.0002
    var Hr = -20000
    var Fa0 = 5
    var thetaI = 1
    var CpI = 40
    var CpA = 20
    var thetaB = 1
    var CpB = 20
    var Cto = 0.3
    var Ea = 25000
    var Kc = 1000*Math.exp(Hr/1.987*(1/303-1/y[2]))
    var ka = 0.004*Math.exp(Ea/1.987*(1/310-1/y[2]))
    var ya0 = 1/(1+ thetaB + thetaI)
    var Xe = Math.pow(Kc, 0.5)/(2+Math.pow(Kc, 0.5))
    var Ca0 = ya0*Cto
    var sumcp = (thetaI*CpI + thetaB*CpB + CpA)
    var Ca = Ca0*(1-y[3])*y[1]*T0/y[2]
    var Cb = Ca0*(1-y[3])*y[1]*T0/y[2]
    var Cc = Ca0*2*(y[3])*y[1]*T0/y[2]
    var ra = -ka*(Ca*Cb - Math.pow(Cc, 2)/Kc)
    dydt[0] = Uarho*(y[2] - y[0])/Mc/Cpmc
    dydt[1] = -alpha/2*(y[2]/T0)/y[1]
    dydt[2] = (Uarho*(y[0]-y[2]) + (-ra)*(-Hr))/(Fa0*sumcp)
    dydt[3] = -ra/Fa0
}

var y0 = [320, 1, 330, 0] // initial conditions for y1 and y2
var n = 45000
var t0 = 0
var dt = 0.1


var dataTa = [];
var datay = [];
var dataT = [];
var dataX = []
var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  console.log(integrator.y[0])
  dataT.push(integrator.y[2]);
  // dataT.push(450+500*integrator.y[0]);
  // dataTa.push(integrator.y[3]);
}
// for (var i = 0; i < n; i++) {
//   integrator = integrator.step()
//   console.log(`y1: ${integrator.y[0]}, y2: ${integrator.y[1]}`)
// } 

// press_drop();
const VariableCoolantHex = () => {
  // State variables to hold input values and results
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [voidFraction, setVoidFraction] = useState('');
  const [diameter_particle, setDiameter_particle] = useState('');
  const [viscosity, setViscosity] = useState('');
  const [density, setDensity] = useState('');
  const [massFlowRate, setMassFlowRate] = useState('');
  const [initialPressure, setInitialPressure] = useState('');
  const [initialTemperature, setInitialTemperature] = useState('');
  const [pressureDrop, setPressureDrop] = useState(null);
  const [plotData, setPlotData] = useState([]);
  // Add more state variables for other input parameters

  // State variables to hold calculated results
  

  // Function to handle calculation
  const calculatePressureDrop = () => {
    
    // ... (your calculation logic here)

    setPlotData([
      // {
      //   x: Array.from({length: n}, (_, i) => i * dt),
      //   y: dataX,
      //   mode: 'lines',
      //   name: 'Conversion',
      // },
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataT,
        mode: 'lines',
        name: 'Conversion',
      },
      
    ]);
    console.log(plotData)
  };
  
  const inputs = [
    { name: 'Diameter', state: diameter, setState: setDiameter },
    { name: 'Length', state: length, setState: setLength },
    { name: 'Void Fraction', state: voidFraction, setState: setVoidFraction },
    { name: 'Particle Diameter', state: diameter_particle, setState: setDiameter_particle },
    { name: 'Viscosity', state: viscosity, setState: setViscosity },
    { name: 'Density', state: density, setState: setDensity },
    { name: 'Mass Flow Rate', state: massFlowRate, setState: setMassFlowRate },
    { name: 'Initial Pressure', state: initialPressure, setState: setInitialPressure },
    { name: 'Initial Temperature', state: initialTemperature, setState: setInitialTemperature },
  ];
  return (
  <div>
       <h2 style={{ textAlign: 'center', color: '#333' }}>Pressure Drop Calculator for constant heat exchanger in PBR</h2>
       
    <button 
        onClick={calculatePressureDrop}
        style={{ display: 'block', margin: '20px auto', padding: '10px', fontSize: '16px' }}
      >
        Calculate
      </button>
    <Plot
      data={plotData}
      layout={{width: 500, height: 500, title: 'A Fancy Plot'}}
    />
  </div>
);
};

export default VariableCoolantHex;
