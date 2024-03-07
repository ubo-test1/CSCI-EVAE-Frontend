import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';
import SideBar from './sideBar';
import image5 from '../img/welcome-evaluation.png'

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
      (
        <div>
          {isLoggedIn ? (
            <div>
              <Navbar isLoggedIn={isLoggedIn} />
              <SideBar/>
              <div className="dashboard-container">
                
                  <>
                      <img src={image5} alt="Evaluation image" />
                      <h1>Bienvenue dans la gestion des évaluations !</h1>
                      </>
                
              </div>
            </div>
          ) : (
            <div>
              {showErrorMessage && <h1>Désolé vous n'avez pas accées à cette page !</h1>}
            </div>
          )}
        </div>
      )
    </div>
  );
}

export default Home;