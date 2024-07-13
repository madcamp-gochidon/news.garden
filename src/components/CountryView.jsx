import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';
import dummyData from '../dummyData.json';

const CountryView = ({ countryData, onClose }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // 배경을 투명하게 설정
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

    WordCloud(canvas, {
      list: dummyData,
      gridSize: 4,
      weightFactor: (size) => Math.log2(size) * 5,
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
  }, []);

  return (
    <div id="country-view" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <div
        id="country-name"
        style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
        }}
      >
        {countryData.properties.name}
      </div>
      <div
        id="close-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        x
      </div>
      <div
        id="wordcloud-container"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 100px)',
          marginTop: '100px',
        }}
      >
        <canvas ref={canvasRef} width={800} height={600} style={{ backgroundColor: 'transparent' }}></canvas>
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
      </div>
    </div>
  );
};

export default CountryView;