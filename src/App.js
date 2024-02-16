import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Login from './Components/login';
import QuestionStandardsList from './Components/QuestionStandardsList';
import Home from './Components/Home';

class App extends Component {
  render() {
    return (
      <Router> {/* Wrap Routes with BrowserRouter */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionStandards" element={<QuestionStandardsList />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
