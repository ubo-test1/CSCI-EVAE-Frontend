import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import CircularProgress from '@mui/material/CircularProgress';
import evaluationImage from '../img/evaluationIcon.png'; // Import your evaluation image here
import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');
  const userRole = sessionStorage.getItem('role');

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
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
    // Store user information in session storage
    sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    sessionStorage.setItem('userInfo', JSON.stringify(user));
    sessionStorage.setItem('request', route);

    // Redirect to the specified route
    window.location.href = route;
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
                {userRole === 'ROLE_ADM' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="dashboard-item" onClick={() => handleRedirect('/rubriqueStandard')}>
                      <img src={image2} alt="Rubriques Standards" />
                      <p>Rubriques Standards</p>
                    </div>
                    <div className="dashboard-item" onClick={() => handleRedirect('/questionStandards')}>
                      <img src={image3} alt="Questions Standards" />
                      <p>Questions Standards</p>
                    </div>
                    <div className="dashboard-item" onClick={() => handleRedirect('/coupleQualificaitf')}>
                      <img src={image4} alt="Couples Qualificatifs" />
                      <p>Couples Qualificatifs</p>
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-item evaluation-item" style={{ textAlign: 'center', marginTop: '20px', flexDirection:'column' }} onClick={() => handleRedirect('/evaluation')}>
                    <img src={evaluationImage} alt="Evaluation" style={{ width: '200px', height: '200px' }} />
                    <h2>Evaluation</h2>
                  </div>
                )}
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