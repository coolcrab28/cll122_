import React, { useState } from 'react';
import Plot from 'react-plotly.js';
// import './style_conc.css'



var rk4 = require('ode-rk4')

// var deriv = function(dydt, y, t) {

//     var T0 = 330
//     var Uarho = 0.5
//     var Mc = 1000
//     var Cpmc = 18
//     var alpha = 0.0002
//     var Hr = -20000
//     var Fa0 = 5
//     var thetaI = 1
//     var CpI = 40
//     var CpA = 20
//     var thetaB = 1
//     var CpB = 20
//     var Cto = 0.3
//     var Ea = 25000
//     var Kc = 1000*Math.exp(Hr/1.987*(1/303-1/y[2]))
//     var ka = 0.004*Math.exp(Ea/1.987*(1/310-1/y[2]))
//     var ya0 = 1/(1+ thetaB + thetaI)
//     var Xe = Math.pow(Kc, 0.5)/(2+Math.pow(Kc, 0.5))
//     var Ca0 = ya0*Cto
//     var sumcp = (thetaI*CpI + thetaB*CpB + CpA)
//     var Ca = Ca0*(1-y[3])*y[1]*T0/y[2]
//     var Cb = Ca0*(1-y[3])*y[1]*T0/y[2]
//     var Cc = Ca0*2*(y[3])*y[1]*T0/y[2]
//     var ra = -ka*(Ca*Cb - Math.pow(Cc, 2)/Kc)
//     dydt[0] = Uarho*(y[2] - y[0])/Mc/Cpmc
//     dydt[1] = -alpha/2*(y[2]/T0)/y[1]
//     dydt[2] = (Uarho*(T0-y[2]) + (-ra)*(-Hr))/(Fa0*sumcp)
//     dydt[3] = -ra/Fa0
// }

// var y0 = [320, 1, 330, 0] // initial conditions for y1 and y2
// var n = 4500
// var t0 = 0
// var dt = 1


// var dataTa = [];
// var datay = [];
// var dataT = [];
// var dataX = []

// for (var i = 0; i < n; i++) {
//   integrator = integrator.step()
//   console.log(`y1: ${integrator.y[0]}, y2: ${integrator.y[1]}`)
// } 

// press_drop();
const VariableCoolantHex = () => {
  // State variables to hold input values and results
 

  const [plotDataTemp, setPlotDataTemp] = useState([]);
  const [plotDataConv, setPlotDataConv] = useState([]);
  const [plotDatay, setPlotDatay] = useState([]);

  // Add more state variables for other input parameters

  // State variables to hold calculated results
  
  const [T0, setT0] = useState(330);
  const [Uarho, setUarho] = useState(0.5);
  const [Mc, setMc] = useState(1000);
  const [Cpmc, setCpmc] = useState(18);
  const [alpha, setAlpha] = useState(0.0002);
  const [Hr, setHr] = useState(-20000);
  const [Fa0, setFa0] = useState(5);
  const [thetaI, setThetaI] = useState(1);
  const [CpI, setCpI] = useState(40);
  const [CpA, setCpA] = useState(20);
  const [thetaB, setThetaB] = useState(1);
  const [CpB, setCpB] = useState(20);
  const [Cto, setCto] = useState(0.3);
  const [Ea, setEa] = useState(25000);
  const [Ta, setTa] = useState(320);

  const inputs = [
    { name: 'Initial Temp', state: T0, setState: setT0 },
    {name: 'Coolant Temp', state: Ta, setState: setTa},
    { name: 'Total Heat Transfer Coeddicient(Uarho)', state: Uarho, setState: setUarho },
    { name: 'Mass flow rate of coolant(Mc)', state: Mc, setState: setMc },
    { name: 'Heat Capacity of coolant(Cpmc)', state: Cpmc, setState: setCpmc },
    { name: 'Alpha', state: alpha, setState: setAlpha },
    { name: 'Heat of Reaction(Hr)', state: Hr, setState: setHr },
    { name: 'Initial Flow Rate of A(Fa0)', state: Fa0, setState: setFa0 },
    { name: 'ThetaI', state: thetaI, setState: setThetaI },
    { name: 'Heat capacity of Inert Component (CpI)', state: CpI, setState: setCpI },
    { name: 'Heat capacity of Reactant A (CpA)', state: CpA, setState: setCpA },
    { name: 'ThetaB', state: thetaB, setState: setThetaB },
    { name: 'Heat capacity of reactant B (CpB)', state: CpB, setState: setCpB },
    { name: 'Total Initial concentration of feed(Cto)', state: Cto, setState: setCto },
    { name: 'Activation Energy of ReactEa', state: Ea, setState: setEa },
  ];

  // var alpha = 0.0002
  // var T0 = 330
  // var Uarho = 0.5
  // var Mc = 1000
  // var Cpmc = 18
  // var Hr = -20000
  // var Fa0 = 5
  // var thetaI = 1
  // var CpI = 40
  // var CpA = 20
  // var thetaB = 1
  // var CpB = 20
  // var Cto = 0.3
  // var Ea = 25000



var deriv = function(dydt, y, t) {
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
    dydt[2] = (Uarho*(Ta-y[2]) + (-ra)*(-Hr))/(Fa0*sumcp)
    dydt[3] = -ra/Fa0
}




var y0 = [Ta, 1, T0, 0] 
var n = 4500
var t0 = 0
var dt = 1


var dataTa = [];
var datay = [];
var dataT = [];
var dataX = []
  // Function to handle calculation
  const calculatePressureDrop = () => {

    var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  // console.log(integrator.y[0])
  dataT.push(integrator.y[2]);
  dataX.push(integrator.y[3]);
  datay.push(integrator.y[1]);
}
    
    // ... (your calculation logic here)

    setPlotDataConv([
      
      
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataX,
        mode: 'lines',
        name: 'Conversion',
      },
      
    ]);
    setPlotDataTemp([
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataT,
        mode: 'lines',
        name: 'Temperature',
      },

    ]);
    setPlotDatay([
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: datay,
        mode: 'lines',
        name: 'P/P0',
      },
    ]);

    
    
  };
  
  return (
    <div>
  <h2 style={{ textAlign: 'center', color: '#333' }}>Pressure Drop Calculator Constant coolant HeX</h2>
  <h2 style={{ textAlign: 'center', color: '#333' }}>A+B ⇌ 2C</h2>

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
        data={plotDataTemp}
        layout={{ width: 500, height: 500, title: 'Temp vs Weight of Catalyst' }}
      />
    </div>
    <div>
      <Plot
        data={plotDataConv}
        color="red"
        layout={{ width: 500, height: 500, title: 'Conversion vs Weight of Catalyst' }}
      />
    </div>
    <div>
      <Plot data={plotDatay} layout={{ width: 500, height: 500, title: 'P/P0 vs Weight of Catalyst' }} />
    </div>
  </div>
</div>
  );
};

export default VariableCoolantHex;
