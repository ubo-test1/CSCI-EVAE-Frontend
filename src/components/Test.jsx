import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [qualificatifs, setQualificatifs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/qualificatifs/all')
      .then(response => {
        setQualificatifs(response.data);
      })
      .catch(error => {
        console.error('Error fetching qualificatifs:', error);
      });
  }, []);

  return (
    <div>
      <h1>Liste des qualificatifs</h1>
      <ul>
        {qualificatifs.map(qualificatif => (
          <li key={qualificatif.qualificatif.idQualificatif}>
            <p>Identifiant: {qualificatif.qualificatif.idQualificatif}</p>
            <p>Minimal: {qualificatif.qualificatif.minimal}</p>
            <p>Maximal: {qualificatif.qualificatif.maximal}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
