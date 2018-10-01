import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Button, Select, Row, Col, Form } from 'antd';
import FormItemInput from './FormItemInput.js';
import FormItemRadio from './FormItemRadio.js';
import SelectUnit from './SelectUnit.js';
import axios from 'axios';
import LineChart from './LineChart.js';
import SelectFan from './SelectFan.js';
import CreatePDF from './CreatePDF';

const Option = Select.Option;

var chartData = {
  datasets: [{
    type: 'line',
    label: fan_calc_vars.effect_label,
    yAxisID: 'B',
    fill: false,
    pointBorderColor: '#FDD835',
    borderColor: "#FDD835",
    backgroundColor: "#FFF59D",
    pointRadius: 4,
  }, {
    type: 'line',
    label: fan_calc_vars.total_pressure_label,
    yAxisID: 'A',
    fill: false,
    borderColor: '#D84315',
    backgroundColor: '#FFAB91',
    pointBorderColor: '#D84315',
    pointRadius: 4,
  }, {
    type: 'line',
    label: fan_calc_vars.dynamic_pressure_label,
    yAxisID: 'A',
    fill: false,
    borderColor: '#4CAF50',
    backgroundColor: '#A5D6A7',
    pointRadius: 0,
  }, {
    type: 'bubble',
    label: fan_calc_vars.work_point_label,
    yAxisID: 'A',
    fill: false,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'transparent',
    pointStyle: 'rect',
  }]
};

var chartOptions = {
  responsive: true,
  responsiveAnimationDuration: 0,
  animation: {
    duration: 0
  },
  maintainAspectRatio: true,
  scales: {
    yAxes: [{
      id: 'A',
      type: 'linear',
      position: 'left',
      fontSize: 10,
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.pressure_label + ' [Pa]'
      },
      ticks: {
        beginAtZero: true,
        fontSize: 14
      },
    }, {
      id: 'B',
      type: 'linear',
      position: 'right',
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.effect_label + ' [kW]'
      },
      ticks: {
        beginAtZero: true,
        fontSize: 14
      }
    }],
    xAxes: [{
      type: 'linear',
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.flow_label + ' [m3/s]'
      },
      ticks: {
        beginAtZero: true,
        fontSize: 14
      },
    }]
  }
}

var chartOptionsPDF = {
  responsive: false,
  responsiveAnimationDuration: 0,
  animation: {
    duration: 0
  },
  maintainAspectRatio: true,
  scales: {
    yAxes: [{
      id: 'A',
      type: 'linear',
      position: 'left',
      fontSize: 10,
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.pressure_label + ' [Pa]'
      },
      ticks: {
        fontSize: 14
      },
    }, {
      id: 'B',
      type: 'linear',
      position: 'right',
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.effect_label + ' [kW]'
      },
      ticks: {
        fontSize: 14
      }
    }],
    xAxes: [{
      type: 'linear',
      scaleLabel: {
        display: true,
        fontSize: 16,
        fontStyle: 'bold',
        labelString: fan_calc_vars.flow_label + ' [m3/s]'
      },
      ticks: {
        fontSize: 14
      },
    }]
  }
}


var chartInstance;


