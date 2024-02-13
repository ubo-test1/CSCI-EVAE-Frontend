import React from 'react';
import { Table, TableCaption, Thead, Tbody, Tfoot, Tr, Th, Td, Link, Box, Text,Heading } from '@chakra-ui/react';

const evaluationsData = [
  {
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
  }
];

const Evaluations = () => {
    return (
        <Box  borderRadius="lg" overflow="hidden">
          <Box p="6">
            <Heading as="h1" size="lg" mb="6">Mes évaluations</Heading>
            {evaluationsData.map(evaluation => (
              <Link key={evaluation.id} href={`/evaluations/${evaluation.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box as="div" mb="4" key={evaluation.id} p="4" borderWidth="1px" borderRadius="md" cursor="pointer">
                  <Text fontSize="lg" fontWeight="bold">
                    {`${evaluation.noEnseignant.prenom} ${evaluation.noEnseignant.nom}`}
                  </Text>
                  <Text>{`${evaluation.elementConstitutif.id.codeFormation}`}</Text>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      );
};

export default Evaluations;