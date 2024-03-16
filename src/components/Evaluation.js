import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormHelperText} from '@mui/material';
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
import Tooltip from '@mui/material/Tooltip';
import { deleteEva } from '../api/deleteEvaluationApi';
import Alert from '@mui/material/Alert';
import InputAdornment from "@mui/material/InputAdornment";
import { KeyboardDatePicker } from '@material-ui/pickers';
import { getAllByEnseignant } from '../api/fetchUeApi';
import { fetchPromotions } from '../api/fetchPromotionsApi';
import { createEvaluation } from '../api/addEvaluationApi';
import DialogContentText from "@mui/material/DialogContentText";
import {avancerWorkflow} from "../api/avancerWorkflow";
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
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
const [latestAction, setLatestAction] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [designationError, setDesignationError] = useState(false)
  const [periodeError, setPeriodeError] = useState(false)
  const [debutReponseError, setDebutReponseError] = useState(false)
  const [finReponseError, setFinReponseError] = useState(false)
  const [promotionError, setPromotionError] = useState(false)
  const [uniteEnseignementError, setUniteEnseignementError] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialogAjouter, setOpenDialogAjouter] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [tableData, setTableData] = useState([]);


// Fonction pour valider le format de la date (JJ/MM/AAAA)
  const isValidDateFormat = (dateString) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;
    return regex.test(dateString);
  };
