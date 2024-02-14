import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td  } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom'; // Assurez-vous d'avoir React Router installé


const evaluationData = {
  "evaluation": {
      "id": 1,
      "noEnseignant": {
          "id": 1,
          "type": "ENC",
          "sexe": "H",
          "nom": "Saliou",
          "prenom": "Philippe",
          "adresse": "6, rue de l'Argoat",
          "cp": "29860",
          "ville": "Le Drennec",
          "pays": "France",
          "telPort": null,
          "encPersoTel": "02.98.40.82.95",
          "encUboTel": "02.98.01.69.74",
          "encPersoEmail": null,
          "encUboEmail": "Philippe.Saliou@univ-brest.fr",
          "intNoInsee": null,
          "intSocNom": null,
          "intSocAdresse": null,
          "intSocCp": null,
          "intSocVille": null,
          "intSocPays": null,
          "intFonction": null,
          "intProfEmail": null,
          "intProfTel": null
      },
      "elementConstitutif": {
          "id": {
              "codeFormation": "M2DOSI",
              "codeUe": "PSI",
              "codeEc": "SD"
          },
          "uniteEnseignement": {
              "codeFormation": {
                  "codeFormation": "M2DOSI",
                  "diplome": "M",
                  "n0Annee": 2,
                  "nomFormation": "Master Développement à l'Offshore des Systèmes d'Information",
                  "doubleDiplome": "O",
                  "debutHabilitation": "2012-08-31T22:00:00Z",
                  "finHabilitation": "2016-08-31T22:00:00Z"
              },
              "codeUe": "PSI",
              "noEnseignant": {
                  "id": 2,
                  "type": "ENC",
                  "sexe": "H",
                  "nom": "Ribaud",
                  "prenom": "Vincent",
                  "adresse": "20, avenur le Gorgeu",
                  "cp": "29200",
                  "ville": "Brest",
                  "pays": "France",
                  "telPort": null,
                  "encPersoTel": null,
                  "encUboTel": "02.98.01.69.71",
                  "encPersoEmail": null,
                  "encUboEmail": "Vincent.Ribaud@univ-brest.fr",
                  "intNoInsee": null,
                  "intSocNom": null,
                  "intSocAdresse": null,
                  "intSocCp": null,
                  "intSocVille": null,
                  "intSocPays": null,
                  "intFonction": null,
                  "intProfEmail": null,
                  "intProfTel": null
              },
              "designation": "Programmation des Systèmes d’Information",
              "semestre": "9  ",
              "description": null,
              "nbhCm": null,
              "nbhTd": null,
              "nbhTp": 48
          },
          "noEnseignant": {
              "id": 1,
              "type": "ENC",
              "sexe": "H",
              "nom": "Saliou",
              "prenom": "Philippe",
              "adresse": "6, rue de l'Argoat",
              "cp": "29860",
              "ville": "Le Drennec",
              "pays": "France",
              "telPort": null,
              "encPersoTel": "02.98.40.82.95",
              "encUboTel": "02.98.01.69.74",
              "encPersoEmail": null,
              "encUboEmail": "Philippe.Saliou@univ-brest.fr",
              "intNoInsee": null,
              "intSocNom": null,
              "intSocAdresse": null,
              "intSocCp": null,
              "intSocVille": null,
              "intSocPays": null,
              "intFonction": null,
              "intProfEmail": null,
              "intProfTel": null
          },
          "designation": "Serveur de Donnees",
          "description": "Programmation BDD localisï¿½ sur un  Serveur de base de Donnï¿½es",
          "nbhCm": 10,
          "nbhTd": 10,
          "nbhTp": 18
      },
      "anneePro": {
          "anneePro": "2006-2007",
          "codeFormation": null,
          "noEnseignant": {
              "id": 1,
              "type": "ENC",
              "sexe": "H",
              "nom": "Saliou",
              "prenom": "Philippe",
              "adresse": "6, rue de l'Argoat",
              "cp": "29860",
              "ville": "Le Drennec",
              "pays": "France",
              "telPort": null,
              "encPersoTel": "02.98.40.82.95",
              "encUboTel": "02.98.01.69.74",
              "encPersoEmail": null,
              "encUboEmail": "Philippe.Saliou@univ-brest.fr",
              "intNoInsee": null,
              "intSocNom": null,
              "intSocAdresse": null,
              "intSocCp": null,
              "intSocVille": null,
              "intSocPays": null,
              "intFonction": null,
              "intProfEmail": null,
              "intProfTel": null
          },
          "siglePro": "RSOFT",
          "nbEtuSouhaite": 12,
          "etatPreselection": "ENC",
          "dateRentree": "2006-09-17T22:00:00Z",
          "lieuRentree": "LC117A",
          "dateReponseLp": "2006-07-13T22:00:00Z",
          "commentaire": null,
          "dateReponseLalp": null,
          "processusStage": null,
          "noEvaluation": null,
          "noBareme": null
      },
      "noEvaluation": 1,
      "etat": "ELA",
      "periode": "printemps",
      "debutReponse": "2007-01-05T23:00:00Z",
      "finReponse": "2007-06-05T22:00:00Z"
  },
  "rubriques": [
      {
          "rubrique": {
              "id": 1,
              "type": "RBP",
              "designation": "Cours/Td Agl",
              "ordre": 1.0,
              "noEnseignant": {
                  "id": 1,
                  "type": "ENC",
                  "sexe": "H",
                  "nom": "Saliou",
                  "prenom": "Philippe",
                  "adresse": "6, rue de l'Argoat",
                  "cp": "29860",
                  "ville": "Le Drennec",
                  "pays": "France",
                  "telPort": null,
                  "encPersoTel": "02.98.40.82.95",
                  "encUboTel": "02.98.01.69.74",
                  "encPersoEmail": null,
                  "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                  "intNoInsee": null,
                  "intSocNom": null,
                  "intSocAdresse": null,
                  "intSocCp": null,
                  "intSocVille": null,
                  "intSocPays": null,
                  "intFonction": null,
                  "intProfEmail": null,
                  "intProfTel": null
              }
          },
          "questions": [
              {
                  "id": 1,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Pauvre",
                      "minimal": "Riche"
                  },
                  "intitule": "Contenu"
              },
              {
                  "id": 2,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Faible",
                      "minimal": "Fort"
                  },
                  "intitule": "Interet"
              },
              {
                  "id": 3,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Difficile",
                      "minimal": "Facile"
                  },
                  "intitule": "Assimilabilité"
              }
          ]
      },
      {
          "rubrique": {
              "id": 2,
              "type": "RBP",
              "designation": "Tp Agl",
              "ordre": 2.0,
              "noEnseignant": {
                  "id": 1,
                  "type": "ENC",
                  "sexe": "H",
                  "nom": "Saliou",
                  "prenom": "Philippe",
                  "adresse": "6, rue de l'Argoat",
                  "cp": "29860",
                  "ville": "Le Drennec",
                  "pays": "France",
                  "telPort": null,
                  "encPersoTel": "02.98.40.82.95",
                  "encUboTel": "02.98.01.69.74",
                  "encPersoEmail": null,
                  "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                  "intNoInsee": null,
                  "intSocNom": null,
                  "intSocAdresse": null,
                  "intSocCp": null,
                  "intSocVille": null,
                  "intSocPays": null,
                  "intFonction": null,
                  "intProfEmail": null,
                  "intProfTel": null
              }
          },
          "questions": [
              {
                  "id": 1,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Faible",
                      "minimal": "Importante"
                  },
                  "intitule": "Utilité des Tp pour assimiler le cours"
              },
              {
                  "id": 2,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Difficile",
                      "minimal": "Facile"
                  },
                  "intitule": "Niveau des exercices"
              },
              {
                  "id": 3,
                  "type": "QUS",
                  "noEnseignant": {
                      "id": 1,
                      "type": "ENC",
                      "sexe": "H",
                      "nom": "Saliou",
                      "prenom": "Philippe",
                      "adresse": "6, rue de l'Argoat",
                      "cp": "29860",
                      "ville": "Le Drennec",
                      "pays": "France",
                      "telPort": null,
                      "encPersoTel": "02.98.40.82.95",
                      "encUboTel": "02.98.01.69.74",
                      "encPersoEmail": null,
                      "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                      "intNoInsee": null,
                      "intSocNom": null,
                      "intSocAdresse": null,
                      "intSocCp": null,
                      "intSocVille": null,
                      "intSocPays": null,
                      "intFonction": null,
                      "intProfEmail": null,
                      "intProfTel": null
                  },
                  "idQualificatif": {
                      "id": 1,
                      "maximal": "Peu clair",
                      "minimal": "Tres clair"
                  },
                  "intitule": "Clarté des énoncés"
              }
          ]
      },
      {
        "rubrique": {
            "id": 2,
            "type": "RBP",
            "designation": "Tp Agl",
            "ordre": 2.0,
            "noEnseignant": {
                "id": 1,
                "type": "ENC",
                "sexe": "H",
                "nom": "Saliou",
                "prenom": "Philippe",
                "adresse": "6, rue de l'Argoat",
                "cp": "29860",
                "ville": "Le Drennec",
                "pays": "France",
                "telPort": null,
                "encPersoTel": "02.98.40.82.95",
                "encUboTel": "02.98.01.69.74",
                "encPersoEmail": null,
                "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                "intNoInsee": null,
                "intSocNom": null,
                "intSocAdresse": null,
                "intSocCp": null,
                "intSocVille": null,
                "intSocPays": null,
                "intFonction": null,
                "intProfEmail": null,
                "intProfTel": null
            }
        },
        "questions": [
            {
                "id": 1,
                "type": "QUS",
                "noEnseignant": {
                    "id": 1,
                    "type": "ENC",
                    "sexe": "H",
                    "nom": "Saliou",
                    "prenom": "Philippe",
                    "adresse": "6, rue de l'Argoat",
                    "cp": "29860",
                    "ville": "Le Drennec",
                    "pays": "France",
                    "telPort": null,
                    "encPersoTel": "02.98.40.82.95",
                    "encUboTel": "02.98.01.69.74",
                    "encPersoEmail": null,
                    "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                    "intNoInsee": null,
                    "intSocNom": null,
                    "intSocAdresse": null,
                    "intSocCp": null,
                    "intSocVille": null,
                    "intSocPays": null,
                    "intFonction": null,
                    "intProfEmail": null,
                    "intProfTel": null
                },
                "idQualificatif": {
                    "id": 1,
                    "maximal": "Faible",
                    "minimal": "Importante"
                },
                "intitule": "Utilité des Tp pour assimiler le cours"
            },
            {
                "id": 2,
                "type": "QUS",
                "noEnseignant": {
                    "id": 1,
                    "type": "ENC",
                    "sexe": "H",
                    "nom": "Saliou",
                    "prenom": "Philippe",
                    "adresse": "6, rue de l'Argoat",
                    "cp": "29860",
                    "ville": "Le Drennec",
                    "pays": "France",
                    "telPort": null,
                    "encPersoTel": "02.98.40.82.95",
                    "encUboTel": "02.98.01.69.74",
                    "encPersoEmail": null,
                    "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                    "intNoInsee": null,
                    "intSocNom": null,
                    "intSocAdresse": null,
                    "intSocCp": null,
                    "intSocVille": null,
                    "intSocPays": null,
                    "intFonction": null,
                    "intProfEmail": null,
                    "intProfTel": null
                },
                "idQualificatif": {
                    "id": 1,
                    "maximal": "Difficile",
                    "minimal": "Facile"
                },
                "intitule": "Niveau des exercices"
            },
            {
                "id": 3,
                "type": "QUS",
                "noEnseignant": {
                    "id": 1,
                    "type": "ENC",
                    "sexe": "H",
                    "nom": "Saliou",
                    "prenom": "Philippe",
                    "adresse": "6, rue de l'Argoat",
                    "cp": "29860",
                    "ville": "Le Drennec",
                    "pays": "France",
                    "telPort": null,
                    "encPersoTel": "02.98.40.82.95",
                    "encUboTel": "02.98.01.69.74",
                    "encPersoEmail": null,
                    "encUboEmail": "Philippe.Saliou@univ-brest.fr",
                    "intNoInsee": null,
                    "intSocNom": null,
                    "intSocAdresse": null,
                    "intSocCp": null,
                    "intSocVille": null,
                    "intSocPays": null,
                    "intFonction": null,
                    "intProfEmail": null,
                    "intProfTel": null
                },
                "idQualificatif": {
                    "id": 1,
                    "maximal": "Peu clair",
                    "minimal": "Tres clair"
                },
                "intitule": "Clarté des énoncés"
            }
        ]
    }
    
  ]
};

