import React, { Component } from 'react';
import { render } from 'react-dom';
import { omit, isNil } from 'ramda';

import './styles.scss';

const test_scenegraph = require('./scenegraph.json');

//Create a port with background page for continous message communication
let port;
if (!window.location.search || window.location.search !== '?test') {
  port = chrome.runtime.connect({ name: "vega-panel" });
  console.log('created port', port);
}


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
    this.setState({ expanded: !this.state.expanded });
    e.preventDefault();
  }

  getItemDisplay(item, marktype) {
    switch (marktype) {
      case 'text':
        return {
          header: `(${item.x},${item.y}): ${item.text}`,
          tip: JSON.stringify(omit(['x', 'y', 'text'], item))
        }
        break;
      case 'rule':
        return {
          header: `(${item.x},${item.y}): (${item.x2},${item.y2})`,
          tip: JSON.stringify(omit(['x', 'y', 'x2', 'y2'], item))
        }
        break;
      case 'rect':
        return {
          header: `(${item.x},${item.y}): (${item.x2},${item.y2}) (${item.width}x${item.height})`,
          tip: JSON.stringify(omit(['x', 'y', 'x2', 'y2', 'width', 'height'], item))
        }
        break;
      case 'arc':
        return {
          header: `(${item.x},${item.y}): ${item.startAngle} to ${item.endAngle} r=${item.outerRadius})`,
          tip: JSON.stringify(omit(['x', 'y', 'startAngle', 'endAngle', 'outerRadius'], item))
        }
        break;
      case 'symbol':
        return {
          header: `(${item.x},${item.y}): size=${item.size} ${item.shape})`,
          tip: JSON.stringify(omit(['x', 'y', 'size', 'shape'], item))
        }
        break;
      default:
        return {
          header: `(${item.x},${item.y}): (${item.width}x${item.height})`,
          tip: JSON.stringify(omit(['x', 'y', 'width', 'height', 'items'], item))
        }

        // TODO
        // general paths or polygons (path),
        // filled areas (area),
        // lines (line),
        // images (image),
        // shape
        // trail
        // area
    }
  }

  renderSubItems(items, index, marktype) {
    return (
      <div>
        {items.map((item, subIndex) =>
        <Mark key={makeSubIndex(index, subIndex)}
          mark={item}
          index={makeSubIndex(index, subIndex)}
          parent={marktype}
        />
        )}
      </div>
    );
  }

  renderItem(item, index, marktype) {
    const nSubItems = item.items ? item.items.length : 0;
    const { header, tip }= this.getItemDisplay(item, marktype);
    return (
      <div className="item">
        <div className="header" onClick={this.click}>
          {header}
          { tip && <span className="tooltiptext">{tip}</span>}
        </div>

        {this.state.expanded && !!nSubItems &&
          this.renderSubItems(item.items, index, item.marktype)
        }
      </div>
    );
  }

  renderMark(mark, index) {
    const nSubItems = mark.items ? mark.items.length : 0;
    let header = `${mark.name}/${mark.role}`;
    if (!!nSubItems) {
      header = `${header}: ${nSubItems} sub item(s)`
    }
    const tip = JSON.stringify(omit(['items', 'marktype', 'name', 'role'], mark));
    return (
      <div className={mark.marktype==='group'?'group':'mark'}>
        <div className="header" onClick={this.click}>
          {header}
          <span className="tooltiptext">{tip}</span>
        </div>

        {this.state.expanded && !!nSubItems &&
          this.renderSubItems(mark.items, index, mark.marktype)
        }
      </div>
    );
  }

  render() {
    const { mark, index, parent } = this.props;
    if (!isNil(mark.marktype)) {
        return this.renderMark(mark, index);
    }
    return this.renderItem(mark, index, parent);
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
    console.log('app constructor');
    super(props);
    this.click = this.click.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {};
  }

  componentDidMount() {
    // Listen to messages from the background page
    if (port) {
      port.onMessage.addListener(this.receiveMessage);
      console.log('listener added');
    }

    if (window.location.search && window.location.search === '?test') {
      this.setState({scenegraph: test_scenegraph})
    }
  }
      
  receiveMessage(message) {
    console.log('receiveMessage', message);
    // port.postMessage(message);
    const scenegraph = JSON.parse(message.content);
    validate(scenegraph);
    this.setState({scenegraph});
  }

  click() {
  }

  render() {
    return (
      <div>
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

