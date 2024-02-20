import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Heading, Box, CloseButton, useToast } from '@chakra-ui/react';
import { API } from '../constants';

const ConsulterQuestions = ({ id }) => {
  const [questions, setQuestions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.accessToken;

        const response = await axios.get(API + `rub/consulter/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleRemoveQuestion = async (questionId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;
  
      // Envoi de la requête POST pour supprimer la question de la rubrique
      await axios.post(`${API}rub/deletebyquestion`, {
        rubriqueId: parseInt(id),
        qList: [questionId]
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Mettre à jour les questions de la rubrique en rechargeant les données
      const response = await axios.get(API + `rub/consulter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
      }
  
      // Afficher un message de succès
      toast({
        title: "Question supprimée de la rubrique avec succès",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing question from rubrique:', error);
      // Afficher un message d'erreur
      toast({
        title: "Erreur lors de la suppression de la question de la rubrique.",
        description: "Veuillez réessayer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  return (
    <Box mb={10}>
      {questions.length > 0 ? (
        <Box>
          <Heading>Questions</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Intitulé</Th>
                <Th>Minimal</Th>
                <Th>Maximal</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {questions.map(question => (
                <Tr key={question.id}>
                  <Td>{question.intitule}</Td>
                  <Td>{question.idQualificatif.minimal}</Td>
                  <Td>{question.idQualificatif.maximal}</Td>
                  <Td>
                    <CloseButton
                      aria-label="Supprimer"
                      colorScheme="red"
                      onClick={() => handleRemoveQuestion(question.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box textAlign="center">
          <Heading as="h3" size="sm">Pas de questions associées à cette rubrique pour l'instant</Heading>
        </Box>
      )}
    </Box>
  );
};

export default ConsulterQuestions;
