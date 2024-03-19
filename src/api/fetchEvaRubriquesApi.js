export async function getAllByIdEvaluation(id) {
    console.log("this is the iddd ::: " + id)
    try {
        const response = await fetch(`http://localhost:8080/eva/rbs/findByIdEvaluation/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}