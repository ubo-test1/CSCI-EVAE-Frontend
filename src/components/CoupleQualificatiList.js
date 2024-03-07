import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { fetchQualificatifs } from '../api/fetchQualificatifsApi';
import Navbar from './navbar';
import Sidebar from './sideBar';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { addCouple } from '../api/addCoupleQualificatifApi';
import { updateQualificatif } from '../api/updateCoupleQualificatifApi';
import { deleteQualificatif } from '../api/deleteCoupleQualificatifApi';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';




const CoupleQualificatifList = () => {
  const [coupleQualificatifs, setCoupleQualificatifs] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [minimalValue, setMinimalValue] = useState('');
  const [maximalValue, setMaximalValue] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState(null);
  const [minimalError, setMinimalError] = useState(false); // State to track minimal value error
  const [maximalError, setMaximalError] = useState(false); // State to track minimal value error
  const [latestAction, setLatestAction] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
 
  const localizedTextsMap = {
    columnMenuUnsort: "non classé",
    columnMenuSortAsc: "Trier par ordre croissant",
    columnMenuSortDesc: "Trier par ordre décroissant",
    columnMenuFilter: "Filtre",
    columnMenuHideColumn: "Cacher",
    columnMenuManageColumns: "Gérer les colonnes", // Add translation for "Manage Columns"
  };

 const handleHideAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchQualificatifs();
      const sortedRows = data.map((row) => ({ ...row.qualificatif, id: row.qualificatif.id, associated: row.associated }))
                            .sort((a, b) => a.minimal.localeCompare(b.minimal));
      console.log("Content of sortedRows:");
      sortedRows.forEach(row => {
        console.log(row);
      });
      setCoupleQualificatifs(sortedRows);
    } catch (error) {
      console.error('Error fetching couple qualificatifs:', error);
    }
  };
  


  const columns = [
    { field: 'minimal', headerName: 'Minimal', width: 450 },
    { field: 'maximal', headerName: 'Maximal', width: 450, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title={params.row.associated ? "Couple associé à une question" : "Modifier"}>
              
              <span>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(params.row)}
                  color="primary"
                  disabled={params.row.associated}
                >
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={params.row.associated ? "Couple associé à une question" : "Supprimer"}>
              <span>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteConfirmation(params.row)}
                  color="secondary"
                  disabled={params.row.associated}
                >
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    
  ];

  const handleEdit = (row) => {
    setEditRow(row);
    setMinimalValue(row.minimal);
    setMaximalValue(row.maximal);
    setOpenEditDialog(true);
  };

  const handleDeleteConfirmation = (row) => {
    setDeleteConfirmation(row);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteQualificatif(deleteConfirmation.id);
      setDeleteSuccess(true);
      setDeleteError(null);
      setDeleteConfirmation(null);
      // Remove the deleted row from the list
      const updatedCoupleQualificatifs = coupleQualificatifs.filter((couple) => couple.id !== deleteConfirmation.id);
      setCoupleQualificatifs(updatedCoupleQualificatifs);
      setShowAlert(true);
      setLatestAction('delete');
    } catch (error) {
      setDeleteError('Failed to delete qualificatif');
      setDeleteSuccess(false);
      console.error('Error deleting qualificatif:', error);
      setShowAlert(true);
      setLatestAction('deleteError')
    }
  };

  const handleAjouterCouple = () => {
    setOpenAddDialog(true);
  };

  const handleAddCouple = async () => {
    try {
      if (!minimalValue || !maximalValue) {
        throw new Error('Minimal and maximal values are required');
      }
  
      // Reset minimal and maximal error states
      setMinimalError(false);
      setMaximalError(false);
  
      const response = await addCouple(minimalValue, maximalValue);
  
      if (response.status === 200) {
        // Refresh data grid after adding couple
        fetchData();
  
        setMinimalValue('');
        setMaximalValue('');
        setOpenAddDialog(false);
  
        // Set success message
        setAddSuccess(true);
        setAddError(null);
        setShowAlert(true);
        setLatestAction('add');

      } else if (response.status === 400) {
        console.error('Failed to add couple:', response.statusText);
        alert('Couple qualificatif existe déjà !');
      }
    } catch (error) {
      console.error('Error adding couple:', error.message);
      console.log("yes")
      setAddSuccess(false);
        setAddError(true);
        setShowAlert(true);
        setLatestAction('addError');
        setOpenAddDialog(false);
  
      // Set minimal and maximal error states if values are not provided
      if (!minimalValue) {
        setMinimalError(true);
      }
      if (!maximalValue) {
        setMaximalError(true);
      }
  
      // Set error message
      setAddError('Failed to add couple qualificatif');
      setAddSuccess(false);
    }
  };
  
  
  


  const handleUpdateQualificatif = async () => {
    try {
      await updateQualificatif(editRow.id, minimalValue, maximalValue);
      const updatedCoupleQualificatifs = coupleQualificatifs.map((couple) => {
        if (couple.id === editRow.id) {
          return { ...couple, minimal: minimalValue, maximal: maximalValue };
        }
        return couple;
      });
      setEditSuccess(true);
      setEditError(null);
      setCoupleQualificatifs(updatedCoupleQualificatifs);
      setMinimalValue('');
      setMaximalValue('');
      setOpenEditDialog(false);
      setEditRow(null);
      setShowAlert(true);
      setLatestAction('edit');
    } catch (error) {
      console.error('Error updating qualificatif:', error);
      setShowAlert(true);
      setLatestAction('editError');
      setOpenEditDialog(false);


    }
  };

  const handleBlur = (value, setValue, setError) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "" || trimmedValue.length <= 16) {
      setValue(trimmedValue);
      setError(false);
    } else {
      setError(true);
    }
  };
  
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
      <Button variant='contained' onClick={handleAjouterCouple} color="primary" startIcon={<AddIcon />}>
  Ajouter
