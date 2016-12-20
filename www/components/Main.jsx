import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import {callQueryParamsApi} from "../util/callApi";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                xAxis: {
                    categories: []
                },
                series: []
            }
        };
        callQueryParamsApi("",{type:"temperature"}).then((data) => {
            data.forEach(obj=>{
                this.state.config.xAxis.categories.push(obj.created);
                this.state.config.series.push({name: obj.sensorid, data: obj.value});
            });
            var config = {
              xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              },
              series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
              }]
            };
            this.state.config = config
            console.log(this.state.config);
        });
    }

    render() {
        return (
            <ReactHighcharts config={this.state.config}></ReactHighcharts>
        )
    }
}

export default Main;