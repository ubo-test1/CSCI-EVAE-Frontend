export const updateEvaluation = async (evaluationId, updatedEvaluationData) => {
    try {
        const response = await fetch('http://localhost:8080/eva/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                id: evaluationId,
                noEvaluation: updatedEvaluationData.noEvaluation,
                designation: updatedEvaluationData.designation,
                etat: updatedEvaluationData.etat,
                periode: updatedEvaluationData.periode || null,
                debutReponse: updatedEvaluationData.debutReponse,
                finReponse: updatedEvaluationData.finReponse,
                uniteEnseignement: {
                    id: {
                        codeFormation: updatedEvaluationData.codeFormation,
                        codeUe: updatedEvaluationData.ue
                    }
                },
                elementConstitutif: updatedEvaluationData.ec ? {
                    id: {
                        codeFormation: updatedEvaluationData.codeFormation,
                        codeUe: updatedEvaluationData.ue,
                        codeEc: updatedEvaluationData.ec
                    }
                } : null,
                promotion: {
                    id: {
                        codeFormation: updatedEvaluationData.codeFormation,
                        anneeUniversitaire: updatedEvaluationData.anneeUniversitaire
                    }
                }
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to update evaluation');
        }

        const updatedEvaluation = await response.json();
        return updatedEvaluation;
    } catch (error) {
        throw new Error(error.message || 'Failed to update evaluation');
    }
};
