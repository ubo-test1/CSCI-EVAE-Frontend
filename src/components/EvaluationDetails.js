import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import Navbar from './navbar'; // Import Navbar component
import Sidebar from './sideBar'; // Import Sidebar component
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid component from Material-UI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; // Import Material-UI components
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import zIndex from '@mui/material/styles/zIndex';

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

  useEffect(() => {
    const getEvaluationDetails = async () => {
      try {
        console.log("text wla chi l3iba: "+id);
        const data = await fetchEvaluationDetails(id);
        setDetails(data);
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



  // Define rows for rubriques table


  return (
    <div>
      <Navbar />
      <Sidebar />
<div className="evaluationContainer" style={{ position: 'absolute', left: '12vw', top: '17vh', width: '80%', margin: 'auto', marginLeft: '0' }}>
      <TableContainer component={Paper} style={{width: '80%',  marginLeft: '0', textAlign: 'left' }}>
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
  onClose={() => setDialogOpen(false)}
  maxWidth="md"
>
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



    </div>
  );
}

export default EvaluationDetails;
