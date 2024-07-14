import React from 'react';

const PicturePage = ({ countryData, onBack }) => {
  return (
    <div>
      <h1>Picture Page</h1>
      <p>Country: {countryData.properties.name}</p>
      <div
        id="back-button"
        style={{
          position: 'absolute',
          top: '20px',
          left: '40px',
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

export default PicturePage;