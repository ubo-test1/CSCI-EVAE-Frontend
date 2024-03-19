export async function addRub(requestBody) {
    console.log("i am here -------------------------------- " + JSON.stringify(requestBody))
    try {
        const response = await fetch('http://localhost:8080/eva/rbs/addRub', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Server responded with status ${response.status}: ${errorMessage}`);
        }

        const responseData = await response.text(); // Assuming response is text, modify accordingly if JSON or other format
        return responseData;
    } catch (error) {
        console.error('Error adding rubrique:', error);
        throw error;
    }
}
