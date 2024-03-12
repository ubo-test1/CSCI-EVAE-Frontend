import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { fetchAllStandardRubriques } from '../api/fetchRubriques';
import { fetchQuestionStandards } from '../api/fetchQuestionStandardsApi';
import { fetchRubriqueDetails } from '../api/fetchRubriqueDetailsApi';; // Import the API function for fetching rubrique details
import { createRubriqueAndAssignQuestions } from '../api/createRubriqueAndAssignQuestions';
import { deleteRubriqueApi } from '../api/deleteRubriqueApi';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DialogContentText from '@mui/material/DialogContentText';
import {updateRubriqueApi} from '../api/updateRubriqueApi';
import { addQtoRubApi } from '../api/addQtoRubApi';
import { delQfromRubApi } from '../api/delQfromRubApi';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress'; 
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { localizedTextsMap } from './dataGridLanguage';


const RubriqueList = () => {
    const [rubriques, setRubriques] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [designation, setDesignation] = useState('');
    const [questionStandards, setQuestionStandards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rubriqueToDelete, setRubriqueToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRubrique, setSelectedRubrique] = useState(null);
    const [fullQuestions, setFullQuestions] = useState([]);
    const [initialCheckState, setInitialCheckState] = useState(false);
    const [checkedQuestions, setCheckedQuestions] = useState([]);
    const [srvQuestions, setSrvQuestions] = useState([]);
    const [toAdd, setToAdd] = useState([])
    const [toDel, setToDel] = useState([])
    const [latestAction, setLatestAction] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
  const [designationError, setDesignationError] = useState(false);




      const handleBlur = () => {
        // Remove leading and trailing spaces and update the state
        const trimmedValue = designation.trim();
        setDesignation(trimmedValue);
        // Set error state if the trimmed value is invalid
        if (trimmedValue === '' || trimmedValue.length <= 64) {
          setDesignationError(false); // Reset error state when value is valid
        } else {
          setDesignationError(true); // Set error state when value is invalid
        }
      };
      const handleHideAlert = () => {
        setShowAlert(false);
      };
    useEffect(() => {
        fetchRubriques();
        sessionStorage.setItem('toAdd', JSON.stringify([]));
        sessionStorage.setItem('toDel', JSON.stringify([]));
    }, []);

    const fetchRubriques = async () => {
        try {
            const data = await fetchAllStandardRubriques();
            const sortedRubriques = data.map((rubrique) => ({
                ...rubrique.rubrique,
                associated: rubrique.associated
            })).sort((a, b) => a.designation.localeCompare(b.designation));
    
            setRubriques(sortedRubriques);
        } catch (error) {
            console.error('Error fetching rubriques:', error);
        }
    };
    

    const fetchRubriqueDetailsById = async (id) => {
        try {
            const data = await fetchRubriqueDetails(id);
            return data;
        } catch (error) {
            console.error('Error fetching rubrique details:', error);
        }
    };

    const handleEditClick = async (rubriqueId) => {
        setEditDialogOpen(true);
        try {
            setLoading(true);
            const rubriqueDetails = await fetchRubriqueDetails(rubriqueId);
            console.log(rubriqueDetails)
            if ('rubrique' in rubriqueDetails) {
                setSelectedRubrique(rubriqueDetails.rubrique);
            } else {
                setSelectedRubrique(rubriqueDetails);
            }
            const modifiedQuestions = (rubriqueDetails.questions || []).map(question => ({
                ...question,
                received: true
            }));
            console.log("Modified")
            console.log(modifiedQuestions)
            let mergedQuestions = [];
            const data = await fetchQuestionStandards();
            const filteredData = data.filter(question => !modifiedQuestions.some(modifiedQuestion => modifiedQuestion.intitule === question.question.intitule));
            console.log(filteredData)

            let test1 = []

            filteredData.forEach(element => {
                test1.push(element.question)
            });

            // Concatenate the selected questions with the merged questions
            mergedQuestions = [...modifiedQuestions, ...test1];

            console.log("Merged")
            console.log(mergedQuestions)
    
            // Update state
            setDesignation(rubriqueDetails.designation || rubriqueDetails.rubrique.designation);
            setFullQuestions(mergedQuestions);
            setCheckedQuestions(modifiedQuestions)
            setSrvQuestions(modifiedQuestions)

            console.log("Srv questions")
            console.log(srvQuestions)
            
            console.log(rubriqueDetails.rubrique)
            setQuestionStandards(data);
        } catch (error) {
            console.error('Error fetching rubrique details:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleEditConfirmed = async () => {
        try {
            setLoading(true);
            console.log("this is the new designation ::: " + selectedRubrique.designation)
            let updateReq = {
                "id" : selectedRubrique.id,
                "type" : selectedRubrique.type,
                "noEnseignant" : selectedRubrique.noEnseignant,
                "designation" : designation,
                "ordre" : selectedRubrique.ordre
            }

            let addQReq = {
                "rubriqueId" : selectedRubrique.id,
                "qList" : JSON.parse(sessionStorage.getItem('toAdd'))
            }

            let delQReq = {
                "rubriqueId" : selectedRubrique.id,
                "qList" : JSON.parse(sessionStorage.getItem('toDel'))
            }
            if(JSON.parse(sessionStorage.getItem('toAdd')).length > 0){
                const addq = await addQtoRubApi(addQReq);
                if (addq) {
                    console.log('questions added successfully');
                    fetchRubriques();
                    setShowAlert(true);
                    setLatestAction("edit")
                } else {
                    alert('Failed to add quests');
                    setShowAlert(true);
                    setLatestAction("editError")
                }
            }

            if(JSON.parse(sessionStorage.getItem('toDel')).length > 0){
                const delq = await delQfromRubApi(delQReq);
                if (delq) {
                    console.log('questions deleted successfully');
                    fetchRubriques();
                    setShowAlert(true);
                    setLatestAction("edit")
                } else {
                    alert('Failed to update rubrique');
                    setShowAlert(true);
                    setLatestAction("editError")
                }
            }

            const update = await updateRubriqueApi(updateReq);
                if (update.success) {
                    console.log('rubrique updated successfully');
                    fetchRubriques();
                    setShowAlert(true);
                    setLatestAction("edit")
                } else {
                    setShowAlert(true);
                    setLatestAction("editError")
                }
                
            
        } catch (error) {
            console.error('Error updating rubrique:', error);
        } finally {
            setLoading(false);
            handleCloseDialog();
        }
    };

    const handleAjouterRubrique = async () => {
        setOpenDialog(true);
        try {
            setLoading(true);
            const data = await fetchQuestionStandards();
            console.log("this is the questions data " + data)
            const sortedData = data.sort((a, b) => a.question.intitule.localeCompare(b.question.intitule));
            setQuestionStandards(sortedData);
        } catch (error) {
            console.error('Error fetching question standards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRubrique = async () => {
        try {
            setLoading(true);
            if(designation.trim()==""){
                console.log("i am in the empty designation ::::: ")
                setDesignationError(true);
                setOpenDialog(true);
                return;
            }
            const success = await createRubriqueAndAssignQuestions(designation, selectedQuestions.map(question => question.question.id), sessionStorage.getItem('accessToken'));
            if (success) {
                console.log('Rubrique created and questions assigned successfully');
                fetchRubriques(); // Refresh the rubriques data after adding a rubrique
                setShowAlert(true);
                setLatestAction("add")
                handleCloseDialog();

            } else {
                console.error('Failed to create rubrique or assign questions');
                setShowAlert(true);
                setLatestAction("addError")

            }
        } catch (error) {
            console.error('Error creating rubrique and assigning questions:', error);
            setShowAlert(true);
            setLatestAction("addError")

        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (rubriqueId) => {
        setRubriqueToDelete(rubriqueId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const { success, error } = await deleteRubriqueApi(rubriqueToDelete);
            if (success) {
                console.log('Rubrique deleted successfully');
                fetchRubriques(); // Refresh the rubriques data after deleting a rubrique
                setShowAlert(true);
                setLatestAction("delete")

            } else {
                console.error('Error deleting rubrique:', error);
                setShowAlert(true);
                setLatestAction("deleteError")
            }
        } catch (error) {
            console.error('Error deleting rubrique:', error);
            setShowAlert(true);
            setLatestAction("deleteError")
        } finally {
            setDeleteDialogOpen(false);
            setRubriqueToDelete(null);
        }
    };

    const handleCloseDialog = () => {
        console.log("i am here")
        setOpenDialog(false);
        setEditDialogOpen(false)
        setDesignation('');
        setSelectedQuestions([]);
        setSelectedRubrique(null);
    };
    const handleDesignationChange = (event) => {
        const newValue = event.target.value;
        // Update the state with the new value
        setDesignation(newValue);
        // Reset error state when value changes
        setDesignationError(false);
      };
      
    /*const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    };*/

    function isSrv(question, array) {
        return array.some(element => {
            if (element.id === question.id) {
                return true;
            }
        });
    }
    

    const handleCheckboxChange = (event, question) => {
        if (initialCheckState === false) setInitialCheckState(true);
        const isChecked = event.target.checked;
        console.log("this is the ischecked value :::: " + isChecked)
        // Initialize toAdd and toDel in session storage if they don't exist
        if (!sessionStorage.getItem('toAdd')) sessionStorage.setItem('toAdd', JSON.stringify([]));
        if (!sessionStorage.getItem('toDel')) sessionStorage.setItem('toDel', JSON.stringify([]));
    
        // Deserialize toAdd and toDel from session storage
        let toAdd = JSON.parse(sessionStorage.getItem('toAdd'));
        let toDel = JSON.parse(sessionStorage.getItem('toDel'));
    
        if (isChecked) {
            setCheckedQuestions(prevChecked => [...prevChecked, question]);
            if (isSrv(question,srvQuestions)===false) {
                // Add question.id to toAdd
                toAdd = [...toAdd, question.id];
                sessionStorage.setItem('toAdd', JSON.stringify(toAdd));
            }
            else{
                toDel.pop(question.id)
                sessionStorage.setItem('toDel', JSON.stringify(toDel));
            }
        } else {
            setCheckedQuestions(prevChecked =>
                prevChecked.filter(selected => selected.id !== question.id)
            );

            if(isSrv(question,srvQuestions)===false){
                if (toAdd.includes(question.id)) {
                    toAdd = toAdd.filter(id => id !== question.id);
                    sessionStorage.setItem('toAdd', JSON.stringify(toAdd));
                }
                else{
                    alert("Err 306")
                }
            }
            else{
                toDel = [...toDel, question.id];
                sessionStorage.setItem('toDel', JSON.stringify(toDel));
            }
        
        }
        console.log("To add:")
        console.log(toAdd)
        console.log("To delete")
        console.log(toDel)
    
        event.target.checked = isChecked;
    };
    
    
    
    
    
    
    

    const handleCheckboxChange2 = (event, question) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedQuestions(prevSelected => [...prevSelected, { id: question.id, question }]);
        } else {
            setSelectedQuestions(prevSelected =>
                prevSelected.filter(selected => selected.id !== question.id)
            );
        }
    };
    
    

    const renderQuestionStandardsTable = () => {
        const columns = [
            { field: 'intitule', headerName: 'Intitule',flex : 4 },
            { field: 'minimal', headerName: 'Minimal', flex :2 },
            { field: 'maximal', headerName: 'Maximal', flex:  2},
            {
                field: 'action',
                headerName: 'Ajouter',
                flex: 1,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <Checkbox
                checked={selectedQuestions.some(q => q.id === params.row.id)}
                onChange={(event) => handleCheckboxChange2(event, params.row)}
            />
                ),
            },
        ];
    
        if (loading) {
            return <CircularProgress />;
        }

    
        return (
            <div style={{ height: 400, width: '100%' }}>
                <h3>Question Standards</h3>
                <DataGrid
                    localeText={localizedTextsMap}
                    hideFooter={true}
                    rows={questionStandards.map(question => ({
                        id: question.question.id, // Assuming each question has a unique id property
                        intitule: question.question.intitule,
                        minimal: question.question.idQualificatif.minimal,
                        maximal: question.question.idQualificatif.maximal,
                    }))}
                    columns={columns}
                    pageSize={5}
                />

            </div>
        );
    };
    const renderEditRubrique = () => {
        if (loading) {
            return <CircularProgress />;
        }
    
        // Sort fullQuestions array based on whether the question is checked and its intitule
        const sortedQuestions = fullQuestions.sort((a, b) => {
            // If a is checked and b is not, a comes first
            if (checkedQuestions.some(q => q.id === a.id) && !checkedQuestions.some(q => q.id === b.id)) {
                return -1;
            }
            // If b is checked and a is not, b comes first
            if (!checkedQuestions.some(q => q.id === a.id) && checkedQuestions.some(q => q.id === b.id)) {
                return 1;
            }
            // Otherwise, sort alphabetically
            return a.intitule.localeCompare(b.intitule);
        });
    
        const columns = [
            { field: 'intitule', headerName: 'Intitule', flex: 4 },
            { field: 'minimal', headerName: 'Minimal', flex: 2 },
            { field: 'maximal', headerName: 'Maximal', flex: 2 },
            {
                field: 'action',
                headerName: 'Ajouter',
                flex: 1,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Checkbox
                        checked={checkedQuestions.some(q => q.id === params.row.id)}
                        onChange={(event) => handleCheckboxChange(event, params.row)}
                    />
                ),
            },
        ];
    
        return (
            <div style={{ height: 400, width: '100%' }}>
                <h3>Question Standards</h3>
                <DataGrid
                    hideFooter={true}
                    rows={sortedQuestions.map((question) => ({
                        id: question.id,
                        intitule: question.intitule,
                        minimal: question.idQualificatif.minimal,
                        maximal: question.idQualificatif.maximal,
                    }))}
                    columns={columns}
                    pageSize={5}
                />
            </div>
        );
    };
    

    
    
    const columns = [
        { field: 'designation', headerName: 'Désignation', width: 1050 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div>
                    {params.row.associated ? (
                        <Tooltip title="Rubrique associé à une évaluation">
                            <span>
                                <IconButton
                                    disabled
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Modifier">
                            <IconButton color="primary" onClick={() => handleEditClick(params.row.id)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.associated ? (
                        <Tooltip title="Rubrique associé à une évaluation">
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
                            <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <Sidebar />
            <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
            <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleAjouterRubrique} color="primary" startIcon={<AddIcon />}>
                Ajouter
            </Button>
            </div>
            <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
                <div style={{ height: 450, width: '100%' }}>
                        <DataGrid pageSize={5} localeText={localizedTextsMap} hideFooter={true} className="customDataGrid" rowHeight={30} style={{ width: '100%' }} rows={rubriques} columns={columns} getRowId={(row) => row.id} />
                </div>
            </div>
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                        position: 'absolute',
                        width: '70vw', // Set width to 100vw
                        maxWidth: 'none',
                        marginTop: '10px',
                        maxHeight: 'none',
                        height: '80vh',
                    },
                }}
            >
    <DialogTitle>Ajouter une rubrique standard</DialogTitle>
    <DialogContent>
    <form
             style={{
                height:'85%',
                width :'100%',
                justifyContent:'space-evenly !important',
                  display:'flex',
                  flexDirection :'column',
                  margin:'0 !important'
            }}
            noValidate>
        <TextField
      autoFocus
      margin="dense"
      id="designation"
      label="Designation"
      fullWidth
      value={designation}
      onChange={handleDesignationChange}
      onBlur={handleBlur}
      error={designationError}
      helperText={designationError ? "La désignation est requise (max 64 caractères)" : ""}
      inputProps={{ maxLength: 32 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {`${designation.length}/32`}
          </InputAdornment>
        ),
      }}
      required
    />
        {renderQuestionStandardsTable()}
        </form>
    </DialogContent>
    <DialogActions>
        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCloseDialog} color="secondary">Annuler</Button>
        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleAddRubrique} color="primary">Ajouter</Button>
    </DialogActions>
</Dialog>
<Dialog
PaperProps={{
    style: {
        position: 'absolute',
        width: '70vw', // Set width to 100vw
        maxWidth: 'none',
        marginTop: '10px',
        maxHeight: 'none',
        height: '80vh',
    },
}}
open={editDialogOpen} onClose={handleCloseDialog}>
    <DialogTitle>Modifier la Rubrique</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="designation"
            label="Designation"
            fullWidth
            value={designation}
            onBlur={handleBlur}
            onChange={handleDesignationChange}
            inputProps={{ maxLength: 32 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {`${designation.length}/32`}
          </InputAdornment>
        ),
      }}
      required
        />
        {renderEditRubrique()}
    </DialogContent>
    <DialogActions>
        <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleCloseDialog} color="secondary">Annuler</Button>
        <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleEditConfirmed} color="primary">Sauvgarder</Button>
    </DialogActions>
</Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Supprimer une rubrique</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Etes-vous sûr de vouloir supprimer cette rubrique ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ textTransform: 'none' }} variant="contained" onClick={() => setDeleteDialogOpen(false)} color="secondary">
                    Annuler
                    </Button>
                    <Button style={{ textTransform: 'none' }} variant="contained" onClick={handleDeleteConfirmed} color="primary" autoFocus>
                    Supprimer
                    </Button>
                </DialogActions>

            </Dialog>
            {showAlert && latestAction === 'delete' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Rubrique standard supprimé avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'deleteError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de la suppression de la Rubrique standard !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
{showAlert && latestAction === 'add' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Rubrique standard ajouté avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'addError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de l'ajout de la Rubrique standard (la rubrique existe déjà) !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
{showAlert && latestAction === 'edit' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Rubrique standard modifié avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction==='editError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de la modification de la Rubrique standard (la rubrique existe déjà) !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
        </>
        
    );
};

export default RubriqueList;