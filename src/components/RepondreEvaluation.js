import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import SideBarRepondreEvaluation from './SideBarRepondreEvaluation'; // Assurez-vous que le chemin d'importation est correct
import { fetchEvaluationDetails } from '../api/fetchEvaluationInfo';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import '../RepondreEvaluation.css';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import {Button} from "@mui/material";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


function RepondreEvaluation() {
    const { id } = useParams();
    const [evaluation, setEvaluation] = useState({ rubriques: [] });
    const [currentRubriqueIndex, setCurrentRubriqueIndex] = useState(0);
    const [rubriques, setRubriques] = useState();

    useEffect(() => {
        async function getEvaluationDetails() {
            try {
                const details = await fetchEvaluationDetails(id);
                setEvaluation(details);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'évaluation:', error);
            }
        }

        getEvaluationDetails();
    }, [id]);

    if (!evaluation || !evaluation.rubriques || evaluation.rubriques.length === 0) {
        return <div>Chargement...</div>;
    }

    const handleRubriqueChange = (index) => {
        setCurrentRubriqueIndex(index);
    };

    const handlePrevious = () => {
        if (currentRubriqueIndex > 0) {
            setCurrentRubriqueIndex(currentRubriqueIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentRubriqueIndex < evaluation.rubriques.length - 1) {
            setCurrentRubriqueIndex(currentRubriqueIndex + 1);
        }
    };
    const handleRetourClick = () => {
        window.history.back();
        console.log('Retour button clicked');
    };

    return (
        <div className="repondreEvaluationContainer">
            <Navbar/>
            <SideBarRepondreEvaluation
                rubriques={evaluation.rubriques.map(r => r.rubrique)}
                currentRubriqueIndex={currentRubriqueIndex}
                setCurrentRubriqueIndex={setCurrentRubriqueIndex}
            />
            <div style={{position: "absolute", left: '1vh' ,top: '12vh', zIndex: '100', textAlign: 'left', width: 'auto'}}>
                <Button variant="contained" color="primary" startIcon={<ArrowBackIcon/>} onClick={handleRetourClick}>
                    Retour
                </Button>
            </div>

            <div className="evaluationContent">
                <div className="rubricContainer">
                    <Typography variant="h5" className="rubricTitle">
                        {evaluation.rubriques[currentRubriqueIndex].rubrique.designation}
                    </Typography>
                    <div className="paper">
                    <Paper style={{overflowX: 'auto', boxShadow: 'none'}}> {/* Paper avec ombre désactivée */}
                        <Table>
                            <TableBody>
                                {evaluation.rubriques[currentRubriqueIndex].questions.map((question, index) => (
                                    <TableRow key={index} className="questionRow">
                                        {/* Question */}
                                        <TableCell component="th" scope="row" style={{borderBottom: 'none'}}
                                                   sx={{minWidth: 10, maxWidth: 80}}>
                                            {question.intitule}
                                        </TableCell>

                                        <TableCell align="right" style={{borderBottom: 'none'}}>
                                            {question.idQualificatif.minimal}
                                        </TableCell>

                                        <TableCell style={{borderBottom: 'none'}} sx={{minWidth: 100, maxWidth: 200}}>
                                            <Slider
                                                defaultValue={1}
                                                step={1}
                                                marks // Supprimez cette ligne si vous ne voulez pas afficher les marks sur chaque Slider
                                                min={1}
                                                max={5}
                                                valueLabelDisplay="auto"
                                            />
                                        </TableCell>

                                        {/* Qualificatif maximal */}
                                        <TableCell align="left" style={{borderBottom: 'none'}}>
                                            {question.idQualificatif.maximal}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
                </div>
            </div>
            <div className="evaluationFooter">
                {currentRubriqueIndex > 0 && (
                    <button className="prev" onClick={handlePrevious} disabled={currentRubriqueIndex === 0}> ← Précédent</button>
                )}
                <span className="navItem pageIndicator">{currentRubriqueIndex + 1}/{evaluation.rubriques.length}</span>
                {currentRubriqueIndex < evaluation.rubriques.length - 1 ? (
                    <button className="next" onClick={handleNext}>Suivant →</button>
                ) : (
                    <button className="finish">Terminer</button>
                )}
            </div>
        </div>
    );
}

export default RepondreEvaluation;
