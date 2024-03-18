// api.js
export async function fetchUnitsByEnseignant() {
    try {
      const response = await fetch('http://localhost:8080/UniteUnseignemant/getAllByEnseignant', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch units');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    }
  }
  