class FormContainer extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleFanChange = this.handleFanChange.bind(this);
    this.reset = this.reset.bind(this);
    this.openFanSheet = this.openFanSheet.bind(this);
    this.lineChartPDF = null;
    this.isSubmitDisabled = this.isSubmitDisabled.bind(this);

    this.state = {
      wantedPressureUnit: 'Pa',
      depAndPressTempUnit: 'Pa',
      flowUnit: 'm3/s',
      sTpUnit: 'nm3/s',
      gasTempUnit: 'C',
      selectFanDisabled: true,
      fanSheetBtnDisabled: true,
      chartData: {},
      pressureTempDisabled: false,
      depressionDisabled: false,
      wantedPressureDisabled: false,
      atmospherePressureDisabled: true,
      flowDisabled: false,
      sTpDisabled: false,
      flow: '',
      wantedPressure: '',
      pressureTemp: '',
      depression: '',
      sTp: '',
      gasTemp: '',
      wheelTypes: [],
      fanCategories: [],
      resultValues: {}
    }
  }

  handleInputChange(valueKey, e) {
    const newState = {};

    if (e.target.value.indexOf(',') > -1) {
      e.target.value = e.target.value.replace(/,/g, '.');
    }

    newState[valueKey] = e.target.value;

    //Disable fields that are not supposed to be used at the same time

    switch (valueKey) {
      case "wantedPressure":
        if (e.target.value.length > 0) {
          newState['pressureTempDisabled'] = true;
          newState['depressionDisabled'] = true;
        }
        else {
          newState['pressureTempDisabled'] = false;
          newState['depressionDisabled'] = false;
        }
        break;
      case "pressureTemp":
        if (e.target.value.length > 0) {
          newState['wantedPressureDisabled'] = true;
          newState['depressionDisabled'] = false;
        }
        else {
          if (typeof this.state.depression != 'undefined') {
            if (this.state.depression.length <= 0) {
              newState['wantedPressureDisabled'] = false;
              newState['depressionDisabled'] = false;
            }
          }
          else {
            newState['wantedPressureDisabled'] = false;
            newState['depressionDisabled'] = false;
          }
        }
        break;
      case "depression":
        if (e.target.value.length > 0) {
          newState['pressureTempDisabled'] = false;
          newState['wantedPressureDisabled'] = true;
        }
        else {
          if (typeof this.state.pressureTemp != 'undefined') {
            if (this.state.pressureTemp.length <= 0) {
              newState['pressureTempDisabled'] = false;
              newState['wantedPressureDisabled'] = false;
            }
          }
          else {
            newState['pressureTempDisabled'] = false;
            newState['wantedPressureDisabled'] = false;
          }
        }
        break;
      case "flow":
        if (e.target.value.length > 0) {
          newState['sTpDisabled'] = true;
        }
        else {
          newState['sTpDisabled'] = false;
        }
        break;
      case "sTp":
        if (e.target.value.length > 0) {
          newState['flowDisabled'] = true;
        }
        else {
          newState['flowDisabled'] = false;
        }
        break;
    }

    this.setState(newState);
  }

  handleSelectChange(valueKey, value) {
    const newState = {};
    if (value.indexOf('all') > -1) {
      if (valueKey === "fanCategories") {
        newState[valueKey] = ['FAM', 'FAH', 'FKL', 'FML', 'FAY', 'KML'];
      }
      else {
        newState[valueKey] = ['B', 'P', 'R'];
      }
    }
    else {
      newState[valueKey] = value;
    }
    this.setState(newState);
  }

  handleFanChange(value) {
    var index = this.state.resultValues['data'].findIndex(x => x.name === value);
    this.setValues(index);
    this.createChart(index, this.lineChartPDF, this.state.resultValues);
  }

  isSubmitDisabled() {
    if (!this.state.flowDisabled && this.state.flow === '') {
      return true;
    }
    if (!this.state.wantedPressureDisabled && this.state.wantedPressure === '') {
      return true;
    }
    if (!this.state.pressureTempDisabled && this.state.pressureTemp === '') {
      return true;
    }
    if (!this.state.depressionDisabled && this.state.depression === '') {
      return true;
    }
    if (!this.state.sTpDisabled && this.state.sTp === '') {
      return true;
    }
    if ((this.state.pressureTemp !== '' && this.state.gasTemp === '') || (this.state.depression !== '' && this.state.gasTemp === '')) {
      return true;
    }
    if (this.state.wantedPressure !== '' && this.state.sTp !== '' && this.state.gasTemp === '') {
      return true;
    }
    return this.state.wheelTypes.length === 0 || this.state.fanCategories.length === 0;
  }

  handleSubmit() {
     var requestParams = {};

    if (this.state.wantedPressureDisabled) {
      console.log('Using depAndPressUnit');

      requestParams['pressureUnit'] = this.state.depAndPressTempUnit;
      requestParams['flow'] = this.state.flow;
      requestParams['flowUnit'] = this.state.flowUnit;
      requestParams['depression'] = this.state.depression;
      requestParams['fanCategories'] = this.state.fanCategories;
      requestParams['gasTemp'] = this.state.gasTemp;
      requestParams['gasTempUnit'] = this.state.gasTempUnit;
      requestParams['pressureTemp'] = this.state.pressureTemp;
      requestParams['sTp'] = this.state.sTp;
      requestParams['sTpUnit'] = this.state.sTpUnit;
      requestParams['wheelTypes'] = this.state.wheelTypes;

      console.log(requestParams);
      this.getCalculations(requestParams);
    }
    else {
      console.log('Using wantedPressure Unit');

      requestParams['pressureUnit'] = this.state.wantedPressureUnit;
      requestParams['pressure'] = this.state.wantedPressure;
      requestParams['flow'] = this.state.flow;
      requestParams['flowUnit'] = this.state.flowUnit;
      requestParams['fanCategories'] = this.state.fanCategories;
      requestParams['wheelTypes'] = this.state.wheelTypes;

      console.log(requestParams);
      this.getCalculations(requestParams);
    }
  }

  getCalculations(params) {
    const lineChartPDF = this.lineChartPDF;
    axios.post(`http://linux.entos.se:8080/FanCalculatorServlet/FanCalculatorServlet`, params)
      // axios.post(`http://localhost:8080/FanCalculatorServlet/FanCalculatorServlet`, params) //For local testing
      .then(res => {
        if (!res['data'].hasOwnProperty('errorcode')) {
          this.createChart(0, lineChartPDF, res);
          // this.fillFanOptions();

          this.setState({
            resultValues: res
          })
          this.setValues(0)
        }
        else {
          const newState = {};

          newState['noResults'] = true;
          newState['fanName'] = '';
          newState['dBA'] = '';
          newState['rpm'] = '';
          newState['soundEffectLevel'] = '';
          newState['effect'] = '';
          newState['efficiency'] = '';
          newState['chartData'] = {};
          newState['selectFanDisabled'] = true;
          newState['fanSheetBtnDisabled'] = true;
          newState['showFanSheetErrMsg'] = false;
          newState['pressure'] = null;
          newState['resultValues'] = {};

          this.setState(newState);
        }
      });
  }

  getOptions(incomingOptions) {
    const options = [];
    for (var i = 0; i < incomingOptions.length; i++) {
      options.push(
        <Option key={incomingOptions[i]}>{incomingOptions[i]}</Option>
      )
    }
    return options;
  }

  getFields() {
    const fields = [];
    const inputs = this.props.fields;
    
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i]['type'] === 'inputField') {
        if (inputs[i].hasOwnProperty('options')) {
          fields.push(<FormItemInput
            key={inputs[i]['key']}
            label={inputs[i]['label']}
            marginBottom={inputs[i]['marginBottom']}
            handleInputChange={this.handleInputChange.bind(this, inputs[i]['key'])}
            handleEnterPressed={this.handleSubmit}
            defaultValue={inputs[i]['initialValue']}
            disabled={this.state[inputs[i]['key'] + 'Disabled']}
            selectUnit={<SelectUnit options={this.getOptions(inputs[i]['options'])} disabled={this.state[inputs[i]['key'] + 'Disabled']} defaultValue={inputs[i]['defaultValue']} handleSelectChange={this.handleSelectChange.bind(this, inputs[i]['key'] + "Unit")} />}
          />);
        }
        else {
          fields.push(<FormItemInput
            key={inputs[i]['key']}
            label={inputs[i]['label']}
            marginBottom={inputs[i]['marginBottom']}
            handleInputChange={this.handleInputChange.bind(this, inputs[i]['key'])}
            handleEnterPressed={this.handleSubmit}
            disabled={this.state[inputs[i]['key'] + 'Disabled']}
          />);
        }
      }

      else if (inputs[i]['type'] === 'radioButton') {
        fields.push(<FormItemRadio
          key={inputs[i]['key']}
          label={inputs[i]['label']}
          handleRadioChange={this.handleInputChange.bind(this, inputs[i]['key'])}
          defaultValue={inputs[i]['defaultValue']}
          buttons={inputs[i]['buttons']}
          disabled={this.state.pressureTempDisabled}
        />)
      }
    }
    return fields;
  }

  editDecimals(number) {
    if (number > 10) {
      return number.toFixed(0);
    }
    else if (number >= 1 && number <= 10) {
      return number.toFixed(2);
    }
    else {
      return number.toFixed(3);
    }
  }

  getChartPoints(graph, points) {
    graph['data'] = [];
    for (var i = 0; i < points.length; i++) {
      var x = this.editDecimals(points[i][0]);
      var y = this.editDecimals(points[i][1]);
      graph['data'].push({ x: x, y: y });
    }
  }

  createChart(index, lineChartPDF, resultValues) {
    var dynamicPressurePoints = resultValues['data'][index]['dynamicPressureGraph'];
    var effectPoints = resultValues['data'][index]['effectGraph'];
    var wantedPressurePoints = resultValues['data'][index]['totalPressureGraph'];
    var workPoint = resultValues['data'][index]['workPoint'];
    var labelFlowUnit = resultValues['data'][index]['wantedFlow'].split(' ')[1];
    var labelPressureUnit = resultValues['data'][index]['wantedPressure'].split(' ')[1];

    chartData.datasets[chartData.datasets.findIndex(x => x.label === fan_calc_vars.work_point_label)]['data'] = [{ x: workPoint[0], y: workPoint[1], r: 6 }];

    var effect = chartData.datasets[chartData.datasets.findIndex(x => x.label === fan_calc_vars.effect_label)];
    this.getChartPoints(effect, effectPoints);
    var dynamicPressure = chartData.datasets[chartData.datasets.findIndex(x => x.label === fan_calc_vars.dynamic_pressure_label)];
    this.getChartPoints(dynamicPressure, dynamicPressurePoints);
    var wantedPressure = chartData.datasets[chartData.datasets.findIndex(x => x.label === fan_calc_vars.total_pressure_label)];
    this.getChartPoints(wantedPressure, wantedPressurePoints);

    chartOptions.scales.yAxes[0].scaleLabel.labelString = fan_calc_vars.pressure_label + ' [' + labelPressureUnit + ']';
    chartOptions.scales.xAxes[0].scaleLabel.labelString = fan_calc_vars.flow_label + ' [' + labelFlowUnit + ']';

    chartOptionsPDF.scales.yAxes[0].scaleLabel.labelString = fan_calc_vars.pressure_label + ' [' + labelPressureUnit + ']';
    chartOptionsPDF.scales.xAxes[0].scaleLabel.labelString = fan_calc_vars.flow_label + ' [' + labelFlowUnit + ']';

    chartInstance = lineChartPDF.refs.lineChart.chartInstance;

    this.setState({ chartData: chartData });
  }

  createFanOptions(resultValues) {
    if (!resultValues || !resultValues.data) {
      return null;
    }

    var fanOptions = []
    for (var i = 0; i < resultValues.data.length; i++) {
      fanOptions.push(<Option key={resultValues.data[i]['name']}>
        {resultValues.data[i]['name']} ({resultValues.data[i]['efficiency']} - {resultValues.data[i]['effect']} - {resultValues.data[i]['rpm']} - {resultValues.data[i]['soundEffectLevel']})
        </Option>);
    }
    return fanOptions;
  }

  // fillFanOptions() {
  //   for (var i = 0; i < resultValues.data.length; i++) {
  //     this.fanOptions.push(<Option key={resultValues.data[i]['name']}>
  //       {resultValues.data[i]['name']} ({resultValues.data[i]['efficiency']} - {resultValues.data[i]['effect']} - {resultValues.data[i]['rpm']} - {resultValues.data[i]['soundEffectLevel']})
  //       </Option>);
  //   }
  //   this.setValues(0);
  // }

  setValues(index) {
    var resultValues = this.state.resultValues
    this.setFanSheetLink(resultValues.data[index]['name'].substring(0, 3));
    this.setState({
      noResults: false,
      selectFanDisabled: false,
      fanName: resultValues.data[index]['name'],
      dBA: resultValues.data[index]['dBA'],
      rpm: resultValues.data[index]['rpm'],
      soundEffectLevel: resultValues.data[index]['soundEffectLevel'],
      effect: resultValues.data[index]['effect'],
      efficiency: resultValues.data[index]['efficiency'],
    });
  }

  setFanSheetLink(fanName) {
    var fanSheetLink;
    var disableBtn = false;
    var showErrMsg = false;

    if (fanName === 'KML') {
      fanSheetLink = 'http://akerstedts.entos.net/wp-content/uploads/2018/07/Kammarfläkt-KMLB.pdf';
    }
    else if (fanName === 'FAY') {
      fanSheetLink = 'http://akerstedts.entos.net';
      disableBtn = true;
      showErrMsg = true;
    }
    else {
      fanSheetLink = 'http://akerstedts.entos.net/wp-content/uploads/2018/07/Radialflakt_' + fanName + '.pdf';
    }

    this.setState({ fanSheet: fanSheetLink, fanSheetBtnDisabled: disableBtn, showFanSheetErrMsg: showErrMsg });
  }

  reset() {
    this.refs.form.reset();
    this.setState({
      wantedPressure: '',
      flow: '',
      pressureTemp: '',
      depression: '',
      sTp: '',
      gasTemp: '',
      pressureTempDisabled: false,
      depressionDisabled: false,
      wantedPressureDisabled: false,
      atmospherePressureDisabled: true,
      flowDisabled: false,
      sTpDisabled: false,
      wheelTypes: [],
      fanCategories: [],
    });
  }

  openFanSheet() {
    window.open(this.state.fanSheet);
  }

  render() {
    const FormItem = Form.Item;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 10 },
        lg: { span: 10 },
        xl: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 20 },
        xl: { span: 14 }
      },
    };

    return (
      <div>
        <form ref="form">
          <Row gutter={{ xs: 0, md: 12, lg: 88, xl: 88 }}>
            <Col xs={20} md={12} lg={10} xl={10}>
              {this.getFields()}

              <FormItem
                style={{ marginBottom: 12 }}
                {...formItemLayout}
                label={fan_calc_vars.fan_wheel_types_label}
              >
                <Select allowClear={true} mode="multiple" placeholder={fan_calc_vars.select_fan_wheel_types} value={this.state.wheelTypes} onChange={this.handleSelectChange.bind(this, 'wheelTypes')}>
                  <Option value="all">{fan_calc_vars.select_all}</Option>
                  {this.getOptions(['B', 'P', 'R'])}
                </Select>
              </FormItem>

              <FormItem
                style={{ marginBottom: 12 }}
                {...formItemLayout}
                label={fan_calc_vars.fan_categories_label}
              >
                <Select allowClear={true} mode="multiple" placeholder={fan_calc_vars.select_fan_categories} value={this.state.fanCategories} onChange={this.handleSelectChange.bind(this, 'fanCategories')}>
                  <Option value="all">{fan_calc_vars.select_all}</Option>
                  {this.getOptions(['FAM', 'FAH', 'FKL', 'FML', 'FAY', 'KML'])}
                </Select>
              </FormItem>

              <Row gutter={10} type="flex" justify="end" style={{ marginBottom: 48 }}>
                <Col>
                  <Button type="default" onClick={this.reset}>{fan_calc_vars.reset_button}</Button>
                </Col>
                <Col>
                  <Button type="primary" disabled={this.isSubmitDisabled()} onClick={this.handleSubmit}>{fan_calc_vars.calculate_button}</Button>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Row>
                <p style={this.state.noResults ? { color: 'red', fontSize: 16, fontStyle: 'bold' } : { display: 'none' }}>
                  {fan_calc_vars.noResultsFound}
                </p>
              </Row>
              <Row>
                <Col xs={20} md={24} lg={24} xl={24}>
                  <Select value={this.state.fanName} onChange={this.handleFanChange} style={{ marginBottom: 12 }} disabled={this.state.selectFanDisabled}>
                    {this.createFanOptions(this.state.resultValues)}
                  </Select>
                  {/* <SelectFan fanName={this.state.fanName} handleFanChange={this.handleFanChange} disabled={this.state.selectFanDisabled} fanOptions={this.state.fanOptions} /> */}
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col>
                  <h2>{this.state.fanName}</h2>
                </Col>
              </Row>
              <Row>
                <Col xs={20} md={24} lg={24} xl={24}>
                  <LineChart ref="lineChartComponent" datasets={this.state.chartData} chartOptions={chartOptions} />
                  <LineChart ref={element => { this.lineChartPDF = element }} display={'none'} width={800} height={400} datasets={this.state.chartData} chartOptions={chartOptionsPDF} />
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col xs={20} md={24} lg={24} xl={24}>
                  <Row gutter={20} type="flex" justify="end">
                    <Col>
                      <Button size="default" type="primary" icon="download" onClick={this.openFanSheet} disabled={this.state.fanSheetBtnDisabled}>{fan_calc_vars.download_fan_sheet_button}</Button>
                    </Col>
                    <Col>
                      <CreatePDF data={this.state.resultValues} chart={chartInstance} fanName={this.state.fanName} disabled={this.state.selectFanDisabled} />
                    </Col>
                  </Row>
                  <Row>
                    <p style={this.state.showFanSheetErrMsg ? { color: 'red', fontSize: 12, fontStyle: 'bold' } : { display: 'none' }}>
                      {fan_calc_vars.noFanSheetFound1} <a href="http://akerstedts.entos.net/kontakt-2/"><u>{fan_calc_vars.contact}</u></a> {fan_calc_vars.noFanSheetFound2}
                    </p>
                  </Row>
                </Col>
                <Col className="align-left" xs={20} md={24} lg={24} xl={24}>
                  <p><b>{fan_calc_vars.rpm_label}:</b> {this.state.rpm}</p>
                  <p><b>{fan_calc_vars.efficiency_label}:</b> {this.state.efficiency}</p>
                  <p><b>{fan_calc_vars.effect_label}:</b> {this.state.effect}</p>
                  <p><b>{fan_calc_vars.sound_effect_level_label}:</b> {this.state.soundEffectLevel}</p>
                  <p><b>dBA:</b> {this.state.dBA}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

export default FormContainer;
