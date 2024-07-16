import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PicturePage = ({ countryData, onBack }) => {
  const [stations, setStations] = useState([]);
  const [rotation, setRotation] = useState(0);
  const circleRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const countryCode = countryData.properties.iso_a2 || countryData.properties.iso_a3;
        const response = await axios.get(`https://at1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`);
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching radio stations: ", error);
      }
    };

    fetchStations();
  }, [countryData.properties.iso_a2, countryData.properties.iso_a3]);

  useEffect(() => {
    if (stations.length > 0) {
      // Find the card closest to P (leftmost point)
      const closestCardIndex = findClosestCardToP();
      const closestCardAngle = (closestCardIndex / 21) * 360;
      
      // Adjust the rotation to align the closest card with P
      const newRotation = rotation - closestCardAngle + 180;
      setRotation(newRotation);
    }
  }, [stations]);

  const handleMouseDown = (e) => {
    const startX = e.clientX;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newRotation = rotation + deltaX / 5; // Adjust the division factor to control sensitivity
      setRotation(newRotation);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const findClosestCardToP = () => {
    const adjustedRotation = rotation % 360;
    const angles = stations.map((_, index) => ((index / 21) * 360 + adjustedRotation) % 360);
    const closestCardIndex = angles.reduce((closestIndex, angle, index, array) => {
      const diff = Math.abs(angle - 180); // P is at 180 degrees
      if (diff < Math.abs(array[closestIndex] - 180)) {
        return index;
      }
      return closestIndex;
    }, 0);
    return closestCardIndex;
  };

  const cardStyle = {
    position: 'absolute',
    width: '10vw',
    height: '10vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.5s ease-in-out', // Add animation
  };

  const textStyle = {
    transform: 'rotate(180deg)',
  };

  const renderCards = () => {
    const radius = (window.innerHeight * 0.4) / window.innerHeight * 100; // Adjust the radius based on window height
    const cards = [];
    for (let i = 0; i < 21; i++) {
      const angle = (i / 21) * 2 * Math.PI + (rotation * Math.PI / 180);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const cardRotation = (angle * 180) / Math.PI; // Convert radians to degrees
      cards.push(
        <div
          key={i}
          style={{
            ...cardStyle,
            transform: `translate(${x}vh, ${y}vh) rotate(${cardRotation}deg)`,
          }}
        >
          <div style={textStyle}>
            {stations[i]?.name || 'Station'}
          </div>
        </div>
      );
    }
    return cards;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', height: '100vh', position: 'relative' }}>
      <h1>Radio Page</h1>
      <p>Country: {countryData.properties.name}</p>
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
      <div
        ref={circleRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '0',
          height: '0',
          transform: 'translate(-50%, -50%)',
          cursor: 'grab',
        }}
      >
        {renderCards()}
      </div>
    </div>
  );
};

export default PicturePage;