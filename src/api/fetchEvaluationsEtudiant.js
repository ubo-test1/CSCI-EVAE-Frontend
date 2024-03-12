export async function fetchEvaluationsEtudiant() {
        /*const accessToken = sessionStorage.getItem('user');
      const test = accessToken;
      console.log("THIS IS THE TEST ::: " + test)*/
      try {
        const response = await fetch('http://localhost:8080/eva/getByPro', {
          headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch evaluations');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        return [];
      }
    }