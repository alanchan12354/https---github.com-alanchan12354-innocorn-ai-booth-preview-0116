import React, { useState } from 'react'
import './App.css'

// Images
import bgImg from './assets/bg.png';
import titleImg from './assets/ai-photo-booth-text-logo.png';
import imgTopLeft from './assets/homepage-top-left.png';
import imgTopRight from './assets/homepage-top-right.png';
import imgBottomLeft from './assets/homepage-bottom-left.png';
import imgBottomRight from './assets/homepage-bottom-right.png';

// Icons
const HomeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="none" />
  </svg>
);

const GlobeIcon = () => (
   <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '15px'}}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
   </svg>
);

function App() {
  const [lang, setLang] = useState('EN');

  return (
    <div className="container" style={{ backgroundImage: `url(${bgImg})` }}>
      
      {/* Top Images */}
      <img src={imgTopLeft} className="img-pose img-top-left" alt="" />
      <img src={imgTopRight} className="img-pose img-top-right" alt="" />

      <div className="home-btn-container">
            <button className="home-btn">
                <HomeIcon />
            </button>
      </div>

      {/* Main Content */}
      <div className="center-content">
        <img src={titleImg} className="title-img" alt="AI Photo Booth" />

        <div className="lang-section">
            <div className="lang-header">
                <GlobeIcon />
                <span>SELECT LANGUAGE</span>
            </div>
            <div className="lang-buttons">
                <button className="lang-btn" onClick={() => setLang('EN')}>&gt; Eng</button>
                <button className="lang-btn" onClick={() => setLang('TC')}>&gt; 繁體</button>
                <button className="lang-btn" onClick={() => setLang('SC')}>&gt; 简体</button>
            </div>
        </div>
      </div>

      {/* Bottom Images */}
      <img src={imgBottomLeft} className="img-pose img-bottom-left" alt="" />
      <img src={imgBottomRight} className="img-pose img-bottom-right" alt="" />
      
    </div>
  )
}

export default App

