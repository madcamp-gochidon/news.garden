import React from 'react';

const CountryView = ({ countryData, onClose }) => {
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
    </div>
  );
};

export default CountryView;