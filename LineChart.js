import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Line } from 'react-chartjs-2';


class LineChart extends Component {

  render() {
    return (
      <div style={{ display: this.props.display }}>
        <Line ref="lineChart" data={this.props.datasets} width={this.props.width} height={this.props.height} options={this.props.chartOptions} />
      </div>
    )
  }
}

export default LineChart;
