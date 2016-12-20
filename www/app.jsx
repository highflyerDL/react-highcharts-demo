import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Main} ></Route>
      </Router>
    )
  }
}

const NotFound = () => (
  <h1>404.. This page is not found!</h1>)

export default App;