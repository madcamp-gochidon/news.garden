import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const RadioPage = ({ countryData, onBack }) => {
  const [stations, setStations] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(new Audio());
  const circleRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const countryCode = countryData.properties.iso_a2 || countryData.properties.iso_a3;
        const response = await axios.get(`https://at1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`);
        let fetchedStations = response.data;

        // "votes" 기준으로 내림차순 정렬
        fetchedStations.sort((a, b) => b.votes - a.votes);

        if (fetchedStations.length > 21) {
          fetchedStations = fetchedStations.slice(0, 21);
        } else {
          while (fetchedStations.length < 21) {
            const randomStation = fetchedStations[Math.floor(Math.random() * fetchedStations.length)];
            fetchedStations.push(randomStation);
          }
        }

        setStations(fetchedStations);
      } catch (error) {
        console.error("Error fetching radio stations: ", error);
      }
    };

    fetchStations();
  }, [countryData.properties.iso_a2, countryData.properties.iso_a3]);

  useEffect(() => {
    if (currentStation) {
      audioRef.current.src = currentStation.url_resolved;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentStation]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const startRotationAnimation = () => {
    let speed = 100; // Initial speed
    const decay = 0.98; // Decay factor

    const animate = () => {
      setRotation((prevRotation) => prevRotation + speed);
      speed *= decay;

      if (speed > 0.01) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startRotationAnimation();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseDown = (e) => {
    cancelAnimationFrame(animationRef.current); // Stop animation on drag
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

  const handleBackClick = () => {
    audioRef.current.pause();
    onBack();
  };

  const cardStyle = {
    position: 'absolute',
    width: '15vw',
    height: '15vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transformOrigin: 'center', // Add transform origin
  };

  const textStyle = {
    transform: 'rotate(90deg)',
  };

  const renderCards = () => {
    const radius = (window.innerHeight * 0.4) / window.innerHeight * 100; // Adjust the radius based on window height
    const cards = [];
    let closestIndex = 0;
    let minDifference = Infinity;

    for (let i = 0; i < 21; i++) {
      const angle = (i / 21) * 2 * Math.PI + (rotation * Math.PI / 180);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const cardRotation = (angle * 180) / Math.PI; // Convert radians to degrees

      const normalizedAngle = ((((angle + Math.PI) % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) - Math.PI; // Map angle to the range [-Math.PI, Math.PI]
      const difference = Math.abs(normalizedAngle + Math.PI / 2);
      if (difference < minDifference) {
        minDifference = difference;
        closestIndex = i;
      }

      cards.push(
        <div key={i}>
          <div
            style={{
              ...cardStyle,
              transform: `translate(${x}vw, ${y}vw) translate(-50%, -50%) rotate(${cardRotation}deg)`,
            }}
          >
            <div style={textStyle}>
              {stations[i]?.name || ''}
            </div>
          </div>
        </div>
      );
    }

    if (stations[closestIndex] && currentStation !== stations[closestIndex]) {
      setCurrentStation(stations[closestIndex]);
    }

    return cards;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', height: '100vh', position: 'relative' }}>
      <div
        id="back-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={handleBackClick}
      >
        x
      </div>
      <div
        ref={circleRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          bottom: '0%',
          right: '50%',
          width: '0',
          height: '0',
          transform: 'translate(-50%, -50%)',
          cursor: 'grab',
        }}
      >
        {renderCards()}
        <div
          style={{
            position: 'absolute',
            width: `2px`,
            height: '50vw',
            backgroundColor: 'red',
            transformOrigin: 'bottom',
            bottom: '0%',
            left: '50%',
          }}
        />
      </div>
    </div>
  );
};

export default RadioPage;