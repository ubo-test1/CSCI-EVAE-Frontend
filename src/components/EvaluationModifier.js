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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    const [openDialog, setOpenDialog] = useState(false);
    const [rubriqueToDelete, setRubriqueToDelete] = useState(null); // State variable to store rubrique to delete
    const [expanded, setExpanded] = useState([]); // State variable to manage expanded state of each accordion

    const handleAccordionToggle = (index) => {
        if (expanded.includes(index)) {
          setExpanded((prevExpanded) => prevExpanded.filter((item) => item !== index));
        } else {
          setExpanded((prevExpanded) => [...prevExpanded, index]);
        }
      };
    const handleExpand = (panel) => () => {
        setExpanded({ ...expanded, [panel]: !expanded[panel] });
    };
    const handleExpandAll = () => {
        const allIndexes = Array.from({ length: rubriques.length }, (_, index) => index);
        setExpanded(allIndexes);
      };

      const handleCollapseAll = () => {
        setExpanded([]);
      };

    const handleDeleteConfirmation = () => {
        setOpenDialog(false);
        if (rubriqueToDelete) {
            const { id, designation } = rubriqueToDelete.rubrique;
            rmRub(id, designation);
        }
    };
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
                    console.log("---------------")
                    setRubriques(sortedRubriques);
                    console.log(JSON.stringify(sortedRubriques))
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
            const tempSelectedRubriques = [...selectedRubriques];
            const requestBody = tempSelectedRubriques.map(rubriqueId => ({ eva: id, rub: rubriqueId }));
            console.log("Request Body:", requestBody);

            for (let i = 0; i < requestBody.length; i++) {
                console.log("Adding rubrique:", requestBody[i]);
                await addRub(requestBody[i]);
                // Add a delay of 1 second (1000 milliseconds) before processing the next rubrique
                //await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setSelectedRubriques([]);
        } catch (error) {
            console.error('Error adding rubrique:', error);
            setShowAlert(true);
            setLatestAction("addError");
        } finally {
            setajouterRubriquesOpenDialog(false);
            setChange(true);
            setShowAlert(true);
            setLatestAction("add");
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
        setChange(true)
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
            const evaluationRubriques = await getAllByIdEvaluation(id);
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
                setLatestAction("orderSuccess")
                setShowSaveButton(false);
            })
            .catch(error => {
                alert("Erreur en modifiant l'ordre");
                console.error('Error updating ordre:', error);
            });
    }

    const rmRub = (rubriqueId, desi) => {
            deleteEvaRub(rubriqueId)
                .then(response => {
                    setLatestAction("delete");
                    setChange(true);
                })
                .catch(error => {
                    alert("Rubrique liée, suppression impossible!");
                });
        
    };


    return (
        <>
            <Navbar />
            <SideBar />
            <div className="evaluationContainer" style={{ position: 'absolute', left: '0vw', top: '17vh', width: '80%', margin: 'auto', display: 'flex' }}>
                <div style={{ position: 'fixed', left: '10vw', top: '17vh', zIndex: '1', textAlign: 'left', width: '50%' }}>
                    <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleRetourClick} style={{textTransform:'none'}}>
                        Retour
                    </Button>
                </div>
                <div className='evaluationImageModifier'>
                    <img src={evaluationBackgroundImg} />
                </div>
                <div className='evaluationInfo'>
          <div ><strong>Désignation:</strong> {evaluationDetails.designation}</div>
          <div ><strong> Promotion:</strong> {evaluationDetails.promotion.id.codeFormation} - {evaluationDetails.promotion.id.anneeUniversitaire}</div>
          <div ><strong>Semestre:</strong> {evaluationDetails.uniteEnseignement.semestre}</div>
          {evaluationDetails.uniteEnseignement.description && (
    <div >
        <strong>Description:</strong> 
        {evaluationDetails.uniteEnseignement.description}
    </div>
)}
          {evaluationDetails.elementConstitutif && evaluationDetails.elementConstitutif.id.codeEc !== "" && (
    <div >
        <strong>Element Constitutif:</strong> 
        {evaluationDetails.elementConstitutif.id.codeEc}
    </div>
)}
          <div ><strong> Unité d'enseignement:</strong> {evaluationDetails.uniteEnseignement.id.codeUe}</div>
          <div>
    <strong>État :</strong> {evaluationDetails.etat === 'DIS' ? 'Mise à disposition' : 
                                evaluationDetails.etat === 'ELA' ? 'En cours d\'élaboration' :
                                evaluationDetails.etat === 'CLO' ? 'Cloturé' : ''}
