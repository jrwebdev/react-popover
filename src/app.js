import React from 'react';
import ReactDOM from 'react-dom';

import Scrollable from './components/Scrollable';
import Popover from './components/Popover';

import './app.scss';

class App extends React.Component {
  render () {
    return (
      <div className="wrapper">
        <Scrollable className="left-sidebar">
          <div style={{marginBottom: 400}}>
            <Popover anchor={<button>Toggle Popover</button>}>
              <div>Some popover content...</div>
            </Popover>
          </div>
          <div style={{marginBottom: 400}}>
            <Popover anchor={<button>Toggle Popover</button>}>
              <div style={{width: 400, height: 250}}>Some large popover content...</div>
            </Popover>
          </div>
          <div style={{position: 'relative', marginBottom: 400}}>
            <Popover anchor={<button>Toggle Popover</button>}>
              <div style={{padding: 25}}>Popover positioned within a relative positioned div</div>
            </Popover>
          </div>
          <div style={{marginBottom: 400}} className="relative-position">
            <Popover anchor={<button>Toggle Popover</button>}>
              <div style={{padding: 25}}>Popover positioned within a relative positioned div (via CSS class)</div>
            </Popover>
          </div>
        </Scrollable>
        <Scrollable className="main">

        </Scrollable>
        <Scrollable className="right-sidebar">
          <div style={{marginBottom: 2000, textAlign: 'right'}}>
            <Popover anchor={<button>Toggle Popover</button>}>
              <div style={{width: 400, height: 250, padding: 25}}>Right aligned popover</div>
            </Popover>
          </div>
        </Scrollable>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