</Button>
      </div>
      <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
          <DataGrid localeText={localizedTextsMap} hideFooter={true} className="customDataGrid" rowHeight={30} style={{ width: '100%' }} rows={coupleQualificatifs} columns={columns} pageSize={10} />
        </div>
      </div>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Ajouter un couple qualificatif</DialogTitle>
        <DialogContent>
        <form noValidate>
        <TextField
  id="minimal"
  label="Minimal"
  value={minimalValue}
  onChange={(e) => setMinimalValue(e.target.value)}
  onBlur={() => handleBlur(minimalValue, setMinimalValue, setMinimalError)}
  fullWidth
  variant="outlined"
  error={minimalError}
  helperText={minimalError ? "La valeur minimale est requise" : ""}
  required
  inputProps={{ maxLength: 16 }}
/>
<TextField
  id="maximal"
  label="Maximal"
  value={maximalValue}
  onChange={(e) => setMaximalValue(e.target.value)}
  onBlur={() => handleBlur(maximalValue, setMaximalValue, setMaximalError)}
  fullWidth
  variant="outlined"
  error={maximalError}
  helperText={maximalError ? "La valeur maximale est requise" : ""}
  required
  inputProps={{ maxLength: 16 }}
/>
</form>




        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleAddCouple} color="primary">
            Ajouter
          </Button>
          <Button variant='contained' onClick={() => setOpenAddDialog(false)} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Modifier Couple</DialogTitle>
        <DialogContent>
        <TextField
  label="Minimal"
  value={minimalValue}
  onChange={(e) => setMinimalValue(e.target.value)}
  onBlur={() => handleBlur(minimalValue, setMinimalValue, setMinimalError)}
  fullWidth
  variant="outlined"
  margin="normal"
  error={minimalError}
  helperText={minimalError ? "Minimal value is required" : ""}
  required
  inputProps={{ maxLength: 16 }}
/>

<TextField
  label="Maximal"
  value={maximalValue}
  onChange={(e) => setMaximalValue(e.target.value)}
  onBlur={() => handleBlur(maximalValue, setMaximalValue, setMaximalError)}
  fullWidth
  variant="outlined"
  margin="normal"
  error={maximalError}
  helperText={maximalError ? "Maximal value is required" : ""}
  required
  inputProps={{ maxLength: 16 }}
/>

        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleUpdateQualificatif} color="primary">
            Modifier
          </Button>
          <Button variant='contained' onClick={() => setOpenEditDialog(false)} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteConfirmation)} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Êtes-vous sûr de vouloir supprimer ce couple qualificatif ?</div>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button variant='contained' onClick={handleDeleteConfirm} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {showAlert && latestAction === 'delete' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Couple qualificatif supprimé avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
      {showAlert && latestAction === 'deleteError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Échec de la suppression du couple qualificatif !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>

        </Alert>
      )}
      {showAlert && latestAction === 'add' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Couple qualificatif ajouté avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>

        </Alert>
      )}
      {showAlert && latestAction === 'addError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Échec de l'ajout du couple qualificatif (Couple existe déjà) !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
      {showAlert && latestAction === 'edit' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', alignItems:'center' }}>
          Couple qualificatif modifié avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>

        </Alert>
      )}
      {showAlert && latestAction === 'editError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Échec de la modification du couple qualificatif (Couple existe déjà) !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>

        </Alert>
      )}

    </div>
  );
};

export default CoupleQualificatifList;
