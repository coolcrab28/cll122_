import React, { useState } from 'react';
import { Select, Radio, InputNumber, Button, Card, Checkbox, Tooltip, Row, Col, Input } from 'antd';

const { Option } = Select;

function App() {
  const [selectedReactor, setSelectedReactor] = useState('isothermal');
  const [reactionType, setReactionType] = useState('irreversible');
  const [stoichiometry, setStoichiometry] = useState({ a: -1, b: -1, c: 1, d: 0 });
  const [reactionPhase, setReactionPhase] = useState('liquid');
  const [reactionRateConstant, setReactionRateConstant] = useState(1.0);
  const [equilibriumConstant, setEquilibriumConstant] = useState(1.0);

  const [pressure, setPressure] = useState(1.013); // in MPa
  const [temperature, setTemperature] = useState(450); // in Kelvin
  const [totalVolumetricFlowRate, setTotalVolumetricFlowRate] = useState(2.0); // m^3/s
  const [molarFlowOfA, setMolarFlowOfA] = useState(0.2); // mol/s
  const [componentConcentrations, setComponentConcentrations] = useState({
    A: { molarFraction: 0.5, concentration: 0.1 },
    B: { molarFraction: 0.5, concentration: 0.1 },
    C: { molarFraction: 0, concentration: 0 },
    D: { molarFraction: 0, concentration: 0 },
    Inert: { molarFraction: 0, concentration: 0 }
  });

  const [thermalCharacteristics, setThermalCharacteristics] = useState({
    A: { heatCapacity: 15.0, enthalpy: 20.0 },
    B: { heatCapacity: 15.0, enthalpy: 15.0 },
    C: { heatCapacity: 30.0, enthalpy: 41.0 },
    D: { heatCapacity: 0, enthalpy: 0 },
    Inert: { heatCapacity: 0, enthalpy: 0 }
  });
  const [referenceTemperature, setReferenceTemperature] = useState(273);
  const [reactorType, setReactorType] = useState('CSTR');

  const [heatTransferCoefficient, setHeatTransferCoefficient] = useState(10.0); // W/m^2K
  const [areaOfHeatExchange, setAreaOfHeatExchange] = useState(10.0); // m^2
  const [streamTemperature, setStreamTemperature] = useState(450.0); // K
  const [molarFlow, setMolarFlow] = useState(50.0); // mol/s
  const [heatCapacity, setHeatCapacity] = useState(1.0); // J/mol.K

  const [referenceTemperatureK, setReferenceTemperatureK] = useState(298.15);
  const [activationEnergy, setActivationEnergy] = useState(10000); // in J/mol
  const [referenceTemperatureA, setReferenceTemperatureA] = useState(300); // in K
  const [referenceRateConstant, setReferenceRateConstant] = useState(1e-2); // in (mol/m³)⁄s
  const [universalGasConstant, setUniversalGasConstant] = useState(8.314); // in J/(mol.K)

  const [allowed, setAllowed] = useState(false);

  const handleKeqm = () => { 
    return (Math.exp(((-activationEnergy / 1.987) * (1 / referenceTemperatureK - 1 / temperature))) * referenceRateConstant);
  }

  const handleJculation = () => {
    setAllowed(true);
  }

  return (
    <>
    <div className="App" style={{ margin: '20px' }}>
      <h1>Ideal Reactor Jculator</h1>
      <hr/>
      <Select defaultValue={selectedReactor} style={{ width: 200 }} onChange={setSelectedReactor}>
        <Option value="isothermal">Isothermal</Option>
        <Option value="adiabatic">Adiabatic</Option>
        <Option value="adiabatic_heat_exchange">Adiabatic with Heat Exchange</Option>
      </Select>

      <Card title="Step 1 : Reaction Kinetics" bordered={false} style={{ marginTop: 16 }}>
        <Card type="inner" title="1.1 Reaction Type">
          <Radio.Group onChange={e => setReactionType(e.target.value)} value={reactionType}>
            <Radio value="irreversible">Irreversible</Radio>
            <Radio value="reversible">Reversible</Radio>
          </Radio.Group>
        </Card>

        <Card type="inner" title="1.2 Stoichiometry" style={{ marginTop: 16 }}>
          {['a', 'b', 'c', 'd'].map(compound => (
            <div key={compound} style={{ marginBottom: 8 }}>
              <label>{compound.toUpperCase()}:</label>
              <InputNumber
                min={-10}
                max={10}
                defaultValue={stoichiometry[compound]}
                onChange={value => setStoichiometry(prev => ({ ...prev, [compound]: value }))}
                style={{ marginLeft: 8 }}
              />
            </div>
          ))}
        </Card>

        <Card type="inner" title="1.3 Reaction Phase" style={{ marginTop: 16 }}>
          <Radio.Group onChange={e => setReactionPhase(e.target.value)} value={reactionPhase}>
            <Radio value="liquid">Liquid</Radio>
            <Radio value="gas">Gas</Radio>
          </Radio.Group>
        </Card>

        <Card type="inner" title="1.4 - Parameters of Reaction Rate Constants" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card type="inner" title="Equilibrium Constant">
              <label>Reference Keq:</label>
              <InputNumber disabled={reactionType == 'irreversible'} min={0} step={0.01} value={equilibriumConstant} onChange={setEquilibriumConstant} style={{ width: '100%' }} />
              <label style={{ marginTop: 8 }}>Reference Temperature (K):</label>
              <InputNumber disabled={reactionType == 'irreversible'} min={0} step={0.1} value={referenceTemperatureK} onChange={setReferenceTemperatureK} style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card type="inner" title="Reaction Rate Constant (k)">
              <label>Activation Energy (E, J/mol):</label>
              <InputNumber min={0} step={100} value={activationEnergy} onChange={setActivationEnergy} style={{ width: '100%' }} />
              <label style={{ marginTop: 8 }}>Reference Temperature (Tref, K):</label>
              <InputNumber min={0} step={1} value={referenceTemperatureA} onChange={setReferenceTemperatureA} style={{ width: '100%' }} />
              <label style={{ marginTop: 8 }}>Reference Reaction Rate Constant (mol/m³/s):</label>
              <InputNumber min={0} step={0.0001} value={referenceRateConstant} onChange={setReferenceRateConstant} style={{ width: '100%' }} />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <label>Universal Constant of Gases (R, J/(mol.K)):</label>
            <InputNumber min={0} step={0.001} value={universalGasConstant} onChange={setUniversalGasConstant} style={{ width: '100%' }} />
          </Col>
        </Row>
        </Card>
      </Card>

      <Card title="Step 2 - Operating Conditions of the Reactor" bordered={false} style={{ marginTop: 16 }}>
        <Card type="inner" title="2.1 Reactor Operation">
          <div style={{ marginBottom: 16 }}>
            <label>Pressure (MPa): </label>
            <InputNumber min={0} defaultValue={pressure} onChange={setPressure} />
            <label style={{ marginLeft: 20 }}>Temperature (K): </label>
            <InputNumber min={0} defaultValue={temperature} onChange={setTemperature} />
          </div>
        </Card>

        <Card type="inner" title="2.2 Reactor Feed" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Checkbox checked onChange={(e) => console.log(e.target.checked)}>Total Volumetric flow rate</Checkbox>
              <Tooltip title="Enter the total volumetric flow rate in cubic meters per second">
                <InputNumber
                  addonAfter="m³/s"
                  defaultValue={totalVolumetricFlowRate}
                  onChange={setTotalVolumetricFlowRate}
                  style={{ width: '100%' }}
                />
              </Tooltip>
            </Col>
            <Col span={12}>
              <Checkbox onChange={(e) => console.log(e.target.checked)}>Molar flow of A</Checkbox>
              <Tooltip title="Enter the molar flow of component A in moles per second">
                <InputNumber
                  addonAfter="mol/s"
                  defaultValue={molarFlowOfA}
                  onChange={setMolarFlowOfA}
                  style={{ width: '100%' }}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            {Object.keys(componentConcentrations).map(key => (
              <Col key={key} span={8}>
                <div style={{ marginBottom: 8 }}>
                  <label>{key}</label>
                  <Tooltip title={`Set the molar fraction for ${key}`}>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.01}
                      value={componentConcentrations[key].molarFraction}
                      onChange={value => setComponentConcentrations(prev => ({
                        ...prev,
                        [key]: { ...prev[key], molarFraction: value }
                      }))}
                      addonAfter="molar fraction"
                      style={{ width: '100%' }}
                    />
                  </Tooltip>
                  <Tooltip title={`Set the concentration for ${key} in mol/m³`}>
                    <InputNumber
                      min={0}
                      step={0.01}
                      value={componentConcentrations[key].concentration}
                      onChange={value => setComponentConcentrations(prev => ({
                        ...prev,
                        [key]: { ...prev[key], concentration: value }
                      }))}
                      addonAfter="mol/m³"
                      style={{ width: '100%' }}
                    />
                  </Tooltip>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        <Card title="Step 2.3 - Thermal Characteristics of Components" bordered={false} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            {Object.keys(thermalCharacteristics).map(key => (
              <Col key={key} span={4}>
                <div style={{ marginBottom: 8 }}>
                  <label>{key}</label>
                  <Tooltip title={`Set the heat capacity for ${key} (J/molK)`}>
                    <InputNumber
                      min={0}
                      step={0.01}
                      value={thermalCharacteristics[key].heatCapacity}
                      onChange={value => setThermalCharacteristics(prev => ({
                        ...prev,
                        [key]: { ...prev[key], heatCapacity: value }
                      }))}
                      addonAfter="J/molK"
                      style={{ width: '100%' }}
                    />
                  </Tooltip>
                  <Tooltip title={`Set the enthalpy for ${key} (kJ/mol)`}>
                    <InputNumber
                      min={0}
                      step={0.01}
                      value={thermalCharacteristics[key].enthalpy}
                      onChange={value => setThermalCharacteristics(prev => ({
                        ...prev,
                        [key]: { ...prev[key], enthalpy: value }
                      }))}
                      addonAfter="kJ/mol"
                      style={{ width: '100%' }}
                    />
                  </Tooltip>
                </div>
              </Col>
            ))}
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={8}>
              <label>Ref. Temperature of Enthalpy (K):</label>
              <InputNumber
                min={0}
                step={1}
                value={referenceTemperature}
                onChange={setReferenceTemperature}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Card>
      </Card>

      <Card title="Step 3 - Parameters of Heat Exchange" bordered={false} style={{ marginTop: 16 }}>
        <Card type="inner" title="3.1 Parameters of Heat Exchange">
          <Row gutter={16}>
            <Col span={12}>
              <label>Overall Heat-Transfer Coefficient (W/m²K):</label>
              <InputNumber
                min={0}
                step={0.1}
                value={heatTransferCoefficient}
                onChange={setHeatTransferCoefficient}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={12}>
              <label>Area of Heat Exchange (m²):</label>
              <InputNumber
                min={0}
                step={0.1}
                value={areaOfHeatExchange}
                onChange={setAreaOfHeatExchange}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Card>

        <Card type="inner" title="3.2 Type of Stream">
          <p>Constant Temperature with Co-current Flow</p>
        </Card>

        <Card type="inner" title="3.3 Stream's Parameters">
          <Row gutter={16}>
            <Col span={8}>
              <label>Temperature (K):</label>
              <InputNumber
                min={0}
                step={1}
                value={streamTemperature}
                onChange={setStreamTemperature}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <label>Molar Flow (mol/s):</label>
              <InputNumber
                min={0}
                step={0.01}
                value={molarFlow}
                onChange={setMolarFlow}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <label>Heat Capacity (J/mol.K):</label>
              <InputNumber
                min={0}
                step={0.01}
                value={heatCapacity}
                onChange={setHeatCapacity}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Card>
      </Card>

      {/* Reactor Type Selection */}
      <Radio.Group onChange={e => setReactorType(e.target.value)} value={reactorType} style={{ marginTop: 16 }}>
        <Radio value="CSTR">CSTR</Radio>
        <Radio value="PFR">PFR</Radio>
      </Radio.Group>
      <br/><br/>
      <Button type="primary" style={{ marginTop: 16 }} onClick={handleJculation}>Jculate</Button>

      <br/>
      {allowed && (
              <h3>Keqm : {reactionType == 'irreversible' ? 'Not Applicable' : handleKeqm()}</h3>
      )
      }
    </div>
    </>
  );
}

export default App;