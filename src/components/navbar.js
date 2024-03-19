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
      pageTitle = 'Questions standards';
      break;
    case '/rubriqueStandard':
      pageTitle = 'Rubriques standards';
      break;
    case '/coupleQualificaitf':
      pageTitle = 'Couples qualificatifs';
      break;
    default:
      pageTitle = 'Gestion des évaluations';
      break;
  }
  let displayText = "";
  //console.log("this is the roles : : : :  " + JSON.parse(sessionStorage.getItem('user')).roles)
  if(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).roles.includes("ROLE_ENS")){  
  const user = JSON.parse(sessionStorage.getItem('user'));
          const emailParts = user.email.split(".");
          const displayName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
          const domainName = emailParts[1].split("@")[0].toUpperCase();
          displayText = `${displayName}  ${domainName}`;
        }else if(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).roles.includes("ROLE_ETU")){
          const user = JSON.parse(sessionStorage.getItem('user'));
          const emailParts = user.email.split(".");
          const displayName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1).toUpperCase();
          const domainName = emailParts[1].split("@")[0].charAt(0).toUpperCase() + emailParts[1].split("@")[0].slice(1) ;
          displayText = `${domainName}  ${displayName}`;
        }
        else{
          displayText = "Administrateur"
        }
  return (
    <div className='navbarContainer'>
      <div className='section1'>
      <a href={sessionStorage.getItem('user') ? "/home" : "/login"}>
        <img className="ubo-logo" alt="ubo-logo" src={uboLogo} />
        </a>
        <h4>{pageTitle}</h4>
      </div>
      {sessionStorage.getItem('user') && (
        <div className='section2'>
          {/* Render other components only if logged in */}
          <h4>{displayText}</h4>
          <Tooltip title="Déconnexion" arrow>
            <LogoutIcon className="logout-icon" onClick={handleLogout} />
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default React.memo(Navbar);
