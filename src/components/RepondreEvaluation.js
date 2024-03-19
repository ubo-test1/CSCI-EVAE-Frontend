import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { useParams } from "react-router-dom";
import { fetchEvaRubQuesDetails } from "../api/fetchEvaRubQuesDetails";
import EvaluationDetails from "./EvaluationDetails";
import EvaluationDetailsReponse from "./EvaluationDetailsReponse";
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router-dom";
import { Button } from '@mui/material';

function RepondreEvaluation() {
    const { id } = useParams();
    const [rubriques, setRubriques] = useState([]);
    const [initialRubriquesOrder, setInitialRubriquesOrder] = useState([]);
    const [details, setDetails] = useState(null);
 
    useEffect(() => {
        const getEvaluationDetails = async () => {
            try {
                const data = await fetchEvaRubQuesDetails(id);
                console.log("uezfhuzeifhqziupfhqs :::: " + JSON.stringify(data))
                if (data?.rubriques) {
                    // Ensure rubriques are sorted by their initial order when fetched
                    const sortedRubriques = data.rubriques.sort((a, b) => a.rubrique.ordre - b.rubrique.ordre);
                    console.log("these are the sorted rubriquess ::::: " + JSON.stringify(sortedRubriques))
                    setRubriques(sortedRubriques);
                    // Capture the initial order of rubrique IDs
                    setInitialRubriquesOrder(sortedRubriques.map(rubrique => rubrique.rubrique.id));
                }
                setDetails(data);
            } catch (error) {
                console.error('Error fetching evaluation details:', error);
            }
        };
        if (id) {
            getEvaluationDetails();
        }
    }, [id]);

    return (
        <>
            <Navbar />
            <Sidebar />
            <div style={{ height:'80vh', width:'90vw', paddingTop:'0', margin: 'auto' }}>
                {id && <EvaluationDetailsReponse id={id} />}
            </div>
        </>
    );
}

export default RepondreEvaluation;
