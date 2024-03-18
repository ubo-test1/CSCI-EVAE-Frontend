// fetchQuestionStandards.js
export async function fetchQuestionStandards() {
  try {
    const response = await fetch('http://localhost:8080/eva/qus/all', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch question standards');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
