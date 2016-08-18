import React from 'react';
import ReactDOM from 'react-dom';

import Scrollable from './components/Scrollable';
import PopoverButton from './components/PopoverButton';

import './app.scss';

class App extends React.Component {
  render () {
    return (
      <div className="wrapper">
        <Scrollable className="left-sidebar">
          <div style={{position: 'relative'}}>
            <PopoverButton />
          </div>
          <PopoverButton />
          <PopoverButton />
        </Scrollable>
        <Scrollable className="main">

        </Scrollable>
        <Scrollable className="right-sidebar">
          <PopoverButton />
          <PopoverButton />
          <PopoverButton />
        </Scrollable>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
