import React, { useState } from 'react';
import Navbar from './Components/navbar';
function EvaluationComponent() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/eva');
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
      }
      const data = await response.json();
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchEvaluations} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Evaluations'}
      </button>
      <div>
        {evaluations.map((evaluation, index) => (
          <div key={index}>
            {/* Render evaluation properties here */}
            <p>{evaluation.property}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EvaluationComponent;
