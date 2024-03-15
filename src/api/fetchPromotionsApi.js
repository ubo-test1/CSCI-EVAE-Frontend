export async function fetchPromotions() {
    const url = `http://localhost:8080/promotion/getAll`;
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.map(promotion => ({
            value: `${promotion.id.codeFormation}-${promotion.id.anneeUniversitaire}`,
            label: `${promotion.id.codeFormation} - ${promotion.id.anneeUniversitaire}`
        }));
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw error;
    }
}
