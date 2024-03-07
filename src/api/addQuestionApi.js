import axios from 'axios';

export async function saveQuestion(questionData) {
    try {
        const response = await axios.post('http://localhost:8080/eva/qus/create', questionData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response from server:', error.response.data);
            throw new Error(error.response.data || 'Server error');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error setting up the request:', error.message);
            throw new Error('Request setup error');
        }
    }
}
