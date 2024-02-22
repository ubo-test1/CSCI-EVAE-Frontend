import React from 'react';
import uboLogo from '../img/ubo-logo.png';
import profileImg from '../img/profile-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useLocation } from 'react-router-dom'; // Import useLocation hook from react-router-dom
import '../App.css';

function Navbar() {
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    // Redirect to login page with success message
    window.location.href = '/login?success=true';
  };

  const location = useLocation(); // Use useLocation hook to get the current location
  const currentPath = location.pathname; // Access the pathname property to get the current path

  let pageTitle = '';

  // Set the page title based on the current path
  switch (currentPath) {
    case '/questionStandards':
      pageTitle = 'Questions Standards';
      break;
    case '/rubriqueStandard':
      pageTitle = 'Rubriques Standards';
      break;
    case '/coupleQualificaitf':
      pageTitle = 'Couples Qualificatifs';
      break;
    default:
      pageTitle = 'CSCI-EVAE';
      break;
  }

  return (
    <div className='navbarContainer'>
      <div className='section1'>
        <img className="ubo-logo" alt="ubo-logo" src={uboLogo} />
        {/* Render component based on login status */}
        <h4>{pageTitle}</h4>
      </div>
      {sessionStorage.getItem('user') && (
        <div className='section2'>
          {/* Render other components only if logged in */}
          <h4>{JSON.parse(sessionStorage.getItem('user')).email}</h4>
          <img className="profile-img" alt="profile-icon" src={profileImg} />
          <Tooltip title="Déconnexion" arrow>
            <LogoutIcon className="logout-icon" onClick={handleLogout} />
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default React.memo(Navbar);
