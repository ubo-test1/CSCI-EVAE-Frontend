import axios from 'axios';

export async function save(req) {
    try {
        const response = await axios.post(
            'http://localhost:8080/eva/create',
            req,
            {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, // Fix the string interpolation here
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('Failed to add evaluation:', error.response.data);
        } else {
            console.error('Error creating evaluation:', error.message);
        }
        throw error;
    }
}
