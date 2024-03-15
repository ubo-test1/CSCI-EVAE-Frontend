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

import Tooltip from '@mui/material/Tooltip';
import { deleteEva } from '../api/deleteEvaluationApi';
import Alert from '@mui/material/Alert';
import InputAdornment from "@mui/material/InputAdornment";
import { KeyboardDatePicker } from '@material-ui/pickers';
import { getAllByEnseignant } from '../api/fetchUeApi';
import { fetchPromotions } from '../api/fetchPromotionsApi';
import { createEvaluation } from '../api/addEvaluationApi';
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
const [latestAction, setLatestAction] = useState(null);
const [showAlert, setShowAlert] = useState(true);
const [designationError, setDesignationError] = useState(false)
const [periodeError, setPeriodeError] = useState(false)
const [selectedDate, setSelectedDate] = useState(null);
const [openDialogAjouter, setOpenDialogAjouter] = useState(false);
const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
const [idToDelete, setIdToDelete] = useState(null);
const [promotions, setPromotions] = useState([]);
const [selectedPromotion, setSelectedPromotion] = useState('');

  const handleAjouter = async () => {
    try {
      // Assuming debutReponse and finReponse are strings in the format 'yyyy-mm-dd'
      const debutReponseDate = new Date(debutReponse);
      const finReponseDate = new Date(finReponse);

      // Format the dates to yyyy-mm-dd
      const formattedDebutReponse = debutReponseDate.toISOString().split('T')[0];
      const formattedFinReponse = finReponseDate.toISOString().split('T')[0];

      const newEvaluation = {
        uniteEnseignement: {
          id: {
            codeFormation: ue.id.codeFormation,
            codeUe: ue.id.codeUe
          }
        },
        elementConstitutif: {
          id: {
            codeFormation: ue.id.codeFormation,
            codeUe: ue.id.codeUe,
            codeEc: ec
          }
        },
        promotion: {
          id: {
            codeFormation: selectedPromotion.split('-')[0].trim(), // Split and get codeFormation
            anneeUniversitaire: selectedPromotion.split('-')[1].trim() +"-"+ selectedPromotion.split('-')[2].trim() // Split and get anneeUniversitaire
          }
        },
        etat: "ELA", // Set the etat directly to "ELA"
        designation: designation,
        periode: periode,
        debutReponse: formattedDebutReponse, // Use the formatted dates
        finReponse: formattedFinReponse // Use the formatted dates
      };

      // Call the addEvaluation API with the new evaluation data
      await createEvaluation(newEvaluation);

      // Close the dialog after successful submission
      setOpenDialogAjouter(false);
      setShowAlert(true);
        setLatestAction('add');
      // Fetch evaluations again to update the data grid
      const updatedEvaluations = await fetchEvaluations();
      setEvaluations(updatedEvaluations);
    } catch (error) {
      console.error('Error adding evaluation:', error);
      // Handle error if necessary
    }
  };

  const handleDelete = (id) => {
    setIdToDelete(id); // Set the ID to delete
    setOpenConfirmationDialog(true); // Open the confirmation dialog
  };
  useEffect(() => {
    fetchPromotions()
      .then(promotionsData => setPromotions(promotionsData))
      .catch(error => console.error('Error setting promotions:', error));
  }, [])
const fetchUnits = async () => {
  try {
    // Fetch units data from backend
    const unitsData = await getAllByEnseignant(); // Pass appropriate auth token
    setUnits(unitsData);
    console.log("these are the uniittsss !:::: " + units)
  } catch (error) {
    console.error('Error fetching units:', error);
  }
};
const handleUnitChange = async (e) => {
  setUE(e.target.value); // Set the selected UE
  console.log("thisi isisisisi ::::: " + JSON.stringify(e.target.value))
  try {
    // Fetch ECs data based on the selected UE
    const ecsData = await fetchEcsByUe({ id: { codeFormation: e.target.value.id.codeFormation, codeUe: e.target.value.id.codeUe } });
    setEcs(ecsData);
  } catch (error) {
    console.error('Error fetching ECs:', error);
  }
};

const handleConfirmationDialogClose = () => {
  setOpenConfirmationDialog(false); // Close the confirmation dialog
  setIdToDelete(null); // Reset the ID to delete
};

