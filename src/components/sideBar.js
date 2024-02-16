import React from 'react';
import uboLogo from '../img/ubo-logo.png';
import image1 from '../img/homeBtn.png';
import image2 from '../img/rubrique.png';
import image3 from '../img/question.png';
import image4 from '../img/couple.png';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img className="logo" src={uboLogo} alt="ubo-logo" />
      </div>
      <div className="image-list">
        <div>
            <img src={image1} alt="Image 1" />
            <h3>Accueil</h3>
        </div>
        <div>
        <img src={image2} alt="Image 2" />
        <h3>Rubriques Standards</h3>
        </div>
        <div>
        <img src={image3} alt="Image 3" />
        <h3>Questions Standards</h3>
        </div>
        <div>
        <img src={image4} alt="Image 4" />
        <h3>Couples Qualificatifs</h3>
        </div>
        

      </div>
    </div>
  );
}

export default Sidebar;
