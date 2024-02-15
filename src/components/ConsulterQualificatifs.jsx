import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Heading, Link, Button, useToast } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { API } from "../constants";

const ConsulterQualificatifs = () => {
  const [qualificatifsData, setQualificatifsData] = useState([]);
  const toast = useToast(); // Déplacer l'appel de useToast à un niveau supérieur

  useEffect(() => {
    axios.get(API + 'qualificatifs/all')
      .then(response => {
        setQualificatifsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching qualificatifs:', error);
      });
  }, []);

  const handleDelete = (idQualificatif) => {
    fetch(`http://localhost:8080/qualificatifs/delete/${idQualificatif}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici tout en-tête supplémentaire requis par votre serveur
      },
      // Vous pouvez ajouter un corps de requête JSON si nécessaire
      // body: JSON.stringify({}),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('La suppression du qualificatif a échoué');
        }
        toast({
          title: "Suppression réussie",
          description: "Le qualificatif a été supprimé avec succès.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Supprimer l'élément correspondant de qualificatifsData
        setQualificatifsData(prevQualificatifsData => prevQualificatifsData.filter(qualificatif => qualificatif.qualificatif.idQualificatif !== idQualificatif));
        // Ajoutez ici toute logique supplémentaire après la suppression réussie
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du qualificatif:', error);
        toast({
          title: "Suppression échouée",
          description: "Une erreur s'est produite lors de la suppression du qualificatif.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // Ajoutez ici toute gestion d'erreur supplémentaire
      });
  };
  

  return (
    <Box mt="8">
      <Heading as="h2" size="lg" textAlign="center" color="darkblue" textTransform="uppercase" mt="10">
        Couples qualificatifs
      </Heading>
      <Table width="70%" mx="auto" maxW="60%" mt="10">
        <Thead>
          <Tr>
            <Th>Minimal</Th>
            <Th>Maximal</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {qualificatifsData.map(qualificatif => (
            <Tr key={qualificatif.qualificatif.idQualificatif} _hover={{ backgroundColor: "#ddd" }} height="40px">
              <Td>{qualificatif.qualificatif.minimal}</Td>
              <Td>{qualificatif.qualificatif.maximal}</Td>
              <Td>
                <Link href={`/qualificatifs/${qualificatif.qualificatif.idQualificatif}`} color="blue.500" textDecoration="underline" mr="2">
                  <IconButton icon={<EditIcon />} aria-label="Modifier" />
                </Link>
                <IconButton icon={<DeleteIcon />} aria-label="Supprimer" onClick={() => handleDelete(qualificatif.qualificatif.idQualificatif)} />
              </Td>
            </Tr>
          ))}
          {/* Bouton "Ajouter qualificatif" stylisé */}
          <Tr>
            <Td colSpan={3} textAlign="center">
              <Link href="/qualificatifs/creer" color="green.500" textDecoration="underline">
                <Button colorScheme="teal" size="lg" mt="4">Ajouter qualificatif</Button>
              </Link>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ConsulterQualificatifs;
