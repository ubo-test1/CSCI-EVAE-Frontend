import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function sideBarRepondreEvaluation({ rubriques, setCurrentRubriqueIndex }) {
    return (
        <div className="sidebBarRepondreEvaluation">
            <List component="nav">
                {rubriques.map((rubrique, index) => (
                    <ListItem
                        button
                        key={rubrique.id}
                        selected={index === 0} // Remplacez 0 par la logique de sélection actuelle, si nécessaire
                        onClick={() => setCurrentRubriqueIndex(index)}
                    >
                        <ListItemText primary={rubrique.designation} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default sideBarRepondreEvaluation;
