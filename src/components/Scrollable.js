import React from 'react';
import Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

class Scrollable extends React.Component {

  constructor () {
    super();
    this.attachScrollbar = this.attachScrollbar.bind(this);
  }

  attachScrollbar(ref) {
    this.scrollableArea = ref;
    Ps.initialize(ref);
  }

  componentWillUnmount() {
    Ps.destroy(this.scrollableArea);
  }

  render() {
      return (
        <div
          ref={this.attachScrollbar}
          className={`scrollable ${this.props.className}`}
          style={{position: 'relative', overflow: 'hidden'}}
        >
          {this.props.children}
        </div>
      )
  }
}

export default Scrollable;
