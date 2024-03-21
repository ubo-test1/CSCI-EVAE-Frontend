import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {fetchEvaRubQuesDetails} from "../api/fetchEvaRubQuesDetails";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { Accordion, AccordionSummary, AccordionDetails, Typography,LinearProgress } from '@mui/material';
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
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';

function EvaluationDetailsReponse({ id }) {
    //const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rubriques, setRubriques] = useState([]);
    const [expanded, setExpanded] = useState([]); // State variable to manage expanded state of each accordion
    const [comment, setComment] = useState('');
    const [ratings, setRatings] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [showAlert, setShowAlert] = useState(true);
    const [latestAction, setLatestAction] = useState(null);
    const [confirmResponseDialog, setConfirmResponseDialog] = useState(false)
    
    const handleOpenConfirmResponseDialog = () => {
        const noRatingsProvided = Object.values(ratings).every(rating => rating === 0 || rating === undefined);
        console.log("hello i am here :::: " + comment.trim() ==='')
        if ((comment.trim() === '' && noRatingsProvided) || (comment.trim()!='' && noRatingsProvided)) {
            setShowAlert(true)
            setLatestAction("addError")
            return; // Stop execution if validation fails
        }
        setConfirmResponseDialog(true);
    };

    const handleCloseConfirmResponseDialog = () => {
        setConfirmResponseDialog(false);
    };
    const handleConfirmSubmit = () => {
        setConfirmResponseDialog(false);
        handleSubmit();
    };

    const navigate = useNavigate();

    const handleHideAlert = () => {
        setShowAlert(false);
      };
      useEffect(() => {
        const getEvaluationDetails = async () => {
            try {
                const data = await fetchEvaRubQuesDetails(id);
                console.log("================================")
                console.log(JSON.stringify(data));
    
                // Sort rubriques by their order
                const sortedRubriques = data?.rubriques.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
    
                setDetails(data);
                setRubriques(sortedRubriques || []);
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
    const rubriquesPerPage = 1; // Change this value according to the number of rubriques you want to display per page

    const totalPages = Math.ceil(rubriques.length / rubriquesPerPage + 1);
    const currentRubriques = rubriques.slice(currentPage * rubriquesPerPage, (currentPage + 1) * rubriquesPerPage);
    console.log("these areeee ther currenntt ::: " + JSON.stringify(rubriques))
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const evaluationDetails = details.evaluation;
    const scrollToRubrique = (rubriqueIndex) => {
        // Calculate the page corresponding to the rubrique index
        const rubriquePage = Math.floor(rubriqueIndex / rubriquesPerPage);

        // Set the current page
        setCurrentPage(rubriquePage);
    };

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
        console.log("hello i am here :::: " + comment.trim() ==='')
        if ((comment.trim() === '' && noRatingsProvided) || (comment.trim()!='' && noRatingsProvided)) {
            setShowAlert(true)
            setLatestAction("addError")
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
            setShowAlert(true)
            setLatestAction("add")
            navigate(`/evaluationetudiant?success=true`);
        } catch (error) {
            // Handle errors that occur during the fetch/request
            console.error("Submission Error:", error);
            alert("Failed to submit response. Please try again.");
        }
    };

    return (
        <>
            <div className="evaluationContainer" style={{ position: 'absolute', left: '0vw', width: '80%', margin: 'auto', display: 'flex' }}>

                <div className='evaluationImageRepondre'>
                    <img src={evaluationBackgroundImg}/>
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
</div>
          <div ><strong>Début de réponse :</strong> {evaluationDetails.debutReponse}</div>
          <div ><strong>Fin de réponse :</strong> {evaluationDetails.finReponse}</div>


        </div>

                <div style={{ position: 'fixed', top: '29vh', right: '10vw', overflowY: 'auto', width: 'calc(50% - 50px)', maxHeight: '45vh', border:'2px solid black', padding:'20px',boxShadow: '0px 0px 21px 5px rgba(0,0,0,0.5)' }}>
    {/* Your existing UI */}
    {currentPage !== totalPages -1  &&( 
    <div style={{ maxHeight: '40vh', minHeight:'40vh', overflowY: 'hidden' }}>
        {currentRubriques.map((rubrique, index) => (
            <div key={index}>
                {/* Render rubrique content here */}
                <div>
    <Typography variant="h6">{rubrique.rubrique.idRubrique.designation}</Typography>
    <div style={{ maxHeight: 'none', overflow: 'hidden' }}>
        {rubrique.questions.length > 0 ? (
            <TableContainer component={Paper} style={{ maxHeight: '35vh', overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Intitulé</TableCell>
                            <TableCell>Minimal</TableCell>
                            <TableCell>Maximal</TableCell>
                            <TableCell>Note</TableCell> {/* Add a header for the rating */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubrique.questions
                            .slice() // Create a shallow copy to avoid mutating the original array
                            .sort((a, b) => a.ordre - b.ordre) // Sort questions by their order
                            .map((question, qIndex) => (
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
</div>

            </div>
        ))}
    </div>
    )}

    {/* Check if it's the last page */}
    {currentPage === totalPages -1  && (
        <div style={{ maxHeight: '40vh', minHeight:'40vh', overflowY: 'hidden' }}>
            <Typography variant="h6">Commentaire</Typography>
            <TextField
                label="Commentaire"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginBottom: '171px' }}
            />
        </div>
    )}

    {/* Navigation buttons */}
    <div style={{ textAlign: 'center', marginBottom: '0px',marginTop:'0', display:'flex', justifyContent:'space-evenly' }}>
        <Button disabled={currentPage === 0} onClick={handlePrevPage} variant='contained' style={{textTransform:'none'}}>Précédent</Button>
        <Button disabled={currentPage === totalPages - 1} onClick={handleNextPage} variant='contained' style={{textTransform:'none'}}>Suivant</Button>
    </div>
    <div style={{ 
    width: '80%', 
    position: 'fixed', 
    top: '15vh', 
    left: '10vw', 
    padding: '10px', 
    display: 'grid', 
    gridTemplateColumns: `repeat(${rubriques.length + 1}, 1fr)`, 
    gap: '10px', 
    border: '1px solid #ccc', 
    borderRadius: '10px',
    backgroundColor:'#2b85cf',
    boxShadow: '0px 0px 21px 5px rgba(0,0,0,0.27)' // Add shadow
}}>
    {rubriques.map((rubrique, index) => (
        <div key={index} style={{ 
            padding: '5px', 
            cursor: 'pointer', 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            backgroundColor: currentPage === index ? 'white' : '#2b85cf', 
            color: currentPage === index ? '#2b85cf' : 'white' 
        }} onClick={() => scrollToRubrique(index)}>
            <div style={{ textAlign: 'center' }}>{rubrique.rubrique.idRubrique.designation}</div>
        </div>
    ))}
    <div style={{ 
        padding: '5px', 
        cursor: 'pointer', 
        border: '1px solid #ccc', 
        borderRadius: '5px', 
        backgroundColor: currentPage === totalPages -1  ? 'white' : '#2b85cf', 
        color: currentPage === totalPages -1 ? '#2b85cf' : 'white' 
    }} onClick={() => setCurrentPage(totalPages - 1)}>
        <div style={{ textAlign: 'center' }}>Commentaire</div>
    </div>
</div>




    {/* Progress bar */}
    <div style={{ width: '80%', position: 'fixed', bottom: '1vh', left: '10vw', padding: '10px' }}>
    <LinearProgress
        variant="determinate"
        value={(currentPage + 1) / totalPages * 100}
        sx={{ height: '8px' }} // Set the height of the progress bar
        style={{borderRadius:'50px'}}
    />
</div>

</div>


<Button
                variant="contained"
                color="success"
                onClick={handleOpenConfirmResponseDialog}
                style={{ position: 'absolute', top: '83vh', right: '0', marginTop: '20px', textTransform: 'none' }}
            >
                Envoyer les réponses
            </Button>
                    <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={handleRetourClick} style={{textTransform:'none',position:'absolute',top:'83vh',left:'11vw', marginTop: '20px'}}>
                        Retour
                    </Button>
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
            <Dialog open={confirmResponseDialog} onClose={handleCloseConfirmResponseDialog}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir envoyer les réponses ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    
                    <Button onClick={handleConfirmSubmit} color="primary" autoFocus variant='contained' style={{textTransform:'none'}}>
                        Confirmer
                    </Button>
                    <Button onClick={handleCloseConfirmResponseDialog} color="secondary" variant='contained' style={{textTransform:'none'}}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
            {showAlert && latestAction==='addError' && (
            <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Vous devez remplir au moins une note.
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
         {showAlert && latestAction==='add' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Vous avez répondu avec success !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
        </>
    );
}

export default EvaluationDetailsReponse;
