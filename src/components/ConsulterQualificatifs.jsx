import { Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Heading, Link  } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import React, { useState } from 'react';

const qualificatifsData = [
    { "idQualificatif": 1, "maximal": "Pauvre", "minimal": "Riche" },
    { "idQualificatif": 2, "maximal": "Faible", "minimal": "Fort" },
    { "idQualificatif": 3, "maximal": "Facile", "minimal": "Difficile" },
    { "idQualificatif": 4, "maximal": "Insatisfaisant", "minimal": "Satisfaisant" },
    { "idQualificatif": 5, "maximal": "Lent", "minimal": "Rapide" },
    { "idQualificatif": 6, "maximal": "Peu clair", "minimal": "Très clair" },
    { "idQualificatif": 56, "maximal": "fort", "minimal": "faible" }
];

const ConsulterQualificatifs = () => {
  const [selectedQualificatif, setSelectedQualificatif] = useState(null);

  const handleClick = (idQualificatif) => {
    setSelectedQualificatif(idQualificatif);
  };
  const handleDelete = (id) => {
    // Implémentez ici la logique pour supprimer le qualificatif avec l'ID donné
    // par exemple, appelez une API ou mettez à jour votre état local
    console.log(id);
  };

  return (
    <Box mt="4">
      <Heading as="h2" size="lg" textAlign="center" fontFamily="sans-serif" color="darkblue" textTransform="uppercase" style={{ marginTop: '50px', margin: '0 auto' }}>
        Couples qualificatifs
      </Heading>
      <Table width="70%" mx="auto" style={{ marginTop: '50px', maxWidth: '60%', margin: '0 auto' }}>
        <Thead>
          <Tr>
            <Th>Minimal</Th>
            <Th>Maximal</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {qualificatifsData.map((qualificatif) => (
            <Tr
              key={qualificatif.idQualificatif}
              onClick={() => handleClick(qualificatif.idQualificatif)}
              _hover={{ backgroundColor: "#ddd" }}
              height="40px"
            >
              <Td>{qualificatif.minimal}</Td>
              <Td>{qualificatif.maximal}</Td>
              <Td>
              <Link href={`/qualificatifs/${qualificatif.idQualificatif}`} color="blue.500" textDecoration="underline">
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Modifier"
                />
              </Link>
              {" "}
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Supprimer"
                onClick={() => handleDelete(qualificatif.idQualificatif)}
              />
            </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ConsulterQualificatifs;
