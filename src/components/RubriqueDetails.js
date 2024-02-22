import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRubriqueDetails } from '../api/fetchRubriqueDetailsApi';; // Import your API function to fetch rubrique details

const RubriqueDetails = () => {
  const { rubriqueId } = useParams(); // Get the rubriqueId from the URL params
  const [rubriqueDetails, setRubriqueDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("this is the rubriqueID ! " + rubriqueDetails )
        const data = await fetchRubriqueDetails(rubriqueId); // Fetch rubrique details using the rubriqueId
        setRubriqueDetails(data);
      } catch (error) {
        console.error('Error fetching rubrique details:', error);
      }
    };

    fetchData();
  }, [rubriqueId]);

  if (!rubriqueDetails) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }

  return (
    <div>
      <h1>Rubrique Details</h1>
      <p><strong>Designation:</strong> {rubriqueDetails.designation}</p>
      <p><strong>Ordre:</strong> {rubriqueDetails.ordre}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default RubriqueDetails;
