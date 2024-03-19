export async function fetchEvaRubQuesDetails (id) {
    console.log("this is the iddd :::: " + id)
    try {
        const response = await fetch(`http://localhost:8080/eva/quv/consulterInfo/${id}`,{
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch evaluation details');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching evaluation details:', error);
        throw error;
    }
}