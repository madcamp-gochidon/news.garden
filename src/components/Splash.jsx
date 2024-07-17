import React, { useEffect, useState } from 'react';
import './splash.css';

const Splash = ({ onAnimationEnd }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 3000); // 3초 후에 페이드 아웃 시작
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash ${fade ? 'fade-out' : ''}`}
      onTransitionEnd={onAnimationEnd}
    >
      <h1>news.garden</h1>
    </div>
  );
};

export default Splash;