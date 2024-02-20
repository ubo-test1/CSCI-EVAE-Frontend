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

const CreerQualificatif = () => {
  const [qualificatif1, setQualificatif1] = useState('');
  const [qualificatif2, setQualificatif2] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!qualificatif1 || !qualificatif2) {
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
      await axios.post('http://localhost:8080/qualificatifs/create', {
        minimal: qualificatif1,
        maximal: qualificatif2
      });

      // Afficher un message de succès
      toast({
        title: "Qualificatifs créés avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/qualificatifs');

      // Réinitialiser les champs
      setQualificatif1('');
      setQualificatif2('');
    } catch (error) {
      console.error('Error creating qualificatifs:', error);
      // Afficher un message d'erreur
      toast({
        title: "Erreur lors de la création des qualificatifs.",
        description: error.response.data,
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
          <Heading as="h4" size="l">Créer un couple de qualificatifs</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Qualificatif minimal</FormLabel>
              <Input
                type="text"
                placeholder="Entrer le qualificatif minimal"
                value={qualificatif1}
                onChange={(e) => setQualificatif1(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Qualificatif maximal</FormLabel>
              <Input
                type="text"
                placeholder="Entrer le qualificatif maximal"
                value={qualificatif2}
                onChange={(e) => setQualificatif2(e.target.value)}
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

export default CreerQualificatif;
