import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MultiSearchTablets from './MultiSearchTablets';
import Homepage from './components/Home';
import "./index.css";
import './App.css';
import SubmittedDrugsDisplay from './components/SubmittedDrugsDisplay';

function App() {
  return (
      <Router>
          <Routes>
            {/* Main route with search functionality and displaying selected drug details */}
            <Route path="/" element={<Homepage />} />
            <Route path='/MultiSearchTablets' element={<MultiSearchTablets />} />
            <Route path='/SubmittedDrugsDisplay' element={<SubmittedDrugsDisplay />} />
          </Routes>
      </Router>
  );
}

export default App;
