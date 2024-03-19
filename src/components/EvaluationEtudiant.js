import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid from MUI
import { fetchEvaluationsEtudiant } from '../api/fetchEvaluationsEtudiant';
import { localizedTextsMap } from './dataGridLanguage';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router-dom";
import { Button } from '@mui/material';

function EvaluationEtudiant() {
  const [evaluations, setEvaluations] = useState([]);
  const location = useLocation(); // Use useLocation hook to get the current location
  const queryParams = new URLSearchParams(location.search);
  console.log("these are the query parammmss ::: " + queryParams)
  let isSuccess = queryParams.get('success'); // Get the 'success' parameter from the query string
  console.log("this is the isSuccesss :::: " + isSuccess)
  const [showAlert, setShowAlert] = useState(true);
  const [latestAction, setLatestAction] = useState(null);


  useEffect(() => {
    if (isSuccess) {
        setShowAlert(true)
        setLatestAction("add");
    }
}, [isSuccess]);
const handleHideAlert = () => {
    setShowAlert(false);
  };  


  useEffect(() => {
    async function getEvaluations() {
      try {
        const data = await fetchEvaluationsEtudiant();
        console.log(data)
        setEvaluations(data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    }
    getEvaluations();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'designation', headerName: 'Designation', flex: 0.7 },
    { field: 'formation', headerName: 'Formation', flex: 0.6 },
    { field: 'ue', headerName: 'UE', flex: 0.5 },
    { field: 'ec', headerName: 'EC', flex: 0.5 },
    { field: 'periode', headerName: 'Période', flex: 1.5 },
    { field: 'debutReponse', headerName: 'Début de réponse', flex: 1 },
    { field: 'finReponse', headerName: 'Fin de réponse', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.repondu ? "secondary" : "primary"}
          fullWidth
          disabled={params.row.evaluation.etat === "CLO" && !params.row.repondu}
          onClick={() => {
            if (
              params.row.evaluation.etat !== "CLO" &&
              !params.row.repondu
            ) {
              window.location.href = `/evaluationetudiant/${params.row.evaluation.id}`;
            }
            if(params.row.repondu) {
              window.location.href = `/evaluationetudiantconsulter/${params.row.reponseEvaluation.id}`;
              //console.log(params.row)
            }
          }}
        >
          {(() => {
            if (params.row.evaluation.etat === "CLO" && params.row.repondu) {
              return "Consulter les réponses";
            } else if (params.row.evaluation.etat === "CLO") {
              return "Évaluation clôturée";
            } else if (params.row.evaluation.etat !== "CLO" && params.row.repondu) {
              return "Consulter les réponses";
            } else if (params.row.evaluation.etat !== "CLO" && !params.row.repondu) {
              return "Répondre";
            }
          })()}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <Sidebar />
      {evaluations.length > 0 ? (
        <div style={{ position: 'absolute', left: '12vw', top: '25vh', width: '80%', margin: 'auto' }}>
        <div style={{ height: 450, width: '100%' }}>
          <DataGrid
            rows={evaluations.map((evaluation, index) => ({
              id: index,
              designation: evaluation.evaluation.designation,
              formation: evaluation.evaluation.uniteEnseignement.codeFormation.codeFormation,
              ue: evaluation.evaluation.uniteEnseignement.id.codeUe,
              ec: evaluation.evaluation.elementConstitutif ? evaluation.evaluation.elementConstitutif.id.codeEc : "",
              periode: evaluation.evaluation.periode,
              debutReponse: new Date(evaluation.evaluation.debutReponse).toLocaleDateString('fr-FR'),
              finReponse: new Date(evaluation.evaluation.finReponse).toLocaleDateString('fr-FR'),
              etat: evaluation.evaluation.etat === "CLO" ? "Cloturé" : "à disposition",
              repondu: evaluation.repondu,
              evaluation: evaluation.evaluation,
              reponseEvaluation : evaluation.repondu ? evaluation.reponseEvaluation : ""
            }))}
            hideFooter={true}
            columns={columns}
            pageSize={5}
          />
          </div>
        </div>
      ) : (
        <p>Pas d'évaluations en cours pour l'instant</p>
      )}
      {showAlert && latestAction==='add' && (
            <Alert severity="success" style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
              Vous avez répondu avec success !
              <Button onClick={handleHideAlert}><CloseIcon /></Button>
            </Alert>
        )}
    </div>
  );
}

export default EvaluationEtudiant;
