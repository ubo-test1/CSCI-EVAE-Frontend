import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluations } from '../api/fetchEvaluations';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
    { field: 'etat', headerName: 'Etat', flex: 1 },
    { field: 'periode', headerName: 'Période', flex: 1 },
    { field: 'debutReponse', headerName: 'Début Réponse', flex: 1 },
    { field: 'finReponse', headerName: 'Fin Réponse', flex: 1 },
  ];

  return (
    <div className="evaluationContainer">
      <Navbar />
      <Sidebar />
      <div style={{ height: 400, width: '100%' }}> {/* Set height and width for DataGrid */}
        <DataGrid
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
  );
}

export default Evaluation;
