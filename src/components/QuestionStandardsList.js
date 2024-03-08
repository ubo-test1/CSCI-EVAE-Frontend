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
import Alert from '@mui/material/Alert';
import { useStepContext } from '@mui/material';
import { fetchQualificatifById } from '../api/fetchCoupleById';
import { getQuestionById } from '../api/fetchQuestionById';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from "@mui/material/InputAdornment";



const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [openAjouterModal, setOpenAjouterModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [types, setTypes] = useState([]); // State to hold the list of types
  const [coupleQualificatifs, setCoupleQualificatifs] = useState([]); // State to hold the list of couple qualificatifs
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
  const [currentPath, setCurrentPath] = useState('');
  const [latestAction, setLatestAction] = useState(null);
  const [coupleQualificatifError, setCoupleQualificatifError] = useState(false);
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
  const [showAlert, setShowAlert] = useState(true);

  const [intituleValue,setIntituleValue] = useState('')
  const [intituleError, setIntituleError] = useState(false);
  const userString = sessionStorage.getItem('user');
  const userObject = userString
  const accessToken = userObject.accessToken;


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
  const handleOpenDeleteDialog = (id) => {
    setQuestionToDelete(id); // Set the ID of the question to be deleted
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteQuestion(id);
      setRows(prevRows => prevRows.filter(row => row.id !== id));
      setShowAlert(true);
      setLatestAction('delete');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting question:', error);
      setShowAlert(true);
      setLatestAction('deleteError');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleAjouterQuestion = async (selectedCoupleId, newQuestionIntitule) => {
    try {
      // Check if the new question intitulé is empty
      if (!selectedCoupleId && newQuestionIntitule.trim()=="") {
        setCoupleQualificatifError(true);
        setIntituleError(true);  // Set error state if intitulé is empty
        return;
      }
      if (newQuestionIntitule.trim()=="") {
        setIntituleError(true); // Set error state if intitulé is empty
        return;
      }
      if(!selectedCoupleId){
        setCoupleQualificatifError(true);
        return;
      }

      // Check if the selected couple ID is valid
      const selectedCouple = coupleQualificatifs.find(couple => couple.qualificatif.id === selectedCoupleId);
      if (!selectedCouple) {
        setShowAlert(true);
        setLatestAction('addError');
        return;
      }

      const questionData = {
        idQuestion: 3,
        intitule: newQuestionIntitule,
        type: 'QUS', // Set type to 'QUS'
        idQualificatif: { id: selectedCoupleId },
      };
  
      // Send the request to create the question
      await saveQuestion(questionData);
  
      // Display a success message to the user
      setShowAlert(true);
      setLatestAction('add');
  
      // Close the modal
      handleAjouterModalClose();
  
      // Fetch the updated list of questions
      fetchQuestionStandards()
        .then(questionStandards => {
          if (questionStandards) {
            const formattedRows = questionStandards.map((standard, index) => ({
              id: standard.question.id,
              intitule: standard.question.intitule,
              type: standard.question.type,
              coupleQualificatif: `${standard.question.idQualificatif.minimal} / ${standard.question.idQualificatif.maximal}`,
              associated: standard.associated
            }));

            // Sort formattedRows by intitule
            formattedRows.sort((a, b) => a.intitule.localeCompare(b.intitule));

            setRows(formattedRows);
          }
        })
        .catch((error) => {
          console.error('Error fetching question standards:', error);
        });
    } catch (error) {
      console.error('Error creating question:', error);
      setShowAlert(true);
      setLatestAction("addError")
      setOpenAjouterModal(false)
    }
  };
  
  
  
  const columns = [
    { field: 'intitule', headerName: 'Intitulé', width: 500 },
    { field: 'coupleQualificatif', headerName: 'Couple qualificatif', width: 500 },
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
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div>
          <Tooltip title="Modifier la question" arrow placement="top">
            <span>
              <IconButton onClick={() => handleModify(params.row.id)} color="primary" disabled={params.row.associated}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Supprimer la question" arrow placement="top">
  <span>
    <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)} color="secondary" disabled={params.row.associated}>
      <DeleteIcon />
    </IconButton>
  </span>
</Tooltip>


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
            coupleQualificatif: `${standard.question.idQualificatif.minimal} / ${standard.question.idQualificatif.maximal}`,
            associated: standard.associated
          }));

          // Sort formattedRows by intitule
          formattedRows.sort((a, b) => a.intitule.localeCompare(b.intitule));

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
        setCoupleQualificatifs(data);
      } else {
        console.error('Data received is not in the expected format');
      }
    })
    .catch(error => {
      console.error('Error fetching couple qualificatifs:', error);
    });
}, []); // Empty dependency array means this effect will run once after the first render


  


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

  const handleModify = async (id) => {
    try {
      const questionToModify = rows.find(row => row.id === id);
      if (questionToModify) {
        setSelectedQuestion({ ...questionToModify, id: id });
        // Set modifiedType to 'QUS'
        setModifiedType('QUS');

        // Fetch question details including the couple qualificatif
        const questionDetails = await getQuestionById(id);

        // Extract relevant information from the response
        const intitule = questionDetails.intitule;
        const qualificatifId = questionDetails.idQualificatif.id;

        // Set the modified intitule and couple qualificatif ID
        setModifiedIntitule(intitule);
        setModifiedCoupleQualificatif(qualificatifId); // Set ID instead of formatted string

        setOpenModifyModal(true);
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };


  const handleBlur = (value, setValue, setError) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "" || trimmedValue.length <= 64) {
      setValue(trimmedValue);
      setError(false); // Reset error state when value is valid
    } else {
      setError(true); // Set error state when value is invalid
    }
  };

  const handleModifyCoupleQualificatifChange = (event) => {
    setModifiedCoupleQualificatif(event.target.value);
  };
  
  const handleUpdate = async () => {
    try {
        const response = await fetchQualificatifById(modifiedCoupleQualificatif);
        console.log("this is the responsssseee ::::  " + JSON.stringify(response))
        const qualificatif = response; // Assuming the response has a data field containing the qualificatif object
        console.log("Fetched Qualificatif:", qualificatif);

        const updatedQuestion = {
            id: selectedQuestion.id,
            type: modifiedType,
            intitule: modifiedIntitule,
            idQualificatif: {
                id: qualificatif.id
            },
            coupleQualificatif: `${qualificatif.minimal}-${qualificatif.maximal}`
        };

        console.log("Updated Question:", updatedQuestion);

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
                            coupleQualificatif: `${qualificatif.minimal} / ${qualificatif.maximal}`
                        };
                    }
                    return row;
                });

                setRows(updatedRows); // Update the rows state
                setShowAlert(true);
                setLatestAction('edit');
                console.log('Question updated successfully:', updatedQuestion);
                handleModifyModalClose();
            })
            .catch(error => {
              setShowAlert(true);
              setLatestAction('editError');
                console.error('Failed to update question:', error);
            });
    } catch (error) {
        console.error('Failed to fetch qualificatif:', error);
    }
};



  


