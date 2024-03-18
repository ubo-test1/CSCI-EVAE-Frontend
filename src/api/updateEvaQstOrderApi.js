export async function ordonnerQuestions(questionEvaluations) {
    console.log("this is what you send :::: " + JSON.stringify(questionEvaluations))
    try {
        const response = await fetch('http://localhost:8080/eva/quv/ordonner', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(questionEvaluations)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        // Assuming getAll() returns some data
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error to the caller if necessary
    }
}