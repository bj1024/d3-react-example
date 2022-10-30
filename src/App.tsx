import React from 'react';

import './App.css';
import D3Example from "./components/d3example";
import CounterExample from "./components/counter";

function App() {
  return (
    <div className="App">
      <div className="App-main">
        <D3Example/>
        {/*<div>counter<CounterExample/></div>*/}
      </div>

    </div>
  );
}

export default App;
