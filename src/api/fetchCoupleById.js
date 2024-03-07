// fetchQualificatifApi.js

export const fetchQualificatifById = async (idQualificatif) => {
    try {
        const response = await fetch(`http://localhost:8080/qualificatif/find/${idQualificatif}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch qualificatif');
        }

        const qualificatif = await response.json();

        return qualificatif;
    } catch (error) {
        throw new Error(error.message);
    }
};
