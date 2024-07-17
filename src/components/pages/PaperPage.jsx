import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Paper = ({ article, style, index, initialX, initialY, initialRotation, onClick, isSelected, zIndex, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const paperRef = useRef(null);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    paperRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      const newPos = { x: e.clientX - paperRef.current.clientWidth / 2, y: e.clientY - paperRef.current.clientHeight / 2 };
      setPosition(newPos);
      onMove(index, newPos.x, newPos.y);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    paperRef.current.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const element = paperRef.current;

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerUp);

    return () => {
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <motion.div
      ref={paperRef}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 1000 : zIndex,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${isSelected ? 0 : initialRotation}deg)`,
        userSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{
        y: isSelected ? window.innerHeight / 2 - 200 : position.y,
        x: isSelected ? window.innerWidth / 2 - 150 : position.x,
        rotate: isSelected ? 0 : initialRotation,
        opacity: 1,
        scale: isSelected ? 1.5 : 1,
      }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 0.5 }}
      onPointerDown={handlePointerDown}
      onClick={onClick}
    >
      <div>
        <h2 style={styles.headline}>{article.title}</h2>
        <p style={styles.summary}>{article.summary === "No summary available. More in link" ? "No summary available. More in link" : article.summary}</p>
      </div>
    </motion.div>
  );
};

const PaperPage = ({ countryData, onBack }) => {
  const [news, setNews] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [zIndices, setZIndices] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [notSupported, setNotSupported] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://13.124.216.160:3000/api/get_news_summary/${countryData.properties.iso_a2}`);
        const data = await response.json();
        const filteredData = data.filter((article) => article.title !== "Title not available");
        const sortedData = filteredData.sort((a, b) => b.value - a.value).slice(0, 12);

        if (sortedData.length < 10) {
          setNews([]);
          setNotSupported(true);
        } else {
          setNews(
            sortedData.map((article) => ({
              ...article,
              ...generateRandomPosition(),
            }))
          );
          setZIndices(sortedData.map((_, index) => index));
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNotSupported(true);
      }
    };

    fetchNews();
  }, [countryData]);

  const generateRandomPosition = () => {
    const x = Math.random() * (window.innerWidth - 320);
    const y = Math.random() * (window.innerHeight - 500) + 100;
    const rotation = Math.random() * 60 - 30;
    return { x, y, rotation };
  };

  const movePaper = (index, newX, newY) => {
    setNews((prevNews) =>
      prevNews.map((article, i) => (i === index ? { ...article, x: newX, y: newY } : article))
    );
    setZIndices((prevZIndices) => {
      const maxZIndex = Math.max(...prevZIndices);
      return prevZIndices.map((z, i) => (i === index ? maxZIndex + 1 : z));
    });
  };

  const handlePageClick = (index) => {
    setSelectedPage(index === selectedPage ? null : index);
    if (index !== selectedPage) {
      setZIndices((prevZIndices) => {
        const maxZIndex = Math.max(...prevZIndices);
        return prevZIndices.map((z, i) => (i === index ? maxZIndex + 1 : z));
      });
    }
  };

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(onBack, 500);
  };

  return (
    <div style={styles.outerContainer} onClick={() => setSelectedPage(null)}>
      <div
        id="back-button"
        style={styles.backButton}
        onClick={(e) => {
          e.stopPropagation();
          handleExit();
        }}
      >
        x
      </div>
      <AnimatePresence>
        {!isExiting && !notSupported ? (
          news.map((article, index) => {
            const { x = 0, y = 0, rotation = 0 } = article;
            const isSelected = selectedPage === index;
            return (
              <Paper
                key={index}
                article={article}
                index={index}
                initialX={x}
                initialY={y}
                initialRotation={rotation}
                isSelected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageClick(index);
                }}
                zIndex={zIndices[index]}
                style={{
                  ...styles.container,
                }}
                onMove={movePaper}
              />
            );
          })
        ) : (
          notSupported && 
          <div style={styles.notSupported}>Not Supported</div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  outerContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundColor: '#ffffff',
  },
  container: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    fontFamily: "'Times New Roman', Times, serif",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    position: 'absolute',
    cursor: 'pointer',
    width: '300px',
    minHeight: '400px', // 최소 높이 설정 (A4 비율에 맞게)
    paddingBottom: '40px', // 패딩 추가
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '30px',
    cursor: 'pointer',
    color: '#333',
    zIndex: 1000,
  },
  headline: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  summary: {
    fontSize: '18px',
    lineHeight: '1.6',
  },
  notSupported: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    color: '#333',
  },
};

export default PaperPage;
