import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Select } from 'antd';

class SelectFan extends Component {

  render() {
    return (
        <Select value={this.props.fanName} onChange={this.props.handleFanChange} style={{ marginBottom: 12 }} disabled={this.props.disabled}>
        {this.props.fanOptions}
      </Select>
    )
  }
}

export default SelectFan;
