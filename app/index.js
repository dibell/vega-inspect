import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  render() {
    return (<div>Hello</div>);
  }
};

render(
  <App />,
  document.getElementById('container')
);

