import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const loadingSnackbar = () => {
  return {
    content : <span style={{verticalAlign:'top'}}>Processing...<CircularProgress size={0.5}/></span>,
    duration: 9999999
  }
};

const callbackSnackbar = (content) => {
  return {
    content : content,
    duration: 700
  }
};

export {loadingSnackbar, callbackSnackbar};