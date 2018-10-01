import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Button } from 'antd';

class CreatePDF extends Component {

    constructor(props) {
        super(props);

        this.state = {
            navigator: ''
        }
    }

    getBase64Image(imgUrl, callback) {
        var img = new Image();
        var canvas = this.refs.canvas;
        img.onload = function () {
            canvas.width = 472;
            canvas.height = 149;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/jpeg");
            callback(dataURL);

        };

        img.setAttribute('crossOrigin', 'anonymous');
        img.src = imgUrl;
    }


    createPDF() {
        var resultValues = this.props.data;

        if (resultValues == null) {
            return;
        }

        var index = resultValues['data'].findIndex(x => x.name === this.props.fanName);
        const doc = new jsPDF('p', 'mm', 'a4');
        console.log('Creating PDF..');

        var fanName = this.props.fanName;
        var chartInstance = this.props.chart;

        doc.setFontSize(7);
        doc.setFont('Helvetica');
        doc.text(190, 18, 'Åkerstedts Verkstads AB', null, null, 'right');
        doc.text(190, 22, 'Broholm 1', null, null, 'right');
        doc.text(190, 26, '535 91, Kvänum', null, null, 'right');
        doc.text(190, 30, 'Tel: 0512-32560', null, null, 'right');
        doc.text(190, 34, 'info@akerstedts.com', null, null, 'right');
        doc.text(190, 38, 'www.akerstedts.com', null, null, 'right');
        doc.setFontSize(10);

        doc.setFont('courier').setFontStyle('bold');
        doc.text(12, 48, fan_calc_vars.tender_marking_label + ': ');
        var textField = new TextField();
        textField.Rect = [65, 44.5, 100, 5];
        textField.V = '<tag>';
        doc.addField(textField);

        doc.text(100, 61, fanName, null, null, 'center');
        var image = new Image();
        image.src = chartInstance.toBase64Image();
        doc.addImage(image.src, 'PNG', 18, 66, 170, 80);

        doc.setFontSize(8);
        doc.text(12, 155, fan_calc_vars.current_fan_label + ': ' + fanName);
        doc.text(12, 160,
            fan_calc_vars.fan_wheel_type_label + ': ' + resultValues['data'][index]['wheelType'] +
            '   ' + fan_calc_vars.with_max_rpm_100 + ': ' + resultValues['data'][index]['maxRpms'][0] +
            '     ' + fan_calc_vars.at_200 + ': ' + resultValues['data'][index]['maxRpms'][1] +
            '     ' + fan_calc_vars.at_300 + ': ' + resultValues['data'][index]['maxRpms'][2]
        );
        doc.text(12, 170, fan_calc_vars.data_at_work_point_label + ': ');
        doc.setFontStyle('normal');
        doc.text(12, 175, fan_calc_vars.rpm_label + ': ' + resultValues['data'][index]['rpm']);
        doc.text(12, 180, fan_calc_vars.efficiency_label + ': ' + resultValues['data'][index]['efficiency']);
        doc.text(12, 185, fan_calc_vars.sound_effect_level_label + ': ' + resultValues['data'][index]['soundEffectLevel']);
        doc.text(12, 190, fan_calc_vars.sound_level_label + '*: ' + resultValues['data'][index]['dBA']);
        doc.text(12, 200, fan_calc_vars.dBA_value_one_meter_distance);
        doc.setFontStyle('bold');
        doc.text(12, 210, fan_calc_vars.data_at_air_density + ': ');
        doc.setFontStyle('normal');
        doc.text(12, 215, fan_calc_vars.total_pressure_label + ': ' + resultValues['data'][index]['wantedPressure']);
        doc.text(12, 220, fan_calc_vars.flow_label + ': ' + resultValues['data'][index]['wantedFlow']);
        doc.text(12, 225, fan_calc_vars.effect_label + ': ' + resultValues['data'][index]['effect']);
        doc.text(12, 230, fan_calc_vars.fan_torque_label + ': ' + resultValues['data'][index]['fanTorque']);
        doc.text(12, 235, 'Pd: ' + resultValues['data'][index]['pd']);
        doc.text(12, 240, 'P1: ' + resultValues['data'][index]['p1']);
        doc.text(12, 245, 'P2: ' + resultValues['data'][index]['p2']);
        doc.text(12, 250, 'P3: ' + resultValues['data'][index]['p3']);

        if (resultValues['data'][index]['pressureTemp'] !== null) {
            doc.setFontStyle('bold');
            doc.text(12, 260, fan_calc_vars.data_at_given_gas_temp + ': ');
            doc.setFontStyle('normal');
            doc.text(12, 265, fan_calc_vars.total_pressure_label + ': ' + resultValues['data'][index]['pressureTemp']);
            doc.text(12, 270, fan_calc_vars.flow_label + ': ' + resultValues['data'][index]['wantedFlow']);
            doc.text(12, 275, fan_calc_vars.effect_label + ': ' + resultValues['data'][index]['effect2']);
            doc.text(80, 265, fan_calc_vars.depression_label + ': ' + resultValues['data'][index]['depression']);
            var stp = fan_calc_vars.sTp_label + ': ';
            stp = stp.concat(resultValues['data'][index]['sTp'] || ' ');
            doc.text(80, 270, stp);
            doc.text(80, 275, fan_calc_vars.gas_temperature_label + ': ' + resultValues['data'][index]['gasTemp']);
        }

        var date = new Date().toLocaleString().replace(' ', '_');

        // var url = 'http://linux.entos.se:8080/FanCalculatorServlet/logo_akerstedts.jpg';
        var url = 'http://akerstedts.entos.net/wp-content/uploads/2018/08/logo_akerstedts.jpg';
        var isMacOS = navigator.userAgent.indexOf("Mac") !== -1;
        // this.setState({ navigator: navigator.userAgent });  //For testing only

        this.getBase64Image(url, function (base64image) {
            doc.addImage(base64image, 'JPG', 12, 15, 40, 12);
            if (isMacOS) {
                doc.output('dataurlnewwindow');
            }
            else {
                doc.save(fanName + '_' + date + '.pdf');
            }
        });
    }

    render() {
        return (
            <div>
                <Button size="default" type="primary" icon="download" onClick={(e) => { this.createPDF() }} disabled={this.props.disabled}>{fan_calc_vars.download_results_button}</Button>
                {/* <p>{this.state.navigator}</p> */}
                <canvas ref="canvas" style={{ display: 'none' }} />
            </div>
        )
    }
}

export default CreatePDF;