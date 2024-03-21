export const updateQualificatif = async (id, minimal, maximal) => {
    try {
      console.log("this is the id", id);
      console.log("this is the minimal", minimal);
      console.log("this is the maximal", maximal);
  
      const bodyData = {
        id: id,
        minimal: minimal,
        maximal: maximal,
      };
      console.log("i am in the api :: ======" + JSON.stringify(bodyData))
      console.log('Sending body:', bodyData);
  
      const response = await fetch(`http://localhost:8080/qualificatif/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(bodyData),
      });
  
      // Log the response before parsing it as JSON
      console.log('Response:', response);
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating qualificatif:', error);
      throw new Error('Failed to update qualificatif');
    }
  };
  