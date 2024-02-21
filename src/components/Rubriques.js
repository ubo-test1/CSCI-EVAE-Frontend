import React, { useState, useEffect } from 'react';
import { fetchAllStandardRubriques } from '../api/fetchRubriques';
import Navbar from './navbar';
import Sidebar from './sideBar';
function Rubrique() {
  const [rubriques, setRubriques] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllStandardRubriques();
        setRubriques(data);
      } catch (error) {
        console.error('Error fetching rubriques:', error);
      }
    }

    fetchData();

    // Retrieve user information from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    // Check if the user has admin role
    const userRoles = userInfo?.roles;
    setIsAdmin(userRoles && userRoles.includes('ROLE_ADM'));
  }, []); // Run once on component mount

  if (!isAdmin) {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="rubriqueContainer">
          <h2>You do not have access to view rubriques.</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="rubriqueContainer">
        <h1>Standard Rubriques</h1>
        <ul>
          {rubriques.map(rubrique => (
            <li key={rubrique.id}>{rubrique.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Rubrique;
