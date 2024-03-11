// updateRubriqueApi.js
export const updateRubriqueApi = async (rubrique) => {
  console.log("this is the rubrique :::: " + JSON.stringify(rubrique))
    try {
      const response = await fetch('http://localhost:8080/rub/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(rubrique),
      });
      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error('Error updating rubrique:', error);
      return { success: false, error: 'Failed to update rubrique' };
    }
  };
  