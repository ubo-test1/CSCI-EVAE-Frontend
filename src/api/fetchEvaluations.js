export async function fetchEvaluations() {

    try {
      const response = await fetch('http://localhost:8080/eva/getAll', {
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
  