import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import {callQueryParamsApi} from "../util/callApi";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                chart: {
                    type: 'line' 
                },
                title: {
                    text: 'Zelsinki Lambda'
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
        callQueryParamsApi("",{type:"temperature"}).then((data) => {
            data.forEach(obj=>{

            });
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

export default Main;