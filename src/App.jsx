import React, { useState, useRef } from 'react';
import * as d3 from 'd3';
import Globe from './components/Globe';
import CountryView from './components/CountryView';
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const globeRef = useRef(null);

  const handleCountryClick = (countryData) => {
    console.log("Country clicked:", countryData.properties.name);
    setSelectedCountry(countryData);
  };

  const handleCloseCountryView = () => {
    console.log("Closing country view");

    // 먼저 CountryView를 숨깁니다.
    setSelectedCountry(null);

    // 그런 다음, globe로 줌 아웃합니다.
    const g = d3.select(globeRef.current).select("svg g");
    g.style("visibility", "visible"); // Ensure the globe is visible
    g.transition().duration(1500)
      .attr("transform", `translate(0, 0) scale(1)`)
      .on("end", () => {
        console.log("Returned to globe view");
      });
  };

  return (
    <div className="App" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Globe onCountryClick={handleCountryClick} ref={globeRef} />
      {selectedCountry && (
        <CountryView countryData={selectedCountry} onClose={handleCloseCountryView} />
      )}
    </div>
  );
}

export default App;