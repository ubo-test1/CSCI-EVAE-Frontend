// auth.js
export async function authenticateUser(username, password) {
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        console.log("I AM HEREREREER")
        const data = await response.json();
        console.log("this is what the controlelr gives you " + JSON.stringify(data, null, 2));

        if (!response.ok) {
            // Check if the error message indicates bad credentials
            if (data.message === 'Bad credentials') {
                throw new Error('Invalid username or password');
            } else {
                throw new Error('Failed to authenticate user');
            }
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
