import { authenticateUser } from "./loginApi";
export async function fetchQuestionStandards() {
    
    try {
      // Step 1: Send request to /auth/login endpoint to obtain access token
      const accessToken = await authenticateUser('admin', 'admin');
      console.log(accessToken)
  
      // Step 2: Use the obtained access token to fetch the list of question standards
      const response = await fetch('http://localhost:8080/eva/qus/all', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
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