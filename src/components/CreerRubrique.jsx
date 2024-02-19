import React, { useState } from 'react';
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
import { useNavigate } from 'react-router';
import { API } from '../constants';

const CreerRubrique = () => {
  const [type, setType] = useState('');
  const [designation, setDesignation] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier que les champs ne sont pas vides
    if (!type || !designation) {
      // Afficher un message d'erreur si un champ est vide
      toast({
        title: "Veuillez remplir tous les champs.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      // Envoi de la requête POST avec les données saisies par l'utilisateur
      await axios.post('http://localhost:8080/rub/createStd', {
        type: type,
        designation: designation
      }, {
        headers: {
          Authorization: '' // Laisser le header Authorization vide pour l'instant
        }
      });
  
      // Afficher un message de succès
      toast({
        title: "Rubrique créée avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      navigate('/rubriques');
  
      // Réinitialiser les champs
      setType('');
      setDesignation('');
    } catch (error) {
      console.error('Error creating rubrique:', error);
      // Afficher un message d'erreur générique
      toast({
        title: "Une erreur est survenue lors de la création de la rubrique.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Flex align="center" justify="center" height="80vh">
      <Box p={8} maxWidth="700px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading as="h4" size="l">Créer une rubrique non composé</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Input
                type="text"
                placeholder="Entrer le type (RBS ou RBP)"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Designation</FormLabel>
              <Input
                type="text"
                placeholder="Entrer la designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" width="full" mt={4} type="submit">
              Créer
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default CreerRubrique;
