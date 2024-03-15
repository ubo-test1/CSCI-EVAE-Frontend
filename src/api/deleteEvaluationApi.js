export const deleteEva = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/eva/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      });
  
      if (response.ok) {
        // Handle success
        console.log('Evaluation deleted successfully.');
      } else {
        // Handle errors
        const errorData = await response.json();
        console.error('Error deleting evaluation:', errorData);
        // You can display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting evaluation:', error.message);
      // Handle network errors or other exceptions
    }
  };
  