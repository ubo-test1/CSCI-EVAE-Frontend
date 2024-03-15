// SideBarRepondreEvaluation.js
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function SideBarRepondreEvaluation({ rubriques, currentRubriqueIndex, setCurrentRubriqueIndex }) {
    return (
        <div className="SideBarRepondreEvaluation">
            <List component="nav">
                {rubriques.map((rubrique, index) => (
                    <ListItem
                        button
                        key={`rubrique-${rubrique.id}-${index}`}
                        selected={index === currentRubriqueIndex}
                        onClick={() => setCurrentRubriqueIndex(index)}
                    >
                        <ListItemText primary={rubrique.designation} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default SideBarRepondreEvaluation;