return (
  <>
<Navbar isLoggedIn={isLoggedIn} userInfo={user} pageTitle={currentPath === '/questionStandards' ? 'Questions Standards' : 'CSCI-EVAE'} />
    <Sidebar />


      <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
        <Button style={{ textTransform: 'none' }} variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAjouterModalOpen}>
          Ajouter
        </Button>
      </div>
      <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
        <DataGrid
  rows={rows}
  columns={columns}
  style={{ width: '100%' }}
  hideFooter={true}
  className="customDataGrid"
  rowHeight={30}
  pageSize={10}
  localeText={localizedTextsMap}
/>

      </div>
      </div>
      {/* Ajouter Question Modal */}
      <Dialog open={openAjouterModal} onClose={handleAjouterModalClose}>
        <DialogTitle>Ajouter une question standard</DialogTitle>
        <DialogContent>
            <form
                style={{
                    height:'21vh',
                    width :'30vw',
                    justifyContent:'space-between',
                    display:'flex',
                    flexDirection :'column'
                }}
                noValidate>

        <TextField
  label="Intitulé"
  fullWidth
  value={newQuestionIntitule}
  onChange={(e) => {
    setNewQuestionIntitule(e.target.value);
    setIntituleError(false); // Reset error state when value changes
  }}
  onBlur={() => handleBlur(newQuestionIntitule, setNewQuestionIntitule, setIntituleError)}
  error={intituleError}
  helperText={intituleError ? "L'intitulé est requis" : ""}
  style={{ width: '100%', margin: 'auto' }}
  required
  inputProps={{ maxLength: 64 }}
  InputProps={{
      endAdornment: (
          <InputAdornment position="end">
              {`${newQuestionIntitule.length}/64`}
          </InputAdornment>
      ),
  }}
/>


