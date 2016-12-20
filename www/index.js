import React from 'react';
import {render} from 'react-dom';
import App from "./app";
// Load Highcharts
var Highcharts = require('highcharts');

// Load a module
require('highcharts/modules/funnel')(Highcharts);

render(<App/>, document.getElementById('container'));