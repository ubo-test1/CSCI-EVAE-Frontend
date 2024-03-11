import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluations } from '../api/fetchEvaluations';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { localizedTextsMap } from './dataGridLanguage';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    async function getEvaluations() {
      try {
        const data = await fetchEvaluations();
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
      field: 'etat', 
      headerName: 'Etat', 
      flex: 1,
      valueGetter: (params) => {
        const etatValue = params.row.etat;
        if (etatValue === 'CLO') {
          return 'Cloturé';
        } else if (etatValue === 'ELA') {
          return 'En cours d\'élaboration';
        } else if (etatValue === 'DIS') {
          return 'Mise à disposition';
        } else {
          return etatValue; // Return the original value if it's not one of the specified values
        }
      }
    },    { field: 'periode', headerName: 'Période', flex: 1 },
    { 
      field: 'debutReponse', 
      headerName: 'Début Réponse', 
      flex: 1,
      valueGetter: (params) => {
        const debutReponse = new Date(params.row.debutReponse);
        return debutReponse.toLocaleDateString('fr-FR'); // Format date as DD/MM/YYYY
      }
    },
    { 
      field: 'finReponse', 
      headerName: 'Fin Réponse', 
      flex: 1,
      valueGetter: (params) => {
        const finReponse = new Date(params.row.finReponse);
        return finReponse.toLocaleDateString('fr-FR'); // Format date as DD/MM/YYYY
      }
    },
  ];

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
      <Button style={{ textTransform: 'none' }} variant='contained' color="primary" startIcon={<AddIcon />}>
        Ajouter
      </Button>
      </div>
      <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
        <DataGrid
        localeText={localizedTextsMap}
        hideFooter={true}
          rows={evaluations}
          columns={columns}
          pageSize={5}
          checkboxSelection={false} // Remove the select checkbox
          sortingOrder={['asc', 'desc']} // Set sorting order
          getRowId={(row) => row.id} // Set a unique identifier for each row
          onRowClick={(row) => { // Handle row click event
            // Redirect to detail page with the id of the clicked evaluation
            window.location.href = `/Evaluation/${row.id}`;
          }}
          rowClassName={(params) => { // Apply CSS class to each row
            return 'pointer'; // Set cursor style to pointer
          }}
        />
      </div>
    </div>
    </div>
  );
}

export default Evaluation;
