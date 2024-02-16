import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import CircularProgress from '@mui/material/CircularProgress';

import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    if (successParam === 'true') {
      setShowErrorMessage(false);
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Get the current path
    setCurrentPath(window.location.pathname);

    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    window.location.href = '/login?success=true';
  };

  const handleRedirect = (route) => {
    if (route === '/questionStandards') {
      // Store user information in session storage
      sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      sessionStorage.setItem('userInfo', JSON.stringify(user));
      sessionStorage.setItem('request',"questionStandards")

      // Redirect to the specified route
      window.location.href = route;
    } else {
      // Redirect to the specified route
      window.location.href = route;
    }
  };
  

  return (
    <div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {isLoggedIn ? (
            <div>
<Navbar isLoggedIn={isLoggedIn} />
              <div className="dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* Add onClick handlers to divs and wrap them in anchor tags */}
                  <div className="dashboard-item" onClick={() => handleRedirect('/rubriqueStandards')}>
                    <img src={image2} alt="Image 1" />
                    <p>Rubriques Standards</p>
                  </div>
                  <div className="dashboard-item" onClick={() => handleRedirect('/questionStandards')}>
                    <img src={image3} alt="Image 2" />
                    <p>Questions Standards</p>
                  </div>
                  <div className="dashboard-item" onClick={() => handleRedirect('/couplesQualificatifs')}>
                    <img src={image4} alt="Image 3" />
                    <p>Couples Qualificatifs</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {showErrorMessage && <h1>Désolé vous n'avez pas accées à cette page !</h1>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
