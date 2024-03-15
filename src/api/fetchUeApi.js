export async function getAllByEnseignant() {
    const url = 'http://localhost:8080/UniteUnseignemant/getAllByEnseignant';
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
    };
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  