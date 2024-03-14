import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
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


const handleRetourClick = () => {
    window.history.back();
    console.log('Retour button clicked');
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

function EvaluationModifier() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rubriques, setRubriques] = useState([]);
    const [initialRubriquesOrder, setInitialRubriquesOrder] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);

    useEffect(() => {
        const getEvaluationDetails = async () => {
            try {
                const data = await fetchEvaluationDetails(id);
                if (data?.rubriques) {
                    const sortedRubriques = data.rubriques.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
                    setRubriques(sortedRubriques);
                    setInitialRubriquesOrder(sortedRubriques.map(rubrique => rubrique.rubrique.id));
                }
                setDetails(data);
            } catch (error) {
                console.error('Error fetching evaluation details:', error);
            }
        };
        if (id) {
            getEvaluationDetails();
        }
    }, [id]);

    if (details === null) {
        return null;
    }

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
        // Reset the order to the initial state
        const initialOrderRubriques = initialRubriquesOrder.map((rubriqueId, index) => ({
            ...rubriques.find(rubrique => rubrique.rubrique.id === rubriqueId),
            rubrique: {
                ...rubriques.find(rubrique => rubrique.rubrique.id === rubriqueId).rubrique,
                ordre: index + 1
            }
        }));
        setRubriques(initialOrderRubriques);
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
                                                                <Typography>{rubrique.rubrique.designation}</Typography>
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
                                                                    color="error" // Set the color of the IconButton
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
                                                                                            <TableCell>{question.intitule}</TableCell>
                                                                                            <TableCell>{question.idQualificatif.minimal}</TableCell>
                                                                                            <TableCell>{question.idQualificatif.maximal}</TableCell>
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
                </div>
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
        </>
    );
}

export default EvaluationModifier;
