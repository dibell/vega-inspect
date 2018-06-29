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
  
  click(e) {
    console.log('click', this);
    this.setState({ expanded: !this.state.expanded });
    e.preventDefault();
  }

  renderSubItems(items, index) {
    return (
      <div>
        {items.map((item, subIndex) =>
          <Mark key={makeSubIndex(index, subIndex)} mark={item} index={makeSubIndex(index, subIndex)} />
        )}
      </div>
    );
  }

  renderItem(mark, index) {
    const nSubItems = mark.items ? mark.items.length : 0;
    const display = JSON.stringify(mark);
    return (
      <div className="mark" onClick={this.click}>
        {index}: {display} - {nSubItems} sub item(s)
      </div>
    );
  }

  renderMark(mark, index) {
    const nSubItems = mark.items ? mark.items.length : 0;
    return (
      <div className="mark">
        <div className="header" onClick={this.click}>
          {index}: {mark.marktype}/{mark.role} - {nSubItems} sub item(s)
        </div>

        {this.state.expanded && nSubItems &&
          this.renderSubItems(mark.items, index)
        }
      </div>
    );
  }

  renderGroup(mark, index) {
    const rootItem = mark.items[0];
    const nSubItems = rootItem.items ? rootItem.items.length : 0;

    return (
      <div className="group">
        <div className="header" onClick={this.click}>
          {index} group: {mark.name}/{mark.role}&nbsp;
          {rootItem.width}x{rootItem.height}&nbsp;
          {nSubItems} sub item(s)
        </div>

        {this.state.expanded && nSubItems &&
          this.renderSubItems(rootItem.items, index)
        }
      </div>
    );
  }

  render() {
    const { mark, index } = this.props;
    if (mark.marktype === 'group') {
        return this.renderGroup(mark, index);
    }
    if (mark.marktype) {
        return this.renderMark(mark, index);
    }
    return this.renderItem(mark, index);
  }
};

const Scenegraph = ({scenegraph}) => {
  return (
    <div id="root">
      <Mark key={0} mark={scenegraph} index={0} />
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

