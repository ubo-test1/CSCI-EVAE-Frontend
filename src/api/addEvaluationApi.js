import axios from 'axios';

export async function createEvaluation(newEvaluation) {
    console.log("this is the new fucking evaluation ::::" + JSON.stringify(newEvaluation))
  try {
    const response = await axios.post(
      'http://localhost:8080/eva/create',
      newEvaluation,
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
