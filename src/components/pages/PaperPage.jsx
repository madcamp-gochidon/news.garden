import React, { useEffect, useState, useCallback } from 'react';
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

  return (
    <motion.div
      ref={(node) => {
        drag(drop(node));
      }}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 1000 : zIndex,
      }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{
        y: isSelected ? window.innerHeight / 2 - 250 : initialY, // 세로 크기 조절
        x: isSelected ? window.innerWidth / 2 - 150 : initialX,
        rotate: isSelected ? 0 : initialRotation,
        opacity: 1,
        scale: isSelected ? 1.5 : 1, // 축소된 확대 비율
      }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <h2 style={styles.headline} onClick={handleHeadlineClick}>{article.title}</h2>
      <p style={styles.summary}>{article.summary === "No summary available. More in link" ? "No summary available. More in link" : article.summary}</p>
    </motion.div>
  );
};

const PaperPage = ({ countryData, onBack }) => {
  const [news, setNews] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [zIndices, setZIndices] = useState([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://13.124.216.160:3000/api/get_news_summary/${countryData.properties.iso_a2}`);
        const data = await response.json();
        // value 기준으로 정렬하고 최대 12개만 사용
        const sortedData = data.sort((a, b) => b.value - a.value).slice(0, 12);
        setNews(
          sortedData.map((article) => ({
            ...article,
            ...generateRandomPosition(),
          }))
        );
        setZIndices(sortedData.map((_, index) => index));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [countryData]);

  const generateRandomPosition = () => {
    const x = Math.random() * (window.innerWidth - 300); // 300은 페이지의 대략적인 너비
    const y = Math.random() * (window.innerHeight - 600); // 600은 페이지의 대략적인 높이
    const rotation = Math.random() * 60 - 30; // -30도에서 30도 사이의 랜덤 회전
    return { x, y, rotation };
  };

  const movePaper = useCallback((index, deltaX, deltaY) => {
    setNews((prevNews) =>
      prevNews.map((article, i) => {
        if (i === index) {
          const newX = Math.min(window.innerWidth - 300, Math.max(0, (article.x || 0) + deltaX));
          const newY = Math.min(window.innerHeight - 600, Math.max(0, (article.y || 0) + deltaY));
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
    setTimeout(onBack, 500); // 애니메이션 종료 시간 후에 onBack 호출
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
          {!isExiting && news.map((article, index) => {
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
                  transition: 'transform 0.5s ease', // 애니메이션 적용
                }}
              />
            );
          })}
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
    backgroundColor: '#ffffff', // 배경 색상
  },
  container: {
    width: '300px',
    height: '600px', // 세로 크기 늘림
    backgroundColor: '#f0f0f0', // 밝은 회색 배경
    padding: '20px',
    fontFamily: "'Times New Roman', Times, serif",
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 부드러운 그림자 효과
    boxSizing: 'border-box',
    border: '1px solid #ddd', // 얇은 테두리
    position: 'absolute',
    cursor: 'pointer',
    transition: 'transform 0.3s ease', // 애니메이션 적용
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
    cursor: 'pointer', // 링크처럼 보이도록 마우스 커서 변경
  },
  summary: {
    fontSize: '18px',
    lineHeight: '1.6',
  },
};

export default PaperPage;