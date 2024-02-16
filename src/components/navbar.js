import React from 'react';
import uboLogo from '../img/ubo-logo.png';
import profileImg from '../img/profile-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import '../App.css';

function Navbar() {
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    // Redirect to login page with success message
    window.location.href = '/login?success=true';
  };
  const userInfo = sessionStorage.getItem('user')
  const currentPath = sessionStorage.getItem('request')
  console.log("this is the current path " + currentPath)
  console.log(JSON.stringify(userInfo))
  return (
    <div className='navbarContainer'>
      <div className='section1'>
        <img className="ubo-logo" alt="ubo-logo" src={uboLogo} />
        {/* Render component based on login status */}
        {userInfo ? <h4>{currentPath === 'questionStandards' ? 'Questions Standards' : 'CSCI-EVAE'}</h4> : <h4>CSCI-EVAE</h4>}
      </div>
      {userInfo && (
        <div className='section2'>
          {/* Render other components only if logged in */}
          <h4>{userInfo.username}</h4>
          <img className="profile-img" alt="profile-icon" src={profileImg} />
          <Tooltip title="Déconnexion" arrow>
            <LogoutIcon className="logout-icon" onClick={handleLogout} />
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default Navbar;
