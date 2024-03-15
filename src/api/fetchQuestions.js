
export const fetchAllQuestions = async () => {
    try {
        const response = await fetch(`http://localhost:8080/qes/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch question');
        }

        const data = await response.json(); // Parse the response as JSON

        return data; // Return the question object
    } catch (error) {
        throw new Error(error.message);
    }
};