import React, { useState } from 'react';
import Plot from 'react-plotly.js';


var rk4 = require('ode-rk4')
const k_ = 0.0266;
const fa0 = 5
const alpha = 0.0002
const epsilon = -0.15
const Hr = 20000
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
  var T0 = 450
  var v0 = 20
  var Uarho = 0.08
  var Ta = 293
  var P0 = 1013250
  var Ca0 = P0/8.314/T0
  var Ca = Ca0*(1-y[0])/(1+y[0])*T0/y[1]
  var k = 0.133*Math.exp(31400/8.314*(1/T0 - 1/y[1])) 
  var ra = -k*Ca
  dydt[0] = k*(1-y[0])/(1+y[0])*T0/y[1]/v0
  dydt[1] = (Uarho*(Ta-y[1]) + ra*20000)/v0/Ca0/40
}

var y0 = [0, 450] // initial conditions for y1 and y2
var n = 5000
var t0 = 0
var dt = 0.01


var dataX = [];
var datay = [];
var dataT = [];
var dataTa = []
var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  // console.log(integrator.y[0])
  dataX.push(integrator.y[0]);
  dataT.push(integrator.y[1]);
  // dataT.push(450+500*integrator.y[0]);
  // dataTa.push(integrator.y[3]);
}
// for (var i = 0; i < n; i++) {
//   integrator = integrator.step()
//   console.log(`y1: ${integrator.y[0]}, y2: ${integrator.y[1]}`)
// } 

// press_drop();
const ConstantHeatEx = () => {
  // State variables to hold input values and results
  const [alpha, setAlpha] = useState(0);
  const [fa0, setFa0] = useState(0);
  const [E, setE] = useState(0);
  const [Ta, setTa] = useState(0);
  const [T0, setT0] = useState(0);
  const [P0, setP0] = useState(0);
  const [Uarho, setUarho] = useState(0);
  const [Kc_303, setKc_303] = useState(0);
  const [ka_310, setKa_310] = useState(0);
  const [CpA, setCpA] = useState(0);
  const [CpB, setCpB] = useState(0);
  const [CpC, setCpC] = useState(0);
  const [Hrx, setHrx] = useState(0);
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
    // console.log(plotData)
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '800px', padding: '20px' }}>
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

export default ConstantHeatEx;
function press_drop() {
  var dataY1 = [];
  var dataY2 = [];
  for (var i = 0; i < n; i++) {
    integrator = integrator.step();
    dataY1.push(integrator.y[0]);
    dataY2.push(integrator.y[1]);
  }
  // console.log(dataY1)
}

