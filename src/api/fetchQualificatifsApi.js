import { authenticateUser } from "./loginApi";

export async function fetchQualificatifs() {
  try {
    const accessToken = await authenticateUser('admin', 'admin');
    console.log("this is in qualificatif : " + accessToken);
    const response = await fetch('http://localhost:8080/eva/qus/qualificatifs', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
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
