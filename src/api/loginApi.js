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

        if (!response.ok) {
            throw new Error('Failed to authenticate user');
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}