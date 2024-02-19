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

const ModifierQualificatif = () => {
  const [qualificatif1, setQualificatif1] = useState('');
  const [qualificatif2, setQualificatif2] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Récupérer les données du qualificatif à modifier
    axios.get(API + `qualificatifs/find/${id}`)
      .then(response => {
        const { minimal, maximal } = response.data;
        setQualificatif1(minimal);
        setQualificatif2(maximal);
      })
      .catch(error => {
        console.error('Error fetching qualificatif:', error);
        // Afficher un message d'erreur
        toast({
          title: "Erreur lors du chargement du qualificatif.",
          description: "Une erreur s'est produite lors du chargement du qualificatif à modifier.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoi de la requête PUT avec les données saisies par l'utilisateur
      await axios.put(API+`qualificatifs/${id}`, {
        minimal: qualificatif1,
        maximal: qualificatif2
      });

      // Afficher un message de succès
      toast({
        title: "Qualificatifs modifiés avec succès",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Navigation vers la page '/qualificatifs'
      navigate('/qualificatifs');
    } catch (error) {
      console.error('Error updating qualificatifs:', error.response.data.message);
      // Afficher un message d'erreur
      toast({
        title: "Erreur lors de la modification des qualificatifs.",
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
          <Heading as="h4" size="l">Modifier un couple de qualificatifs</Heading>
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
              Modifier
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default ModifierQualificatif;
