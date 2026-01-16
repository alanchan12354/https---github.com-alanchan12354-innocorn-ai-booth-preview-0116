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

// Decoration Assets
import animatedAvatar from './assets/animated-demo-avator.png';

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

const STICKERS = [
  { id: 1, emoji: '🎁' },
  { id: 2, emoji: '🧃' },
  { id: 3, emoji: '🌮' },
  { id: 4, emoji: '🍦' },
  { id: 5, emoji: '🏢' },
];

function App() {
  const [lang, setLang] = useState('EN');
  const [page, setPage] = useState('home'); // 'home' | 'style' | 'capture' | 'generating' | 'decoration'
  const [countdown, setCountdown] = useState(3);
  const [capturedImage, setCapturedImage] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [decorationTab, setDecorationTab] = useState('stickers'); // 'stickers' | 'frames'
  const [stickers, setStickers] = useState([]);
  const [draggedSticker, setDraggedSticker] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const videoRef = React.useRef(null);
  const photoContainerRef = React.useRef(null);

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

  const handleDone = () => {
    setPage('generating');
    setGenerationProgress(0);
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

  React.useEffect(() => {
    let progressTimer;
    if (page === 'generating') {
      progressTimer = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 99) {
            clearInterval(progressTimer);
            return 99;
          }
          return prev + Math.random() * 30;
        });
      }, 500);
    }
    return () => clearInterval(progressTimer);
  }, [page]);

  React.useEffect(() => {
    let timer;
    if (page === 'generating' && generationProgress >= 99) {
      timer = setTimeout(() => {
        setPage('decoration');
        setStickers([]);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [page, generationProgress]);

  const handleAddSticker = (sticker) => {
    const newSticker = {
      ...sticker,
      x: 50,
      y: 50,
      id: Date.now(),
    };
    setStickers([...stickers, newSticker]);
    setDraggedSticker(newSticker.id);
  };

  const handlePhotoContainerDrop = (e) => {
    e.preventDefault();
    if (!draggedSticker || !photoContainerRef.current) return;

    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if we are dragging a new sticker from palette (ID is small number)
    const catalogSticker = STICKERS.find(s => s.id === draggedSticker);
    
    if (catalogSticker) {
      // Create new sticker instance
      const newSticker = {
        ...catalogSticker,
        x: Math.max(0, Math.min(x - 25, rect.width - 50)),
        y: Math.max(0, Math.min(y - 25, rect.height - 50)),
        id: Date.now(),
      };
      setStickers((prev) => [...prev, newSticker]);
    } else {
      // Moving existing sticker (if draggable was enabled for them, but currently they use onMouseDown)
      // This branch might be reached if we enabled native drag for existing stickers.
      setStickers((prev) =>
        prev.map((s) =>
          s.id === draggedSticker
            ? { ...s, x: Math.max(0, Math.min(x - 40, rect.width - 80)), y: Math.max(0, Math.min(y - 40, rect.height - 80)) }
            : s
        )
      );
    }
    setDraggedSticker(null);
  };

  React.useEffect(() => {
    if (!draggedSticker) return;
    if (draggedSticker < 1000) return;

    const handleWindowMouseMove = (e) => {
        if (!photoContainerRef.current) return;
        const rect = photoContainerRef.current.getBoundingClientRect();
        
        let clientX = e.clientX;
        let clientY = e.clientY;

        // Touch support
        if (e.touches && e.touches[0]) {
           clientX = e.touches[0].clientX;
           clientY = e.touches[0].clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setStickers((prev) =>
          prev.map((s) => {
            if (s.id === draggedSticker) {
                 return { 
                     ...s, 
                     x: Math.min(Math.max(x - 40, -40), rect.width - 40), 
                     y: Math.min(Math.max(y - 40, -40), rect.height - 40)
                 };
            }
            return s;
          })
        );
    };

    const handleWindowMouseUp = () => {
        setDraggedSticker(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleWindowMouseMove, { passive: false });
    window.addEventListener('touchend', handleWindowMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
        window.removeEventListener('touchmove', handleWindowMouseMove);
        window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [draggedSticker]);

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };


  // Countdown circle calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((3 - countdown) / 3) * circumference;

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      
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
                {[
                  { id: 1, src: style1 },
                  { id: 2, src: style2 },
                  { id: 3, src: style3 },
                  { id: 4, src: style4 },
                  { id: 5, src: style5 },
                  { id: 6, src: style6 },
                ].map((style) => (
                  <img 
                    key={style.id}
                    src={style.src} 
                    alt={`Style ${style.id}`}
                    className={selectedStyle === style.id ? 'selected' : ''}
                    onClick={() => setSelectedStyle(style.id)}
                  />
                ))}
            </div>

            <button 
              className="take-shot-btn" 
              onClick={handleStartCapture}
              style={{ opacity: selectedStyle ? 1 : 0.5, pointerEvents: selectedStyle ? 'auto' : 'none' }}
            >
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
                    <button className="done-btn" onClick={handleDone}>
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

      {page === 'generating' && (
        <div className="capture-content">
            <h1 className="style-title">GENERATING</h1>
            <p className="style-subtitle">Transforming your photo style</p>

            <div className="camera-container">
                <img src={capturedImage} className="camera-feed" alt="Captured" />
                <div className="processing-shimmer" />
                
                <div className="generating-overlay">
                    <div className="loading-spinner" />
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${generationProgress}%` }} />
                    </div>
                    <div className="progress-text">{Math.round(generationProgress)}%</div>
                </div>
            </div>

            <div className="bottom-logo-container">
               <img src={titleImg} className="bottom-logo" alt="AI Photo Booth" />
               <p className="bottom-logo-text">FUTURISTIC PHOTOS • INSTANT SHARING</p>
            </div>
        </div>
      )}

      {page === 'decoration' && (
        <div className="capture-content">
            <h1 className="style-title">DECORATION</h1>
            
            <div className="decoration-tabs">
                <button 
                  className={`tab-btn ${decorationTab === 'stickers' ? 'active' : ''}`}
                  onClick={() => setDecorationTab('stickers')}
                >
                  STICKERS
                </button>
                <button 
                  className={`tab-btn ${decorationTab === 'frames' ? 'active' : ''}`}
                  onClick={() => setDecorationTab('frames')}
                >
                  FRAMES
                </button>
            </div>

            {decorationTab === 'stickers' && (
              <div className="stickers-grid">
                {STICKERS.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="sticker-item"
                    draggable
                    onDragStart={() => setDraggedSticker(sticker.id)}
                    onDragEnd={() => setDraggedSticker(null)}
                    onClick={() => handleAddSticker(sticker)}
                    style={{ cursor: 'grab' }}
                  >
                    {sticker.emoji}
                  </div>
                ))}
              </div>
            )}

            <div 
              className="camera-container"
              ref={photoContainerRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePhotoContainerDrop}
              style={{ position: 'relative' }}
            >
                <img src={animatedAvatar} className="camera-feed" alt="Decorated" />
                
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className={`sticker-on-photo ${draggedSticker === sticker.id ? 'dragging' : ''}`}
                    style={{
                      position: 'absolute',
                      left: `${sticker.x}px`,
                      top: `${sticker.y}px`,
                      cursor: draggedSticker === sticker.id ? 'grabbing' : 'grab',
                      userSelect: 'none',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDraggedSticker(sticker.id);
                    }}
                    onTouchStart={(e) => {
                      // Prevent scrolling while dragging
                      e.stopPropagation();
                      setDraggedSticker(sticker.id);
                    }}
                  >
                    {sticker.emoji}
                  </div>
                ))}
            </div>

            <div className="review-buttons">
                <button className="retake-btn" onClick={() => setPage('style')}>
                     RETAKE ↻
                </button>
                <button className="done-btn">
                     DONE ✨
                </button>
            </div>

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

