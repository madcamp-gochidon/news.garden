import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RadioPage = ({ countryData, onBack }) => {
  const [radioUrl, setRadioUrl] = useState('');

  useEffect(() => {
    const fetchRadioStation = async () => {
      try {
        const response = await axios.get(`https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryData.properties.country_code_2}`);
        const newsStations = response.data.filter(station => station.tags.includes('news'));
        if (newsStations.length > 0) {
          setRadioUrl(newsStations[0].url_resolved);
        } else {
          alert('No news stations found for this country.');
        }
      } catch (error) {
        console.error('Error fetching radio stations:', error);
        alert('Failed to fetch radio stations.');
      }
    };

    fetchRadioStation();
  }, [countryData]);

  return (
    <div>
      <h1>Radio Page</h1>
      <p>Country: {countryData.properties.name}</p>
      <p>Country Code (2 letters): {countryData.properties.country_code_2}</p>
      <p>Country Code (3 letters): {countryData.properties.country_code_3}</p>
      <div
        id="back-button"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '30px',
          cursor: 'pointer',
        }}
        onClick={onBack}
      >
        x
      </div>
      {radioUrl && (
        <div>
          <h2>Now Playing:</h2>
          <audio controls src={radioUrl} autoPlay>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default RadioPage;