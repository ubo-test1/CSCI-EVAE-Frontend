
export const fetchRubEvaDetailsApi = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/rubEva/consulter/${id}`,{
            headers : {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`}
        });
        if (!response.ok) {
            throw new Error('Failed to fetch rubrique details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching rubrique details:', error);
        throw error;
    }
};