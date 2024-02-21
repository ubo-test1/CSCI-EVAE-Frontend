import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import Navbar from './navbar'; // Import Navbar component
import Sidebar from './sideBar'; // Import Sidebar component
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid component from Material-UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components

function EvaluationDetails() {

  const { id } = useParams(); // Get the id parameter from the route
  const [details, setDetails] = useState(null);
  const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const getEvaluationDetails = async () => {
      try {
        console.log("text wla chi l3iba: "+id);
        const data = await fetchEvaluationDetails(id);
        setDetails(data);
      } catch (error) {
        // Handle error
        console.error('Error fetching evaluation details:', error);
      }
    };
    getEvaluationDetails();
  }, [id]); // Fetch details whenever ID changes

  if (!details) {
    return <div>Loading...</div>;
  }

  const evaluationDetails = details.evaluation;
  const rubriques = details.rubriques;

  // Function to render questions for a rubrique
  const renderQuestions = (questions) => {
    if (questions.length === 0) {
      return <p>No questions available for this rubrique.</p>;
    } else {
      return (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      );
    }
  };

  // Open dialog to show questions for selected rubrique
  const handleShowQuestions = (questions) => {

    setSelectedRubriqueQuestions(questions);
    setDialogOpen(true);
  };
  

  // Define columns for rubriques table
  const columns = [
    { field: 'rubrique', headerName: 'Rubrique', width: 200 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'questions',
      headerName: 'Questions',
      width: 300,
      renderCell: (params) =>
  params.value.length > 0 ? (
    <Button onClick={() => handleShowQuestions(params.value)}>Show Questions</Button>
  ) : (
    <span>No Questions</span>
  ),

    },
  ];

  // Define rows for rubriques table
  const rows = rubriques.map((rubrique, index) => ({
    id: index,
    rubrique: rubrique.rubrique.designation,
    order: rubrique.rubrique.ordre,
    questions: rubrique.questions, // Pass the entire questions array
  }));

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="evaluationContainer" style={{ marginLeft: '300px',  marginRight: '50px' }}>
      <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Designation</TableCell>
        <TableCell>Promotion</TableCell>
        <TableCell>Nom de Formation</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>{evaluationDetails.designation}</TableCell>
        <TableCell>{evaluationDetails.promotion.id.codeFormation} - {evaluationDetails.promotion.id.anneeUniversitaire}</TableCell>
        <TableCell>{evaluationDetails.promotion.codeFormation.nomFormation}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      </div>
      <Dialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  maxWidth="md"
>
  <DialogTitle>Questions</DialogTitle>
  <DialogContent>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={selectedRubriqueQuestions}
        columns={[
          { field: 'intitule', headerName: 'Intitule', flex: 1 },
          { 
            field: 'idQualificatif.maximal',
            headerName: 'Maximal',
            flex: 1,
            valueGetter: (params) => params.row.idQualificatif.maximal
          },
          { 
            field: 'idQualificatif.minimal',
            headerName: 'Minimal',
            flex: 1,
            valueGetter: (params) => params.row.idQualificatif.minimal
          },
        ]}
        pageSize={5}
      />
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>



    </div>
  );
}

export default EvaluationDetails;
