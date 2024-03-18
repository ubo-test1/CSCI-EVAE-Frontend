export const submitReponses = async (payload) => {
    const url = 'http://localhost:8080/etu/repondre'; // L'URL de votre API pour soumettre les réponses
    const token = sessionStorage.getItem('accessToken'); // Récupère le token stocké dans sessionStorage

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Convertit les données payload en chaîne JSON pour l'envoi
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json(); // Renvoie la réponse du serveur après l'avoir convertie en JSON
    } catch (error) {
        console.error("Erreur lors de la soumission des réponses :", error);
        throw error; // Renvoie l'erreur pour un traitement ultérieur
    }
};