const handleConfirmDelete = async () => {
  setOpenConfirmationDialog(false); // Close the confirmation dialog
  if (idToDelete) {
    // Call deleteEva with the ID stored in state
    await deleteEva(idToDelete);
    // Fetch evaluations again and render them
    const updatedEvaluations = await fetchEvaluations();
    setEvaluations(updatedEvaluations);  }
    setShowAlert(true);
        setLatestAction('delete');
};

const handleClickOpen = async () => {
  setOpenDialogAjouter(true);
  try {
    // Fetch UEs data
    const ueData = await getAllByEnseignant();
    setUnits(ueData); // Set fetched UEs for the input of UE
  } catch (error) {
    console.error('Error fetching UEs:', error);
  }
};

const handleClose = () => {
  setOpenDialogAjouter(false);
};


useEffect(() => {
  // Check if selectedRow and ue are not null or undefined
  if (selectedRow && ue) {
    console.log("Initial value of ec:", ec); // Log the initial value of ec
    async function fetchEcs() {
      try {
        // Fetch ECs data based on selectedRow and ue

        const ecsData = await fetchEcsByUe({ id: { codeFormation: selectedRow.codeFormation.codeFormation, codeUe: ue } });
        setEcs(ecsData);
      } catch (error) {
        console.error('Error fetching ECs:', error);
      }
    }

    fetchEcs();
  }
}, [selectedRow, ue, ec]); // Include ec in the dependency array


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
  const handleHideAlert = () => {
    setShowAlert(false);
  };

    const handleEditEva = () => {
      window.location.href = `/evaluationEdit/${selectedItemId}`;
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

      // Fetch ECs data based on the selected unit
      const ecsData = await fetchEcsByUe({ id: { codeFormation: row.codeFormation.codeFormation, codeUe: row.code_UE } });
      setEcs(ecsData);

      // Set the initial value for EC if it's not null or undefined in the row
      if (row.code_EC !== null && row.code_EC !== undefined) {
        setEC(row.code_EC);
        console.log("this is the ecccccccccccc :::: " + row.code_EC);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };
  
  const handleBlur = (value, setValue, setError) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      setValue(trimmedValue);
      setError(false); // Reset error state when value is valid
    } else {
      setError(true); // Set error state when value is invalid
    }
  };

  const handleConfirmation = async () => {
    console.log("this is the selected item idddd ::: +++++" + selectedItemId);
    console.log("this is the selected row info :::: " + JSON.stringify(selectedRow));
  console.log("this is the ec element ::::: " + ec)
    const { codeFormation, promotion, noEvaluation } = selectedRow;
    const { code_UE, code_EC } = selectedRow;
    const { anneeUniversitaire } = promotion.id;

    try {
        // Format debutReponse and finReponse to "YYYY/MM/DD" format
        const formattedDebutReponse = debutReponse.split('/').reverse().join('-');
        const formattedFinReponse = finReponse.split('/').reverse().join('-');

        let updatedEvaluationData = {
            id: selectedItemId,
            uniteEnseignement: {
                id: {
                    codeFormation: codeFormation.codeFormation,
                    codeUe: ue
                }
            },
            promotion: {
                id: {
                    codeFormation: codeFormation.codeFormation,
                    anneeUniversitaire: anneeUniversitaire
                }
            },
            noEvaluation: noEvaluation,
            designation: designation,
            etat: etat,
            periode: periode || null, // If periode is empty, set it to null
            debutReponse: formattedDebutReponse, // Use formatted debutReponse
            finReponse: formattedFinReponse // Use formatted finReponse
        };

        // Conditionally include elementConstitutif if code_EC is provided
        if (ec) {
          updatedEvaluationData = {
              ...updatedEvaluationData, // Spread the existing properties
              elementConstitutif: {
                  id: {
                      codeFormation: codeFormation.codeFormation,
                      codeUe: ue,
                      codeEc: ec
                  }
              }
          };
      }


        // Call updateEvaluation function with authToken, evaluationId, and updatedEvaluationData
        console.log("this is the information that i send ::!:!!! " + JSON.stringify(updatedEvaluationData))
        const updatedEvaluation = await updateEvaluation(selectedItemId, updatedEvaluationData);

        console.log('Updated evaluation:', updatedEvaluation);
        setOpenDialog(false); // Close the dialog after successful update
        setShowAlert(true);
        setLatestAction('edit');
        // Fetch evaluations again to update the data grid
        const updatedEvaluations = await fetchEvaluations();
        setEvaluations(updatedEvaluations);
    } catch (error) {
        console.error('Error updating evaluation:', error.message);
        // Handle error if necessary
    }
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);

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
      renderCell: (params) => {
        const isELA = params.row.etat === 'ELA';
        return (
          <div>
            <Tooltip title={"Consulter"}>
              <span>
                <IconButton
                  onClick={() => handleConsult(params.row)}
                  style={{ color: 'green' }}
                >
                  <VisibilityIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={!isELA ? "Vous ne pouvez pas modifier cette évaluation" : "Modifier"}>
              <span>
                <IconButton
                  onClick={() => isELA && handleEdit(params.row.id, params.row)}
                  color="primary"
                  disabled={!isELA}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={!isELA ? "Vous ne pouvez pas supprimer cette évaluation" : "Supprimer"}>
              <span>
                <IconButton
                  onClick={() => isELA && handleDelete(params.row.id)}
                  color="secondary"
                  disabled={!isELA}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      },
    }


  ];

  const handleEditEvaluation = () => {
    navigate(`/evaluationEdit/${selectedItemId}`);
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ position: 'absolute', right: '17vh', marginTop: '17vh', marginBottom: '0', }}>
        <Button
          style={{ textTransform: 'none' }}
          variant='contained'
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
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
      getRowId={(evaluations) => evaluations.id}
     
    />
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} style={{marginLeft:'50px'}}>
  <DialogTitle>Modifier l'évaluation</DialogTitle>
  <DialogContent style={{ display: 'flex', flexWrap: 'wrap', width:'90%',justifyContent:'center',marginLeft:'50px' }}>
  <TextField
  label="Designation"
  value={designation}
  onChange={(e) => {
    const inputValue = e.target.value; // Get the input value
    if (inputValue.length <= 16) { // Check if value is within the limit
      setDesignation(inputValue); // Update the state without trimming
      setDesignationError(false); // Reset error state when value changes
    }
  }}
  onBlur={() => handleBlur(designation, setDesignation, setDesignationError)} // Apply the same handleBlur function
  fullWidth
  margin="normal"
  style={{ flexBasis: '45%' }} // Adjust the width of the text field
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {`${designation.trim().length}/16`} {/* Trim the value when displaying the length */}
      </InputAdornment>
    ),
  }}
