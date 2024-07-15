import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';

const GossipPage = ({ countryData, onBack }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null); // 부모 div 요소에 대한 ref
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth * 0.8; // 부모 div 폭의 80%
        const height = containerRef.current.offsetHeight * 0.7; // 부모 div 높이의 70%
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
    console.log("fetch");
    fetchWordData();
  }, [countryData]);

  useEffect(() => {
    if (!loading) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);

      function showTooltip(item, dimension, event) {
        tooltipRef.current.innerText = item[0];
        tooltipRef.current.style.left = `${event.pageX}px`;
        tooltipRef.current.style.top = `${event.pageY}px`;
        tooltipRef.current.style.visibility = 'visible';
      }

      function hideTooltip() {
        tooltipRef.current.style.visibility = 'hidden';
      }

      const widthFactor = canvasSize.width / 800; // 기준 크기 800을 사용
      const heightFactor = canvasSize.height / 600; // 기준 크기 600을 사용

      WordCloud(canvas, {
        list: wordData,
        gridSize: 4,
        weightFactor: (size) => Math.log2(size) * 1.5 * widthFactor * heightFactor, // 페이지 크기에 연동
        fontFamily: 'Times, serif',
        color: 'random-dark',
        rotateRatio: 0.5,
        rotationSteps: 2,
        shape: 'circle',
        hover: showTooltip,
        mouseout: hideTooltip,
        wait: 100
      });

      return () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };
    }
  }, [loading, wordData, canvasSize]);

  return (
    <div id="gossip-page" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <div
        id="wordcloud-container"
        ref={containerRef} // 부모 div 요소에 ref 설정
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
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} style={{ backgroundColor: 'transparent' }}></canvas>
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
          right: '40px', // 우상단으로 위치 조정
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

export default GossipPage;