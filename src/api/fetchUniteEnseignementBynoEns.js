import axios from 'axios';

export const fetchUniteEnseignement = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/uniteEnseignement/getAllByENS`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Server error:', error.response.data);
            throw new Error(error.response.data);
        } else if (error.request) {
            console.error('No response from server:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error setting up the request');
        }
    }
};
