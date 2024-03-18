
export const avancerWorkflow = async (id, etat) => {
    try {
        console.log("this is the id", id);
        console.log("this is the etat", etat);

        const bodyData = {
            id: id,
            etat: etat
        };

        console.log('Sending body:', bodyData);

        const response = await fetch(`http://localhost:8080/eva/updateWorkflow`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(bodyData),
        });

        // Log the response before parsing it as JSON
        console.log('Response:', response);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating evaluation workflow:', error);
        throw new Error('Failed to update workflow evaluation');
    }
};
