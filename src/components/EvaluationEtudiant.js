import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluationsEtudiant } from '../api/fetchEvaluationsEtudiant';
import { localizedTextsMap } from './dataGridLanguage';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
function EvaluationEtudiant() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    async function getEvaluations() {
      try {
        const data = await fetchEvaluationsEtudiant();
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();

  }, []);

  // Define columns for DataGrid
  

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ display: 'flex', flexWrap: 'wrap', top: '15vh', left: '15vw', position: 'absolute', gap: '20px', justifyContent: 'flex-start', padding: '20px' }}>
  {evaluations.length > 0 ? (
    evaluations.map((evaluation, index) => (
            <div
            key={index}
            style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                width: '300px',
                transition: 'transform 0.3s, box-shadow 0.3s', // Adding transition effect
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Adding initial drop shadow
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'; // Enlarging the div on hover
                e.currentTarget.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.2)'; // Adding stronger drop shadow on hover
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'; // Restoring the original size on mouse leave
                e.currentTarget.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)'; // Restoring the original drop shadow
            }}
            >
        <h3>{evaluation.designation}</h3>
        <p>Formation: {evaluation.uniteEnseignement.codeFormation.codeFormation}</p>
        <p>Unité d'enseignement: {evaluation.uniteEnseignement.id.codeUe}</p>
        <p>Élement Constitutif: {evaluation.elementConstitutif ? evaluation.elementConstitutif.id.codeEc : ""}</p>
        <p>Période: {evaluation.periode}</p>
        <p>Début de réponse: {new Date(evaluation.debutReponse).toLocaleDateString('fr-FR')}</p>
        <p>Fin de réponse: {new Date(evaluation.finReponse).toLocaleDateString('fr-FR')}</p>
        <p>État: {evaluation.etat==="CLO" ? "Cloturé" : "à disposition"}</p>
        <Button
  variant="contained"
  color={evaluation.repondu ? "secondary" : "primary"}
  fullWidth
  disabled={evaluation.etat === "CLO" && !evaluation.repondu}
  onClick={() => {
    if (
      evaluation.etat !== "CLO" &&
      !evaluation.repondu
    ) {
      window.location.href = `/evaluationetudiant/${evaluation.id}`;
    }
  }}
>
  {(() => {
    if (evaluation.etat === "CLO" && evaluation.repondu) {
      return "Consulter les réponses";
    } else if (evaluation.etat === "CLO") {
      return "Évaluation clôturée";
    } else if (evaluation.etat !== "CLO" && evaluation.repondu) {
      return "Consulter les réponses";
    } else if (evaluation.etat !== "CLO" && !evaluation.repondu) {
      return "Répondre";
    }
  })()}
</Button>



      </div>
    ))
  ) : (
    <p>Pas d'évaluations en cours pour l'instant</p>
  )}
</div>
</div>
  );
  
}

export default EvaluationEtudiant;