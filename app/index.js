import React, { Component } from 'react';
import { render } from 'react-dom';
import { omit } from 'ramda';

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
    this.setState({ expanded: !this.state.expanded });
    e.preventDefault();
  }

  getDisplay(item, marktype) {
    switch (marktype) {
      case 'text':
        return `(${item.x},${item.y}): ${item.text}`;
        break;
      case 'rule':
        return `(${item.x},${item.y}: ${item.x2},${item.y2})`;
        break;
      case 'rect':
        return `(${item.x},${item.y}: ${item.x2},${item.y2}) (${item.width}x${item.height})`;
        break;
      default:
        return JSON.stringify(item);
        // plotting symbols (symbol),
        // general paths or polygons (path),
        // circular arcs (arc),
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
    const display = this.getDisplay(item, marktype);
    return (
      <div className="item" onClick={this.click}>
        {display}
        {!!nSubItems &&
          <span>- {nSubItems} sub item(s)</span>
        }
      </div>
    );
  }

  renderMark(mark, index) {
    const nSubItems = mark.items ? mark.items.length : 0;
    return (
      <div className="mark">
        <div className="header" onClick={this.click}>
          {mark.marktype}/{mark.role} - {nSubItems} sub item(s)
        </div>

        {this.state.expanded && nSubItems &&
          this.renderSubItems(mark.items, index, mark.marktype)
        }
      </div>
    );
  }

  renderGroup(mark, index) {
    const rootItem = mark.items[0];
    const nSubItems = rootItem.items ? rootItem.items.length : 0;
    console.log(mark);
    const tip = JSON.stringify(omit(['items', 'marktype', 'name', 'role'], mark));

    return (
      <div className="group">
        <div className="header" onClick={this.click}>
          {mark.name}/{mark.role}&nbsp;
          {rootItem.width}x{rootItem.height}&nbsp;
          {nSubItems} sub item(s)
          <span className="tooltiptext">{tip}</span>
        </div>

        {this.state.expanded && nSubItems &&
          this.renderSubItems(rootItem.items, index)
        }
      </div>
    );
  }

  render() {
    const { mark, index, parent } = this.props;
    if (mark.marktype === 'group') {
        return this.renderGroup(mark, index);
    }
    if (mark.marktype) {
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

