// DeleteQuestionDialog.js

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DeleteQuestionDialog = ({ isOpen, onClose, onDelete, questionId }) => {
  const handleDelete = () => {
    onDelete(questionId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        <p>Êtes-vous sûr de vouloir supprimer cette question ?</p>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button variant='contained' onClick={handleDelete} color="secondary">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteQuestionDialog;
