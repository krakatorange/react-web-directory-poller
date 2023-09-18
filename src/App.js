// App.js

import React from 'react';
import './App.css';
import DirectoryPoller from './DirectoryPoller';

function App() {
  return (
    <div className="App">
      <h1>Directory Polling App</h1>
      <DirectoryPoller />
    </div>
  );
}

export default App;