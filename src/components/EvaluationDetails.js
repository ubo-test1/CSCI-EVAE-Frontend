import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import Navbar from './navbar'; // Import Navbar component
import Sidebar from './sideBar'; // Import Sidebar component
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid component from Material-UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { Accordion, AccordionSummary, AccordionDetails, Typography, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import zIndex from '@mui/material/styles/zIndex';
import { updateWorkflow } from '../api/avancerWorkflow';
import CloseIcon from '@mui/icons-material/Close';



const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function EvaluationDetails() {

  const { id } = useParams(); // Get the id parameter from the route
  const [details, setDetails] = useState(null);
  const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rubriques, setRubriques] = useState([]);
  const [evaluationState, setEvaluationState] = useState(null);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [latestAction, setLatestAction] = useState('');

  useEffect(() => {
    const getEvaluationDetails = async () => {
      try {
        console.log("text wla chi l3iba: "+id);
        const data = await fetchEvaluationDetails(id);
        setDetails(data);
        setEvaluationState(data?.evaluation?.etat);
      } catch (error) {
        // Handle error
        console.error('Error fetching evaluation details:', error);
      }
    };
    getEvaluationDetails();
  }, [id]); // Fetch details whenever ID changes

  useEffect(() => {
    if (details) {
      setRubriques(details.rubriques);
    }
  }, [details]); // Update

  if (!details) {
    return <div>Loading...</div>;
  }
  
  const evaluationDetails = details.evaluation;
 
  const onDragEnd = (result) => {
    // dropped outside the list
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

  const handleMettreADispositionClick = () => {
    setActionToConfirm('METTRE_A_DISPOSITION');
    setConfirmationText('Êtes-vous sûr de vouloir mettre à disposition cette évaluation à vos étudiants?');
    setDialogOpen(true);
  };
  
  const handleCloturerEvaluationClick = () => {
    setActionToConfirm('CLOTURER_EVALUATION');
    setConfirmationText('Êtes-vous sûr de vouloir clôturer cette évaluation ? personne ne pourra y répondre');
    setDialogOpen(true);
  };

  const handleConfirmation = async () => {
    if (actionToConfirm === 'METTRE_A_DISPOSITION') {
      try {
        // Vérifier si la fonction existe et l'état est ELA
        if (updateWorkflow && evaluationState === "ELA") {
          const response = await updateWorkflow(evaluationDetails.id, 'DIS'); // Appeler la fonction updateWorkflow avec le nouvel état
          if (response.success) {
            console.log("Evaluation mise à disposition avec succès");
            // Update the state to reflect that the evaluation is now at "DIS" state
            setEvaluationState('DIS');
            setShowAlert(true);
            setLatestAction('METTRE_A_DISPOSITION');
          } else {
            // Gérer les erreurs
            setShowAlert(true);
            setLatestAction('');
          }
        }
      } catch (error) {
        console.error('Error updating evaluation state:', error);
        setShowAlert(true);
        setLatestAction('');
      }
    } else if (actionToConfirm === 'CLOTURER_EVALUATION') {
      try {
        // Vérifier si la fonction existe et l'état est DIS
        if (updateWorkflow && evaluationState === "DIS") {
          const response = await updateWorkflow(evaluationDetails.id, 'CLO'); // Appeler la fonction updateWorkflow avec le nouvel état
          if (response.success) {
            console.log("Evaluation cloturée avec succès");
            // Update the state to reflect that the evaluation is now at "CLO" state
            setEvaluationState('CLO');
            setShowAlert(true);
            setLatestAction('CLOTURER_EVALUATION');
          } else {
            // Gérer les erreurs
            setShowAlert(true);
            setLatestAction('');
          }
        }
      } catch (error) {
        console.error('Error updating evaluation state:', error);
        setShowAlert(true);
        setLatestAction('');
      }
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleHideAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
    
    <div className="evaluationContainer" style={{ position: 'absolute', left: '12vw', top: '17vh', width: '80%', margin: 'auto', marginLeft: '0' }}>
      {/* Conditional rendering of buttons based on evaluation state */}
      {evaluationState === "ELA" && (
        <div style={{ position:'relative',right: '0',left:'30%', marginTop: '0', marginBottom: '0', }}>
          <Button style={{ textTransform: 'none' }} variant='contained' color="primary" onClick={handleMettreADispositionClick}>
            Mettre à disposition
          </Button>
        </div>
      )}

      {evaluationState === "DIS" && (
        <div style={{ position:'relative',right: '0',left:'30%', marginTop: '0', marginBottom: '0', }}>
          <Button style={{ textTransform: 'none' }} variant='contained' color="primary" onClick={handleCloturerEvaluationClick}>
            Cloturer l'évaluation
          </Button>
        </div>
      )}
      {evaluationState === "CLO" && (
        <div style={{ position:'relative',right: '0',left:'30%', marginTop: '0', marginBottom: '0', }}>
          <Button style={{ textTransform: 'none' }} color="primary"  >
            Cette évaluation est cloturée
          </Button>
        </div>
      )}
      <TableContainer component={Paper} style={{width: '80%',  marginLeft: '0', textAlign: 'left',margin:'0',padding:'0' }}>
      <Table>
  <TableHead>
    <TableRow>
      <TableCell style={{ background: 'lightblue', fontWeight: 'bold', border: '1px solid black' }}>Designation</TableCell>
      <TableCell style={{ background: 'lightblue', fontWeight: 'bold', border: '1px solid black' }}>Promotion</TableCell>
      <TableCell style={{ background: 'lightblue', fontWeight: 'bold', border: '1px solid black' }}>Element Constitutif</TableCell>
      <TableCell style={{ background: 'lightblue', fontWeight: 'bold', border: '1px solid black' }}>Unité d'enseignement</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell style={{ border: '1px solid black' }}>{evaluationDetails.designation}</TableCell>
      <TableCell style={{ border: '1px solid black' }}>{evaluationDetails.promotion.id.codeFormation} - {evaluationDetails.promotion.id.anneeUniversitaire}</TableCell>
      <TableCell style={{ border: '1px solid black' }}>{evaluationDetails.elementConstitutif ? evaluationDetails.elementConstitutif.id.codeEc : ""}</TableCell>
      <TableCell style={{ border: '1px solid black' }}>{evaluationDetails.uniteEnseignement.id.codeUe}</TableCell>
    </TableRow>
  </TableBody>
</Table>

</TableContainer>


<DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ width: '50%' }} // Adjust the width as needed
        >
            {rubriques.map((rubrique, index) => (
              <Draggable key={rubrique.rubrique.id} draggableId={rubrique.rubrique.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{rubrique.rubrique.designation}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                      <AccordionDetails style={{ maxHeight: '400px', overflow: 'auto' }}>
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
    </AccordionDetails>
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
    
      <Dialog
  open={dialogOpen}
  onClose={handleCancel}
  maxWidth="md"
>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    {confirmationText}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel} color="primary">
      Annuler
    </Button>
    <Button onClick={handleConfirmation} color="primary">
      Confirmer
    </Button>
  </DialogActions>
</Dialog>

{showAlert && latestAction === 'METTRE_A_DISPOSITION' && (
  <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
    Évaluation mise à disposition !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}

{showAlert && latestAction === 'CLOTURER_EVALUATION' && (
  <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
    Évaluation clôturée !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}

    </div>
  );
}

export default EvaluationDetails;
