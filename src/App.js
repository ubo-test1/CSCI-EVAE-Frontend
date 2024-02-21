import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import Login from './Components/login';
import QuestionStandardsList from './Components/QuestionStandardsList';
import Home from './Components/Home';
import EvaluationList from './Components/Evaluation';
import EvaluationDetails from './Components/EvaluationDetails';
import CoupleQualificatifList from './Components/CoupleQualificatiList';
import RubriqueList from './Components/rubrique';
class App extends Component {
  render() {
    return (
      <Router> {/* Wrap Routes with BrowserRouter */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionStandards" element={<QuestionStandardsList />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Evaluation" element={<EvaluationList />} />
          <Route path="/Evaluation/:id" element={<EvaluationDetails />} />
          <Route path="/coupleQualificaitf" element={<CoupleQualificatifList />} />
          <Route path="/rubriqueStandard" element={<RubriqueList />} />


        </Routes>
      </Router>
    );
  }
}

export default App;
