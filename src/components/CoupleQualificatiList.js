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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchQualificatifs();
      const rowsWithId = data.map((row, index) => ({ ...row.qualificatif, id: index + 1, associated : row.associated }));
      setCoupleQualificatifs(rowsWithId);
    } catch (error) {
      console.error('Error fetching couple qualificatifs:', error);
    }
  };
  

  const columns = [
    { field: 'minimal', headerName: 'Minimal', width: 300 },
    { field: 'maximal', headerName: 'Maximal', width: 300 },
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
    } catch (error) {
      setDeleteError('Failed to delete qualificatif');
      setDeleteSuccess(false);
      console.error('Error deleting qualificatif:', error);
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
  
      const response = await addCouple(minimalValue, maximalValue);
  
      if (response.status === 200) {
        // Refresh data grid after adding couple
        fetchData();
  
        setMinimalValue('');
        setMaximalValue('');
        setOpenAddDialog(false);
      } else if (response.status === 400) {
        console.error('Failed to add couple:', response.statusText);
        // Display generic error message to the user
        alert('Couple déjà existe');
      }
    } catch (error) {
      console.error('Error adding couple:', error.message);
      // Display generic error message to the user
      alert('Couple déjà existe');
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
      setCoupleQualificatifs(updatedCoupleQualificatifs);
      setMinimalValue('');
      setMaximalValue('');
      setOpenEditDialog(false);
      setEditRow(null);
    } catch (error) {
      console.error('Error updating qualificatif:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ marginLeft: '25vw', marginTop: '20vh', marginBottom: '20px', width: 'calc(80% - 220px)' }}>
        <Button variant="contained" color="primary" onClick={handleAjouterCouple}>
          Ajouter Couple
        </Button>
      </div>
      <div style={{ marginLeft: '25vw', width: 'calc(80% - 220px)' }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={coupleQualificatifs} columns={columns} pageSize={5} />
        </div>
      </div>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Ajouter Couple</DialogTitle>
        <DialogContent>
          <TextField
            label="Minimal"
            value={minimalValue}
            onChange={(e) => setMinimalValue(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Maximal"
            value={maximalValue}
            onChange={(e) => setMaximalValue(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCouple} color="primary">
            Ajouter
          </Button>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
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
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Maximal"
            value={maximalValue}
            onChange={(e) => setMaximalValue(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateQualificatif} color="primary">
            Modifier
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteConfirmation)} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete this qualificatif?</div>
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

      {deleteSuccess && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Qualificatif deleted successfully!
        </Alert>
      )}
      {deleteError && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Failed to delete qualificatif!
        </Alert>
      )}
    </div>
  );
};

export default CoupleQualificatifList;
