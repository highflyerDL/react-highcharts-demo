import React from 'react';
import {render} from 'react-dom';
import App from "./app";
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(<App/>, document.getElementById('container'));