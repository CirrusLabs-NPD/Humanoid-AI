import React from 'react';
import { Route, Routes } from 'react-router-dom'; // No need to import Router here
import Home from '../components/Home';
import Experience from '../components/Experience';
import './app.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
