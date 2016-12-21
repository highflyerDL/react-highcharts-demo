import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import {callQueryParamsApi} from "../util/callApi";
import { browserHistory } from 'react-router';
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";
import Snackbar from 'material-ui/Snackbar';

const dataTypes = ["temperature", "light", "sound"];

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataType: "temperature",
            config: {
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    events: {
                        load: () => {
                            this.pollingTimer = setInterval(this.update, 3000);
                        }
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        }
                    }
                },
                series: []
            },
            snackbar: {
                content: "",
                open: false,
                action: null
            },
            from: ""
        };
        this.getData = this.getData.bind(this);
        this.update = this.update.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.onShowSnackbar = this.onShowSnackbar.bind(this);
    }

    componentWillMount(){
        var type = this.props.params.type;
        if(dataTypes.indexOf(type)!=-1){
            this.state.config.dataType = type;
            this.getData(type);
        } else {
            browserHistory.push("/notfound");
        }
    }

    componentWillUnmount(){
        clearInterval(this.pollingTimer);
    }

    componentWillReceiveProps(nextProps){
        var type = nextProps.params.type;
        if(dataTypes.indexOf(type)!=-1){
            this.state.config.dataType = type;
            this.getData();
        } else {
            browserHistory.push("/notfound");
        }
    }

    handleSnackbarClose(reason) {
        if (reason === "clickaway") {
            return;
        }
        this.state.snackbar.open = false;
        this.setState(this.state);
    }

    onShowSnackbar(snackbar) {
        snackbar.open = true;
        this.setState({snackbar: snackbar})
    }

    getData(){
        this.state.config.title.text = this.state.config.dataType.toUpperCase();
        this.state.config.series = [];
        var now = new Date();
        now = new Date(now.getTime()-30*60000)
        this.state.from = now.toISOString();;
        this.onShowSnackbar(loadingSnackbar());
        this.context.configs.isLoading = true;
        callQueryParamsApi("",{type:this.state.config.dataType, from: this.state.from}).then((data) => {
            this.state.from = data[data.length-1].created;
            data.forEach(obj=>{
                var dateObj = new Date(obj.created);
                obj.created = dateObj.getTime();
                obj.value = parseFloat(obj.value, 10);
                var isNew = true;
                for(var i = 0; i<this.state.config.series.length;i++){
                    var seri = this.state.config.series[i];
                    if(seri.name == obj.sensorid){
                        seri.data.push([obj.created, obj.value]);
                        isNew = false;
                    }
                }
                if(isNew){
                    this.state.config.series.push({name:obj.sensorid, data: [[obj.created, obj.value]], visible: false});
                }
            });
            this.onShowSnackbar(callbackSnackbar("Retrieved !"));
            this.context.configs.isLoading = false;
            this.setState(this.state);
        });
    }

    update(){
        callQueryParamsApi("",{type:this.state.config.dataType, from: this.state.from}).then((data) => {
            this.state.from = data[data.length-1].created;
            let chart = this.refs.chart.getChart();
            data.forEach(obj=>{
                var dateObj = new Date(obj.created);
                obj.created = dateObj.getTime();
                obj.value = parseFloat(obj.value, 10);
                var isNew = true;
                for(var i = 0; i<this.state.config.series.length;i++){
                    var seri = this.state.config.series[i];
                    if(seri.name == obj.sensorid){
                        chart.series[i].addPoint([obj.created, obj.value]);
                        isNew = false;
                    }
                }
                if(isNew){
                    chart.addSeries({name:obj.sensorid, data: [[obj.created, obj.value]]});
                }
            });
            // this.onShowSnackbar(callbackSnackbar("Retrieved !"));
            this.context.configs.isLoading = false;
        });
    }

    render() {
        return (
            <div>
                <ReactHighcharts config={this.state.config} ref="chart"></ReactHighcharts>
                <Snackbar
                    action={this.state.snackbar.action}
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.content}
                    autoHideDuration={this.state.snackbar.duration}
                    onRequestClose={this.handleSnackbarClose}
                    />
            </div>
        )
    }
}
Chart.contextTypes = {
  configs: React.PropTypes.object
};
export default Chart;