</div>          <div ><strong>Début de réponse :</strong> {evaluationDetails.debutReponse}</div>
          <div ><strong>Fin de réponse :</strong> {evaluationDetails.finReponse}</div>


        </div>

                <div style={{ marginTop: '70px', overflowX: 'auto', width: '50%' }}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <div style={{ marginBottom: '10px' }}>
                <Button startIcon={<KeyboardArrowDownIcon />} color="primary" onClick={handleExpandAll} style={{ marginRight: '10px', textTransform:'none' }}>
                    Développer tout
                </Button>
                <Button startIcon={<KeyboardArrowUpIcon />}  color="primary" onClick={handleCollapseAll} style={{textTransform:'none'}}>
                    Réduire tout
                </Button>
            </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        
    <Droppable droppableId="droppable">
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {rubriques.length === 0 ? (
                    <Typography variant="body1" style={{ margin: '10px' }}>
                        Il n'y a aucune rubrique dans cette évaluation
                    </Typography>
                ) : (
                    rubriques.map((rubrique, index) => (
                        <Draggable key={rubrique.rubrique.id} draggableId={rubrique.rubrique.id.toString()} index={index}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps}>
      <Accordion expanded={Array.isArray(expanded) && expanded.includes(index)} onChange={() => handleAccordionToggle(index)}>
    <AccordionSummary 
        expandIcon={rubrique.questions.length > 0 ? <ExpandMoreIcon /> : null} // Conditionally render the expand icon
        {...provided.dragHandleProps}
        onClick={rubrique.questions.length > 0 ? null : (event) => event.stopPropagation()} // Conditionally prevent expansion if no questions
        style={{ cursor: rubrique.questions.length > 0 ? 'pointer' : 'default' }} // Conditionally set cursor style
    >
        <Typography>{rubrique.rubrique.idRubrique.designation}</Typography>
        {/* Edit Icon */}
        <IconButton
            style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '130px', // Adjust the position for the edit icon
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
            onClick={() => {
                setOpenDialog(true);
                setRubriqueToDelete(rubrique); // Set the rubrique to delete when the delete button is clicked
            }}
            style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '80px',
                transform: 'translateY(-50%)',
            }}
            color="error"
        >
            <DeleteIcon />
        </IconButton>
        {/* Drag Indicator Icon */}
        <IconButton
            style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '50%',
                right: '30px', // Adjust the position for the drag indicator icon
                transform: 'translateY(-50%)',
            }}
            color="primary" // Set the color of the Drag IconButton
        >
            <DragIndicatorIcon />
        </IconButton>
    </AccordionSummary>
    <AccordionDetails>
        {/* Conditionally render Typography only if there are questions */}
        {rubrique.questions.length > 0 && (
            <div style={{ maxHeight: 'none', overflow: 'hidden' }}>
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
                            {/* Sort questions by their order */}
                            {rubrique.questions.sort((a, b) => a.ordre - b.ordre).map((question, qIndex) => (
                                <TableRow key={qIndex}>
                                    <TableCell>{question.idQuestion.intitule}</TableCell>
                                    <TableCell>{question.idQuestion.idQualificatif.minimal}</TableCell>
                                    <TableCell>{question.idQuestion.idQualificatif.maximal}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )}
    </AccordionDetails>
</Accordion>


                                </div>
                            )}
                        </Draggable>
                    ))
                )}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
</DragDropContext>


                    </div>
                    <div style={{ position: 'absolute', bottom: '-5vh', right: '0', zIndex: '999' }}>
                        <Button variant="contained" color="primary" onClick={handleButtonClick} style={{textTransform:'none'}}>
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
                        style={{ position: 'absolute', top: '0', right: '0', zIndex: '999',textTransform:'none' }}
                    >
                        Valider l'ordre
                    </Button>
                )}
                {showSaveButton && (
                    <Button
                        variant="contained"
                        color="error" // Change color to error for red color
                        onClick={resetOrder}
                        style={{ position: 'absolute', top: '0', right: '150px', zIndex: '999', textTransform:'none' }}
                    >
                        Réinitialiser l'ordre
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
          {/* Button to close the dialog */}
          <Button onClick={handleEditDialogClose1} color="primary" variant='contained' style={{textTransform:'none',position:'absolute', right:'6%', top:'3%'}}>
            Fermer
          </Button>
        </DialogContent>
      </Dialog>







<Dialog open={ajouterRubriquesOpenDialog} onClose={handleCloseDialog}>
    <DialogTitle>Ajouter des rubriques</DialogTitle>
    <DialogContent>
        <form>
            {rubriquesAjouter.map((rubrique, index) => (
                <Accordion key={index} style={{ marginBottom: '10px' }}>
                <AccordionSummary 
                    expandIcon={rubrique.questions && rubrique.questions.length > 0 ? <ExpandMoreIcon /> : null}  
                    onClick={(event) => event.stopPropagation()}
                    style={{ cursor: rubrique.questions && rubrique.questions.length > 0 ? 'pointer' : 'default' }} // Conditionally set cursor style
                >
                    <Checkbox
                        checked={selectedRubriques.includes(rubrique.rubrique.id)}
                        onChange={(event) => handleCheckboxChange(event)}
                        value={rubrique.rubrique.id ? rubrique.rubrique.id.toString() : ''}
                        style={{ marginRight: '8px' }} // Add some margin between checkbox and accordion summary
                        onClick={(event) => event.stopPropagation()} // Prevent accordion expansion when clicking checkbox
                        />
                    <Typography>{rubrique.rubrique.designation}</Typography>
                </AccordionSummary>
                {/* Conditionally render AccordionDetails only if there are questions */}
                {rubrique.questions && rubrique.questions.length > 0 && (
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
                                    {rubrique.questions.map((question, qIndex) => (
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
                )}
            </Accordion>
            
            ))}
        </form>
    </DialogContent>
    <DialogActions>
        <Button color="primary" onClick={handleAjouter} variant='contained' style={{textTransform:'none'}}>
            Ajouter
        </Button>
        <Button color="secondary" onClick={handleCloseDialog} variant='contained' style={{textTransform:'none'}}>
            Annuler
        </Button>
    </DialogActions>
</Dialog>

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Supprimer l'évaluation</DialogTitle>
                <DialogContent>
                {`Voulez-vous vraiment supprimer la rubrique ${rubriqueToDelete ? rubriqueToDelete.rubrique.designation : ''}?`}
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDeleteConfirmation} color="primary" variant='contained' style={{textTransform:'none'}}>Supprimer</Button>

                    <Button onClick={() => setOpenDialog(false)} color="secondary" variant='contained' style={{textTransform:'none'}}>Annuler</Button>
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
        {showAlert && latestAction==='orderSuccess' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              L'ordre a été modifiée avec succées
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}


        </>
    );
}

export default EvaluationModifier;
