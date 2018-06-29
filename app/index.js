import React, { Component } from 'react';
import { render } from 'react-dom';

import './styles.scss';

const scenegraph = require('./scenegraph.json');

const makeSubIndex = (index, subIndex) => 
  `${index}.${subIndex}`;

class Mark extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.state = {
      expanded: false,
    };
  }
  
  click() {
    console.log('click');
    this.setState({ expanded: !this.state.expanded });
  }

  render () {
    const { mark, index } = this.props;
    const nSubItems = mark.items ? mark.items.length : 0;
    return (
      <div className="mark" onClick={this.click}>
        {index}: {mark.marktype}/{mark.role} - {nSubItems} sub item(s)
        {this.state.expanded && mark.items &&
          <div>
            {mark.items.map((item, subIndex) =>
              <Mark key={makeSubIndex(index, subIndex)} mark={item} index={index} />
            )}
          </div>
        }
      </div>
    );
  }
};

const Scenegraph = ({scenegraph}) => {
  const rootItem = scenegraph.items[0];
  return (
    <div id="root">
      <div className="root">scenegraph: {scenegraph.name}/{scenegraph.role} <span>{rootItem.width}x{rootItem.height}</span></div>
      {rootItem.items.map((item, index) =>
        <Mark key={index} mark={item} index={index} />
      )}
    </div>
  )
};

const validate = (scenegraph) => {
  if (!scenegraph) {
    console.error('Scenegraph is empty');
  }
  if (!scenegraph.marktype === 'group') {
    console.error(`Expected root mark to be a group not a ${scenegraph.marktype}`);
  }
  if (!scenegraph.items && scenegraph.items.length!==1) {
    console.error(`Expected root to contain a single item not ${scenegraph.items.length}`);
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.state = {};
  }

  click() {
    console.log('Done!');
    validate(scenegraph);
    this.setState({scenegraph});
  }

  render() {
    return (
      <div>
        <button onClick={this.click}>Load scenegraph</button>
        {!!this.state.scenegraph &&
          <Scenegraph scenegraph={this.state.scenegraph} />
        }
      </div>
    );
  }
};

render(
  <App />,
  document.getElementById('container')
);

