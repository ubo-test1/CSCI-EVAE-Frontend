// api.js

const BASE_URL = 'http://localhost:8080';

export const addCouple = async (minimal, maximal) => {
  try {
    const response = await fetch(`${BASE_URL}/qualificatif/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ minimal, maximal }),
    });
    if (!response.ok) {
      throw new Error('Failed to add couple');
    }
    const data = await response.json();
    return data; // Return the response data if successful
  } catch (error) {
    throw new Error(error.message); // Throw an error if request fails
  }
};
