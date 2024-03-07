import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { updateQuestion } from '../api/updateQuestionApi';
import { fetchQuestionStandards } from '../api/fetchQuestionStandardsApi';
import { fetchQualificatifs } from '../api/fetchQualificatifsApi';
import { saveQuestion } from '../api/addQuestionApi';
import DeleteQuestionDialog from './deleteQuestionDialog';
import { deleteQuestion } from '../api/deleteQuestionApi';
import Navbar from './navbar';
import Sidebar from './sideBar';

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [openAjouterModal, setOpenAjouterModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [types, setTypes] = useState([]); // State to hold the list of types
  const [coupleQualificatifs, setCoupleQualificatifs] = useState([]); // State to hold the list of couple qualificatifs
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
  const [currentPath, setCurrentPath] = useState('');


  const [minimalMaximalValues, setMinimalMaximalValues] = useState([]);
  const [selectedCoupleQualificatif, setSelectedCoupleQualificatif] = useState('');
  const [modifiedIntitule, setModifiedIntitule] = useState('');
  const [modifiedType, setModifiedType] = useState('');
  const [modifiedCoupleQualificatif, setModifiedCoupleQualificatif] = useState('');
  const [newQuestionIntitule, setNewQuestionIntitule] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('');
  const [newQuestionCoupleQualificatif, setNewQuestionCoupleQualificatif] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [user, setUser] = useState(null);

  const userString = sessionStorage.getItem('user');
  const userObject = userString
  const accessToken = userObject.accessToken;

  console.log("Access Token:", accessToken);


  const handleOpenDeleteDialog = (questionId) => {
    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };
  const handleDelete = async (id) => {
    // Display a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this question?');

    // If confirmed, proceed with deletion
    if (confirmed) {
      try {
        const message = await deleteQuestion(id);
        setRows(prevRows => prevRows.filter(row => row.id !== id));
        alert(message); // Display the message to the user
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };
  


  const handleCoupleQualificatifChange = (event) => {
    setSelectedCoupleQualificatif(event.target.value);
  };
  const handleAjouterQuestion = async () => {
    try {
      const selectedCoupleId = newQuestionCoupleQualificatif.split('-')[0];
      const questionData = {
        idQuestion: 3,
        intitule: newQuestionIntitule,
        type: 'QUS', // Set type to 'QUS'
        idQualificatif: { id: selectedCoupleId },
      };
  
      // Send the request to create the question
      await saveQuestion(questionData);
  
      // Display a success message to the user
      alert('Question créée avec succès');
  
      // Close the modal
      handleAjouterModalClose();
  
      // Fetch the updated list of questions
      fetchQuestionStandards()
        .then((questionStandards) => {
          if (questionStandards) {
            const formattedRows = questionStandards.map((standard, index) => ({
              id: standard.question.id,
              intitule: standard.question.intitule,
              type: standard.question.type,
              coupleQualificatif: `${standard.question.idQualificatif.minimal}-${standard.question.idQualificatif.maximal}`,
              associated: standard.associated,
            }));
            setRows(formattedRows);
          }
        })
        .catch((error) => {
          console.error('Error fetching question standards:', error);
        });
    } catch (error) {
      console.error('Error creating question:', error);
      alert("Une erreur s'est produite lors de la création de la question");
    }
  };
  
  
  
  
  
  const columns = [
    { field: 'intitule', headerName: 'Intitulé', width: 450 },
    { field: 'coupleQualificatif', headerName: 'Couple Qualificatif', width: 250 },
    /*{
      field: 'associated',
      headerName: 'Associé',
      width: 150,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="primary" /> : null
      ),
    },*/
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div>
                    {params.row.associated ? (
          <Tooltip title="Referencé" arrow placement="top">
            <span>
              <IconButton onClick={() => handleModify(params.row.id)} color="primary" disabled style={{
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        pointerEvents: 'none',
                                    }}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
                              ) : (
<Tooltip title="Modifier">
                            <IconButton color="primary" onClick={() => handleModify(params.row.id)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                                            )}

{params.row.associated ? (
                        <Tooltip title="Referencé">
                            <span>
                                <IconButton
                                    disabled
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Supprimer">
                            <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
        </div>
      ),
    },
  ];
  
  useEffect(() => {
    fetchQuestionStandards()
      .then(questionStandards => {
        if (questionStandards) {
          const formattedRows = questionStandards.map((standard, index) => ({
            id: standard.question.id,
            intitule: standard.question.intitule,
            type: standard.question.type,
            coupleQualificatif: `${standard.question.idQualificatif.minimal}-${standard.question.idQualificatif.maximal}`,
            associated: standard.associated
          }));
          setRows(formattedRows);
        }
      })
      .catch(error => {
        console.error('Error fetching question standards:', error);
      });

    // Fetch the list of types
    setTypes(['QUS']); // Replace with your actual list of types

    // Fetch minimal and maximal values
    fetchQualificatifs()
  .then(data => {
    console.log("Couple Qualificatif response:", data);
if (data && Array.isArray(data) && data.length > 0) {
  console.log("THIS IS THE ID ::: " + JSON.stringify(data))
  const formattedCoupleQualificatifs = data.map(item => `${item.qualificatif.id}-${item.qualificatif.minimal}-${item.qualificatif.maximal}`);
  setCoupleQualificatifs(formattedCoupleQualificatifs);
} else {
  console.error('Data received is not in the expected format');
}

  })
  .catch(error => {
    console.error('Error fetching couple qualificatifs:', error);
  });

  }, []);

  


  const handleAjouterModalOpen = () => {
    setOpenAjouterModal(true);
  };

  const handleAjouterModalClose = () => {
    setOpenAjouterModal(false);
  };

  const handleModifyModalClose = () => {
    setOpenModifyModal(false);
    setSelectedQuestion(null); // Reset selectedQuestion after closing the modify modal
  };

  const handleModify = (id) => {
    const questionToModify = rows.find(row => row.id === id);
    if (questionToModify) {
      setSelectedQuestion({ ...questionToModify, id: id });
      // Set modifiedType to 'QUS'
      setModifiedType('QUS');
      setModifiedIntitule(questionToModify.intitule);
      setModifiedCoupleQualificatif(questionToModify.coupleQualificatif);
      setSelectedCoupleQualificatif(questionToModify.coupleQualificatif);
      setOpenModifyModal(true);
    }
  };


const handleUpdate = () => {
  //const [qualificatifId, minimalValue, maximalValue] = modifiedCoupleQualificatif.split('-');
  const holderQualificatif = modifiedCoupleQualificatif.split('-')
  const qualificatifId = holderQualificatif[0]
  const minimalValue = holderQualificatif[2]
  const maximalValue = holderQualificatif[1]
  console.log("this is the ID :::: " + qualificatifId)
  console.log("this is the minimal :::: " + minimalValue)

  console.log("this is the maximal :::: " + maximalValue)



  //console.log("this is the MAXXX : " + maximalValue)
  

  const updatedQuestion = {
    id: selectedQuestion.id,
    type: modifiedType,
    intitule: modifiedIntitule,
    idQualificatif: {
      id: parseInt(qualificatifId)
    },
    //coupleQualificatif: `${minimalValue}-${maximalValue}`
  };
  console.log("THE NEW INFORMATION §§§§ "  + JSON.stringify(updatedQuestion));

  // Send the update request to the server
  updateQuestion(updatedQuestion)
    .then(updatedQuestion => {
      // Update the rows state with the modified question data
      const updatedRows = rows.map(row => {
        if (row.id === selectedQuestion.id) {
          return {
            ...row,
            intitule: updatedQuestion.intitule,
            type: updatedQuestion.type,
            coupleQualificatif: `${minimalValue}-${maximalValue}`
          };
        }
        return row;
      });

      setRows(updatedRows); // Update the rows state
      console.log('Question updated successfully:', updatedQuestion);
      handleModifyModalClose();
    })
    .catch(error => {
      console.error('Failed to update question:', error);
    });
};


  


return (
  <>
<Navbar isLoggedIn={isLoggedIn} userInfo={user} pageTitle={currentPath === '/questionStandards' ? 'Questions Standards' : 'CSCI-EVAE'} />
    <Sidebar />

    <div className="dataTableContainer" style={{ width: '80%', margin: 'auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAjouterModalOpen}>
          Ajouter Question
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        style={{ width: '80%' }}
      />
      {/* Ajouter Question Modal */}
      <Dialog open={openAjouterModal} onClose={handleAjouterModalClose}>
        <DialogTitle>Ajouter Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Intitulé"
            fullWidth
            value={newQuestionIntitule}
            onChange={(e) => setNewQuestionIntitule(e.target.value)}
            style={{ width: '100%', margin: 'auto' }}
          />
          <TextField
            select
            label="Couple Qualificatifs"
            fullWidth
            value={newQuestionCoupleQualificatif}
            onChange={(e) => setNewQuestionCoupleQualificatif(e.target.value)}
          >
            {coupleQualificatifs.map((couple, index) => (
              <MenuItem key={index} value={couple}>
                {couple}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAjouterModalClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleAjouterQuestion} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modify Question Modal */}
      <Dialog open={openModifyModal} onClose={handleModifyModalClose}>
        <DialogTitle>Modifier Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Intitulé"
            fullWidth
            value={modifiedIntitule}
            onChange={(e) => setModifiedIntitule(e.target.value)}
          />
          <TextField
            select
            label="Couple Qualificatifs"
            fullWidth
            value={modifiedCoupleQualificatif}
            onChange={(e) => setModifiedCoupleQualificatif(e.target.value)}
          >
            {coupleQualificatifs.map((couple, index) => (
              <MenuItem key={index} value={couple}>
                {couple}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModifyModalClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
      <DeleteQuestionDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
        questionId={questionToDelete}
      />
    </div>
  </>
);

};

export default DataTable;
