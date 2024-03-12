import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,TextField  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluations } from '../api/fetchEvaluations';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { localizedTextsMap } from './dataGridLanguage';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [designation, setDesignation] = useState('');
  const [etat, setEtat] = useState('');
  const [periode, setPeriode] = useState('');
  const [debutReponse, setDebutReponse] = useState('');
  const [finReponse, setFinReponse] = useState('');
  useEffect(() => {
    async function getEvaluations() {
      try {
        const data = await fetchEvaluations();
        console.log("this ish ishish " + JSON.stringify(data))
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();
  }, []);
  const handleConsult = (id) => {
    // Redirect to detail page with the id of the clicked evaluation
    window.location.href = `/Evaluation/${id}`;
  };
  const handleConfirmation = () => {
    // Perform edit action here using selectedItemId
    setOpenDialog(false);
  };

  const handleEdit = (id, row) => {
    setSelectedItemId(id);
    console.log("thishsish " + JSON.stringify(row))
    setDesignation(row.designation);
    setEtat(row.etat);
    setPeriode(row.periode);
    setDebutReponse(row.debutReponse);
    setFinReponse(row.finReponse);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    // Handle delete logic here
    console.log('Delete evaluation with ID:', id);
  };
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
    },
    { field: 'periode', headerName: 'Période', flex: 2 },
    { 
      field: 'debutReponse', 
      headerName: 'Début Réponse', 
      flex: 1,
      valueGetter: (params) => {
        const debutReponse = new Date(params.row.debutReponse);
        return debutReponse.toLocaleDateString('fr-FR');
      }
    },
    { 
      field: 'finReponse', 
      headerName: 'Fin Réponse', 
      flex: 1,
      valueGetter: (params) => {
        const finReponse = new Date(params.row.finReponse);
        return finReponse.toLocaleDateString('fr-FR');
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleConsult(params.row.id)} style={{ color: 'green' }}><VisibilityIcon /></IconButton>
<IconButton onClick={() => handleEdit(params.row.id)} color="primary"><EditIcon /></IconButton>
<IconButton onClick={() => handleDelete(params.row.id)} color="secondary"><DeleteIcon /></IconButton>

        </div>
      ),
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
          rowClassName={(params) => { // Apply CSS class to each row
            return 'pointer'; // Set cursor style to pointer
          }}
        />
      </div>
    </div>
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Evaluation</DialogTitle>
        <DialogContent>
          <TextField
            label="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Etat"
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Période"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Début Réponse"
            value={debutReponse}
            onChange={(e) => setDebutReponse(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fin Réponse"
            value={finReponse}
            onChange={(e) => setFinReponse(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmation} color="primary">
            Confirmer
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
  );
}

export default Evaluation;
