import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,TextField  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluations } from '../api/fetchEvaluations';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { localizedTextsMap } from './dataGridLanguage';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EvaluationDetails from './EvaluationDetails';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/lab';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'; // Import Material-UI components
import { fetchUnitsByEnseignant } from '../api/fetchUnitsByEnseignant';
import{ fetchEcsByUe } from '../api/fetchEcsByUe'; // Import the function to fetch ECs by UE
import { updateEvaluation } from '../api/updateEvaInfoApi';
import { useNavigate } from 'react-router-dom';

function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [designation, setDesignation] = useState('');
  const [etat, setEtat] = useState('');
  const [periode, setPeriode] = useState('');
  const [debutReponse, setDebutReponse] = useState('');
  const [finReponse, setFinReponse] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Define dialogOpen state
  const [selectedRubriqueQuestions, setSelectedRubriqueQuestions] = useState([]);
  const [ue, setUE] = useState('');
const [ec, setEC] = useState('');
const [units, setUnits] = useState([]);
const [ecs, setEcs] = useState([]); // State to hold ECs
const [selectedRow, setSelectedRow] = useState(null);
const [codeFormation, setCodeFormation] = useState('');
const [promotion, setPromotion] = useState('')
const [anneeUniversitaire, setAnneeUniversitaire] = useState('')






  useEffect(() => {
    async function getEvaluations() {
      try {
        const data = await fetchEvaluations();
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();
  }, []);

  const navigate = useNavigate();

  const handleConsult = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setDialogOpen(true);
  };
  const handleEdit = async (id, row) => {
    setSelectedRow(row); // Store the selected row
    setSelectedItemId(id);
    setDesignation(row.designation);
    setEtat(row.etat);
    setPeriode(row.periode);
    setDebutReponse(formatDate(row.debutReponse)); 
    setFinReponse(formatDate(row.finReponse));
    setOpenDialog(true);
    
    try {
      const unitsData = await fetchUnitsByEnseignant(); // Fetch units data from backend
      setUnits(unitsData);
      setUE(row.code_UE); // Set the initial value for UE
      if (row.code_EC !== null && row.code_EC !== undefined) {
        setEC(row.code_EC); // Set the initial value for EC if it's not null or undefined
      }
      // Set the initial value for codeFormation
      setCodeFormation(row.codeFormation.codeFormation); 
      
      // Set the initial value for promotion and academic year
      setPromotion(row.promotion.siglePromotion); // Assuming you want to set the promotion's sigle
      setAnneeUniversitaire(row.promotion.id.anneeUniversitaire); // Assuming you want to set the academic year
      
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };
  

const handleConfirmation = async () => {
  console.log("this is the selected item idddd ::: +++++" + selectedItemId)
  console.log("this is the selected row info :::: " + JSON.stringify(selectedRow))
  const codeFormation = selectedRow.codeFormation.codeFormation;
  const codeUe = selectedRow.code_UE;
  try {
    const updatedEvaluationData = {
      codeFormation: codeFormation,
      codeUe: ue,
      codeEc: ec || null, // If ec is empty, set it to null
      anneeUniversitaire: selectedRow.promotion.id.anneeUniversitaire,
      noEvaluation: selectedRow.noEvaluation,
      designation: designation,
      etat: etat,
      periode: periode || null, // If periode is empty, set it to null
      debutReponse: debutReponse,
      finReponse: finReponse,
      uniteEnseignement: {"id": {codeFormation,codeUe}}
    };

    // Call updateEvaluation function with authToken, evaluationId, and updatedEvaluationData
    console.log("this is the information that i send ::!:!!! " + JSON.stringify(updatedEvaluationData))
    const updatedEvaluation = await updateEvaluation(selectedItemId, updatedEvaluationData);
    
    console.log('Updated evaluation:', updatedEvaluation);
    setOpenDialog(false); // Close the dialog after successful update
  } catch (error) {
    console.error('Error updating evaluation:', error.message);
    // Handle error if necessary
  }
};


  const handleDelete = (id) => {
    // Handle delete logic here
    console.log('Delete evaluation with ID:', id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatWithSlash = (input) => {
    input = input.replace(/\D/g, '').slice(0, 8); // Remove non-numeric characters and limit to 8 characters
    if (input.length <= 2) {
      return input;
    } else if (input.length <= 4) {
      return `${input.slice(0, 2)}/${input.slice(2)}`;
    } else {
      return `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4)}`;
    }
  };
  const columns = [
    { field: 'designation', headerName: 'Designation', flex: 1 },
    { 
      field: 'etat', 
      headerName: 'Etat', 
      flex: 1.2,
      valueGetter: (params) => {
        const etatValue = params.row.etat;
        if (etatValue === 'CLO') {
          return 'Cloturé';
        } else if (etatValue === 'ELA') {
          return 'En cours d\'élaboration';
        } else if (etatValue === 'DIS') {
          return 'Mise à disposition';
        } else {
          return etatValue;
        }
      }
    },
    { field: 'code_UE', headerName: 'UE', flex: 0.4 },
    { field: 'code_EC', headerName: 'EC', flex: 0.4 },
    { field: 'periode', headerName: 'Période', flex: 1.7 },
    { 
      field: 'debutReponse', 
      headerName: 'Début Réponse', 
      flex: 1,
      valueGetter: (params) => {
        return formatDate(params.row.debutReponse);
      }
    },
    { 
      field: 'finReponse', 
      headerName: 'Fin Réponse', 
      flex: 1,
      valueGetter: (params) => {
        return formatDate(params.row.finReponse);
      }
    },
    {
      field: 'workflow',
      headerName: 'Workflow',
      flex: 1.3,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleButtonClick(params)}>
          {params.row.etat}
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          
          <IconButton onClick={() => handleConsult(params.row)} style={{ color: 'green' }}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row.id, params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
            <DeleteIcon />
          </IconButton>
         
        </div>
      ),
    },
  ];

  const handleEditEvaluation = () => {
    navigate(`/evaluationEdit/${selectedItemId}`);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
        <Button style={{ textTransform: 'none' }} variant='contained' color="primary" startIcon={<AddIcon />}>
          Ajouter
        </Button>
      </div>
      <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
        <DataGrid
      localeText={localizedTextsMap}
      hideFooter={true}
      rows={evaluations}
      columns={columns}
      pageSize={5}
      checkboxSelection={false}
      sortingOrder={['asc', 'desc']}
      getRowId={(row) => row.id}
     
    />
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Modifier l'évaluation</DialogTitle>
  <DialogContent>
  <TextField
    label="Designation"
    value={designation}
    onChange={(e) => setDesignation(e.target.value)}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Etat"
    value={etat}
    onChange={(e) => setEtat(e.target.value)}
    fullWidth
    margin="normal"
  />
  <FormControl fullWidth>
        <InputLabel id="ue-label">Unité d'Enseignement</InputLabel>
        <Select
  labelId="ue-label"
  id="ue"
  value={ue}
  onChange={async (e) => {
    setUE(e.target.value);
    console.log("this is the content of the selected roooww ::: " + JSON.stringify(selectedRow))
    try {
      const ecsData = await fetchEcsByUe({ id: { codeFormation: selectedRow.codeFormation.codeFormation, codeUe: e.target.value } }); // Fetch ECs data from backend
      setEcs(ecsData);

    } catch (error) {
      console.error('Error fetching ECs:', error);
    }
  }}
>
          {units.map((unit) => (
            <MenuItem key={unit.id.codeUe} value={unit.id.codeUe}>
              {unit.id.codeUe}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
  <InputLabel id="ec-label">Élément Constitutif</InputLabel>
  <Select
    labelId="ec-label"
    id="ec"
    value={ec}
    onChange={(e) => setEC(e.target.value)}
  >
    {/* Option for selecting nothing */}
    <MenuItem value="">&nbsp;</MenuItem>

    {/* Mapping over ecs to generate MenuItem components */}
    {ecs.map((ec) => (
      <MenuItem key={ec.id.codeEc} value={ec.id.codeEc}>
        {ec.id.codeEc}
      </MenuItem>
    ))}
  </Select>
</FormControl>


  <TextField
    label="Période"
    value={periode}
    onChange={(e) => setPeriode(e.target.value)}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Début Réponse"
    type="text"
    value={debutReponse}
    onChange={(e) => setDebutReponse(formatWithSlash(e.target.value))}
    fullWidth
    margin="normal"
    placeholder="JJ/MM/AAAA"
    inputProps={{ maxLength: 10, pattern: "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" }}
  />
  <TextField
    label="Fin Réponse"
    type="text"
    value={finReponse}
    onChange={(e) => setFinReponse(e.target.value)}
    fullWidth
    margin="normal"
    placeholder="JJ/MM/AAAA"
    inputProps={{ maxLength: 10, pattern: "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" }}
  />
</DialogContent>

        <DialogActions>
          <Button onClick={handleConfirmation} color="primary">
            Confirmer
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleEditEvaluation} color="primary">
            Modifier Question/Rubrique
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>
    Consultation de l'évaluation
    <Button onClick={() => setDialogOpen(false)} color="primary" style={{ position: 'absolute', right: 10, top: 10 }}>
  <CloseIcon />
</Button>
  </DialogTitle>
  <DialogContent style={{ height:'80vh',width:'90vw', paddingTop:'0' }}>
    <div style={{ height: '100%', width: '100%' }}>
      {selectedEvaluation && <EvaluationDetails id={selectedEvaluation.id} />}
    </div>
  </DialogContent>
</Dialog>


    </div>
  );
}

export default Evaluation;