import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter


import Login from './components/login';
import QuestionStandardsList from './components/QuestionStandardsList';
import Home from './components/Home';
import EvaluationList from './components/Evaluation';
import EvaluationDetails from './components/EvaluationDetails';
import CoupleQualificatifList from './components/CoupleQualificatiList';
import RubriqueList from './components/rubrique';
import RubriqueDetails from './components/RubriqueDetails';
import EvaluationModifier from "./components/EvaluationModifier";

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
          <Route path="/rubriqueStandard/:id" element={<RubriqueDetails />} />
          <Route path="/EvaluationEdit/:id" element={<EvaluationModifier />} />


        </Routes>
      </Router>
    );
  }
}

export default App;