<TextField
  select
  label="Couple Qualificatifs"
  fullWidth
  value={modifiedCoupleQualificatif}
  onChange={(e) => {
    setModifiedCoupleQualificatif(e.target.value);
    setCoupleQualificatifError(false); // Reset error state when value changes
  }}
  error={coupleQualificatifError}
  helperText={coupleQualificatifError ? "Le couple qualificatif est requis" : ""}
  required
>
  {coupleQualificatifs.map((couple) => (
    <MenuItem key={couple.qualificatif.id} value={couple.qualificatif.id}>
      {`${couple.qualificatif.minimal}-${couple.qualificatif.maximal}`}
    </MenuItem>
  ))}
</TextField>
            </form>
        </DialogContent>
        <DialogActions>
        <Button
        style={{ textTransform: 'none' }}
  variant='contained'
  onClick={() => {
    // Check if the new question intitulé is empty and no couple qualificatif is selected
    if (!modifiedCoupleQualificatif && !newQuestionIntitule.trim()) {
      setCoupleQualificatifError(true);
      setIntituleError(true);  // Set error state if intitulé is empty
      return;
    }

    // Check if the new question intitulé is empty
    if (!newQuestionIntitule.trim()) {
      setIntituleError(true); // Set error state if intitulé is empty
      return;
    }

    // Check if no couple qualificatif is selected
    if (!modifiedCoupleQualificatif) {
      setCoupleQualificatifError(true);
      return;
    }

    // Extract the selected couple ID
    const selectedCoupleId = modifiedCoupleQualificatif;

    // Reset error states when valid inputs are provided
    setCoupleQualificatifError(false);
    setIntituleError(false);

    // Call handleAjouterQuestion with the selected couple ID and new question intitule
    handleAjouterQuestion(selectedCoupleId, newQuestionIntitule);
  }}
  color="primary"
>
  Ajouter
</Button>

          <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleAjouterModalClose} color="secondary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for delete confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent style={{fontFamily:'Roboto'}}>
          Êtes-vous sûr de vouloir supprimer cette question ?
        </DialogContent>
        <DialogActions>
          <Button style={{ textTransform: 'none' }} variant='contained' onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button style={{ textTransform: 'none' }} variant='contained' onClick={() => handleDeleteConfirm(questionToDelete)} color="secondary">Supprimer</Button>
        </DialogActions>
      </Dialog>
      {/* Modify Question Modal */}
      <Dialog open={openModifyModal} onClose={handleModifyModalClose}>
        <DialogTitle>Modifier une question standard</DialogTitle>
        <DialogContent>
            <form
                style={{
                    paddingTop:'10px',
                    height:'21vh',
                    width :'30vw',
                    justifyContent:'space-between',
                    display:'flex',
                    flexDirection :'column'
                }}
                noValidate>
          <TextField
              label="Intitulé"
              fullWidth
              value={modifiedIntitule}
              onChange={(e) => {
                  setModifiedIntitule(e.target.value);
                  setIntituleError(false); // Reset error state when value changes
              }}
              onBlur={() => handleBlur(modifiedIntitule, setModifiedIntitule, setIntituleError)}
              error={intituleError}
              helperText={intituleError ? "L'intitulé est requis" : ""}
              inputProps={{ maxLength: 64 }}
              InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                          {`${modifiedIntitule.length}/64`}
                      </InputAdornment>
                  ),
              }}
          />
          <TextField
  select
  label="Couple Qualificatifs"
  fullWidth
  value={modifiedCoupleQualificatif} // Make sure this holds the ID of the qualificatif
  onChange={handleModifyCoupleQualificatifChange}
>
  {coupleQualificatifs.map((couple, index) => (
    <MenuItem key={index} value={couple.qualificatif.id}>
      {`${couple.qualificatif.minimal} / ${couple.qualificatif.maximal}`}
    </MenuItem>
  ))}
</TextField>

                </form>
        </DialogContent>
        <DialogActions>
            <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleUpdate} color="primary">
                Modifier
            </Button>
          <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleModifyModalClose} color="secondary">
            Annuler
          </Button>

        </DialogActions>
      </Dialog>
      {showAlert && latestAction === 'delete' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Question standard supprimé avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'deleteError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de la suppression de la question standard !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
{showAlert && latestAction === 'add' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Question standard ajouté avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'addError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de l'ajout de la question standard (la question existe déjà) !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
{showAlert && latestAction === 'edit' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Question standard modifié avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction==='editError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de la modification de la question standard (la question existe déjà) !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
  </>
);

};

export default DataTable;
