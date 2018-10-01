import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Select } from 'antd';

class SelectUnit extends Component {

  render() {
    return (
      <Select defaultValue={this.props.defaultValue} style={{ width: 95 }} onChange={this.props.handleSelectChange} disabled={this.props.disabled}>
        {this.props.options}
      </Select>
    )
  }
}

export default SelectUnit;
