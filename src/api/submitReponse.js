export const submitReponse = async (reponse) => {
    try {
        const response = await fetch(`http://localhost:8080/etu/repondre`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: reponse,
        });

        const reponseStatus = response.status;

        // Check if response status is 400
        if (reponseStatus === 400) {
            const errorData = await response.text(); // Read error message as text
            throw new Error(`Failed to add couple: ${errorData}`);
        }

        // For other response statuses, parse JSON response
        const text = await response.text();

        try {
            return JSON.parse(text); // Return the parsed JSON data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return { status: 'error', message: 'Failed to parse JSON response.' };
        }
    } catch (error) {
        throw new Error(error.message); // Throw an error if request fails
    }
};
