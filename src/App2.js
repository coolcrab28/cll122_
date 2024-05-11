// Define constants
const PI = Math.PI;
// const g_c = 32.174 * (lbm / ft) / (hr**2 * lbf); // Assuming lbm, ft, hr, lbf units

// Function to calculate void fraction (phi)
function calculateVoidFraction(rho_c, m, d, L) {
  const V_s = m / rho_c;
  const V_t = (PI * d**2 * L) / 4;
  return 1 - V_s / V_t;
}

// Function to calculate beta_0
function calculateBeta0(G, phi, mu, D_p, rho_0) {
  return ((G * (1 - phi)) / (rho_0  * D_p * phi**3)) * 
         ((150 * (1 - phi) * mu) / D_p + 1.75 * G);
}

// Function to calculate alpha
function calculateAlpha(beta_0, A_c, rho_c, phi, P_0) {
  return (2 * beta_0) / (A_c * rho_c * (1 - phi) * P_0);
}

// Function to calculate cross-sectional area (A_c)
function calculateCrossSectionalArea(d) {
  return (PI * d**2) / 4;
}

// Function to calculate superficial velocity (u_0)
function calculateSuperficialVelocity(nu_0, A_c) {
  return nu_0 / A_c;
}

// Function to calculate mass transfer coefficient (G)
function calculateMassTransferCoefficient(rho_0, u_0) {
  return rho_0 * u_0;
}

// Function to calculate conversion (X) derivative (dP/dW) - Equation 1
function derivativeP(X, P, alpha, P_0, E) {
  return - (alpha * P_0**2 / (2 * P)) * (1 - E * X);
}

// Function to calculate concentration derivative (dX/dW) - Equation 2
function derivativeX(X, P, K, C_a0, nu_0, P_0, E) {
  return (K * C_a0 / (nu_0 * P_0**2)) * P**2 * ((1 - X) / (1 + E * X))**2;
}


// Usage example (replace with your actual values)
const d = 0.1; // Diameter (m)
const L = 1; // Length (m)
const rho_s = 1000; // Solid density (kg/m^3)
const m = 50; // Catalyst mass (kg)
const D_p = 0.001; // Particle diameter (m)
const mu = 0.001; // Viscosity (Pa*s)
const nu_0 = 0.01; // Volumetric flow rate (m^3/s)
const rho_0 = 1; // Initial gas density (kg/m^3)
const P_0 = 101325; // Initial pressure (Pa)
const k = 0.1; // Rate constant (1/s)
const C_a0 = 1; // Entering mole fraction of A
const E = 0.5; // Factor depending on reaction

// Calculate void fraction
const phi = calculateVoidFraction(rho_s, m, d, L);

// Calculate other variables
const beta_0 = calculateBeta0(G, phi, mu, D_p, rho_0);
const A_c = calculateCrossSectionalArea(d);
const u_0 = calculateSuperficialVelocity(nu_0, A_c);
const G = calculateMassTransferCoefficient(rho_0, u_0);
// const alpha = calculateAlpha(beta_0, A_c, rho_c, phi, P_0);



var rk4 = require('ode-rk4')
// y[0] = P, y[1] = X, t = W , 
var deriv = function(dydt, y, t) {
    // dydt[0] = y[1];
    // dydt[1] = Math.exp(t);
    dydt[0] = -1*(alpha * P_0^2 / 2*y[0] )* (1-E*y[1]);
    dydt[1] = (k * C_a0 / (nu_0 * P_0**2)) * y[0]**2 * ((1 - y[1]) / (1 + E * X))**2; 
}
// Example usage of derivative functions (replace X and P with actual values)
var y0 = [P_0, 0] // initial conditions for y1 and y2
var n = 600
var t0 = 0
var dt = 0.1


var dataY1 = [];
var dataY2 = [];
var dataF = [];
var integrator = rk4(y0, deriv, t0, dt)
for (var i = 0; i < n; i++) {
  integrator = integrator.step();
  dataY1.push(integrator.y[0]);
  dataY2.push(integrator.y[1]);
  dataF.push((1+epsilon*integrator.y[0])/integrator.y[1]);
}
// for (var i = 0; i < n; i++) {
//   integrator = integrator.step()
//   console.log(`y1: ${integrator.y[0]}, y2: ${integrator.y[1]}`)
// } 

// press_drop();
const PressureDropCalculator = () => {
  // State variables to hold input values and results
  const [diameter, setDiameter] = useState('');
  const [length, setLength] = useState('');
  const [pressureDrop, setPressureDrop] = useState(null);
  const [plotData, setPlotData] = useState([]);
  // Add more state variables for other input parameters

  // State variables to hold calculated results
  

  // Function to handle calculation
  const calculatePressureDrop = () => {
    // ... (your calculation logic here)

    setPlotData([
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataY1,
        mode: 'lines',
        name: 'y1',
      },
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataY2,
        mode: 'lines',
        name: 'y2',
      },
      {
        x: Array.from({length: n}, (_, i) => i * dt),
        y: dataF,
        mode: 'lines',
        name: 'yjfvb',
      }
    ]);
    console.log(plotData)
  };

  return (
    <div>
      <h2>Pressure Drop Calculator for PBR Reactors</h2>
      <div>
        <label htmlFor="diameter">Diameter (d):</label>
        <input
          type="number"
          id="diameter"
          value={diameter}
          onChange={(e) => setDiameter(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="length">Length (L):</label>
        <input
          type="number"
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </div>
      {/* Add more input fields for other parameters */}
      <button onClick={calculatePressureDrop}>Calculate</button>
      <Plot
        data={plotData}
        layout={{width: 500, height: 500, title: 'A Fancy Plot'}}
      />
      
    </div>
  );
};

export default PressureDropCalculator;
function press_drop() {
  var dataY1 = [];
  var dataY2 = [];
  for (var i = 0; i < n; i++) {
    integrator = integrator.step();
    dataY1.push(integrator.y[0]);
    dataY2.push(integrator.y[1]);
  }
  console.log(dataY1)
}


