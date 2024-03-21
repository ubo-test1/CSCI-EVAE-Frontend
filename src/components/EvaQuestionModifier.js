import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, IconButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogContentText from '@material-ui/core/DialogContentText';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon
import { fetchRubEvaDetailsApi } from '../api/fetchRubEvaDetailsApi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {deleteQev} from "../api/deleteQev";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import {addQtoRubApi} from "../api/addQtoRubApi";
import {delQfromRubApi} from "../api/delQfromRubApi";
import {updateRubriqueApi} from "../api/updateRubriqueApi";
import {fetchRubriqueDetails} from "../api/fetchRubriqueDetailsApi";
import {fetchQuestionStandards} from "../api/fetchQuestionStandardsApi";
import {fetchAllQuestions} from "../api/fetchQuestions";
import Checkbox from "@mui/material/Checkbox";
import {DataGrid} from "@mui/x-data-grid";
import { addQtoRubEva } from "../api/addQtoRubEva";
import { ordonnerQuestions } from '../api/updateEvaQstOrderApi';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';



const EvaQuestionModifier = ({ rubriqueId }) => { // Accept rubriqueId as a parameter
    const [rubriqueQuestions, setRubriqueQuestions] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [availQ, setAvailQ] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [initialQuestionsOrder, setInitialQuestionsOrder] = useState([])
    const [change, setChange] = useState(false)
    const [saveButtonVisible, setSaveButtonVisible] = useState(false); // New state variable to track whether to show the "Sauvegarder" button
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
    const [latestAction, setLatestAction] = useState(null);



    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetchRubEvaDetailsApi(rubriqueId);
                let questions = response.questions ? response.questions.map(q => ({ ...q })) : [];

                // Sort the questions by the 'ordre' attribute
                questions.sort((a, b) => a.ordre - b.ordre);

                setRubriqueQuestions(questions);

                const availableQuestions = await fetchAllQuestions();
                setAvailQ(availableQuestions.filter(q2 =>
                    !questions.some(q => q.idQuestion.id === q2.id)
                ));
                console.log("this is the orderrrrrrrr " + JSON.stringify(questions))
                setChange(false);
            } catch (error) {
                console.error('Error fetching rubrique details:', error);
            }
        };

        fetchQuestions();
    }, [rubriqueId, change]);

    const handleHideAlert = () => {
        setShowAlert(false);
      };


    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(rubriqueQuestions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedItems = items.map((item, index) => ({ ...item, ordre: index + 1 }));
        console.log("this is the updatttee ::: " + JSON.stringify(updatedItems))
        setRubriqueQuestions(updatedItems);
        setSaveButtonVisible(true); // Set save button visibility to true when the order is changed
    };
    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };
    const handleConfirmationConfirm = () => {
        console.log("eeeeeeeeeh selectedQuestion ::: " + JSON.stringify(selectedQuestion))
        deleteQev(selectedQuestion.id)
            .then(response => {
                setShowAlert(true)
                setLatestAction("deleteQuestion")
                setChange(true)
            })
            .catch(error => {
                setShowAlert(true)
                setLatestAction("deleteQuestionError")
            });
        setConfirmationOpen(false);
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
        setChange(true)
    };
    const resetQuestionsOrder = () => {
        setChange(true);
        setSaveButtonVisible(false); // Reset save button visibility when resetting order
    };

    const handleCheckboxChange = (event, question) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedQuestions(prevSelected => [...prevSelected, { id: question.id, question }]);
        } else {
            setSelectedQuestions(prevSelected =>
                prevSelected.filter(selected => selected.id !== question.id)
            );
        }
    };

    const handleSaveOrder = async () => {
        const formattedQuestions = rubriqueQuestions.map(({ id, ordre }) => ({ id, ordre }));

        console.log("Formatted questions:", formattedQuestions);

        try {
            await ordonnerQuestions(formattedQuestions);
            setSaveButtonVisible(false); // Hide the "Sauvegarder" button after saving
            console.log('Questions ordered successfully');
            // You can add any additional logic here after successfully saving the order
            setShowAlert(true)
            setLatestAction('setOrder')
            setChange(true)
        } catch (error) {
            console.error('Error ordering questions:', error);
            // Handle the error as needed
        }
    };



    // Function to handle the click on the trashcan icon
    const handleDeleteClick = (id, intit, event) => {
        event.stopPropagation(); // Prevent accordion from toggling
        setSelectedQuestion({ id, intit });
        setConfirmationOpen(true);
    };
    const renderEditRubrique = () => {
        if (loading) {
            return <CircularProgress />;
        }

        // Sort fullQuestions array based on whether the question is checked and its intitule
        const sortedQuestions = availQ.sort((a, b) => {
            // If a is checked and b is not, a comes first
            if (selectedQuestions.some(q => q.id === a.id) && !selectedQuestions.some(q => q.id === b.id)) {
                return -1;
            }
            // If b is checked and a is not, b comes first
            if (!selectedQuestions.some(q => q.id === a.id) && selectedQuestions.some(q => q.id === b.id)) {
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
                        checked={selectedQuestions.some(q => q.id === params.row.id)}
                        onChange={(event) => handleCheckboxChange(event, params.row)}
                    />
                ),
            },
        ];

        return (
            <div style={{ height: 400, width: '100%' }}>
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

    const handleEditConfirmed = async () => {
        console.log(selectedQuestions)
        let ret = {
            "id_rubEva" : rubriqueId,
            "qList" : []
        }
        let qlist = []
        selectedQuestions.forEach(q => {
            qlist.push(q.question.id)
        });
        ret["qList"] = qlist
        addQtoRubEva(ret);
        setShowAlert(true)
        setLatestAction("deleteQuestion")
        setEditDialogOpen(false)
        setChange(true)
        setShowAlert(true)
        setLatestAction("addQuestion")
        /*
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
        }*/
    };

    const handleEditClick = async (rubriqueId) => {
        setEditDialogOpen(true);
        /*try {
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
        }*/
    };

    return (
        <>
        <Paper style={{ margin: '50px', minHeight: '70vh' }}>
    <Typography variant="h4" style={{ marginBottom: '20px', marginLeft:'20px' }}>Modifier les questions</Typography>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  width:'98%', margin:'auto auto 20px auto' }}>
        <div style={{width:'70%'}}>
            <Button variant="contained" onClick={handleEditClick} style={{ textTransform: 'none' }}>
                Ajouter des questions
            </Button>
        </div>
        {/* Conditional rendering of the "Sauvegarder" button */}
        {saveButtonVisible && (
            <Button variant="contained" onClick={resetQuestionsOrder} style={{ marginRight: '40px',width:'20%', textTransform: 'none' }} color='error'>
                Réinitialiser l'ordre
            </Button>
            )}
        {saveButtonVisible && (
            <Button variant="contained" onClick={handleSaveOrder} style={{width:'20%', textTransform: 'none' }} color="success">
                Valider l'ordre
            </Button>
        )}
    </div>
    <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{width:'98%', margin:'auto'}}>
                        {rubriqueQuestions.map((question, index) => (
                            <Draggable key={question.idQuestion + index} draggableId={question.idQuestion + index.toString()} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps}>
                                        <Accordion {...provided.dragHandleProps}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ alignItems: 'center' }}>
                                            <Typography>{question.idQuestion.intitule}</Typography>
                                            <div style={{ marginLeft: 'auto', display: 'flex' }}>
                                                <IconButton onClick={(event) => handleDeleteClick(question.id, question.idQuestion.intitule, event)} size="small" color="error"
                                                style={{
                                                    cursor: 'pointer',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: '50px',
                                                    transform: 'translateY(-50%)',
                                                }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography>Minimal: {question.idQuestion.idQualificatif.minimal}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>Maximal: {question.idQuestion.idQualificatif.maximal}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
</Paper>





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
                <DialogTitle>Ajouter des questions</DialogTitle>
                <DialogContent>
                    {renderEditRubrique()}
                </DialogContent>
                <DialogActions>
                <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleEditConfirmed} color="primary">Confirmer</Button>
                    <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleCloseDialog} color="secondary">Annuler</Button>
                </DialogActions>
            </Dialog>




            <Dialog
                open={confirmationOpen}
                onClose={handleConfirmationClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedQuestion && `Voulez-vous vraiment supprimer la question "${selectedQuestion.intit}" ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmationConfirm} color="primary" autoFocus>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
            {showAlert && latestAction === 'deleteQuestion' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Question supprimé avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction === 'deleteQuestionError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
            Question liee a une evaluation active, suppression impossible!
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction === 'addQuestion' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Question ajouté avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction === 'addQuestionError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Échec de l'ajout de l'évaluation (évaluation existe déjà) !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction === 'edit' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Évaluation modifié avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction==='editError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Échec de la modification de l'évaluation (évaluation existe déjà) !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction==='setOrder' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Ordre modifié avec succées
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
    {showAlert && latestAction==='setOrderError' && (
        <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          Erreur lors de la modification de l'ordre
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
    )}
        </>
    );



};

export default EvaQuestionModifier;