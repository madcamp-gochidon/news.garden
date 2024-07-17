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

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
  };

  const textStyle = {
    transform: 'rotate(180deg)',
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

      const difference = Math.abs(angle - Math.PI);
      if (difference < minDifference) {
        minDifference = difference;
        closestIndex = i;
      }

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

    if (stations[closestIndex] && currentStation !== stations[closestIndex]) {
      setCurrentStation(stations[closestIndex]);
    }

    // P점에서 왼쪽으로 radius / 4 길이만큼의 선 추가
    const lineLength = radius / 4;
    cards.push(
      <div
        key="line"
        style={{
          position: 'absolute',
          width: `50vh`,
          height: '2px',
          backgroundColor: 'red',
          transform: `translate(0%, 50%) translateX(-${radius}vh) rotate(0deg)`,
          transformOrigin: 'top',
        }}
      />
    );

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
        style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
        }}
      >
        <button onClick={togglePlayPause} style={{ display: 'block', marginBottom: '10px' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={{ display: 'block', width: '200px' }}
        />
      </div>
      <div
        ref={circleRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: '50%',
          right: '0%',
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

export default RadioPage;