export const deleteQualificatif = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/qualificatif/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete qualificatif');
      }
    } catch (error) {
      console.error('Error deleting qualificatif:', error);
      throw error;
    }
  };
  