export const updateEvaOrdre = async (updateData) => {
    try {
        const response = await fetch(`http://localhost:8080/eva/rbs/ordonner`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const responseStatus = response.status;

        // Check if response status is 400
        if (responseStatus === 400) {
            const errorData = await response.text(); // Read error message as text
            throw new Error(`Failed to update order: ${errorData}`);
        }

        // For other response statuses, parse JSON response
        const responseData = await response.json();

        return { data: responseData, status: responseStatus }; // Return both data and status with clear variable names
    } catch (error) {
        throw new Error(error.message); // Throw an error if request fails
    }
};
