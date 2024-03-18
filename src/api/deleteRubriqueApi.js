// deleteRubriqueApi.js
export const deleteRubriqueApi = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/rub/deleteStd/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
      });
      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error deleting rubrique:', error);
      return { success: false, error: 'Failed to delete rubrique' };
    }
  };
  