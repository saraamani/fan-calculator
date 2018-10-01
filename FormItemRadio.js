import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Radio, Form } from 'antd';

const RadioGroup = Radio.Group;

class FormItemRadio extends Component {

    getButtons() {
        const buttons = [];
        for (var i = 0; i < this.props.buttons.length; i++) {
            buttons.push({ label: this.props.buttons[i], value: this.props.buttons[i] });
        }
        return buttons;
    }

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
        //     labelCol: { 
        //         xs: { span: 24 }, 
        //         md: { span: 20 }, 
        //         lg: { span: 20 }, 
        //         xl: { span: 20 } 
        //     }, 
        //     wrapperCol: { 
        //         xs: { span: 24 }, 
        //         md: { span: 20 }, 
        //         xl: { span: 10 } 
        //     }, 
        // };

        return (
            <FormItem
                style={{ marginBottom: 12, textAlign: 'left' }}
                {...formItemLayout}
                label={this.props.label}
                key={this.props.key}
            >
                <RadioGroup options={this.getButtons()} defaultValue={this.props.defaultValue} onChange={this.props.handleRadioChange} disabled={this.props.disabled} />
            </FormItem>
        )
    }
}

const WrappedFormItemRadio = Form.create()(FormItemRadio);
export default WrappedFormItemRadio;
