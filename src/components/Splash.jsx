import React, { useEffect, useState } from 'react';
import './splash.css';
import logo from '/home/ubuntu/news.garden/src/assets/logo.png'; // 이미지 파일 경로

const Splash = ({ onAnimationEnd }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 1000); // 1초 후에 페이드 아웃 시작
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`splash ${fade ? 'fade-out' : ''}`}
      onTransitionEnd={onAnimationEnd}
    >
      <div className="content">
        <h1>news.garden</h1>
        <a 
          href="https://www.flaticon.com/kr/free-icons/-" 
          title="지구 지구 아이콘"
          className="logo-link"
        >
          <img src={logo} alt="Logo" className="splash-logo" />
        </a>
      </div>
    </div>
  );
};

export default Splash;