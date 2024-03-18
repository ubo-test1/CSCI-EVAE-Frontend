export const deleteQev = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/eva/quv/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':` Bearer ${sessionStorage.getItem('accessToken')}`
            },
            method: 'DELETE',

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