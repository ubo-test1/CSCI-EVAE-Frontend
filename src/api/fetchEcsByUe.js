export async function fetchEcsByUe(ue) {
    console.log("this is in fecthicn eccssss ::: " + JSON.stringify(ue))
    const url = `http://localhost:8080/ElementConstitutif/getAllByUE?codeUe=${ue.id.codeUe}&codeFormation=${ue.id.codeFormation}`;
  
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
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
