export async function fetchEcsByUe(ue) {
    //console.log("uergeugeur ::!::: " + JSON.stringify(ue))
    const url = 'http://localhost:8080/ElementConstitutif/getAllByUE';
  
    try {
      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          },
        body: JSON.stringify(ue)
      };
  
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching ECs by UE:', error);
      throw error;
    }
  }
  