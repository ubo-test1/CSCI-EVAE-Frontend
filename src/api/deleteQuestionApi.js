// deleteQuestionApi.js

export const deleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:8080/eva/qus/delete/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
  
      const data = await response.text(); // Get the response text
      
      return data; // Return the message
    } catch (error) {
      throw new Error(error.message);
    }
};
