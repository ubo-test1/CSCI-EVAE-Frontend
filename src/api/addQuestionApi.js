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
      console.error('Error creating question:', error);
      throw error;
    }
  }
  
