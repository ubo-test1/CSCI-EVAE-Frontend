// assignQuestionRubriqueApi.js

export const deleteRubriqueQuestionApi = async (data) => {
    console.log("this is the data to delete "+JSON.stringify(data))
    try {
      const response = await fetch('http://localhost:8080/rub/deletebyquestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`

        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to assign questions to rubrique');
      }
      return await response.json();
    } catch (error) {
      console.error('Error assigning questions to rubrique:', error);
      throw error;
    }
  };
  