import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';
import '/home/ubuntu/news.garden/src/components/WordPage.css'; // CSS 파일 추가


const WordPage = ({ countryData, onBack }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [wordPositions, setWordPositions] = useState([]);

  const colorPalettes = [
    ['#EB3D3E', '#B7DBDC', '#3B5E76', '#20334D'],
    ['#2A4B40', '#267671', '#E0BE4B', '#F3A54D', '#E96E50'],
    ['#95C4D8', '#53B8CE', '#2E718A', '#EFAB3A', '#F3861E'],
    ['#5D5C36', '#8C6E42', '#CE9C58'],
    ['#D5B4DA', '#E79DC4', '#F4AFCC', '#92BEEA', '#5BA9DD'],
    ['#EFAB9A', '#E7B2AD', '#D18D8E', '#877B84'],
    ['#101319', '#273040', '#FFA000', '#E1E1E1', '#FFFFFF'],
    ['#041E3C', '#003973', '#00639A', '#00A1D4', '#8ED6EA'],
    ['#2A5D39', '#4B7045', '#6D8A4D', '#B2493F'],
    ['#B6B39B', '#BDC2A8', '#758A76', '#3D5648'],
  ];

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth * 0.9;
        const height = containerRef.current.offsetHeight * 0.9;
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const fetchWordData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://13.124.216.160:3000/api/get_keyword_and_news/${countryData.properties.iso_a2}`);
        const data = await response.json();
        setWordData(data);
      } catch (error) {
        console.error('Error fetching word data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWordData();
  }, [countryData]);

  useEffect(() => {
    if (!loading) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      let wordPositionsTemp = [];

      context.clearRect(0, 0, canvas.width, canvas.height);

      function showTooltip(item, dimension, event) {
        tooltipRef.current.innerText = item[0];
        tooltipRef.current.style.left = `${event.pageX + 10}px`; // 마우스 커서 오른쪽으로 10px
        tooltipRef.current.style.top = `${event.pageY + 10}px`; // 마우스 커서 아래로 10px
        tooltipRef.current.style.visibility = 'visible';
      }

      function hideTooltip() {
        tooltipRef.current.style.visibility = 'hidden';
      }

      const widthFactor = canvasSize.width / 600;
      const heightFactor = canvasSize.height / 400;

      const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

      WordCloud(canvas, {
        list: wordData,
        gridSize: 15,
        weightFactor: (size) => (size) * 0.03 * widthFactor * heightFactor,
        fontFamily: 'Roboto',
        color: (word, weight, fontSize, distance, theta) => {
          return selectedPalette[Math.floor(Math.random() * selectedPalette.length)];
        },
        rotateRatio: 0.5,
        rotationSteps: 2,
        shape: 'circle',
        hover: (item, dimension, event) => {
          wordPositionsTemp.push({
            word: item[0],
            x: dimension.x,
            y: dimension.y,
            width: dimension.w,
            height: dimension.h
          });
        },
        mouseout: hideTooltip,
        wait: 100,
        click: (item) => {
          const query = item[0];
          const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          window.open(url, '_blank');
        },
        drawOutOfBound: false,
        shrinkToFit: true,
        backgroundColor: '#ffffff',
        classes: ['fade-in'], // Apply animation class to words
      });

      setWordPositions(wordPositionsTemp);

      canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const wordHovered = wordPositionsTemp.find(pos => 
          x >= pos.x && x <= pos.x + pos.width && 
          y >= pos.y && y <= pos.y + pos.height
        );

        if (wordHovered) {
          canvas.style.cursor = 'pointer';
          showTooltip({ 0: wordHovered.word }, wordHovered, event);
        } else {
          canvas.style.cursor = 'default';
          hideTooltip();
        }
      });

      return () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setWordPositions([]);
      };
    }
  }, [loading, wordData, canvasSize]);

  return (
    <div id="word-page" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <div
        id="wordcloud-container"
        ref={containerRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="wordcloud-canvas"></canvas>
            <div
              className="tooltip"
              ref={tooltipRef}
              style={{
                position: 'absolute',
                backgroundColor: '#333',
                color: '#fff',
                padding: '5px',
                borderRadius: '3px',
                visibility: 'hidden',
                whiteSpace: 'nowrap',
                zIndex: 1000,
                pointerEvents: 'none'
              }}
            ></div>
          </>
        )}
      </div>
      <div
        id="back-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={onBack}
      >
        x
      </div>
    </div>
  );
};

export default WordPage;
