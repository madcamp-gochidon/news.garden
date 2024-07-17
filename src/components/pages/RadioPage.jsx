import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCaretDown } from 'react-icons/fa';

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
    let speed = 100;
    const decay = 0.98;

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
    cancelAnimationFrame(animationRef.current);
    const startX = e.clientX;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newRotation = rotation + deltaX / 5;
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

  const renderStationNames = () => {
    const radius = (window.innerHeight * 0.4) / window.innerHeight * 90;
    const stationsElements = [];
    let closestIndex = 0;
    let minDifference = Infinity;

    for (let i = 0; i < 21; i++) {
      const angle = (i / 21) * 2 * Math.PI + (rotation * Math.PI / 180);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const textRotation = (angle * 180) / Math.PI;

      const normalizedAngle = ((((angle + Math.PI) % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) - Math.PI;
      const difference = Math.abs(normalizedAngle + Math.PI / 2);
      if (difference < minDifference) {
        minDifference = difference;
        closestIndex = i;
      }

      stationsElements.push(
        <div key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${x}vw, ${y}vw) translate(-50%, -50%) rotate(${textRotation + 90}deg)`,
            fontFamily: 'Roboto',
            color: 'white',
            fontSize: '1.0vw', // Increased font size
            width: '130px', // Increased width
            textAlign: 'center' // Center align the text
          }}
        >
          {stations[i]?.name || 'Loading...'}
        </div>
      );
    }

    if (stations[closestIndex] && currentStation !== stations[closestIndex]) {
      setCurrentStation(stations[closestIndex]);
    }

    return stationsElements;
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
        <div
          style={{
            position: 'absolute',
            top: '-45vw', // Adjust the position as needed
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <FaCaretDown style={{
            width: '2vw',
            color: '#AE0E36', // 와인색 (Burgundy)
          }}
        />
        </div>
        <div
          style={{
            position: 'absolute',
            width: '90vw',
            height: '90vw',
            bottom: '0%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #444 10%, #333 40%, #111 70%)',
            zIndex: -2,
            top: '50%', // Adjust this value to move the circle up or down
            left: '50%', // Adjust this value to move the circle left or right
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '30vw',
            height: '30vw',
            bottom: '0%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #444 10%, #333 40%, #111 70%)',
            zIndex: -1,
            top: '50%', // Adjust this value to move the circle up or down
            left: '50%', // Adjust this value to move the circle left or right
            transform: 'translate(-50%, -50%)',
          }}
        />
        {renderStationNames()}
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            fontSize: '5vw',
            color: 'black',
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default RadioPage;