import { authenticateUser } from "./loginApi";

export async function fetchQualificatifs() {
  try {

    const response = await fetch('http://localhost:8080/qualificatif/all', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch qualificatifs');
    }

    const qualificatifs = await response.json();
    console.log("Qualificatifs received:", qualificatifs); // Log the data received

    return qualificatifs;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