/>


  <TextField
    label="Etat"
    value={etat}
    onChange={(e) => setEtat(e.target.value)}
    fullWidth
    margin="normal"
    disabled // Make the state field disabled
    style={{ flexBasis: '45%', marginLeft: '10px' }} // Adjust the width and add margin between fields
  />
  <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
    <InputLabel htmlFor="ue">Unité d'Enseignement</InputLabel>
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
      label="Unité d'Enseignement"
    >
      {units.map((unit) => (
        <MenuItem key={unit.id.codeUe} value={unit.id.codeUe}>
          {unit.id.codeUe}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <FormControl fullWidth margin="normal" style={{ flexBasis: '45%', marginLeft: '10px' }}>
      <InputLabel htmlFor="ec">Élément Constitutif</InputLabel>
      <Select
        labelId="ec-label"
        id="ec"
        value={ec}
        onChange={(e) => setEC(e.target.value)}
        label="Élément Constitutif"
      >
        <MenuItem value="">aucun</MenuItem>
        {ecs.map((item) => (
          <MenuItem key={item.id.codeEc} value={item.id.codeEc}>
            {item.id.codeEc}
          </MenuItem>
        ))}
      </Select>


    </FormControl>


  <TextField
    label="Début Réponse"
    type="text"
    value={debutReponse}
    onChange={(e) => setDebutReponse(formatWithSlash(e.target.value))}
    fullWidth
    margin="normal"
    placeholder="JJ/MM/AAAA"
    inputProps={{ maxLength: 10, pattern: "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" }}
    style={{ flexBasis: '45%',marginRight:'10px' }} // Adjust the width and add margin between fields
  />
  <TextField
    label="Fin Réponse"
    type="text"
    value={finReponse}
    onChange={(e) => setFinReponse(formatWithSlash(e.target.value))}
    fullWidth
    margin="normal"
    placeholder="JJ/MM/AAAA"
    inputProps={{ maxLength: 10, pattern: "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" }}
    style={{ flexBasis: '45%' }} // Adjust the width of the text field
  />
  <TextField
  label="Période"
  value={periode}
  onChange={(e) => {
    const inputValue = e.target.value; // Get the input value
    if (inputValue.length <= 64) { // Check if value is within the limit
      setPeriode(inputValue); // Update the state without trimming
      setPeriodeError(false); // Reset error state when value changes
    }
  }}
  onBlur={() => handleBlur(periode, setPeriode, setPeriodeError)} // Apply the same handleBlur function
  fullWidth
  margin="normal"
  style={{ flexBasis: '45%' }} // Adjust the width of the text field
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {`${periode.trim().length}/64`} {/* Trim the value when displaying the length */}
      </InputAdornment>
    ),
  }}
