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
  const [debutReponseUpdated, setDebutReponseUpdated] = useState('');
  const [debutReponseDate,setDebutReponseDate] = useState('')
  const [finReponseDate, setFinReponseDate] = useState('')
  const [change, setChange] = useState(false);
  const [confirmError, setConfirmError] = useState(false)
  const [ErrorTextDateDebut, setErrorTextDateDebut] = useState('');
  const [ErrorTextDateFin, setErrorTextDateFin] = useState('');
  const [chosenPromotion, setChosenPromotion] = useState('')
// Fonction pour valider le format de la date (JJ/MM/AAAA)
  const isValidDateFormat = (dateString,debut) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;
    if(!regex.test(dateString)){if (debut) setErrorTextDateDebut("La date de début de réponse doit être dans un format valide (JJ/MM/AAAA) *");
    else setErrorTextDateFin("La date de fin de réponse doit être dans un format valide (JJ/MM/AAAA) *");}
    return regex.test(dateString);
  };
// Fonction pour valider la valeur de la date
  const isvalidDateValue = (dateString) => {
    // Vérifier d'abord le format de la date
/*    if (!isValidDateFormat(dateString)) {
      return false;
    }*/
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year = parseInt(parts[2], 10);
    const inputDate = new Date(year, month, day);
    const currentDate = new Date();
    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if(inputDate <= currentDate) setErrorTextDateDebut("La date de début de réponse doit être supérieure à la date d'aujourd'hui !");
    return inputDate >= currentDate;
  };
  const isvalidDateValueDebutUpdated = (dateString) => {
    // Vérifier d'abord le format de la date
    if (debutReponseUpdated===null||!isValidDateFormat(dateString,true)) {
      return false;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year = parseInt(parts[2], 10);
    const inputDate = new Date(year, month, day);
    const parts2 = debutReponseUpdated.split('/');
    const day2 = parseInt(parts2[0], 10);
    const month2 = parseInt(parts2[1], 10) - 1; // Les mois dans JavaScript sont 0-indexés
    const year2 = parseInt(parts2[2], 10);
    const debutResponseDate = new Date(year2, month2, day2);
    inputDate.setHours(0, 0, 0, 0);
    debutResponseDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log("date debut ancienne-------->"+debutResponseDate);
    console.log("date debut actuelle-------->"+inputDate);
    console.log(inputDate.getTime() === debutResponseDate.getTime())
    if(inputDate.getTime() === debutResponseDate.getTime()) return true;
   // if(!(inputDate > debutResponseDate && inputDate >= currentDate)) setErrorTextDateDebut("La date de début de réponse doit être soit la même que celle déjà spécifiée, soit supérieure ou égale à la date d'aujourd'hui *")
   // else return inputDate > debutResponseDate && inputDate >= currentDate;
    if(currentDate<=debutResponseDate) {if (inputDate < currentDate) {setErrorTextDateDebut("La date de début de réponse doit être supérieure ou égale à la date d'aujourd'hui *") ;return false;}}
    else if (currentDate>debutResponseDate){if(!(inputDate > debutResponseDate && inputDate >= currentDate)) {setErrorTextDateDebut("La date de début de réponse doit être soit la même que celle déjà spécifiée, soit supérieure ou égale à la date d'aujourd'hui *");return false;}
    }
    return true;
  };
  const isvalidDateValueFin = (dateString) => {
    // Vérifier d'abord le format de la date
    if (debutReponse==null || (!isvalidDateValue(debutReponse))) {
      setErrorTextDateFin("Veuillez d'abord saisir une date de début de réponse valide *")
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
    if(inputDate < debutResponseDate ) setErrorTextDateFin("La date de fin de réponse doit être supérieure ou égale à la date de début de réponse *")
    console.log(inputDate >= debutResponseDate)
    return inputDate >= debutResponseDate   ;
  };
  const isvalidDateValueFinUpdated = (dateString) => {
    // Vérifier d'abord le format de la date
    console.log("hohohohohohohhohohoo")
    if (debutReponse==null || (!isvalidDateValueDebutUpdated(debutReponse))) {
      setErrorTextDateFin(" Veuillez d'abord saisir une date de début de réponse valide *")
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
    if(inputDate < debutResponseDate ) setErrorTextDateFin("La date de fin de réponse doit être supérieure ou égale à la date de début de réponse *")
    console.log(inputDate >= debutResponseDate)
    return inputDate >= debutResponseDate ;
  };

  const handleAjouter = async () => {
    if (finReponse.trim()==="") setFinReponseError(true);setErrorTextDateFin("La date de fin de réponse est requise *");
    if (debutReponse.trim()==="") setDebutReponseError(true);setErrorTextDateDebut("La date de début de réponse est requise *")
    if (finReponseError) return;
    if (debutReponseError) return;
    // Vérifie si tous les champs sont vides
    const champs = {
      designation: { value: designation.trim(), setError: setDesignationError },
      //periode: { value: periode.trim(), setError: setPeriodeError },
      //finReponse: { value: finReponse.trim(), setError: setFinReponseError },
      //debutReponse: { value: debutReponse.trim(), setError: setDebutReponseError },
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
    if(!isvalidDateValueFin(finReponse)) {setFinReponseError(true) ;setErrorTextDateFin("La date de fin de réponse doit être supérieure ou égale à la date de début de réponse *");return;}
      try {
      // Assuming debutReponse and finReponse are strings in the format 'yyyy-mm-dd'
        console.log("checking ::: " + debutReponse)
      setDebutReponseDate(debutReponse);
        setFinReponseDate(finReponse)
        var formattedDebutReponse = debutReponse.split("/")
        var finalDebutReponse = formattedDebutReponse[2] +"-"+ formattedDebutReponse[1] + "-" +  formattedDebutReponse[0]
        var formattedFinReponse = finReponse.split("/")
        var finalFinReponse = formattedFinReponse[2] + "-" + formattedFinReponse[1] + "-" + formattedFinReponse[0]
      //const finReponseDate = new Date(finReponse);
      console.log(debutReponseDate);
      console.log(finReponseDate);
        console.log(debutReponse);
        console.log(finReponse);
      // Format the dates to yyyy-mm-dd
      //const formattedDebutReponse = debutReponseDate.toISOString().split('T')[0];
      //const formattedFinReponse = finReponseDate.toISOString().split('T')[0];
      //console.log(formattedDebutReponse)
        //console.log(formattedFinReponse)

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
        debutReponse: finalDebutReponse, // Use the formatted dates
        finReponse: finalFinReponse // Use the formatted dates
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
        debutReponse: finalDebutReponse, // Use the formatted dates
        finReponse: finalFinReponse // Use the formatted dates
      };}
      // Call the addEvaluation API with the new evaluation data
      await createEvaluation(newEvaluation);
   setPeriode('');
   setDesignation('');
   setDebutReponse('');
   setFinReponse('');
   setUE('');
   setEC('');
   setSelectedPromotion('');
      // Close the dialog after successful submission
      setOpenDialogAjouter(false);
      setShowAlert(true);
      setLatestAction('add');
      setChange(true)
      // Fetch evaluations again to update the data grid
      // const updatedEvaluations = await fetchEvaluations();
      // setEvaluations(updatedEvaluations);
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
    setUniteEnseignementError(false);
    try {
      // Fetch ECs data based on the selected UE
      const ecsData = await fetchEcsByUe({ id: { codeFormation: e.target.value.id.codeFormation, codeUe: e.target.value.id.codeUe } });
      setEcs(ecsData);
    } catch (error) {
      console.error('Error fetching ECs:', error);
    }
  };
const handleCLoseEdit = () => {
  console.log("i ammmmm ")
  setOpenDialog(false)
  setDesignation('')
  setDebutReponse('')
  setFinReponse('')
  setUE('')
  setEC('')
  setPeriode('')
  setDesignationError(false);
  setDebutReponseError(false);
  setFinReponseError(false);
  setPromotionError(false);
  setUniteEnseignementError(false);

  }
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
        setChange(true)
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
      setChange(true)
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
  const handleCloseAjouter = () => {
    console.log()
    setPeriodeError(false);
    setDesignationError(false);
    setUniteEnseignementError(false);
    setDebutReponseError(false);
    setFinReponseError(false);
    console.log(finReponseError)
    //setOpenDialogAjouter(false);
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
        // Sort the evaluations by the 'designation' attribute
        const sortedData = data.slice().sort((a, b) => a.designation.localeCompare(b.designation));
        setEvaluations(sortedData);
        console.log("content ::: " + JSON.stringify(sortedData))
        // console.log("this is the content of the evaluationsss :::::::::: " + JSON.stringify(sortedData))
        setChange(false);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();
  }, [change]);
  
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
    setDebutReponseUpdated(formatDate(row.debutReponse))
    setFinReponse(formatDate(row.finReponse));
    const test = row.promotion.id.codeFormation + "-" + row.promotion.id.anneeUniversitaire
    console.log("111111111111111111111" + test)
    console.log("88888888888888888" + (row.promotion.id.anneeUniversitaire))
    setPromotion(test)
    console.log("$$$$$$$$$$$$$$$$$$$$$$$" + promotion)
    setOpenDialog(true);
    const initialPromotionValue = row.promotion.id.codeFormation + " - " + row.promotion.id.anneeUniversitaire;
    //setPromotion(initialPromotionValue); // Set the initial value for promotion
    //console.log("=============erehjrerher======== " + JSON.stringify(promotions))
    //console.log("=================" + JSON.stringify(promotions))
    // const matchingPromotionIndex = promotions.findIndex(promo => promo.label === promotion);
    // //console.log("=========reeeeeeeeee================" + (promotions[matchingPromotionIndex].label))

    // if (matchingPromotionIndex !== -1) {
    //   setChosenPromotion(promotions[matchingPromotionIndex].value);
    //   console.log("this is the chose kk;;;; " + chosenPromotion)
    //   setPromotion(promotions[matchingPromotionIndex].label)
    // } else {
    //   console.error("No matching promotion found for:", promotion);
    // }

    try {
      const unitsData = await fetchUnitsByEnseignant(); // Fetch units data from backend
      setUnits(unitsData);
      console.log("this is the urrr ::::" + row.code_UE)
      setUE(row.code_UE); // Set the initial value for UE
      console.log("done with the ue ::: " + ue )
      // Set the initial value for codeFormation
      setCodeFormation(row.codeFormation.codeFormation);
      
      // Set the initial value for promotion and academic year
      
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
      setError(true); // Reset error state when value is valid
    } else {
      setValue(trimmedValue)
      setError(false); // Set error state when value is invalid
    }
  };
const handleAnnulerAjouter = () => {
  setPeriode('');
  setDesignation('');
  setDebutReponse('');
  setFinReponse('');
  setUE('');
  setEC('');
  setSelectedPromotion('');
  setPeriodeError(false);
  setDesignationError(false);
  setUniteEnseignementError(false);
  setDebutReponseError(false);
  setFinReponseError(false);
  setOpenDialogAjouter(false)
  setPromotionError(false)

};
  const handleConfirmation = async () => {
    console.log("555555555555555555555" + JSON.stringify(selectedRow))
    const { noEvaluation } = selectedRow;
        console.log("555555555555555555555" + JSON.stringify(promotion))

    const { code_UE, code_EC } = selectedRow;
    const anneeUniversitaire  = promotion.split("-")[1] + "-" +  promotion.split("-")[2];
     const codeFormation = promotion.split("-")[0]
     console.log("aaaaaaaaaaaaaaaaaaaaaaaa" + anneeUniversitaire)
     console.log("eeeeeeeeeeeeeeeeeeeeeeeee" + codeFormation)
    if (finReponse.trim()==="") setFinReponseError(true);setErrorTextDateFin("La date de fin de réponse est requise *");
    if (debutReponse.trim()==="") setDebutReponseError(true);setErrorTextDateDebut("La date de début de réponse est requise *")
    if (finReponseError) return;
    if (debutReponseError) return;
    const champs = {
      designation: { value: designation.trim(), setError: setDesignationError },
      //periode: { value: periode.trim(), setError: setPeriodeError },
      //finReponse: { value: finReponse.trim(), setError: setFinReponseError },
      //debutReponse: { value: debutReponse.trim(), setError: setDebutReponseError },
      promotion: { value: promotion, setError: setPromotionError },
      ue: { value: ue, setError: setUniteEnseignementError }
    };
    // Vérification de chaque champ et définition de l'erreur si nécessaire
    let hasEmptyField = false;
    console.log("--------------------------ttttttttttttttttt----------------------")
    Object.entries(champs).forEach(([fieldName, field]) => {

      console.log("---->"+field.value)
      if (field.value === "") {
        field.setError(true); // Définir l'erreur sur true
        hasEmptyField = true;
      }
    });
    // Si au moins un champ est vide, sortir de la fonction
    if (hasEmptyField) {
      return;
    }
    if(!isvalidDateValueFinUpdated(finReponse)) {setFinReponseError(true) ;setErrorTextDateFin("La date de fin de réponse doit être supérieure ou égale à la date de début de réponse *");return;}

    try {
      // Format debutReponse and finReponse to "YYYY/MM/DD" format
      const formattedDebutReponse = debutReponse.split('/').reverse().join('-');
      const formattedFinReponse = finReponse.split('/').reverse().join('-');
      console.log("t8977777777777777777777" + JSON.stringify(promotion))
let updatedEvaluationData = {
        id: selectedItemId,
        uniteEnseignement: {
          id: {
            codeFormation: codeFormation,
            codeUe: ue
          }
        },
        promotion: {
          id: {
            codeFormation: codeFormation,
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
              codeFormation: codeFormation,
              codeUe: ue,
              codeEc: ec
            }
          }
        };
        setOpenDialog(false)
        setDesignation('')
        setDebutReponse('')
        setFinReponse('')
        setUE('')
        setEC('')
        setPeriode('')
      }


      // Call updateEvaluation function with authToken, evaluationId, and updatedEvaluationData
      console.log("this is the information that i send ::!:!!! " + JSON.stringify(updatedEvaluationData))
      const updatedEvaluation = await updateEvaluation(selectedItemId, updatedEvaluationData);

      console.log('Updated evaluation:', updatedEvaluation);
      setOpenDialog(false); // Close the dialog after successful update
      setShowAlert(true);
      setLatestAction('edit');
      // Fetch evaluations again to update the data grid
      setChange(true)
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
    { field: 'designation', headerName: 'Désignation', flex: 1 },
    {
      field: 'etat',
      headerName: 'État',
      flex: 1.2,
      valueGetter: (params) => {
        const etatValue = params.row.etat;
        if (etatValue === 'CLO') {
          return 'Clôturée';
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
      headerName: 'Début réponse',
      flex: 1,
      valueGetter: (params) => {
        return formatDate(params.row.debutReponse);
      }
    },
    {
      field: 'finReponse',
      headerName: 'Fin réponse',
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
          <div style={{position: 'relative', display: 'inline-block', width:'100%'}}>
            <Tooltip
  title={
    new Date(params.row.finReponse) < new Date() && params.row.etat === 'ELA'
      ? "Vous ne pouvez pas mettre à disposition cette évaluation car la date de fin de réponse a expiré. Veuillez la modifier !"
      : (params.row.etat === 'ELA' && !params.row.hasRubrique)
      ? "Vous ne pouvez pas mettre à disposition cette évaluation car elle n'a pas de rubriques."
      : (params.row.etat === 'ELA' && params.row.hasOrphanRubrique)
      ? "Vous ne pouvez pas mettre à disposition cette évaluation car elle contient une ou plusieurs rubriques sans question."
      : ""
  }
>
  <span>
    <Button
      variant='contained'
      color={
        params.row.etat === 'CLO' ? 'success' :
          params.row.etat === 'ELA' ? 'primary' : 'secondary'
      }
      disabled={
        params.row.etat === 'CLO' || 
        (new Date(params.row.finReponse) < new Date() && params.row.etat === 'ELA') ||
        (params.row.etat === 'ELA' && !params.row.hasRubrique) ||
        (params.row.etat === 'ELA' && params.row.hasOrphanRubrique)
      }
      onClick={() => {
        handleConfirmationDialogOpen(params.row.id, params.row.etat)
      }}
      style={{width: '100%', textTransform: 'none'}}
    >
      {
        params.row.etat === 'CLO' ? 'Clôturée' :
          params.row.etat === 'ELA' ? 'Mettre à disposition' :
          'Clôturer'
      }
    </Button>
  </span>
</Tooltip>

          </div>

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
                    style={{color: 'green' }}
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} style={{marginLeft:'80px', width:'74vw', left:'10vw'}}>
          <DialogTitle>Modifier l'évaluation</DialogTitle>
          <DialogContent style={{ display: 'flex', flexWrap: 'wrap', width: '90%', justifyContent: 'space-evenly', marginLeft: '50px' }}>
            <TextField
    label="Désignation"
    value={designation}
    onChange={(e) => {
        const inputValue = e.target.value; // Get the input value
        if (inputValue.length <= 16) { // Check if value is within the limit
            setDesignation(inputValue); // Update the state without trimming
        }
        if (inputValue.trim() === "") {
            setDesignationError(true); // Set error if value is empty
        } else {
            setDesignationError(false); // Reset error if value is not empty
        }
    }}
    // onBlur={() => {
    //     const trimmedValue = designation.trim(); // Trim the value
    //     setDesignation(trimmedValue); // Update the state with trimmed value
    //     if (trimmedValue === "") {
    //         setDesignationError(true); // Set error if trimmed value is empty
    //     } else {
    //         setDesignationError(false); // Reset error if trimmed value is not empty
    //     }
    // }}
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
    required
/>

            <TextField
                label="État"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                fullWidth
                margin="normal"
                disabled // Make the state field disabled
                style={{ flexBasis: '45%', marginLeft: '10px' }} // Adjust the width and add margin between fields
            />
            <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
              <InputLabel htmlFor="ue" required>Unité d'enseignement</InputLabel>
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
            <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
              <InputLabel htmlFor="ec">Élément constitutif</InputLabel>
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
                label="Début réponse"
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
                  const isValidFormat = isValidDateFormat(inputValue,true); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueDebutUpdated(inputValue); // Valider la valeur de la date
                  setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                onBlur={() => {
                  // Valider la saisie lorsque le champ perd le focus
                  const isValidFormat = isValidDateFormat(debutReponse,true); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueDebutUpdated(debutReponse); // Valider la valeur de la date
                  setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                error={debutReponseError}
                helperText={debutReponseError ? ErrorTextDateDebut : ""}
                fullWidth
                margin="normal"
                placeholder="JJ/MM/AAAA"
                style={{ flexBasis: '45%' }}
                required
            />
            <TextField
                label="Fin réponse"
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
                  const isValidFormat = isValidDateFormat(inputValue,false); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueFinUpdated(inputValue); // Valider la valeur de la date
                  setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                onBlur={() => {
                  // Valider la saisie lorsque le champ perd le focus
                  const isValidFormat = isValidDateFormat(finReponse,false); // Valider le format de la date
                  const isValidDateValue = isvalidDateValueFinUpdated(finReponse); // Valider la valeur de la date
                  setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
                }}
                error={finReponseError}
                helperText={finReponseError ? ErrorTextDateFin : ""}
                fullWidth
                margin="normal"
                placeholder="JJ/MM/AAAA"
                style={{ flexBasis: '45%' }}
                required
            />
            <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
              <InputLabel htmlFor="promotion">Promotion</InputLabel>
              <Select
    labelId="promotion"
    id="promotion"
    value={promotion} // Use chosenPromotion instead of promotion
    onChange={(e) => setPromotion(e.target.value)}
    label="Promotion"
>
    <MenuItem value="">aucun</MenuItem>
    {promotions.map((promotion, index) => (
        <MenuItem key={index} value={promotion.value}>
            {promotion.label}
        </MenuItem>
    ))}
</Select>

            </FormControl>

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
                //onBlur={() => handleBlur(periode, setPeriode, setPeriodeError)} // Apply the same handleBlur function
                fullWidth
                margin="normal"
                style={{ flexBasis: '45%' }} // Adjust the width of the text field
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <InputAdornment position="end">
                          {periode !== null ? `${periode.trim().length}/64` : '0/64'}
                        </InputAdornment>

                      </InputAdornment>
                  ),
                }}
            />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}> {/* Aligner les actions à gauche et à droite */}
            <div>
              <Button variant="contained" color="success" onClick={handleEditEva} style={{ textTransform: 'none' , marginLeft:10}}>
                Modifier rubriques/questions
              </Button>
            </div>
            <div>
              <Button onClick={handleConfirmation} color="primary" variant='contained' style={{ textTransform: 'none'  }} // Condition pour désactiver le bouton
              >
                Confirmer
              </Button>
              <Button onClick={handleCLoseEdit} color="secondary" variant='contained' style={{ textTransform: 'none' , marginLeft:5,marginRight:10}}>
                Annuler
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>
    Consultation de l'évaluation
    <Button onClick={() => setDialogOpen(false)} variant='contained' color="primary" style={{ position: 'absolute', right: 10, top: 10 }}>
  <CloseIcon />
</Button>
  </DialogTitle>
  <DialogContent style={{ height:'80vh',width:'90vw', paddingTop:'0' }}>
    <div style={{ height: '100%', width: '100%' }}>
      {selectedEvaluation && <EvaluationDetails id={selectedEvaluation.id} />}
    </div>
  </DialogContent>
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
<Dialog open={openDialogAjouter} onClose={handleCloseAjouter} style={{marginLeft:'80px', width:'74vw', left:'10vw'}}>
      <DialogTitle>Ajouter une évaluation</DialogTitle>
      <DialogContent style={{ display: 'flex', flexWrap: 'wrap', width: '90%', justifyContent: 'space-evenly', marginLeft: '50px' }}>
        <TextField
            label="Désignation"
            value={designation}
            onChange={(e) => {
              const inputValue = e.target.value; // Obtenez la valeur saisie par l'utilisateur
              if (inputValue.length <= 16) { // Vérifiez si la valeur est dans la limite
                setDesignation(inputValue); // Met à jour l'état sans couper la valeur
                setDesignationError(false); // Réinitialiser l'erreur si la valeur est valide lors de la perte de focus
              }
            }}
            onBlur={() => { handleBlur(designation, setDesignation, setDesignationError)
              // if (designation.trim() === "") {
              //   setDesignationError(true); // Définir l'erreur si la valeur est vide lors de la perte de focus
              // } else {
              //   setDesignationError(false); // Réinitialiser l'erreur si la valeur est valide lors de la perte de focus
              // }
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
            required
        />
        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }} error={uniteEnseignementError}>
          <InputLabel htmlFor="ue" required>Unité d'enseignement</InputLabel>
          <Select
              labelId="ue-label"
              id="ue"
              value={ue}
              onChange={handleUnitChange}
              label="Unité d'enseignement"
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
          <InputLabel htmlFor="promotion" required>Promotion</InputLabel>
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
        <FormControl fullWidth margin="normal" style={{ flexBasis: '45%' }}>
          <InputLabel htmlFor="ec">Élément constitutif</InputLabel>
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
            label="Début réponse"
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
              const isValidFormat = isValidDateFormat(inputValue,true); // Valider le format de la date
              const isValidDateValue = isvalidDateValue(inputValue); // Valider la valeur de la date
              setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            onBlur={() => {
              // Valider la saisie lorsque le champ perd le focus
              const isValidFormat = isValidDateFormat(debutReponse,true); // Valider le format de la date
              const isValidDateValue = isvalidDateValue(debutReponse); // Valider la valeur de la date
              setDebutReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            error={debutReponseError}
            helperText={debutReponseError ? ErrorTextDateDebut : ""}
            fullWidth
            margin="normal"
            placeholder="JJ/MM/AAAA"
            style={{ flexBasis: '45%' }}
            required
        />

        <TextField
            label="Fin réponse"
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
              const isValidFormat = isValidDateFormat(inputValue,false); // Valider le format de la date
              const isValidDateValue = isvalidDateValueFin(inputValue); // Valider la valeur de la date
              setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            onBlur={() => {
              // Valider la saisie lorsque le champ perd le focus
              const isValidFormat = isValidDateFormat(finReponse,false); // Valider le format de la date
              const isValidDateValue = isvalidDateValueFin(finReponse); // Valider la valeur de la date
              setFinReponseError(!isValidFormat || !isValidDateValue); // Définir l'erreur si la date n'est pas valide
            }}
            error={finReponseError}
            helperText={finReponseError ? ErrorTextDateFin: ""}
            fullWidth
            margin="normal"
            placeholder="JJ/MM/AAAA"
            style={{ flexBasis: '45%' }}
            required
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
                    {periode !== null ? `${periode.trim().length}/64` : '0/64'}
                  </InputAdornment>
              ),
            }}
        />
      </DialogContent>
      <DialogActions>
          <Button onClick={handleAjouter} color="primary"  variant='contained' style={{textTransform: 'none'}}>
            Ajouter
          </Button>
          <Button onClick={handleAnnulerAjouter} color="secondary" variant='contained' style={{textTransform: 'none'}}>
            Annuler
          </Button>
        </DialogActions>
    </Dialog>
    <Dialog open={openConfirmationDialog} onClose={handleConfirmationDialogClose}>
        <DialogTitle>Supprimer l'évaluation</DialogTitle>
        <DialogContent>
        Êtes-vous sûr de vouloir supprimer cette évaluation ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="primary" variant='contained' style={{textTransform: 'none'}}>
            Confirmer
          </Button>
          <Button onClick={handleConfirmationDialogClose}  color="secondary" variant='contained' style={{textTransform: 'none'}}>
            Annuler
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