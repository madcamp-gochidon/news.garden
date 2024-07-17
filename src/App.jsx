import React, { useState, useRef } from 'react';
import * as d3 from 'd3';
import Globe from './components/Globe';
import CountryView from './components/CountryView';
import Splash from './components/Splash'; // 스플래쉬 컴포넌트 임포트
import './App.css';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showSplash, setShowSplash] = useState(true); // 스플래쉬 상태 추가
  const [isInitial, setisInitial] = useState(true);
  const globeRef = useRef(null);

  const handleCountryClick = (countryData) => {
    console.log("Country clicked:", countryData.properties.name);
    setSelectedCountry(countryData);
    setisInitial(false);
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

  const handleSplashAnimationEnd = () => {
    setShowSplash(false); // 스플래쉬 애니메이션이 끝나면 숨깁니다.
  };

  return (
    <div className="App">
      {showSplash ? (
        <Splash onAnimationEnd={handleSplashAnimationEnd} />
      ) : (
        selectedCountry ? 
          <CountryView countryData={selectedCountry} onClose={handleCloseCountryView} /> : 
          <Globe onCountryClick={handleCountryClick} ref={globeRef} isInitial={isInitial} />
      )}
    </div>
  );
}

export default App;