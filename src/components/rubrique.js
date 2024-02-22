import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './navbar';
import Sidebar from './sideBar';
import { fetchAllStandardRubriques } from '../api/fetchRubriques';
import { fetchQuestionStandards } from '../api/fetchQuestionStandardsApi';
import { fetchRubriqueDetails } from '../api/fetchRubriqueDetailsApi';; // Import the API function for fetching rubrique details
import { createRubriqueAndAssignQuestions } from '../api/createRubriqueAndAssignQuestions';
import { deleteRubriqueApi } from '../api/deleteRubriqueApi';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DialogContentText from '@mui/material/DialogContentText';
import {updateRubriqueApi} from '../api/updateRubriqueApi';
import { addQtoRubApi } from '../api/addQtoRubApi';
import { delQfromRubApi } from '../api/delQfromRubApi';


const RubriqueList = () => {
    const [rubriques, setRubriques] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [designation, setDesignation] = useState('');
    const [questionStandards, setQuestionStandards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rubriqueToDelete, setRubriqueToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRubrique, setSelectedRubrique] = useState(null);
    const [fullQuestions, setFullQuestions] = useState([]);
    const [initialCheckState, setInitialCheckState] = useState(false);
    const [checkedQuestions, setCheckedQuestions] = useState([]);
    const [srvQuestions, setSrvQuestions] = useState([]);


    useEffect(() => {
        fetchRubriques();
        sessionStorage.setItem('toAdd', JSON.stringify([]));
        sessionStorage.setItem('toDel', JSON.stringify([]));
    }, []);

    const fetchRubriques = async () => {
        try {
            const data = await fetchAllStandardRubriques();
            setRubriques(data.map(rubrique => ({
                ...rubrique.rubrique,
                associated: rubrique.associated
            })));
        } catch (error) {
            console.error('Error fetching rubriques:', error);
        }
    };

    const fetchRubriqueDetailsById = async (id) => {
        try {
            const data = await fetchRubriqueDetails(id);
            return data;
        } catch (error) {
            console.error('Error fetching rubrique details:', error);
        }
    };

    const handleEditClick = async (rubriqueId) => {
        setEditDialogOpen(true);
        try {
            setLoading(true);
            const rubriqueDetails = await fetchRubriqueDetails(rubriqueId);
            console.log(rubriqueDetails)
            if ('rubrique' in rubriqueDetails) {
                setSelectedRubrique(rubriqueDetails.rubrique);
            } else {
                setSelectedRubrique(rubriqueDetails);
            }
            const modifiedQuestions = (rubriqueDetails.questions || []).map(question => ({
                ...question,
                received: true
            }));
            console.log("this is the modified quesitons " + JSON.stringify(modifiedQuestions))
    
            let mergedQuestions = [];
            const data = await fetchQuestionStandards();
            console.log("mamaaaaaaaaaaaak")
            console.log(data)
            const filteredData = data.filter(question => !modifiedQuestions.some(modifiedQuestion => modifiedQuestion.intitule === question.question.intitule));
            console.log("ouououoihoi")
            console.log(filteredData)

            let test1 = []

            filteredData.forEach(element => {
                test1.push(element.question)
            });

            // Concatenate the selected questions with the merged questions
            mergedQuestions = [...modifiedQuestions, ...test1];

            console.log("hhhhhhhhhhhh")
            console.log(mergedQuestions)
    
            // Update state
            setDesignation(rubriqueDetails.designation || rubriqueDetails.rubrique.designation);
            setFullQuestions(mergedQuestions);
            setCheckedQuestions(modifiedQuestions)
            setSrvQuestions(modifiedQuestions)
            
            console.log("RUUUUUUUUUUB")
            console.log(rubriqueDetails.rubrique)
            setQuestionStandards(data);
        } catch (error) {
            console.error('Error fetching rubrique details:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleEditConfirmed = async () => {
        // Handle edit confirmation logic here
        // You can update the rubrique details with the new designation and questions
        // Make API call to update the rubrique with the new details
        try {
            setLoading(true);
            // Example API call to update the rubrique
            let updateReq = {
                "id" : selectedRubrique.id,
                "type" : selectedRubrique.type,
                "noEnseignant" : selectedRubrique.noEnseignant,
                "designation" : selectedRubrique.designation,
                "ordre" : selectedRubrique.ordre
            }

            let addQReq = {
                "rubriqueId" : selectedRubrique.id,
                "qList" : JSON.parse(sessionStorage.getItem('toAdd'))
            }

            let delQReq = {
                "rubriqueId" : selectedRubrique.id,
                "qList" : JSON.parse(sessionStorage.getItem('toDel'))
            }
            if(JSON.parse(sessionStorage.getItem('toAdd')).length > 0){
                const addq = await addQtoRubApi(addQReq);
                if (addq) {
                    console.log('questions added successfully');
                    fetchRubriques();
                } else {
                    alert('Failed to add quests');
                }
            }

            if(JSON.parse(sessionStorage.getItem('toDel')).length > 0){
                const delq = await delQfromRubApi(delQReq);
                if (delq) {
                    console.log('questions deleted successfully');
                    fetchRubriques();
                } else {
                    alert('Failed to update rubrique');
                }
            }

            const update = await updateRubriqueApi(updateReq);
                if (update) {
                    console.log('rubrique updated successfully');
                    fetchRubriques();
                } else {
                    alert('Failed to delete quests');
                }
                
            location.reload()
            
        } catch (error) {
            console.error('Error updating rubrique:', error);
        } finally {
            setLoading(false);
            handleCloseDialog();
        }
    };

    const handleAjouterRubrique = async () => {
        setOpenDialog(true);
        try {
            setLoading(true);
            const data = await fetchQuestionStandards();
            console.log("this is the questions data " + data)
            setQuestionStandards(data);
        } catch (error) {
            console.error('Error fetching question standards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRubrique = async () => {
        try {
            setLoading(true);
            const success = await createRubriqueAndAssignQuestions(designation, selectedQuestions.map(question => question.question.id), sessionStorage.getItem('accessToken'));
            if (success) {
                console.log('Rubrique created and questions assigned successfully');
                fetchRubriques(); // Refresh the rubriques data after adding a rubrique
            } else {
                console.error('Failed to create rubrique or assign questions');
            }
        } catch (error) {
            console.error('Error creating rubrique and assigning questions:', error);
        } finally {
            setLoading(false);
            handleCloseDialog();
        }
    };

    const handleDeleteClick = (rubriqueId) => {
        setRubriqueToDelete(rubriqueId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const { success, error } = await deleteRubriqueApi(rubriqueToDelete);
            if (success) {
                console.log('Rubrique deleted successfully');
                fetchRubriques(); // Refresh the rubriques data after deleting a rubrique
            } else {
                console.error('Error deleting rubrique:', error);
            }
        } catch (error) {
            console.error('Error deleting rubrique:', error);
        } finally {
            setDeleteDialogOpen(false);
            setRubriqueToDelete(null);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDesignation('');
        setSelectedQuestions([]);
        setSelectedRubrique(null);
        location.reload()
    };

    const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    };

    const handleCheckboxChange = (event, question) => {
        if (initialCheckState === false) setInitialCheckState(true);
        const isChecked = event.target.checked;
    
        // Initialize toAdd and toDel in session storage if they don't exist
        if (!sessionStorage.getItem('toAdd')) sessionStorage.setItem('toAdd', JSON.stringify([]));
        if (!sessionStorage.getItem('toDel')) sessionStorage.setItem('toDel', JSON.stringify([]));
    
        // Deserialize toAdd and toDel from session storage
        let toAdd = JSON.parse(sessionStorage.getItem('toAdd'));
        let toDel = JSON.parse(sessionStorage.getItem('toDel'));
    
        if (isChecked) {
            setCheckedQuestions(prevChecked => [...prevChecked, question]);
            if (!srvQuestions.includes(question)) {
                // Add question.id to toAdd
                toAdd = [...toAdd, question.id];
                sessionStorage.setItem('toAdd', JSON.stringify(toAdd));
            }
            else{
                toDel.pop(question.id)
                sessionStorage.setItem('toDel', JSON.stringify(toDel));
            }
        } else {
            setCheckedQuestions(prevChecked =>
                prevChecked.filter(selected => selected.id !== question.id)
            );
            // Remove question.id from toAdd if it exists
            if (toAdd.includes(question.id)) {
                toAdd = toAdd.filter(id => id !== question.id);
                sessionStorage.setItem('toAdd', JSON.stringify(toAdd));
            }
            // Add question.id to toDel if the question is in srvQuestions
            if (srvQuestions.includes(question)) {
                toDel = [...toDel, question.id];
                sessionStorage.setItem('toDel', JSON.stringify(toDel));
            }
        }
    
        // For debugging purposes
        console.log("To add", JSON.parse(sessionStorage.getItem('toAdd')));
        console.log("To del", JSON.parse(sessionStorage.getItem('toDel')));
    
        event.target.checked = isChecked;
    };
    
    

    const handleCheckboxChange2 = (event, question) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedQuestions(prevSelected => [...prevSelected, question]);
        } else {
            setSelectedQuestions(prevSelected =>
                prevSelected.filter(selected => selected.id !== question.id)
            );
        }
    };

    const renderQuestionStandardsTable = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
    
        return (
            <div>
                <h3>Question Standards</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Intitule</th>
                            <th>Minimal</th>
                            <th>Maximal</th>
                            <th>Ajouter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionStandards.map((question, index) => (
                            <tr key={index}>
                                <td>{question.question.intitule}</td>
                                <td>{question.question.idQualificatif.minimal}</td>
                                <td>{question.question.idQualificatif.maximal}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={(event) => handleCheckboxChange2(event, question)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderEditRubrique = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
    
        return (
            <div>
                <h3>Question Standards</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Intitule</th>
                            <th>Minimal</th>
                            <th>Maximal</th>
                            <th>Ajouter</th>
                        </tr>
                    </thead>
                    <tbody>
    {fullQuestions.map((question, index) => (
        <tr key={index}>
            <td>{question.intitule}</td>
            <td>{question.idQualificatif.minimal}</td>
            <td>{question.idQualificatif.maximal}</td>
            <td>
            <input
                    type="checkbox"
                    checked={checkedQuestions.includes(question)}
                    onChange={(event) => handleCheckboxChange(event, question)}
                />
            </td>
        </tr>
    ))}
</tbody>

                </table>
            </div>
        );
    };
    
    const columns = [
        { field: 'designation', headerName: 'Designation', width: 300 },
        { field: 'ordre', headerName: 'Ordre', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    {params.row.associated ? (
                        <Tooltip title="Referencé">
                            <span>
                                <IconButton
                                    disabled
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Modifier">
                            <IconButton color="primary" onClick={() => handleEditClick(params.row.id)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.associated ? (
                        <Tooltip title="Referencé">
                            <span>
                                <IconButton
                                    disabled
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.26)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Supprimer">
                            <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Sidebar />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <Button variant="contained" onClick={handleAjouterRubrique}>Ajouter Rubrique</Button>
            </div>
            <div className="grid-container">
                <DataGrid rows={rubriques} columns={columns} pageSize={5} getRowId={(row) => row.id} />
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Ajouter Rubrique</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="designation"
            label="Designation"
            fullWidth
            value={designation}
            onChange={handleDesignationChange}
        />
        {renderQuestionStandardsTable()}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleAddRubrique} color="primary">Add Rubrique</Button>
    </DialogActions>
</Dialog>
<Dialog open={editDialogOpen} onClose={handleCloseDialog}>
    <DialogTitle>Edit Rubrique</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            id="designation"
            label="Designation"
            fullWidth
            value={designation}
            onChange={handleDesignationChange}
        />
        {renderEditRubrique()}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleEditConfirmed} color="primary">Save Changes</Button>
    </DialogActions>
</Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Rubrique</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this rubrique?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RubriqueList;