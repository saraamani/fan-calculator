import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Input, Form } from 'antd';

class FormItemInput extends Component {

  render() {
    const FormItem = Form.Item;
    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 14 },
        lg: { span: 10 },
        xl: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 20 },
        xl: { span: 14 }
      },
    };

    //if size of plugin remains the same
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     md: { span: 14 },
    //     lg: { span: 14 },
    //     xl: { span: 12 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     md: { span: 20 },
    //     xl: { span: 12 }
    //   },
    // };

    return (
      <FormItem
        style={{ marginBottom: this.props.marginBottom || 12 }}
        {...formItemLayout}
        label={this.props.label}
        key={this.props.key}
      >
        <Input name={this.props.key} defaultValue={this.props.defaultValue} size="default" addonAfter={this.props.selectUnit} onPressEnter={this.props.handleEnterPressed} onChange={this.props.handleInputChange} disabled={this.props.disabled} />
      </FormItem>
    )
  }
}

const WrappedFormItemInput = Form.create()(FormItemInput);
export default WrappedFormItemInput;
