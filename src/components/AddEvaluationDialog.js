import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchPromotions } from "../api/fetchPromotionByEnseignant";
import { fetchElementConstitutifs } from "../api/FetchElementConstitutifByNoENs";
import { fetchUniteEnseignement } from "../api/fetchUniteEnseignementBynoEns";
import CloseIcon from "@mui/icons-material/Close";

const AddEvaluationDialog = ({ open, onClose, onSave }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [latestAction, setLatestAction] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showError, setShowError] = useState(false);
    const [designation, setDesignation] = useState('');
    const [etat, setEtat] = useState('ELA');
    const [selectedUniteEnseignement, setSelectedUniteEnseignement] = useState('');
    const [selectedPromotion, setSelectedPromotion] = useState('');
    const [selectedElementConstitutif, setSelectedElementConstitutif] = useState('');
    const [debutReponse, setDebutReponse] = useState('');
    const [finReponse, setFinReponse] = useState('');
    const [promotions, setPromotions] = useState([]);
    const [elementConstitutifs, setElementConstitutifs] = useState([]);
    const [uniteEnseignements, setUniteEnseignements] = useState([]);
    const [periode, setPeriode] = useState('');

    useEffect(() => {

        const fetchPromotionData = async () => {
            const data = await fetchPromotions();
            setPromotions(data);
        };

        const fetchElementConstitutifsData = async () => {
            const data = await fetchElementConstitutifs();
            setElementConstitutifs(data);
        };
        const fetchUniteEnseignementData = async () => {
            const data = await fetchUniteEnseignement();
            setUniteEnseignements(data);
        }
        fetchUniteEnseignementData();
        fetchPromotionData();
        fetchElementConstitutifsData();
    }, []);

    // Filter element constitutif based on selected unite enseignement
    const filteredElementConstitutifs = elementConstitutifs.filter(element =>
        element.id.codeUe === (selectedUniteEnseignement ? selectedUniteEnseignement.id.codeUe : null)
    );

    const handleSave = () => {
        if (!selectedPromotion || !selectedUniteEnseignement || !designation || !periode || !debutReponse || !finReponse) {
            setShowAlert(true); // Set state to show the alert
            return;
        }
        if (debutReponse >= finReponse) {
            // Show error alert
            setShowAlert(true);
            return;
        }
        const newEvaluation = {
            uniteEnseignement: {
                id: {
                    codeFormation: selectedUniteEnseignement.id.codeFormation,
                    codeUe: selectedUniteEnseignement.id.codeUe
                }
            },
            elementConstitutif: selectedElementConstitutif ? {
                id: {
                    codeFormation: selectedElementConstitutif.id.codeFormation,
                    codeUe: selectedElementConstitutif.id.codeUe,
                    codeEc: selectedElementConstitutif.id.codeEc
                }
            } : null,
            promotion: {
                id: {
                    codeFormation: selectedPromotion.id.codeFormation,
                    anneeUniversitaire: selectedPromotion.id.anneeUniversitaire
                }
            },
            designation,
            etat,
            periode,
            debutReponse,
            finReponse
        };
        try {
            onSave(newEvaluation);
            window.location.reload();

        } catch (error) {
            setShowError(true);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Ajouter une évaluation</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal" style={{ minWidth: 1000 }}>
                    <TextField
                        label="Désignation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="promotion-label">Promotion</InputLabel>
                        <Select
                            labelId="promotion-label"
                            id="promotion-select"
                            value={selectedPromotion}
                            onChange={(e) => setSelectedPromotion(e.target.value)}
                            label="Promotion"
                        >
                            {promotions.map((promotion) => (
                                <MenuItem key={promotion.id} value={promotion}>
                                    {promotion.id.codeFormation + '-' + promotion.id.anneeUniversitaire}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="uniteEnseignement-label">Unité Enseignement</InputLabel>
                        <Select
                            labelId="uniteEnseignement-label"
                            id="uniteEnseignement-select"
                            value={selectedUniteEnseignement}
                            onChange={(e) => setSelectedUniteEnseignement(e.target.value)}
                            label="Unité Enseignement"
                        >
                            {uniteEnseignements.map((uniteEnseignement) => (
                                <MenuItem key={uniteEnseignement.id} value={uniteEnseignement}>
                                    {uniteEnseignement.id.codeFormation + '-' + uniteEnseignement.id.codeUe}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="elementConstitutif-label">Element Constitutif</InputLabel>
                        <Select
                            labelId="elementConstitutif-label"
                            id="elementConstitutif-select"
                            value={selectedElementConstitutif}
                            onChange={(e) => setSelectedElementConstitutif(e.target.value)}
                            label="Element Constitutif"
                        >
                            {filteredElementConstitutifs.map((elementConstitutif) => (
                                <MenuItem key={elementConstitutif.id} value={elementConstitutif}>
                                    {elementConstitutif.id.codeUe + '-' + elementConstitutif.id.codeEc}
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            margin="dense"
                            id="debutReponse"
                            label="Début Réponse"
                            fullWidth
                            value={debutReponse}
                            onChange={setDebutReponse}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            margin="dense"
                            id="finReponse"
                            label="Fin Réponse"
                            fullWidth
                            value={finReponse}
                            onChange={setFinReponse}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                {showAlert && (
                    <Alert severity="error">
                        {finReponse <= debutReponse ? "La date de fin doit être postérieure à la date de début." : "Veuillez remplir tous les champs obligatoires."}
                        <Button onClick={() => setShowAlert(false)}><CloseIcon /></Button>
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Confirmer
                </Button>
                <Button onClick={onClose} color="secondary">
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>

    );
};

export default AddEvaluationDialog;
