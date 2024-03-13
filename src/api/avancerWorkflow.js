export const updateWorkflow = async (evaId, newEtat) => {
    try {
        const response = await fetch('http://localhost:8080/eva/updateWorkflow', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                "id": evaId, // Utilisation de eva.id au lieu de eva.evaluation.id
                "etat": newEtat
            }),
        });
        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Error updating evaluation:', error);
        return { success: false, error: 'Failed to update evaluation' };
    }
};
