import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import {callQueryParamsApi} from "../util/callApi";
import { browserHistory } from 'react-router';
import {callbackSnackbar, loadingSnackbar} from "../util/snackbarFactory";

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
            }
        };
        this.getData = this.getData.bind(this);
    }

    componentDidMount(){
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

    getData(dataType){
        this.state.config.series = [];
        this.state.config.title.text = dataType.toUpperCase();
        // console.log("in",this.props.showSnackbar);
        // this.props.showSnackbar(loadingSnackbar());
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
            // this.props.showSnackbar(callbackSnackbar("Retrieved !"));
            console.log(this.state.config);
            this.setState(this.state);
        });
    }

    render() {
        return (
            <div>
                <ReactHighcharts config={this.state.config}></ReactHighcharts>
            </div>
        )
    }
}

export default Chart;