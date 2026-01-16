import React, { useState } from 'react'
import './App.css'

// Images
import bgImg from './assets/bg.png';
import titleImg from './assets/ai-photo-booth-text-logo.png';
import imgTopLeft from './assets/homepage-top-left.png';
import imgTopRight from './assets/homepage-top-right.png';
import imgBottomLeft from './assets/homepage-bottom-left.png';
import imgBottomRight from './assets/homepage-bottom-right.png';

// Style Images
import style1 from './assets/home-v4-1.png';
import style2 from './assets/home-v4-2.png';
import style3 from './assets/home-v4-3.png';
import style4 from './assets/home-v4-4.png';
import style5 from './assets/home-v4-5.png';
import style6 from './assets/home-v4-6.png';

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
  const [page, setPage] = useState('home'); // 'home' | 'style' | 'capture'
  const [countdown, setCountdown] = useState(3);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = React.useRef(null);

  const handleLangSelect = (selectedLang) => {
    setLang(selectedLang);
    setPage('style');
  };

  const handleStartCapture = () => {
    setPage('capture');
    setCountdown(3);
    setCapturedImage(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCountdown(3);
  };

  React.useEffect(() => {
    let currentStream = null;
    if (page === 'capture' && !capturedImage) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
      startCamera();
    }
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [page, capturedImage]);

  React.useEffect(() => {
    let timer;
    if (page === 'capture' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (page === 'capture' && countdown === 0 && !capturedImage) {
      const video = videoRef.current;
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/png'));
      }
    }
    return () => clearTimeout(timer);
  }, [page, countdown, capturedImage]);

  // Countdown circle calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((3 - countdown) / 3) * circumference;

  return (
    <div className="container" style={{ backgroundImage: `url(${bgImg})` }}>
      
      {/* Top Images - Only on Home */}
      {page === 'home' && (
        <>
          <img src={imgTopLeft} className="img-pose img-top-left" alt="" />
          <img src={imgTopRight} className="img-pose img-top-right" alt="" />
        </>
      )}

      <div className="home-btn-container">
            <button className="home-btn" onClick={() => setPage('home')}>
                <HomeIcon />
            </button>
      </div>

      {/* Main Content */}
      {page === 'home' && (
        <div className="center-content">
          <img src={titleImg} className="title-img" alt="AI Photo Booth" />

          <div className="lang-section">
              <div className="lang-header">
                  <GlobeIcon />
                  <span>SELECT LANGUAGE</span>
              </div>
              <div className="lang-buttons">
                  <button className="lang-btn" onClick={() => handleLangSelect('EN')}>&gt; Eng</button>
                  <button className="lang-btn" onClick={() => handleLangSelect('TC')}>&gt; 繁體</button>
                  <button className="lang-btn" onClick={() => handleLangSelect('SC')}>&gt; 简体</button>
              </div>
          </div>
        </div>
      )}

      {page === 'style' && (
        <div className="style-selection-content">
            <h1 className="style-title">CHOOSE YOUR STYLE</h1>
            <p className="style-subtitle">Select your favorite transformation style</p>
            
            <div className="style-grid">
                <img src={style1} alt="Style 1" />
                <img src={style2} alt="Style 2" />
                <img src={style3} alt="Style 3" />
                <img src={style4} alt="Style 4" />
                <img src={style5} alt="Style 5" />
                <img src={style6} alt="Style 6" />
            </div>

            <button className="take-shot-btn" onClick={handleStartCapture}>
              <span style={{ marginRight: '10px' }}>✨</span> Take a shot now!
            </button>
            
            <div className="bottom-logo-container">
               <img src={titleImg} className="bottom-logo" alt="AI Photo Booth" />
               <p className="bottom-logo-text">FUTURISTIC PHOTOS • INSTANT SHARING</p>
            </div>
        </div>
      )}

      {page === 'capture' && (
        <div className="capture-content">
            <h1 className="style-title">{capturedImage ? "REVIEW PHOTO" : "CAPTURE PHOTO"}</h1>
            <p className="style-subtitle">Select your favorite transformation style</p>

            <div className="camera-container">
                {!capturedImage ? (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="camera-feed" 
                    />
                ) : (
                    <img src={capturedImage} className="camera-feed" alt="Captured" />
                )}
                
                {countdown > 0 && !capturedImage && (
                    <div className="countdown-overlay">
                        <div className="countdown-circle-bg" />
                        <svg className="countdown-svg" viewBox="0 0 100 100">
                             {/* Background Ring */}
                            <circle
                                stroke="white"
                                strokeWidth="2"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                                opacity="0.3"
                            />
                            {/* Progress Ring */}
                            <circle
                                className="progress-ring__circle"
                                stroke="#f48fb1"
                                strokeWidth="6"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                                strokeLinecap="round"
                                style={{ 
                                    strokeDasharray: `${circumference} ${circumference}`, 
                                    strokeDashoffset 
                                }}
                            />
                        </svg>
                        <span className="countdown-text">0{countdown}</span>
                    </div>
                )}
            </div>

            {!capturedImage ? (
                <button className="take-shot-btn">
                  <span style={{ marginRight: '10px' }}>✨</span> Take a shot now!
                </button>
            ) : (
                <div className="review-buttons">
                    <button className="retake-btn" onClick={handleRetake}>
                         RETAKE ↻
                    </button>
                    <button className="done-btn">
                         DONE ✨
                    </button>
                </div>
            )}

            <div className="bottom-logo-container">
               <img src={titleImg} className="bottom-logo" alt="AI Photo Booth" />
               <p className="bottom-logo-text">FUTURISTIC PHOTOS • INSTANT SHARING</p>
            </div>
        </div>
      )}

      {/* Bottom Images - Only on Home */}
      {page === 'home' && (
        <>
          <img src={imgBottomLeft} className="img-pose img-bottom-left" alt="" />
          <img src={imgBottomRight} className="img-pose img-bottom-right" alt="" />
        </>
      )}
      
    </div>
  )
}

export default App

