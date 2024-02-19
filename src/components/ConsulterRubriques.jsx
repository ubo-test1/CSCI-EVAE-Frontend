import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Heading, Link, Button, useToast } from '@chakra-ui/react';
import { DeleteIcon,InfoIcon} from "@chakra-ui/icons"; // Suppression de EditIcon
import { API } from "../constants";

// Import de l'icône pour les détails
import { InfoOutlineIcon } from "@chakra-ui/icons";

const ConsulterRubriques = () => {
  const [rubriquesData, setRubriquesData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios.get(API + 'rub/allStd')
      .then(response => {
        setRubriquesData(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des rubriques:', error);
      });
  }, []);

  const handleDelete = (idRubrique) => {
    axios.delete(`${API}rub/deleteStd/${idRubrique}`)
      .then(response => {
        if (response.status === 200) {
          // Supprimer la rubrique de l'état local
          setRubriquesData(prevState => prevState.filter(rubrique => rubrique.rubrique.id !== idRubrique));
          toast({
            title: "Suppression réussie",
            description: "La rubrique a été supprimée avec succès.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error("Échec de la suppression de la rubrique");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la rubrique:', error);
        toast({
          title: "Erreur de suppression",
          description: "Une erreur s'est produite lors de la suppression de la rubrique.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box mt="8">
      <Heading as="h2" size="lg" textAlign="center" color="darkblue" textTransform="uppercase" mt="10">
        Liste des Rubriques
      </Heading>
      <Table width="70%" mx="auto" maxW="60%" mt="10">
        <Thead>
          <Tr>
            <Th>Designation</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rubriquesData.map(rubrique => (
            <Tr key={rubrique.rubrique.id} _hover={{ backgroundColor: "#ddd" }} height="40px">
              <Td>{rubrique.rubrique.designation}</Td>
              <Td>{rubrique.rubrique.type}</Td>
              <Td>
                <Link href={`/rubriques/${rubrique.rubrique.id}`} color="blue.500" textDecoration="underline" mr="2">
                  {/* Remplacement de EditIcon par InfoOutlineIcon */}
                  <IconButton icon={<InfoIcon />} aria-label="Détails" isDisabled={rubrique.associated} />
                </Link>
                <IconButton icon={<DeleteIcon />} aria-label="Supprimer" onClick={() => handleDelete(rubrique.rubrique.id)} isDisabled={rubrique.associated} />
              </Td>
            </Tr>
          ))}
        </Tbody>
        <Tr>
          <Td colSpan={3} textAlign="center">
            <Link href="/rubriques/creer" color="green.500" textDecoration="underline">
              <Button colorScheme="teal" size="lg" mt="4">Ajouter rubrique</Button>
            </Link>
          </Td>
        </Tr>
      </Table>
    </Box>
  );
};

export default ConsulterRubriques;
