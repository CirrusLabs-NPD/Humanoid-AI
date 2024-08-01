import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Experience from './components/Experience';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
