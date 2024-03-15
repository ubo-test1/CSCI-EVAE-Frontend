import axios from 'axios';

export const updateEvaluation = async (evaluationId, updatedEvaluationData) => {
    console.log("this is the info i am sending :::: " + JSON.stringify(updatedEvaluationData))
  try {
    const response = await axios.put('http://localhost:8080/eva/update', updatedEvaluationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    }
    });

    console.log('Response:', response.data);
    
    // You can return response data if needed
    return response.data;
  } catch (error) {
    console.error('Error updating evaluation:', error);
    // Handle error here if needed
    throw error; // Rethrow error for further handling upstream
  }
};
