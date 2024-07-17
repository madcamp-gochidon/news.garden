import React, { useEffect, useRef, useState } from 'react';
import WordCloud from 'wordcloud';

const GossipPage = ({ countryData, onBack }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const [wordData, setWordData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const colorPalettes = [
    ['#EB3D3E', '#B7DBDC', '#3B5E76', '#20334D'], // 두 번째 색상표
    ['#2A4B40', '#267671', '#E0BE4B', '#F3A54D', '#E96E50'], // 세 번째 색상표
    ['#95C4D8', '#53B8CE', '#2E718A', '#EFAB3A', '#F3861E'], // 네 번째 색상표
    ['#5D5C36', '#8C6E42', '#CE9C58'], // 다섯 번째 색상표
    ['#D5B4DA', '#E79DC4', '#F4AFCC', '#92BEEA', '#5BA9DD'], // 여섯 번째 색상표
    ['#EFAB9A', '#E7B2AD', '#D18D8E', '#877B84'], // 일곱 번째 색상표
    ['#101319', '#273040', '#FFA000', '#E1E1E1', '#FFFFFF'], // 아홉 번째 색상표
    ['#041E3C', '#003973', '#00639A', '#00A1D4', '#8ED6EA'], // 열 번째 색상표
    ['#2A5D39', '#4B7045', '#6D8A4D', '#B2493F'], // 열한 번째 색상표
    ['#B6B39B', '#BDC2A8', '#758A76', '#3D5648'], // 열두 번째 색상표
  ];

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth * 0.9; // 부모 div 폭의 90%
        const height = containerRef.current.offsetHeight * 0.9; // 부모 div 높이의 90%
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

      // 랜덤 색상표 선택
      const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

      WordCloud(canvas, {
        list: wordData,
        gridSize: 15,
        weightFactor: (size) => Math.pow(size, 2) * widthFactor * heightFactor, // 단어 크기 차이를 극명하게
        fontFamily: 'Arial, sans-serif', // 원하는 폰트로 변경
        color: (word, weight, fontSize, distance, theta) => {
          return selectedPalette[Math.floor(Math.random() * selectedPalette.length)];
        },
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

export default GossipPage;