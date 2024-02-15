import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
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
import { useState } from 'react';

const ModifierQualificatif = () => {
  const [qualificatif1, setQualificatif1] = useState('');
  const [qualificatif2, setQualificatif2] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vous pouvez traiter les données ici, par exemple, envoyer une requête API

    // Afficher un message de succès
    toast({
      title: "Qualificatifs modifiés avec succès",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    let  req = {
      qualificatif1: qualificatif1,
      qualificatif2: qualificatif2
    }

    console.log(req);
    // Réinitialiser les champs
    setQualificatif1('');
    setQualificatif2('');
    navigate('/qualificatifs'); 

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
