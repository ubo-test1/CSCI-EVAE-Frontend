export default async function assignQuestionsToRubrique(rubriqueId, selectedQuestions, accessToken) {
    try {
        const response = await fetch('http://localhost:8080/rub/assignQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ rubriqueId: rubriqueId, qList: selectedQuestions })
        });
        console.log("/////////////////" + JSON.stringify({ rubriqueId: rubriqueId, qList: selectedQuestions }))
        if (!response.ok) {
            throw new Error('Failed to assign questions to rubrique');
        }
        return response;
    } catch (error) {
        console.error('Error assigning questions to rubrique:', error);
        throw error;
    }
}