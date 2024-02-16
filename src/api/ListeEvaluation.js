async function getEvaluations() {
    try {
      const response = await fetch('http://localhost:8080/eva');
      if (!response.ok) {
        throw new Error('Failed to fetch evaluations');
      }
      const evaluations = await response.json();
      return evaluations;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      throw error;
    }
  }
  
  // Example usage:
  getEvaluations()
    .then(evaluations => {
      console.log('List of evaluations:', evaluations);
      // Handle evaluations as needed
    })
    .catch(error => {
      // Handle error
    });
  