import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {fetchEvaRubQuesDetails} from "../api/fetchEvaRubQuesDetails";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navbar from './navbar';
import SideBar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import evaluationBackgroundImg from '../img/evaluationContentBackground.png';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TextField } from '@mui/material';
import Rating from '@mui/material/Rating';
import {submitReponse} from "../api/submitReponse";
import { useNavigate } from 'react-router-dom';


function EvaluationDetailsReponse({ id }) {
    //const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rubriques, setRubriques] = useState([]);
    const [expanded, setExpanded] = useState([]); // State variable to manage expanded state of each accordion
    const [comment, setComment] = useState('');
    const [ratings, setRatings] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const getEvaluationDetails = async () => {
            try {
                const data = await fetchEvaRubQuesDetails(id);
                console.log("Dataaaaaaaaaa")
                console.log(data)
                setDetails(data);
                setRubriques(data?.rubriques || []);
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
        setRubriques(items);
    };
    const handleExpandAll = () => {
        const allIndexes = Array.from({ length: rubriques.length }, (_, index) => index);
        setExpanded(allIndexes);
    };
    const handleCollapseAll = () => {
        setExpanded([]);
    };
    const handleAccordionToggle = (index) => {
        if (expanded.includes(index)) {
            setExpanded((prevExpanded) => prevExpanded.filter((item) => item !== index));
        } else {
            setExpanded((prevExpanded) => [...prevExpanded, index]);
        }
    };

    const handleRatingChange = (questionId, newValue) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [questionId]: newValue,
        }));
    };

    const handleSubmit = async () => {
        // Validation to ensure something is entered or rated
        const noRatingsProvided = Object.values(ratings).every(rating => rating === 0 || rating === undefined);
        if (comment.trim() === '' && noRatingsProvided) {
            alert("Vous devez remplir au moins une note.");
            return; // Stop execution if validation fails
        }

        // Transform the ratings into the required structure
        const rList = Object.entries(ratings).map(([questionId, rating]) => ({
            id_qev: questionId,
            pos: rating.toString(),
        }));

        const submissionData = {
            idEva: id, // Assuming `id` is the evaluation ID passed to the component
            commentaire: comment,
            rList: rList,
        };

        console.log("Submission Data:", submissionData);
        // Further processing here, such as sending the data to a server
        try {
            // Assuming submitReponse returns a promise
            const response = await submitReponse(JSON.stringify(submissionData));
            alert(`${response.message}`);
            navigate("/evaluationetudiant")
        } catch (error) {
            // Handle errors that occur during the fetch/request
            console.error("Submission Error:", error);
            alert("Failed to submit response. Please try again.");
        }
    };

    return (
        <>
            <div className="evaluationContainer" style={{ position: 'absolute', left: '0vw', width: '80%', margin: 'auto', display: 'flex' }}>

                <div className='evaluationImage'>
                    <img src={evaluationBackgroundImg}/>
                </div>
                <div className='evaluationInfo'>
                    <div style={{ margin: '4px', padding: '8px' }}><strong>Désignation:</strong> {evaluationDetails.designation}</div>
                    <div style={{ margin: '4px', padding: '8px' }}><strong> Promotion:</strong> {evaluationDetails.promotion.id.codeFormation} - {evaluationDetails.promotion.id.anneeUniversitaire}</div>
                    <div style={{ margin: '4px', padding: '8px' }}> <strong>Element Constitutif:</strong> {evaluationDetails.elementConstitutif ? evaluationDetails.elementConstitutif.id.codeEc : ""}</div>
                    <div style={{ margin: '4px', padding: '8px' }}><strong> Unité d'enseignement:</strong> {evaluationDetails.uniteEnseignement.id.codeUe}</div>
                </div>

                <div style={{ marginTop: '70px',marginRight:'50px', overflowX: 'auto', width: '50%' }}>
                    <TextField
                        label="Commentaire"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ marginBottom: '20px' }} // Add some space between the comment box and the accordions
                    />
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <Button onClick={handleExpandAll} startIcon={<KeyboardArrowDownIcon />}>Développer tout</Button>
                        <Button onClick={handleCollapseAll} startIcon={<KeyboardArrowUpIcon />}>Réduire tout</Button>
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
                                                <div key={rubrique.rubrique.id}>
                                                    <Accordion expanded={Array.isArray(expanded) && expanded.includes(index)} onChange={() => handleAccordionToggle(index)}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} /* Add any necessary props here */>
                                                            <Typography>{rubrique.rubrique.idRubrique.designation}</Typography>
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
                                                                                    <TableCell>Rating</TableCell> {/* Add a header for the rating */}
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {rubrique.questions.map((question, qIndex) => (
                                                                                    <TableRow key={qIndex}>
                                                                                        <TableCell>{question.idQuestion.intitule}</TableCell>
                                                                                        <TableCell>{question.idQuestion.idQualificatif.minimal}</TableCell>
                                                                                        <TableCell>{question.idQuestion.idQualificatif.maximal}</TableCell>
                                                                                        <TableCell>
                                                                                            <Rating
                                                                                                name={`rating-${question.id}`} // Unique name for each question's rating
                                                                                                value={ratings[question.id] || 0} // Control the rating value
                                                                                                onChange={(event, newValue) => {
                                                                                                    handleRatingChange(question.id, newValue);
                                                                                                }}
                                                                                            />
                                                                                        </TableCell>
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
                                            ))
                                        )}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        Envoyer les réponses
                    </Button>
                </div>
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

export default EvaluationDetailsReponse;
