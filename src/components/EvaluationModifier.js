import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,FormControlLabel ,Checkbox , Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navbar from './navbar';
import SideBar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import evaluationBackgroundImg from '../img/evaluationContentBackground.png'
import { updateEvaOrdre } from '../api/updateEvaOrdre .js';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { fetchRubriqueDetails } from '../api/fetchRubriqueDetailsApi.js';
import { localizedTextsMap } from './dataGridLanguage';
import {fetchEvaRubQuesDetails} from "../api/fetchEvaRubQuesDetails";
import {fetchRubEvaDetailsApi} from "../api/fetchRubEvaDetailsApi";
import { useNavigate } from 'react-router-dom';
import { deleteEvaRub } from '../api/deleteEvaRub.js';
import EvaQuestionModifier from './EvaQuestionModifier.js';
import { fetchAllStandardRubriques } from '../api/fetchRubriques.js';
import { getAllByIdEvaluation } from '../api/fetchEvaRubriquesApi.js';
import { addRub } from '../api/addRubtoEvaApi.js';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

function EvaluationModifier() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rubriques, setRubriques] = useState([]);
    const [initialRubriquesOrder, setInitialRubriquesOrder] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [rubriqueQuestions, setRubriqueQuestions] = useState([]);
    const [rubriqueId, setRubriqueId] = useState(null); // Initialize rubriqueId state
    const [editDialogOpen1, setEditDialogOpen1] = useState(false);
    const [ajouterRubriquesOpenDialog, setajouterRubriquesOpenDialog] = useState(false);
    const [evaluationRubriques, setEvaluationRubriques] = useState([]);
    const [rubriquesAjouter, setRubriquesAjouter] = useState([])
    const [selectedRubriques, setSelectedRubriques] = useState([])
    const [change, setChange] = useState(false)
    const [showAlert, setShowAlert] = useState(true);
    const [latestAction, setLatestAction] = useState(null);

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        const rubriqueId = parseInt(value, 10); // Convert value to number
        setSelectedRubriques((prevSelected) => {
            if (prevSelected.includes(rubriqueId)) {
                console.log("Unchecked ID:", rubriqueId); // Log the unchecked ID
                return prevSelected.filter((id) => id !== rubriqueId);
            } else {
                console.log("Checked ID:", rubriqueId); // Log the checked ID
                return [...prevSelected, rubriqueId];
            }
        });
    };
    
    
    useEffect(() => {
        const getEvaluationDetails = async () => {
            try {
                const data = await fetchEvaRubQuesDetails(id);
                if (data?.rubriques) {
                    // Ensure rubriques are sorted by their initial order when fetched
                    const sortedRubriques = data.rubriques.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
                    setRubriques(sortedRubriques);
                    console.log(sortedRubriques)
                    // Capture the initial order of rubrique IDs
                    setInitialRubriquesOrder(sortedRubriques.map(rubrique => rubrique.rubrique.id));
                }
                setDetails(data);
                setChange(false)
            } catch (error) {
                console.error('Error fetching evaluation details:', error);
            }
        };
        if (id) {
            getEvaluationDetails();
        }
    }, [id,change]);

    const handleRetourClick = () => {
        window.history.back();
        console.log('Retour button clicked');
    };
    const handleHideAlert = () => {
        setShowAlert(false);
      };
    const handleAjouter = async () => {
        try {
            // Extracting the evaluation ID from the URL
            const evaluationId = parseInt(window.location.pathname.split('/').pop(), 10);
            console.log("this is the id of the eva: ::: " + evaluationId);
            
            // Create an array of objects with eva and rub properties
            const requestBody = selectedRubriques.map(rubriqueId => ({ eva: 1, rub: rubriqueId }));
            
            // Send all requests simultaneously and wait for all to complete
            await Promise.all(requestBody.map(obj => addRub(obj)));
            
        } catch (error) {
            console.error('Error adding rubrique:', error);
            setShowAlert(true)
            setLatestAction("addError")
        } finally {
            // Close the dialog regardless of the outcome
            setajouterRubriquesOpenDialog(false);
            setChange(true);
            setShowAlert(true)
            setLatestAction("add")
        }
    };
    
    
    
    
    
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const handleEditClick = async (rubriqueId) => {
        console.log("i am here" + rubriqueId)
        setRubriqueId(rubriqueId); // Set the rubriqueId in the state
        setEditDialogOpen1(true);
      };

    const handleEditDialogClose1 = () => {
        setEditDialogOpen1(false);
    };
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    if (details === null) {
        return null;
    }
    const getRemainingRubriques = () => {
        const evaluationRubriqueIds = evaluationRubriques.map(evaluation => evaluation.idRubrique.id);
        const remainingRubriques = rubriquesAjouter.filter(rubrique => !evaluationRubriqueIds.includes(rubrique.rubrique.id));
        console.log("before ::: " + JSON.stringify(remainingRubriques))
        return remainingRubriques;
    };
    const handleButtonClick = async () => {
        try {
            // Fetch evaluation rubriques
            const evaluationRubriques = await getAllByIdEvaluation(1);
            const evalRubriqueIds = evaluationRubriques.map(evalRubrique => evalRubrique.idRubrique.id);
    
            // Fetch all standard rubriques
            const standardRubriques = await fetchAllStandardRubriques();
    
            // Filter out the standard rubriques not present in evaluation rubriques
            const remainingRubriques = standardRubriques.filter(standardRubrique => !evalRubriqueIds.includes(standardRubrique.rubrique.id));
    
            // Fetch details for each remaining rubrique and append questions data
            const remainingRubriquesWithQuestions = await Promise.all(remainingRubriques.map(async (rubrique) => {
                const rubriqueDetails = await fetchRubriqueDetails(rubrique.rubrique.id);
                return {
                    ...rubrique,
                    questions: rubriqueDetails.questions
                };
            }));
    
            // Set state variables
            setEvaluationRubriques(evaluationRubriques);
            setRubriquesAjouter(remainingRubriquesWithQuestions);
            setajouterRubriquesOpenDialog(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    

    const handleCloseDialog = () => {
        setajouterRubriquesOpenDialog(false);
    };
    const evaluationDetails = details.evaluation;

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(
            rubriques,
            result.source.index,
            result.destination.index
        );
        const updatedRubriques = items.map((rubrique, index) => ({
            ...rubrique,
            rubrique: {
                ...rubrique.rubrique,
                ordre: index + 1
            }
        }));
        setRubriques(updatedRubriques);
        setShowSaveButton(true);
    };

    const resetOrder = () => {
        // Use the initialRubriquesOrder to reset the rubriques to their initial state
        const orderedRubriques = initialRubriquesOrder.map((id, index) => {
            const rubrique = rubriques.find(r => r.rubrique.id === id);
            return {
                ...rubrique,
                rubrique: {
                    ...rubrique.rubrique,
                    ordre: index + 1, // Reset the order based on the initial order
                },
            };
        });
        setRubriques(orderedRubriques);
        setShowSaveButton(false);
    };
    

    function updateData() {
        let ret = []
        rubriques.forEach(rubrique => {
            ret.push({
                "id": rubrique.rubrique.id,
                "ordre": rubrique.rubrique.ordre
            })
        });
        updateEvaOrdre(ret)
            .then(response => {
                alert("Succes");
                setShowSaveButton(false);
            })
            .catch(error => {
                alert("Erreur en modifiant l'ordre");
                console.error('Error updating ordre:', error);
            });
    }

    const rmRub = (rubriqueId, desi) => {
        const isConfirmed = window.confirm(`Voulez-vous vraiment supprimer la rubrique ${desi}?`);
        if (isConfirmed) {
            deleteEvaRub(rubriqueId)
                .then(response => {
                    location.reload()
                })
                .catch(error => {
                    alert("Rubrique liee, suppression impossible!");
                });
        }
    };

    return (
        <>
            <Navbar />
            <SideBar />
            <div className="evaluationContainer" style={{ position: 'absolute', left: '0vw', top: '17vh', width: '80%', margin: 'auto', display: 'flex' }}>
                <div style={{ position: 'fixed', left: '10vw', top: '17vh', zIndex: '1', textAlign: 'left', width: '50%' }}>
                    <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleRetourClick}>
                        Retour
                    </Button>
                </div>
                <div className='evaluationImage'>
                    <img src={evaluationBackgroundImg} />
                </div>
                <div className='evaluationInfo'>
                    <div style={{ margin: '4px', padding: '8px' }}><strong>Désignation:</strong> {evaluationDetails.designation}</div>
                    <div style={{ margin: '4px', padding: '8px' }}><strong> Promotion:</strong> {evaluationDetails.promotion.id.codeFormation} - {evaluationDetails.promotion.id.anneeUniversitaire}</div>
                    <div style={{ margin: '4px', padding: '8px' }}> <strong>Element Constitutif:</strong> {evaluationDetails.elementConstitutif ? evaluationDetails.elementConstitutif.id.codeEc : ""}</div>
                    <div style={{ margin: '4px', padding: '8px' }}><strong> Unité d'enseignement:</strong> {evaluationDetails.uniteEnseignement.id.codeUe}</div>
                </div>

                <div style={{ marginTop: '70px', overflowX: 'auto', width: '50%' }}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {rubriques.map((rubrique, index) => (
                                            <Draggable key={rubrique.rubrique.id} draggableId={rubrique.rubrique.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps}>
                                                        <Accordion style={{ marginBottom: '10px' }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} {...provided.dragHandleProps}>
                                                            <Typography>{rubrique.rubrique.idRubrique.designation}</Typography>
                                                            {/* Edit Icon */}
                                                            <IconButton
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '90px', // Adjust the position for the edit icon
                                                                    transform: 'translateY(-50%)',
                                                                }}
                                                                color="primary" // Set the color of the Edit IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent accordion from expanding
                                                                    handleEditClick(rubrique.rubrique.id); // Call handleEditClick function with rubrique id
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            {/* Delete Icon */}
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent accordion from expanding
                                                                    rmRub(rubrique.rubrique.id, rubrique.rubrique.designation); // Call the deletion handler
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '50px',
                                                                    transform: 'translateY(-50%)',
                                                                }}
                                                                color="error" // Set the color of the Delete IconButton
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </AccordionSummary>

                                                            <AccordionDetails>
                                                                <div style={{ maxHeight: 'none', overflow: 'hidden' }}>
                                                                    {rubrique.questions.length > 0 ? (
                                                                        <TableContainer component={Paper}>
                                                                            <Table>
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Intitulé</TableCell>
                                                                                        <TableCell>Minimal</TableCell>
                                                                                        <TableCell>Maximal</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {rubrique.questions.map((question, qIndex) => (
                                                                                        <TableRow key={qIndex}>
                                                                                            <TableCell>{question.idQuestion.intitule}</TableCell>
                                                                                            <TableCell>{question.idQuestion.idQualificatif.minimal}</TableCell>
                                                                                            <TableCell>{question.idQuestion.idQualificatif.maximal}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="body1" style={{ margin: '10px' }}>
                                                                            Aucune question
                                                                        </Typography>
                                                                    )}
                                                                </div>
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
                    </div>
                    <div style={{ position: 'absolute', bottom: '-5vh', right: '0', zIndex: '999' }}>
                        <Button variant="contained" color="primary" onClick={handleButtonClick}>
                            Ajouter des rubriques
                        </Button>
                    </div>

                </div>
                <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md">
                <DialogTitle>Modifier les questions</DialogTitle>
                <DialogContent>
                    <div style={{ height: 400, width: '50vw' }}>
                        <DataGrid
                            rows={rubriqueQuestions}
                            columns={[
                                { field: 'intitule', headerName: 'Intitulé', flex: 2,  valueGetter: (params) => params.row.idQuestion.intitule},
                                {
                                    field: 'idQualificatif.minimal',
                                    headerName: 'Minimal',
                                    flex: 1,
                                    valueGetter: (params) => params.row.idQuestion.idQualificatif.minimal
                                },
                                {
                                    field: 'idQualificatif.maximal',
                                    headerName: 'Maximal',
                                    flex: 1,
                                    valueGetter: (params) => params.row.idQuestion.idQualificatif.maximal
                                },
                            ]}
                            pageSize={5}
                            hideFooter={true}
                            localeText={localizedTextsMap}

                        />
                    </div>
                </DialogContent>



                <DialogActions>
                    {/* Button to close the edit dialog */}
                    <Button onClick={handleEditDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
                {showSaveButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateData}
                        style={{ position: 'absolute', top: '0', right: '0', zIndex: '999' }}
                    >
                        Sauvegarder
                    </Button>
                )}
                {showSaveButton && (
                    <Button
                        variant="contained"
                        color="error" // Change color to error for red color
                        onClick={resetOrder}
                        style={{ position: 'absolute', top: '0', right: '150px', zIndex: '999' }}
                    >
                        Réinitialiser
                    </Button>
                
                )}
            </div>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
                <DialogTitle>Questions</DialogTitle>
                <DialogContent>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={selectedRubriqueQuestions}
                            columns={[
                                { field: 'intitule', headerName: 'Intitule', flex: 1 },
                                {
                                    field: 'idQualificatif.maximal',
                                    headerName: 'Maximal',
                                    flex: 1,
                                    valueGetter: (params) => params.row.idQualificatif.maximal
                                },
                                {
                                    field: 'idQualificatif.minimal',
                                    headerName: 'Minimal',
                                    flex: 1,
                                    valueGetter: (params) => params.row.idQualificatif.minimal
                                },
                            ]}
                            pageSize={5}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editDialogOpen1} onClose={handleEditDialogClose1} fullWidth maxWidth="lg">
  <DialogContent>
    {/* Pass rubriqueId state to the EvaQuestionModifier component */}
    <EvaQuestionModifier rubriqueId={rubriqueId} />
  </DialogContent>
</Dialog>







<Dialog open={ajouterRubriquesOpenDialog} onClose={handleCloseDialog}>
    <DialogTitle>Liste des rubriques</DialogTitle>
    <DialogContent>
        <form>
            {rubriquesAjouter.map((rubrique, index) => (
                <Accordion key={index} style={{ marginBottom: '10px' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                            checked={selectedRubriques.includes(rubrique.rubrique.id)}
                            onChange={(event) => handleCheckboxChange(event)}
                            value={rubrique.rubrique.id ? rubrique.rubrique.id.toString() : ''}
                            style={{ marginRight: '8px' }} // Add some margin between checkbox and accordion summary
                            onClick={(event) => event.stopPropagation()} // Prevent accordion expansion when clicking checkbox
                        />
                        <Typography>{rubrique.rubrique.designation}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Intitulé</TableCell>
                                        <TableCell>Minimal</TableCell>
                                        <TableCell>Maximal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rubrique.questions && rubrique.questions.map((question, qIndex) => (
                                        <TableRow key={qIndex}>
                                            <TableCell>{question.intitule}</TableCell>
                                            <TableCell>{question.idQualificatif.minimal}</TableCell>
                                            <TableCell>{question.idQualificatif.maximal}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))}
        </form>
    </DialogContent>
    <DialogActions>
        <Button color="primary" onClick={handleAjouter} variant='contained'>
            Ajouter
        </Button>
        <Button color="secondary" onClick={handleCloseDialog} variant='contained'>
            Annuler
        </Button>
    </DialogActions>
</Dialog>




{showAlert && latestAction === 'delete' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
                Rubrique supprimé avec succès !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        {showAlert && latestAction === 'deleteError' && (
            <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Échec de la suppression de la Rubrique !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        {showAlert && latestAction === 'add' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
              Rubrique ajouté avec succès !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        {showAlert && latestAction === 'addError' && (
            <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Échec de l'ajout de la Rubrique !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        {showAlert && latestAction === 'edit' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
              Rubrique modifié avec succès !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        {showAlert && latestAction==='editError' && (
            <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Échec de la modification de la Rubrique !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}


        </>
    );
}

export default EvaluationModifier;
