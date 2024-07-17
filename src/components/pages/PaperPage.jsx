import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import throttle from 'lodash/throttle';

const ItemTypes = {
  PAPER: 'paper',
};

const Paper = ({ article, style, index, movePaper, initialX, initialY, initialRotation, onClick, isSelected, zIndex }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PAPER,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAPER,
      hover: throttle((item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta && !isSelected) {
          movePaper(item.index, delta.x, delta.y);
        }
      }, 16), // 16ms 간격으로 업데이트 (60fps)
    }),
    [index, isSelected]
  );

  const handleHeadlineClick = () => {
    if (isSelected && article.link) {
      window.open(article.link, '_blank');
    }
  };

  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [article]);

  return (
    <motion.div
      ref={(node) => {
        drag(drop(node));
      }}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 1000 : zIndex,
        height: contentHeight ? contentHeight + 60 : 'auto', // 패딩 20px, 여유 20px 추가
        width: '320px', // 여유 20px 추가
      }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{
        y: isSelected ? window.innerHeight / 2 - (contentHeight + 60) / 2 : initialY,
        x: isSelected ? window.innerWidth / 2 - 160 : initialX,
        rotate: isSelected ? 0 : initialRotation,
        opacity: 1,
        scale: isSelected ? 1.5 : 1,
      }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div ref={contentRef}>
        <h2 style={styles.headline} onClick={handleHeadlineClick}>{article.title}</h2>
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
        const filteredData = data.filter((article) => article.title !== "Title Not available");
        const sortedData = filteredData.sort((a, b) => b.value - a.value).slice(0, 12);

        console.log(sortedData.length);

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
    const x = Math.random() * (window.innerWidth - 320); // 여유 20px 추가
    const y = Math.random() * (window.innerHeight - 500) + 100; // 화면 중앙에 가깝게 배치
    const rotation = Math.random() * 60 - 30;
    return { x, y, rotation };
  };

  const movePaper = useCallback((index, deltaX, deltaY) => {
    setNews((prevNews) =>
      prevNews.map((article, i) => {
        if (i === index) {
          const newX = Math.min(window.innerWidth - 320, Math.max(0, (article.x || 0) + deltaX)); // 여유 20px 추가
          const newY = Math.min(window.innerHeight - 500, Math.max(0, (article.y || 0) + deltaY));
          return { ...article, x: newX, y: newY };
        }
        return article;
      })
    );
    setZIndices((prevZIndices) => {
      const maxZIndex = Math.max(...prevZIndices);
      return prevZIndices.map((z, i) => (i === index ? maxZIndex + 1 : z));
    });
  }, []);

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
    <DndProvider backend={HTML5Backend}>
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
                  movePaper={movePaper}
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
                    transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                    transition: 'transform 0.5s ease',
                  }}
                />
              );
            })
          ) : (
            notSupported && 
            <div style={styles.notSupported}>Not Supported</div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
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
    transition: 'transform 0.3s ease',
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