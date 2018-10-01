import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import 'core-js/es6/';
import { Tabs } from 'antd';
import FormContainer from './FormContainer.js';

const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong</p>
    }

    return (
      <div className="App">
        <Tabs className="overflow-visible" defaultActiveKey="1">
          <TabPane tab={fan_calc_vars.standard_tab} key="1">
            <StandardCalculations />
          </TabPane>
          <TabPane tab={fan_calc_vars.advanced_tab} key="2">
            <AdvancedCalculations />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

class StandardCalculations extends Component {

  render() {
    
    const fields = [
      {
        type: 'inputField', key: "flow", label: fan_calc_vars.desired_flow_label, defaultValue: "m3/s", options: ['m3/s', 'm3/h', 'l/s']
      },
      {
        type: 'inputField', key: "wantedPressure", label: fan_calc_vars.desired_pressure_label, defaultValue: "Pa", options: ['Pa', 'mmVp']
      },
    ];

    return (
      <div style={{marginLeft: 20}}>
        <FormContainer fields={fields} />
      </div>
    )
  }
}


class AdvancedCalculations extends Component {

  render() {

    const fields = [
      {
        type: 'inputField', key: "flow", label: fan_calc_vars.desired_flow_label, defaultValue: "m3/s", options: ['m3/s', 'm3/h', 'l/s']
      },
      {
        type: 'inputField', key: "wantedPressure", label: fan_calc_vars.desired_pressure_label, marginBottom: 35, defaultValue: "Pa", options: ['Pa', 'mmVp'],
      },
      {
        type: 'radioButton', key: 'depAndPressTempUnit', label: fan_calc_vars.select_pressure_unit_label, defaultValue: 'Pa', buttons: ['Pa', 'mmVp']
      },
      {
        type: 'inputField', key: 'pressureTemp', label: fan_calc_vars.gas_temp_pressure_label
      },
      {
        type: 'inputField', key: 'depression', label: fan_calc_vars.depression_label, marginBottom: 35,
      },
      {
        type: 'inputField', key: "sTp", label: fan_calc_vars.sTp_label, defaultValue: "nm3/s", options: ['nm3/s', 'nm3/h']
      },
      {
        type: 'inputField', key: "gasTemp", label: fan_calc_vars.gas_temp_label, defaultValue: "C", options: ['C', 'K']
      },
      {
        type: 'inputField', key: "atmospherePressure", label: fan_calc_vars.atmosphere_pressure_label, defaultValue: "Pa", options: ['Pa'], initialValue: 101325
      },
    ];

    return (
      <div style={{marginLeft: 20}}>      
        <FormContainer fields={fields} />
      </div>
    )
  }
}

export default App;
