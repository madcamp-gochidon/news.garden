import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';
import dummyData from '../dummyData.json';

const CountryView = ({ countryData, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    WordCloud(canvas, {
      list: dummyData,
      gridSize: 8,
      weightFactor: 10,
      fontFamily: 'Times, serif',
      color: 'random-dark',
      backgroundColor: '#fff',
      rotateRatio: 0.5,
      rotationSteps: 2,
      shape: 'circle'
    });
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
        <canvas ref={canvasRef} width={800} height={600}></canvas>
      </div>
    </div>
  );
};

export default CountryView;