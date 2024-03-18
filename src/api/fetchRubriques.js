export async function fetchAllStandardRubriques() {
    console.log("access token in rubrique fetch : " + sessionStorage.getItem('accessToken'))
    try {
      const response = await fetch('http://localhost:8080/rub/allStd',{
        headers : {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`}
    });
      if (!response.ok) {
        throw new Error('Failed to fetch standard rubriques');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching standard rubriques:', error);
      return [];
    }
  }
  