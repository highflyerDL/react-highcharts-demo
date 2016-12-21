import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import {callQueryParamsApi} from "../util/callApi";
import { browserHistory } from 'react-router';
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";
import Snackbar from 'material-ui/Snackbar';

const dataTypes = ["temperature", "light"];

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataType: "temperature",
            config: {
                chart: {
                    type: 'line' 
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
            }
        };
        this.getData = this.getData.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.onShowSnackbar = this.onShowSnackbar.bind(this);
    }

    componentWillMount(){
        var type = this.props.params.type;
        if(dataTypes.indexOf(type)!=-1){
            this.getData(type);
        } else {
            browserHistory.push("/notfound");
        }
    }

    componentWillReceiveProps(nextProps){
        var type = nextProps.params.type;
        if(dataTypes.indexOf(type)!=-1){
            this.getData(type);
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
        console.log("in show");
        snackbar.open = true;
        this.setState({snackbar: snackbar})
    }

    getData(dataType){
        this.state.config.series = [];
        this.state.config.title.text = dataType.toUpperCase();
        this.onShowSnackbar(loadingSnackbar());
        callQueryParamsApi("",{type:dataType}).then((data) => {
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
                    this.state.config.series.push({name:obj.sensorid, data: [[obj.created, obj.value]]});
                }
            });
            this.onShowSnackbar(callbackSnackbar("Retrieved !"));
            console.log(this.state.config);
            this.setState(this.state);
        });
    }

    render() {
        return (
            <div>
                <ReactHighcharts config={this.state.config}></ReactHighcharts>
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

export default Chart;