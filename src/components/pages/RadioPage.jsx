import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RadioPage = ({ countryData, onBack }) => {
  const [stations, setStations] = useState([]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [audio, setAudio] = useState(new Audio());
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // 특정 국가의 라디오 방송 목록을 가져오는 함수
    const fetchStations = async () => {
      try {
        const countryCode = countryData.properties.iso_a2 || countryData.properties.iso_a3; // 2글자 또는 3글자 국가 코드 사용
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
      audio.src = stations[currentStationIndex].url_resolved;
      audio.play();
    }
    return () => {
      audio.pause();
    };
  }, [currentStationIndex, stations]);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  const handleNextStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
  };

  const handlePrevStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex - 1 + stations.length) % stations.length);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
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
      <div style={{
        display: 'inline-block',
        padding: '20px',
        border: '2px solid black',
        borderRadius: '10px',
        width: '400px',
        backgroundColor: '#d3d3d3',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '5px',
            width: '80%',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: 0 }}>{stations.length > 0 ? stations[currentStationIndex].name : 'Loading...'}</h2>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '80%',
            marginBottom: '20px'
          }}>
            <button onClick={handlePrevStation} style={{
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>Previous</button>
            <button onClick={handleNextStation} style={{
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>Next</button>
          </div>
          <div style={{
            width: '80%'
          }}>
            <label htmlFor="volume" style={{
              display: 'block',
              marginBottom: '10px'
            }}>Volume: </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(e.target.value)}
              style={{
                width: '100%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;