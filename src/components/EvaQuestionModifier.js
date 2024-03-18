import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, IconButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const EvaQuestionModifier = ({ rubriqueId }) => { // Accept rubriqueId as a parameter
    const [rubriqueQuestions, setRubriqueQuestions] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [availQ, setAvailQ] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetchRubEvaDetailsApi(rubriqueId);
                const questions = response.questions ? response.questions.map((q, index) => ({ ...q, ordre: index + 1 })) : [];
                setRubriqueQuestions(questions);
                const availableQuestions = await fetchAllQuestions();
                setAvailQ(availableQuestions.filter(q2 =>
                    !questions.some(q => q.idQuestion.id === q2.id)
                ));
            } catch (error) {
                console.error('Error fetching rubrique details:', error);
            }
        };

        fetchQuestions();
    }, [rubriqueId]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(rubriqueQuestions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedItems = items.map((item, index) => ({ ...item, ordre: index + 1 }));
        setRubriqueQuestions(updatedItems);
    };

    const handleCloseDialog = () => {
        console.log("close dia")
        setOpenDialog(false);
        setEditDialogOpen(false)
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


    // Function to handle the click on the trashcan icon
    const handleDeleteClick = (id, intit, event) => {
        event.stopPropagation(); // Prevent accordion from toggling
        const isConfirmed = window.confirm(`Voulez-vous vraiment supprimer la question ${intit}?`);
        if (isConfirmed) {
            deleteQev(id)
                .then(response => {
                    location.reload()
                })
                .catch(error => {
                    alert("Question liee a une evaluation active, suppression impossible!");
                });
        }
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
        alert("Edit confirmed")
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
        <Paper style={{ padding: '20px', margin: '20px', minHeight: '80vh' }}>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>Modifier les Questions</Typography>
            <Button variant="contained" onClick={() => {}} style={{ marginBottom: '20px' }}>
                Reset Order
            </Button>
            <Button variant="contained" onClick={handleEditClick} style={{ marginBottom: '20px' }}>
                Ajouter des questions
            </Button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {rubriqueQuestions.map((question, index) => (
                                <Draggable key={question.idQuestion + index} draggableId={question.idQuestion + index.toString()} index={index}>
                                    {(provided) => (
                                        <Accordion ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <IconButton onClick={(event) => handleDeleteClick(question.idQuestion.id,question.idQuestion.intitule, event)} size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Typography>{question.idQuestion.intitule}</Typography>
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
                    <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleCloseDialog} color="secondary">Annuler</Button>
                    <Button variant='contained' style={{ textTransform: 'none' }} onClick={handleEditConfirmed} color="primary">Sauvgarder</Button>
                </DialogActions>
            </Dialog>
        </>
    );

};

export default EvaQuestionModifier;