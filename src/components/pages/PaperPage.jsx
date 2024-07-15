import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import throttle from 'lodash/throttle';

const ItemTypes = {
  PAPER: 'paper',
};

const Paper = ({ article, style, index, movePaper, initialX, initialY, initialRotation, onClick, isSelected, zIndex }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
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
        const delta = monitor.getClientOffset();
        if (delta && !isSelected) {
          movePaper(item.index, delta.x, delta.y);
        }
      }, 16), // 16ms 간격으로 업데이트 (60fps)
    }),
    [index, isSelected]
  );

  return (
    <motion.div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 1000 : zIndex,
      }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{
        y: isSelected ? window.innerHeight / 2 - 200 : initialY,
        x: isSelected ? window.innerWidth / 2 - 150 : initialX,
        rotate: isSelected ? 0 : initialRotation,
        opacity: 1,
        scale: isSelected ? 2 : 1,
      }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 1 }}
      onClick={onClick}
    >
      <h2 style={styles.headline}>{article.headline}</h2>
      <p style={styles.summary}>{article.summary}</p>
    </motion.div>
  );
};

const PaperPage = ({ countryData, onBack }) => {
  const [news, setNews] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [zIndices, setZIndices] = useState([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // API 호출 부분은 주석 처리하였습니다.
    // const fetchNews = async () => {
    //   const response = await fetch(`https://api.news.org/v1/headlines?country=${countryData.properties.iso_a2}`);
    //   const data = await response.json();
    //   setNews(data.articles);
    // };

    // 더미 데이터 사용
    const dummyNews = [
      { headline: 'News Headline 1', summary: 'This is a summary of news article 1. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 2', summary: 'This is a summary of news article 2. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 3', summary: 'This is a summary of news article 3. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 4', summary: 'This is a summary of news article 4. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 5', summary: 'This is a summary of news article 5. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 6', summary: 'This is a summary of news article 6. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 7', summary: 'This is a summary of news article 7. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 8', summary: 'This is a summary of news article 8. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 9', summary: 'This is a summary of news article 9. It is supposed to be around 150 characters long to simulate the actual news summary.' },
      { headline: 'News Headline 10', summary: 'This is a summary of news article 10. It is supposed to be around 150 characters long to simulate the actual news summary.' },
    ];

    setNews(
      dummyNews.map((article) => ({
        ...article,
        ...generateRandomPosition(),
      }))
    );
    setZIndices(dummyNews.map((_, index) => index));

    // fetchNews();
  }, [countryData]);

  const generateRandomPosition = () => {
    const x = Math.random() * (window.innerWidth - 300); // 300은 페이지의 대략적인 너비
    const y = Math.random() * (window.innerHeight - 400); // 400은 페이지의 대략적인 높이
    const rotation = Math.random() * 60 - 30; // -30도에서 30도 사이의 랜덤 회전
    return { x, y, rotation };
  };

  const movePaper = useCallback((index, x, y) => {
    const constrainedX = Math.min(window.innerWidth - 300, Math.max(0, x));
    const constrainedY = Math.min(window.innerHeight - 400, Math.max(0, y));
    setNews((prevNews) =>
      prevNews.map((article, i) => {
        if (i === index) {
          return { ...article, x: constrainedX, y: constrainedY };
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
    height: '400px',
    backgroundColor: '#fdf6e3', // 누런 종이 색상
    padding: '20px',
    fontFamily: "'Times New Roman', Times, serif",
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '10px',
    position: 'absolute',
    cursor: 'pointer',
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
  },
  summary: {
    fontSize: '18px',
    lineHeight: '1.6',
  },
};

export default PaperPage;