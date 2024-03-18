export const addCouple = async (minimal, maximal) => {
  try {
    const response = await fetch(`http://localhost:8080/qualificatif/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ minimal, maximal }),
    });
    
    const reponseStatus = response.status;

    // Check if response status is 400
    if (reponseStatus === 400) {
      const errorData = await response.text(); // Read error message as text
      throw new Error(`Failed to add couple: ${errorData}`);
    }

    // For other response statuses, parse JSON response
    const data = await response.json();

    return { data, status: reponseStatus }; // Return both data and status
  } catch (error) {
    throw new Error(error.message); // Throw an error if request fails
  }
};