const formation = evaluationData.evaluation.elementConstitutif.uniteEnseignement.codeFormation.nomFormation;
const promotion = evaluationData.evaluation.anneePro.anneePro;
const ue = evaluationData.evaluation.elementConstitutif.uniteEnseignement.designation;
const elementConstitutif = evaluationData.evaluation.elementConstitutif.designation;

  const Evaluation = () => {
    const { id } = useParams();

    return (
        <>
        <div style={{ marginTop: '40px', maxWidth: '60%', margin: '0 auto' }}>
          {/* Tableau des informations */}
          <Table variant="simple" size="sm">
        <Tbody>
          <Tr>
            <Td fontSize="sm"><strong>Formation</strong></Td>
            <Td fontSize="sm">{formation}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm"><strong>Promotion</strong></Td>
            <Td fontSize="sm">{promotion}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm"><strong>Unité d'enseignement</strong></Td>
            <Td fontSize="sm">{ue}</Td>
          </Tr>
          <Tr>
            <Td fontSize="sm"><strong>Élément constitutif</strong></Td>
            <Td fontSize="sm">{elementConstitutif}</Td>
          </Tr>
        </Tbody>
      </Table>
      </div>
      <div style={{ marginBottom: '50px'}}>
    
          {/* Affichage du tableau principal */}
          <Table variant="simple" size="sm" marginTop="50px">
            <Thead>
              <Tr>
                <Th fontSize="sm">Rubrique</Th>
                <Th fontSize="sm">Question</Th>
                <Th fontSize="sm">Qualificatif Minimal</Th>
                <Th fontSize="sm">Qualificatif Maximal</Th>
              </Tr>
            </Thead>
            <Tbody>
              {evaluationData.rubriques.map((rubrique, index) => (
                <React.Fragment key={index}>
                  <Tr>
                    <Td fontSize="sm" rowSpan={rubrique.questions.length + 1} fontWeight="bold">
                      <span style={{ textTransform: 'uppercase', color: '#1A365D' }}>{rubrique.rubrique.designation}</span>
                    </Td>
                  </Tr>
                  {rubrique.questions.map((question, idx) => (
                    <Tr key={idx}>
                      {idx === 0 && (
                        <Td fontSize="sm" style={{ width: '40%' }}>{question.intitule}</Td>
                      )}
                      {idx !== 0 && (
                        <Td fontSize="sm">{question.intitule}</Td>
                      )}
                      <Td fontSize="sm">{question.idQualificatif.minimal}</Td>
                      <Td fontSize="sm">{question.idQualificatif.maximal}</Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </div>
        </>
      );
  };

export default Evaluation;
