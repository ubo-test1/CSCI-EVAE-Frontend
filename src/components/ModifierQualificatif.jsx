import React from 'react';
import { useParams } from 'react-router-dom';

const ModifierQualificatif = () => {
  const { id } = useParams(); // Utilisation de la déstructuration pour extraire id des paramètres
  return (
    <div>{id}</div>
  );
};

export default ModifierQualificatif;
