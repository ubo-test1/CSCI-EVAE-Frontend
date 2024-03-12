import React, { useState, useEffect, useRef } from 'react';
import uboLogo from '../img/ubo-logo.png';
import image1 from '../img/homeBtn.png';
import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';
import image5 from '../img/evaluationIcon.png';
import { IconButton } from '@mui/material'; // Import IconButton from Material UI
import { ArrowForward } from '@mui/icons-material'; // Import icon

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const sidebarRef = useRef(null); // Reference to the sidebar element

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to add click event listener to document
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Retrieve user information from sessionStorage
  const userInfo = sessionStorage.getItem('user');
  console.log("this is the userInfo : " + (userInfo))
  // Check if the user has admin role
  console.log("this is the role : " + sessionStorage.getItem('role'))
  const isAdmin = sessionStorage.getItem('role') == "ROLE_ADM";
  const isEnseignant = sessionStorage.getItem('role') == "ROLE_ENS";
  const isEtudiant = sessionStorage.getItem('role') == "ROLE_ETU";

  // If user is not admin, render only one item
  if (isEnseignant) {
    return (
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <IconButton style={{ position: 'absolute', right: '-20px', bottom: '50%', transform: 'translateY(50%)', backgroundColor: '#7296A5', borderRadius: '50%', padding: '10px' }} size="large" onClick={toggleSidebar}>
          <ArrowForward style={{ color: 'white', transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>
        <div className="logo-container">
          <img className="logo" src={uboLogo} alt="ubo-logo" />
        </div>
        <div className="image-list">
          <div>
            <a href="/home">
              <img src={image1} alt="Image 1" />
              <h3>Accueil</h3>
            </a>
          </div>
          <div>
            <a href="/evaluation">
              <img src={image5} alt="Image 5" />
              <h3>Évaluation</h3>
            </a>
          </div>
        </div>
      </div>
    );
  }

  else if (isEtudiant) {
    return (
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <IconButton style={{ position: 'absolute', right: '-20px', bottom: '50%', transform: 'translateY(50%)', backgroundColor: '#7296A5', borderRadius: '50%', padding: '10px' }} size="large" onClick={toggleSidebar}>
          <ArrowForward style={{ color: 'white', transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>
        <div className="logo-container">
          <img className="logo" src={uboLogo} alt="ubo-logo" />
        </div>
        <div className="image-list">
          <div>
            <a href="/home">
              <img src={image1} alt="Image 1" />
              <h3>Accueil</h3>
            </a>
          </div>
          <div>
            <a href="/evaluationetudiant">
              <img src={image5} alt="Image 5" />
              <h3>Évaluation</h3>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If user is admin, render all items
  if (isAdmin) {
    return (
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <IconButton style={{ position: 'absolute', right: '-20px', bottom: '50%', transform: 'translateY(50%)', backgroundColor: '#7296A5', borderRadius: '50%', padding: '10px' }} size="large" onClick={toggleSidebar}>
          <ArrowForward style={{ color: 'white', transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>
        <div className="logo-container">
          <img className="logo" src={uboLogo} alt="ubo-logo" />
        </div>
        <div className="image-list">
          <div>
            <a href="/home">
              <img src={image1} alt="Image 1" />
              <h3>Accueil</h3>
            </a>
          </div>
          <div>
            <a href="/rubriqueStandard">
              <img src={image2} alt="Image 2" />
              <h3>Rubriques Standards</h3>
            </a>
          </div>
          <div>
            <a href="/questionStandards">
              <img src={image3} alt="Image 3" />
              <h3>Questions Standards</h3>
            </a>
          </div>
          <div>
            <a href="/coupleQualificaitf">
              <img src={image4} alt="Image 4" />
              <h3>Couples Qualificatifs</h3>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(Sidebar);