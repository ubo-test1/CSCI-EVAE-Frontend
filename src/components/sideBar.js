import React from 'react';
import uboLogo from '../img/ubo-logo.png';
import image1 from '../img/homeBtn.png';
import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';

function Sidebar() {
  // Retrieve user information from sessionStorage
  const userInfo = sessionStorage.getItem('user');
  console.log("this is the userInfo : " + (userInfo))
  // Check if the user has admin role
  console.log("this is the role : " + sessionStorage.getItem('role'))
  const isAdmin = sessionStorage.getItem('role') == "ROLE_ADM";

  // If user is not admin, render only one item
  if (!isAdmin) {
    return (
      <div className="sidebar">
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
        </div>
      </div>
    );
  }

  // If user is admin, render all items
  return (
    <div className="sidebar">
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

export default React.memo(Sidebar);
