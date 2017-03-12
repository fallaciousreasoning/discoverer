import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppRoutes from './components/AppRoutes';

window.onload = () => {
  ReactDOM.render(<MuiThemeProvider><AppRoutes/></MuiThemeProvider>, document.getElementById('main'));
};