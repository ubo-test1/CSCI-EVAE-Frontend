// deleteQuestionApi.js

export const deleteEvaRub = async (rubID) => {
    try {
        const response = await fetch(`http://localhost:8080/eva/rbs/delRub/${rubID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':` Bearer ${sessionStorage.getItem('accessToken')}`
            },
            method: 'GET',

        });

        if (!response.ok) {
            throw new Error('Failed to delete question');
        }

        const data = await response.text(); // Get the response text

        return data; // Return the message
    } catch (error) {
        throw new Error(error.message);
    }
};