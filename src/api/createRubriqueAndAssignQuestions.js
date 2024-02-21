export async function createRubriqueAndAssignQuestions(designation, selectedQuestions, accessToken) {
    try {
        // Create the rubrique and extract the rubrique ID from the response
        const rubriqueId = await createRubrique(designation, accessToken);
        
        // Assign questions to the rubrique using the obtained rubrique ID
        const assignResponse = await assignQuestionsToRubrique(rubriqueId, selectedQuestions, accessToken);
        
        return assignResponse.ok;
    } catch (error) {
        console.error('Error creating rubrique and assigning questions:', error);
        throw error;
    }
}

async function createRubrique(designation, accessToken) {
    try {
        const response = await fetch('http://localhost:8080/rub/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ designation: designation })
        });
        if (!response.ok) {
            throw new Error('Failed to create rubrique');
        }
        // Extract and return the rubrique ID from the response
        const responseData = await response.json();
        return responseData.id; // Assuming the rubrique ID is directly available in the response JSON
    } catch (error) {
        console.error('Error creating rubrique:', error);
        throw error;
    }
}

async function assignQuestionsToRubrique(rubriqueId, selectedQuestions, accessToken) {
    try {
        const response = await fetch('http://localhost:8080/rub/assignQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ rubriqueId: rubriqueId, qList: selectedQuestions })
        });
        if (!response.ok) {
            throw new Error('Failed to assign questions to rubrique');
        }
        return response;
    } catch (error) {
        console.error('Error assigning questions to rubrique:', error);
        throw error;
    }
}