/>
</DialogContent>

  <DialogActions>
  <Button variant="contained" color="primary" onClick={handleEditEvaluation}>
      Modifier rubriques/questions
    </Button>
    <Button onClick={handleConfirmation} color="primary">
      Confirmer
    </Button>
    <Button onClick={() => setOpenDialog(false)} color="secondary">
      Annuler
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

<Dialog open={openDialogAjouter} onClose={handleClose}>
      <DialogTitle>Ajouter une évaluation</DialogTitle>
      <DialogContent style={{ display: 'flex', flexWrap: 'wrap', width: '90%', justifyContent: 'space-evenly', marginLeft: '50px' }}>
        <TextField
          label="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          fullWidth
          margin="normal"
          style={{ flexBasis: '45%' }}
        />
        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
  <InputLabel htmlFor="ue">Unité d'Enseignement</InputLabel>
  <Select
    labelId="ue-label"
    id="ue"
    value={ue}
    onChange={handleUnitChange} // Use the handleUnitChange function
    label="Unité d'Enseignement"
  >
    {units.map((unit) => (
      <MenuItem key={unit.id.codeUe} value={unit}>
        {unit.id.codeUe}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
      <InputLabel htmlFor="promotion">Promotion</InputLabel>
      <Select
        labelId="promotion-label"
        id="promotion"
        value={selectedPromotion}
        onChange={(e) => setSelectedPromotion(e.target.value)}
        label="Promotion"
      >
        {promotions.map((promotion, index) => (
          <MenuItem key={index} value={promotion.value}>
            {promotion.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth margin="normal" style={{ flexBasis: '45%', marginLeft: '10px' }}>
  <InputLabel htmlFor="ec">Élément Constitutif</InputLabel>
  <Select
    labelId="ec-label"
    id="ec"
    value={ec}
    onChange={(e) => setEC(e.target.value)}
    label="Élément Constitutif"
  >
    <MenuItem value="">Aucun</MenuItem>
    {ecs.map((ec) => (
      <MenuItem key={ec.id.codeEc} value={ec.id.codeEc}>
        {ec.id.codeEc}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        <TextField
          label="Période"
          type="text"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          fullWidth
          margin="normal"
          style={{ flexBasis: '45%' }}
        />
        <TextField
          label="Début Réponse"
          type="text"
          value={debutReponse}
          onChange={(e) => setDebutReponse(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="JJ/MM/AAAA"
          inputProps={{ maxLength: 10, pattern: "(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}" }}
          style={{ flexBasis: '45%' }}
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
          style={{ flexBasis: '45%' }}
        />
      </DialogContent>
      <DialogActions>
          <Button onClick={handleAjouter} color="primary">
            Ajouter
          </Button>
          <Button onClick={() => setOpenDialogAjouter(false)} color="primary">
            Annuler
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog open={openConfirmationDialog} onClose={handleConfirmationDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
        Êtes-vous sûr de vouloir supprimer cette évaluation ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationDialogClose} color="primary" variant='contained'>
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" variant='contained'>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>


{showAlert && latestAction === 'delete' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Évaluation supprimé avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'deleteError' && (
  <Alert severity="error" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
    Échec de la suppression de l'évaluation !
    <Button onClick={handleHideAlert}><CloseIcon /></Button>
  </Alert>
)}
{showAlert && latestAction === 'add' && (
        <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
          Évaluation ajouté avec succès !
          <Button onClick={handleHideAlert}><CloseIcon /></Button>
        </Alert>
      )}
{showAlert && latestAction === 'addError' && (
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
    </div>
  );
}

export default Evaluation;}