// Fonction pour valider la valeur de la date
  const isvalidDateValue = (dateString) => {
    // Vérifier d'abord le format de la date
    if (!isValidDateFormat(dateString)) {
      return false;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year = parseInt(parts[2], 10);
    const inputDate = new Date(year, month, day);
    const currentDate = new Date();
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return inputDate >= currentDate;
  };
  const isvalidDateValueFin = (dateString) => {
    // Vérifier d'abord le format de la date
    if (debutReponse==null || (!isvalidDateValue(debutReponse))|| !isValidDateFormat(dateString)) {
      return false;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year = parseInt(parts[2], 10);
    const inputDate = new Date(year, month, day);
    const parts2 = debutReponse.split('/');
    const day2 = parseInt(parts2[0], 10);
    const month2 = parseInt(parts2[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year2 = parseInt(parts2[2], 10);
    const debutResponseDate = new Date(year2, month2, day2);
    inputDate.setHours(0, 0, 0, 0);
    debutResponseDate.setHours(0, 0, 0, 0);
    console.log(inputDate >= debutResponseDate);
    return inputDate >= debutResponseDate   ;
  };
  const handleAjouter = async () => {
    // Vérifie si tous les champs sont vides
    const champs = {
      designation: { value: designation.trim(), setError: setDesignationError },
      periode: { value: periode.trim(), setError: setPeriodeError },
      finReponse: { value: finReponse.trim(), setError: setFinReponseError },
      debutReponse: { value: debutReponse.trim(), setError: setDebutReponseError },
      promotion: { value: selectedPromotion, setError: setPromotionError },
      ue: { value: ue, setError: setUniteEnseignementError }
    };
    // Vérification de chaque champ et définition de l'erreur si nécessaire
    let hasEmptyField = false;
    Object.entries(champs).forEach(([fieldName, field]) => {
      if (field.value === "") {
        field.setError(true); // Définir l'erreur sur true
        hasEmptyField = true;
      }
    });
    // Si au moins un champ est vide, sortir de la fonction
    if (hasEmptyField) {
      return;
    }
      try {
      // Assuming debutReponse and finReponse are strings in the format 'yyyy-mm-dd'
      const debutReponseDate = new Date(debutReponse);
      const finReponseDate = new Date(finReponse);

      // Format the dates to yyyy-mm-dd
      const formattedDebutReponse = debutReponseDate.toISOString().split('T')[0];
      const formattedFinReponse = finReponseDate.toISOString().split('T')[0];
      let newEvaluation = null;
      if(ec){
        console.log(ue)
       newEvaluation = {
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
      };}else{       newEvaluation = {
        uniteEnseignement: {
          id: {
            codeFormation: ue.id.codeFormation,
            codeUe: ue.id.codeUe
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
      };}
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
  const handleConfirmationDialogOpen = (id, etat) => {
    setConfirmationData({ id, etat });
    setConfirmationDialogOpen(true);
    console.log("tttttttttttttttttttttttttttttttttttttttttttttttttttttttttt")
  };

  const handleConfirmationDialogClose2 = () => {
    setConfirmationDialogOpen(false);
  };

  const handleWorkflow = async (id, etat) => {
    try {
      // Fermer le dialogue de confirmation avant de démarrer la mise à jour
      handleConfirmationDialogClose2();
      console.log("wooooooooooooooooooooooooooooooooooooooooooork")

      if (etat === 'ELA') avancerWorkflow(id, "DIS");
      else if (etat === 'DIS') avancerWorkflow(id, "CLO");

      // Mettre à jour les évaluations après avoir modifié l'état dans la base de données
      const data= await fetchEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error('Error updating evaluations:', error);
    }
  }
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
    setPeriodeError(false);
    setDesignationError(false);

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
        console.log("content ::: " + JSON.stringify(data))
        // console.log("this is the content of the evaluationsss :::::::::: " + JSON.stringify(data))
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();
  }, []);

  const handleConsult = (evaluation) => {
    console.log("eeeh")
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
    console.log("this is the fucking row : " + JSON.stringify(row))
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
      console.log("this is the urrr ::::" + row.code_UE)
      setUE(row.code_UE); // Set the initial value for UE
      console.log("done with the ue ::: " + ue )
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
          <Button
              variant='contained'
              color={
                params.row.etat === 'CLO' ? 'success' :
                    params.row.etat === 'ELA' ? 'primary' : 'secondary'
              }
              disabled={params.row.etat === 'CLO'}
              //onClick={() => handleWorkflow(params.row.id,params.row.etat)}
              onClick={() => {handleConfirmationDialogOpen(params.row.id,params.row.etat)}}
              style={{width:'85%',textTransform: 'none'}}
          >
            {
              params.row.etat === 'CLO' ? 'Cloturée' :
                  params.row.etat === 'ELA' ? 'Mettre à disposition' :
                      'Cloturer'
            }
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
        //-------------------------------------------------------------modifier evaluation----------------------------------------------------------
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
                //onBlur={() => handleBlur(designation, setDesignation, setDesignationError)} // Apply the same handleBlur function
                onBlur={() => {
                  if (designation.trim() === "") {
                    setDesignationError(true); // Définir l'erreur si la valeur est vide lors de la perte de focus
                  } else {
                    setDesignationError(false); // Réinitialiser l'erreur si la valeur est valide lors de la perte de focus
                  }
                }}
                error={designationError}
                helperText={designationError ? "La désignation est requise *" : ""}
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
                onChange={(e) => {
                  let inputValue = e.target.value;
                  // Filtrer la saisie pour ne garder que les chiffres et le caractère "/"
                  inputValue = inputValue.replace(/[^0-9/]/g, '');
                  // Limiter la saisie à 10 caractères
                  inputValue = inputValue.substring(0, 10);
                  // Insérer automatiquement le caractère "/" aux positions 3 et 6 si nécessaire
                  if (inputValue.length === 3 && inputValue.charAt(2) !== '/') {
                    inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                  }
                  if (inputValue.length === 6 && inputValue.charAt(5) !== '/') {
                    inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
                  }
                  // Mettre à jour la valeur
                  setDebutReponse(inputValue);
                  // Valider la saisie
                  const isValidFormat = isValidDateFormat(inputValue); // Valider le format de la date
                  const isValidDateValue = isvalidDateValue(inputValue); // Valider la valeur de la date
                  setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                onBlur={() => {
                  // Valider la saisie lorsque le champ perd le focus
                  const isValidFormat = isValidDateFormat(debutReponse); // Valider le format de la date
                  const isValidDateValue = isvalidDateValue(debutReponse); // Valider la valeur de la date
                  setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                error={debutReponseError}
                helperText={debutReponseError ? "La date de début de réponse est requise un format valide (JJ/MM/AAAA) *" : ""}
                fullWidth
                margin="normal"
                placeholder="JJ/MM/AAAA"
                style={{ flexBasis: '45%' }}
            />
            <TextField
                label="Fin Réponse"
                type="text"
                value={finReponse}
                onChange={(e) => {
                  let inputValue = e.target.value;
                  // Filtrer la saisie pour ne garder que les chiffres et le caractère "/"
                  inputValue = inputValue.replace(/[^0-9/]/g, '');
                  // Limiter la saisie à 10 caractères
                  inputValue = inputValue.substring(0, 10);
                  // Insérer automatiquement le caractère "/" aux positions 3 et 6 si nécessaire
                  if (inputValue.length === 3 && inputValue.charAt(2) !== '/') {
                    inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                  }
                  if (inputValue.length === 6 && inputValue.charAt(5) !== '/') {
                    inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
                  }
                  // Mettre à jour la valeur
                  setFinReponse(inputValue);
                  // Valider la saisie
                  const isValidFormat = isValidDateFormat(inputValue); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueFin(inputValue); // Valider la valeur de la date
                  setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                onBlur={() => {
                  // Valider la saisie lorsque le champ perd le focus
                  const isValidFormat = isValidDateFormat(finReponse); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueFin(finReponse); // Valider la valeur de la date
                  setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                error={finReponseError}
                helperText={finReponseError ? "La date de fin de réponse est requise avec un format valide (JJ/MM/AAAA) *" : ""}
                fullWidth
                margin="normal"
                placeholder="JJ/MM/AAAA"
                style={{ flexBasis: '45%' }}
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
            <Button variant="contained" color="primary" onClick={handleEditEva}>
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
        //------------------------------------------------------------------------------workflow----------------------------------------------------------------------------
</Dialog>
      <Dialog open={confirmationDialogOpen} onClose={handleConfirmationDialogClose2}>
        <DialogTitle>{confirmationData.etat === 'ELA' ? "Mettre à disposition l'évaluation" : confirmationData.etat === 'DIS' ? "Clôturer l'évaluation"  : '...'}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ paddingTop:'0' }}>
            Êtes-vous sûr de vouloir {confirmationData.etat === 'ELA' ? 'mettre à disposition ' : confirmationData.etat === 'DIS' ? 'clôturer' : '...'} cette évaluation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleWorkflow(confirmationData.id, confirmationData.etat)} color="primary" variant='contained' style={{textTransform: 'none'}}>
            Confirmer
          </Button>
          <Button onClick={handleConfirmationDialogClose2} color="secondary" variant='contained' style={{textTransform: 'none'}}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
        //----------------------------------------------------------------------------Ajouter----------------------------------------------------------------------------------------
<Dialog open={openDialogAjouter} onClose={handleClose} style={{marginLeft:'50px'}}>
      <DialogTitle>Ajouter une évaluation</DialogTitle>
      <DialogContent style={{ display: 'flex', flexWrap: 'wrap', width: '90%', justifyContent: 'space-evenly', marginLeft: '50px' }}>
        <TextField
            label="Designation"
            value={designation}
            onChange={(e) => {
              const inputValue = e.target.value; // Obtenez la valeur saisie par l'utilisateur
              if (inputValue.length <= 16) { // Vérifiez si la valeur est dans la limite
                setDesignation(inputValue); // Met à jour l'état sans couper la valeur
                setDesignationError(false); // Réinitialiser l'erreur si la valeur est valide lors de la perte de focus

              }
            }}
            onBlur={() => {
              if (designation.trim() === "") {
                setDesignationError(true); // Définir l'erreur si la valeur est vide lors de la perte de focus
              } else {
                setDesignationError(false); // Réinitialiser l'erreur si la valeur est valide lors de la perte de focus
              }
            }}
            error={designationError}
            helperText={designationError ? "La désignation est requise *" : ""}
            fullWidth
            margin="normal"
            style={{ flexBasis: '45%' }} // Ajustez la largeur du champ de texte
            InputProps={{
              endAdornment: (
                  <InputAdornment position="end">
                    {`${designation.trim().length}/16`} {/* Coupez la valeur lors de l'affichage de la longueur */}
                  </InputAdornment>
              ),
            }}
        />
        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }} error={uniteEnseignementError}>
          <InputLabel htmlFor="ue">Unité d'Enseignement</InputLabel>
          <Select
              labelId="ue-label"
              id="ue"
              value={ue}
              onChange={ async (e) => {
                setUE(e.target.value); // Met à jour la valeur sélectionnée
                setUniteEnseignementError(false); // Efface l'erreur
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
                <MenuItem key={unit.id.codeUe} value={unit}>
                  {unit.id.codeUe}
                </MenuItem>
            ))}
          </Select>
          {uniteEnseignementError && <FormHelperText>L'unité d'enseignement est requise *</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }} error={promotionError}>
          <InputLabel htmlFor="promotion">Promotion</InputLabel>
          <Select
              labelId="promotion-label"
              id="promotion"
              value={selectedPromotion}
              onChange={(e) => {
                setSelectedPromotion(e.target.value); // Met à jour la valeur sélectionnée
                setPromotionError(false); // Efface l'erreur
              }}
              label="Promotion"
          >
            {promotions.map((promotion, index) => (
                <MenuItem key={index} value={promotion.value}>
                  {promotion.label}
                </MenuItem>
            ))}
          </Select>
          {promotionError && <FormHelperText>La promotion est requise *</FormHelperText>}
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
            onChange={(e) => {
              let inputValue = e.target.value;
              // Filtrer la saisie pour ne garder que les chiffres et le caractère "/"
              inputValue = inputValue.replace(/[^0-9/]/g, '');
              // Limiter la saisie à 10 caractères
              inputValue = inputValue.substring(0, 10);
              // Insérer automatiquement le caractère "/" aux positions 3 et 6 si nécessaire
              if (inputValue.length === 3 && inputValue.charAt(2) !== '/') {
                inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
              }
              if (inputValue.length === 6 && inputValue.charAt(5) !== '/') {
                inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
              }
              // Mettre à jour la valeur
              setDebutReponse(inputValue);
             // Valider la saisie
              const isValidFormat = isValidDateFormat(inputValue); // Valider le format de la date
              const isValidDateValue = isvalidDateValue(inputValue); // Valider la valeur de la date
              setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            onBlur={() => {
              // Valider la saisie lorsque le champ perd le focus
              const isValidFormat = isValidDateFormat(debutReponse); // Valider le format de la date
              const isValidDateValue = isvalidDateValue(debutReponse); // Valider la valeur de la date
              setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            error={debutReponseError}
            helperText={debutReponseError ? "La date de début de réponse est requise un format valide (JJ/MM/AAAA) *" : ""}
            fullWidth
            margin="normal"
            placeholder="JJ/MM/AAAA"
            style={{ flexBasis: '45%' }}
        />

        <TextField
            label="Fin Réponse"
            type="text"
            value={finReponse}
            onChange={(e) => {
              let inputValue = e.target.value;
              // Filtrer la saisie pour ne garder que les chiffres et le caractère "/"
              inputValue = inputValue.replace(/[^0-9/]/g, '');
              // Limiter la saisie à 10 caractères
              inputValue = inputValue.substring(0, 10);
              // Insérer automatiquement le caractère "/" aux positions 3 et 6 si nécessaire
              if (inputValue.length === 3 && inputValue.charAt(2) !== '/') {
                inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
              }
              if (inputValue.length === 6 && inputValue.charAt(5) !== '/') {
                inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5);
              }
              // Mettre à jour la valeur
              setFinReponse(inputValue);
              // Valider la saisie
              const isValidFormat = isValidDateFormat(inputValue); // Valider le format de la date
              const isValidDateValue = isvalidDateValueFin(inputValue); // Valider la valeur de la date
              setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            onBlur={() => {
              // Valider la saisie lorsque le champ perd le focus
              const isValidFormat = isValidDateFormat(finReponse); // Valider le format de la date
              const isValidDateValue = isvalidDateValueFin(finReponse); // Valider la valeur de la date
              setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            error={finReponseError}
            helperText={finReponseError ? "La date de fin de réponse est requise avec un format valide (JJ/MM/AAAA) *" : ""}
            fullWidth
            margin="normal"
            placeholder="JJ/MM/AAAA"
            style={{ flexBasis: '45%' }}
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
          <Button onClick={handleAjouter} color="primary"  variant='contained' style={{textTransform: 'none'}}>
            Ajouter
          </Button>
          <Button onClick={() => setOpenDialogAjouter(false)} color="secondary" variant='contained' style={{textTransform: 'none'}}>
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
          <Button onClick={handleConfirmationDialogClose} color="primary" variant='contained' color="secondary" variant='contained' style={{textTransform: 'none'}}>
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

export default Evaluation;