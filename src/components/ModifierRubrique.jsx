import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { API } from "../constants";

const ModifierRubrique = () => {
  const [rubriqueType, setRubriqueType] = useState('');
  const [rubriqueDesignation, setRubriqueDesignation] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Récupérer les données de la rubrique à modifier
    axios.get(API + `rub/consulterStd/${id}`)
      .then(response => {
        setRubriqueType(response.data.type);
        setRubriqueDesignation(response.data.designation);
      })
      .catch(error => {
        console.error('Error fetching rubrique:', error);
        // Afficher un message d'erreur
        toast({
          title: "Erreur lors du chargement de la rubrique.",
          description: "Une erreur s'est produite lors du chargement de la rubrique à modifier.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la requête POST avec les données saisies par l'utilisateur
      await axios.post(API+`rub/updateStd`, {
        id:id,
        type: rubriqueType,
        designation: rubriqueDesignation
      });

      // Afficher un message de succès
      toast({
        title: "Rubrique modifiée avec succès",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Navigation vers la page '/rubriques'
      navigate('/rubriques');
    } catch (error) {
      console.error('Error updating rubrique:');
      // Afficher un message d'erreur
      toast({
        title: "Erreur lors de la modification de la rubrique.",
        description: "Veuillez verifier les champs et réessayer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" height="80vh">
      <Box p={8} minWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading as="h4" size="l">Modifier une rubrique</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Type de rubrique</FormLabel>
              <Input
                type="text"
                placeholder="Entrer le type de rubrique"
                value={rubriqueType}
                onChange={(e) => setRubriqueType(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Désignation de rubrique</FormLabel>
              <Input
                type="text"
                placeholder="Entrer la désignation de rubrique"
                value={rubriqueDesignation}
                onChange={(e) => setRubriqueDesignation(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" width="full" mt={4} type="submit">
              Modifier
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default ModifierRubrique;
