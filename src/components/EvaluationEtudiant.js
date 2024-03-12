import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluationsEtudiant } from '../api/fetchEvaluationsEtudiant';
import { localizedTextsMap } from './dataGridLanguage';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

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
  const columns = [
    { field: 'designation', headerName: 'Designation', flex: 1 },
    {
        field: 'formation', 
        headerName: 'Formation', 
        flex: 1
    },
    {
        field: 'ue', 
        headerName: 'Unité d\'enseignement', 
        flex: 1
    },
    { field: 'periode', headerName: 'Période', flex: 1 },
    { field: 'evaluation.debutReponse', 
      headerName: 'Début de réponse', 
      flex: 1,
      valueGetter: (params) => {
        const debutReponse = new Date(params.row.evaluation.debutReponse);
        return debutReponse.toLocaleDateString('fr-FR'); 
      }
    },
    { 
      field: 'evaluation.finReponse', 
      headerName: 'Fin de réponse', 
      flex: 1,
      valueGetter: (params) => {
        const finReponse = new Date(params.row.evaluation.finReponse);
        return finReponse.toLocaleDateString('fr-FR'); 
      }
    },
    {
        field: 'repondu', 
        headerName: 'Statut', 
        flex: 1,
        valueGetter: (params) => {
            return params.row.repondu == true ? "Déja répondu" : "À évaluer";
          }
      }

  ];

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
          {evaluations.length > 0 ? (
            <DataGrid
              localeText={localizedTextsMap}
              hideFooter={true}
              rows={evaluations.map(evaluation => ({ 
                id: evaluation.evaluation.id,
                designation: evaluation.evaluation.designation,
                periode: evaluation.evaluation.periode,
                ue: evaluation.evaluation.uniteEnseignement.id.codeUe,
                formation: evaluation.evaluation.uniteEnseignement.codeFormation.codeFormation,
                ...evaluation 
              }))}
              columns={columns}
              pageSize={5}
              checkboxSelection={false}
              sortingOrder={['asc', 'desc']}
              getRowId={(row) => row.id}
              onRowClick={(row) => {
                window.location.href = `/Evaluation/${row.id}`;
              }}
              rowClassName={(params) => {
                return 'pointer';
              }}
            />
          ) : (
            <p>Pas d'évaluations en cours pour l'instant</p>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default EvaluationEtudiant;
