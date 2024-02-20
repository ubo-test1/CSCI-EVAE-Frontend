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
  useToast,
  Select
} from '@chakra-ui/react';
import axios from 'axios';
import { API } from "../constants";
import ConsulterQuestions from './ConsulterQuestions';

const ModifierRubrique = () => {
  const [rubriqueType, setRubriqueType] = useState('');
  const [rubriqueDesignation, setRubriqueDesignation] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [rubriqueQuestions, setRubriqueQuestions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchRubriqueData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.accessToken;

        // Récupérer les données de la rubrique à modifier
        const rubriqueResponse = await axios.get(API + `rub/consulter/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(rubriqueResponse.data.rubrique){
          setRubriqueType(rubriqueResponse.data.rubrique.type);
          setRubriqueDesignation(rubriqueResponse.data.rubrique.designation);
          setRubriqueQuestions(rubriqueResponse.data.questions.map(question => question.id));
          console.log(rubriqueQuestions);
        } else {
          setRubriqueType(rubriqueResponse.data.type);
          setRubriqueDesignation(rubriqueResponse.data.designation);
        }

        // Récupérer les questions
        const questionsResponse = await axios.get(API + 'rub/testQ', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const filteredQuestions = questionsResponse.data.filter(question => !rubriqueQuestions.includes(question.id));
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error('Error fetching rubrique or questions:', error);
        // Afficher un message d'erreur
        toast({
          title: "Erreur lors du chargement des données.",
          description: "Une erreur s'est produite lors du chargement des données.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRubriqueData();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;

      // Envoi de la requête POST avec les données saisies par l'utilisateur
      await axios.post(API+`rub/update`, {
        id:id,
        type: rubriqueType,
        designation: rubriqueDesignation
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Afficher un message de succès
      toast({
        title: "Rubrique modifiée avec succès",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Navigation vers la page '/rubriques'
    //   navigate('/rubriques');
    } catch (error) {
      console.error('Error updating rubrique:', error);
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

  const handleAddQuestion = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;

      // Envoi de la requête POST pour ajouter la question à la rubrique
      const response = await axios.post(API + 'rub/assignQuestion', {
        rubriqueId: parseInt(id),
        qList: [parseInt(selectedQuestion)]
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Mettre à jour les questions en récupérant à nouveau les données
        const questionsResponse = await axios.get(API + 'rub/testQ', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const filteredQuestions = questionsResponse.data.filter(question => !rubriqueQuestions.includes(question.id));
        setQuestions(filteredQuestions);
        setRefreshKey(prevKey => prevKey + 1);

        // Mettre à jour les rubriqueQuestions (si nécessaire)
        setRubriqueQuestions(prevRubriqueQuestions => [...prevRubriqueQuestions, parseInt(selectedQuestion)]);

        // Afficher un message de succès
        toast({
          title: "Question ajoutée à la rubrique avec succès",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Réinitialiser la question sélectionnée
        setSelectedQuestion('');
      } else {
        throw new Error("Échec de l'ajout de la question à la rubrique");
      }
    } catch (error) {
      console.error('Error adding question to rubrique:', error);
      // Afficher un message d'erreur
      toast({
        title: "Erreur lors de l'ajout de la question à la rubrique.",
        description: "Veuillez réessayer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <>
    <Flex align="center" justify="center" height="40vh">
      <Box p={8} minWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading as="h4" size="l">Modifier la rubrique</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={handleSubmit}>
            {/* <FormControl>
              <FormLabel>Type de rubrique</FormLabel>
              <Input
                type="text"
                placeholder="Entrer le type de rubrique"
                value={rubriqueType}
                onChange={(e) => setRubriqueType(e.target.value)}
              />
            </FormControl> */}
            <FormControl mt={4}>
              <FormLabel>Désignation de la rubrique</FormLabel>
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
    
    <Box mt={4} mb={12} display="flex" alignItems="center">
      <FormControl flex="1" mr={4}>
        <FormLabel>Ajouter une question à cette rubrique</FormLabel>
        <Flex alignItems="center">
        <Select
          placeholder="Sélectionner une question"
          onChange={(e) => setSelectedQuestion(e.target.value)}
          value={selectedQuestion}
        >
          {questions
            .filter(question => !rubriqueQuestions.includes(question.id))
            .map(question => (
              <option key={question.id} value={question.id}>
                {question.intitule} | {question.idQualificatif.minimal} - {question.idQualificatif.maximal}
              </option>
          ))}
        </Select>
          <Button ml={4} colorScheme="green" type="button" onClick={handleAddQuestion}>
            Ajouter
          </Button>
        </Flex>
      </FormControl>
    </Box>
    <Box>
        <ConsulterQuestions key={refreshKey} id={id}/>
    </Box>

      </>

  );
};

export default ModifierRubrique;
