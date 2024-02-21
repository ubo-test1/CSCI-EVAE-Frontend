import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './navbar';
import Sidebar from './sideBar';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchAllStandardRubriques } from '../api/fetchRubriques';
import { deleteRubriqueApi } from '../api/deleteRubriqueApi';
import { updateRubriqueApi } from '../api/updateRubriqueApi';
import { createRubriqueAndAssignQuestions } from '../api/createRubriqueAndAssignQuestions';
import { createRubriqueApi, assignQuestionsToRubrique } from '../api/createRubriqueAndAssignQuestions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchQuestionStandards } from '../api/fetchQuestionStandardsApi';

const RubriqueList = () => {
  const [rubriques, setRubriques] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRubrique, setEditRubrique] = useState({
    id: null,
    type: '',
    noEnseignant: null,
    designation: '',
    ordre: null
  });
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState(null);
  const [ajouterDialogOpen, setAjouterDialogOpen] = useState(false);
  const [ajouterDesignation, setAjouterDesignation] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchAllStandardRubriques();
      setRubriques(data);
    } catch (error) {
      console.error('Error fetching rubriques:', error);
    }
  };
  const generateUniqueIds = (data) => {
    return data.map((item, index) => {
      return { ...item, id: index + 1 }; // Generate unique ID based on the index
    });
  };

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const fetchedQuestions = await fetchQuestionStandards();
      const questionsWithUniqueIds = generateUniqueIds(fetchedQuestions);
      setQuestions(questionsWithUniqueIds);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleDeleteConfirmation = (row) => {
    setDeleteConfirmation(row);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRubriqueApi(deleteConfirmation.rubrique.id);
      setEditSuccess(true);
      setEditError(null);
      setDeleteConfirmation(null);
      // Remove the deleted row from the list
      const updatedRubriques = rubriques.filter((rubrique) => rubrique.rubrique.id !== deleteConfirmation.rubrique.id);
      setRubriques(updatedRubriques);
    } catch (error) {
      setEditError('Failed to delete rubrique');
      setEditSuccess(false);
      console.error('Error deleting rubrique:', error);
    }
  };

  const handleEdit = (row) => {
    setEditRubrique({
      id: row.rubrique.id,
      type: row.rubrique.type,
      noEnseignant: row.rubrique.noEnseignant,
      designation: row.rubrique.designation,
      ordre: row.rubrique.ordre
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    // Reset editRubrique to its initial values
    setEditRubrique({
      id: null,
      type: '',
      noEnseignant: null,
      designation: '',
      ordre: null
    });
  };
  
  const handleEditSubmit = async () => {
    try {
      const response = await updateRubriqueApi(editRubrique);
      if (response.success) {
        setEditSuccess(true);
        setEditError(null);
        setEditDialogOpen(false);
        fetchData();
      } else {
        setEditError('Failed to update rubrique');
        setEditSuccess(false);
        console.error('Error updating rubrique:', response.error);
      }
    } catch (error) {
      console.error('Error updating rubrique:', error);
      setEditError('Failed to update rubrique');
      setEditSuccess(false);
    }
  };

  const handleAjouterDialogOpen = () => {
    fetchQuestions(); // Fetch questions when "Ajouter Rubrique" button is clicked
    setAjouterDialogOpen(true);
  };

  const handleAjouterDialogClose = () => {
    setAjouterDialogOpen(false);
    setAjouterDesignation('');
    setSelectedQuestions([]);
  };

  const handleAjouterSubmit = async () => {
    try {
      const response = await createRubriqueAndAssignQuestions(ajouterDesignation, selectedQuestions.map(question => question.id), sessionStorage.getItem('accessToken'));
      if (response) {
        setEditSuccess(true);
        setEditError(null);
        setAjouterDialogOpen(false);
        fetchData();
      } else {
        setEditError('Failed to create rubrique and assign questions');
        setEditSuccess(false);
        console.error('Error creating rubrique and assigning questions');
      }
    } catch (error) {
      console.error('Error creating rubrique and assigning questions:', error);
      setEditError('Failed to create rubrique and assign questions');
      setEditSuccess(false);
    }
  };

  const columns = [
    { field: 'rubrique.designation', headerName: 'Designation', width: 300, valueGetter: (params) => params.row.rubrique.designation },
    { field: 'rubrique.ordre', headerName: 'Ordre', width: 150, valueGetter: (params) => params.row.rubrique.ordre },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <Button
              startIcon={<EditIcon />}
              onClick={() => handleEdit(params.row)}
              color="primary"
              disabled={params.row.associated}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteConfirmation(params.row)}
              color="secondary"
              disabled={params.row.associated}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="actions">
        <Button variant="contained" onClick={handleAjouterDialogOpen}>Ajouter Rubrique</Button>
      </div>
      <div className="grid-container">
        <DataGrid rows={rubriques} columns={columns} pageSize={5} getRowId={(row) => row.rubrique.id} />
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteConfirmation)} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete this rubrique?</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit rubrique dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Rubrique</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="designation"
            label="Designation"
            type="text"
            fullWidth
            value={editRubrique.designation}
            onChange={(e) => setEditRubrique({ ...editRubrique, designation: e.target.value })}
          />
          <TextField
            margin="dense"
            id="ordre"
            label="Ordre"
            type="number"
            fullWidth
            value={editRubrique.ordre}
            onChange={(e) => setEditRubrique({ ...editRubrique, ordre: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Ajouter rubrique dialog */}
      <Dialog open={ajouterDialogOpen} onClose={handleAjouterDialogClose}>
        <DialogTitle>Ajouter Rubrique</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="designation"
            label="Designation"
            type="text"
            fullWidth
            value={ajouterDesignation}
            onChange={(e) => setAjouterDesignation(e.target.value)}
          />
          <div style={{ height: 400, width: '100%' }}>
          <DataGrid
  rows={questions}
  columns={[
    { field: 'id', headerName: 'ID', width: 100 }, // Optional: If you want to display the ID
    { field: 'intitule', headerName: 'Intitule', width: 300,valueGetter: (params) => params.row.question.intitule },
    { field: 'idQualificatif.minimal', headerName: 'Minimal', width: 150, valueGetter: (params) => params.row.question.idQualificatif.minimal },
    { field: 'idQualificatif.maximal', headerName: 'Maximal', width: 150, valueGetter: (params) => params.row.question.idQualificatif.maximal }
  ]}
  pageSize={5}
  checkboxSelection
  loading={questionsLoading}
  selectionModel={selectedQuestions}
  onSelectionModelChange={(newSelection) => setSelectedQuestions(newSelection.selectionModel)}
  getRowId={(row) => row.id} // Assuming 'id' is the unique identifier of each question
/>


          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAjouterDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAjouterSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Display edit success and error alerts */}
      {editSuccess && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Rubrique updated successfully!
        </Alert>
      )}
      {editError && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Failed to update rubrique!
        </Alert>
      )}
    </div>
  );
};

export default RubriqueList;
