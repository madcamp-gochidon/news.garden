import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3'; // d3를 사용하기 위해 import
import Globe from './components/Globe'; // Globe 컴포넌트를 import
import CountryView from './components/CountryView'; // CountryView 컴포넌트를 import
import './App.css'; // 스타일링을 위해 App.css를 import

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null); // 선택된 국가를 상태로 관리
  const globeRef = useRef(null); // Globe 컴포넌트의 참조를 저장하기 위한 ref

  useEffect(() => {
    console.log("Globe ref:", globeRef.current);
  }, [globeRef]);

  // 국가 클릭 이벤트 핸들러
  const handleCountryClick = (countryData) => {
    console.log("Country clicked:", countryData.properties.name);
    setSelectedCountry(countryData); // 선택된 국가를 상태로 설정
  };

  // CountryView 닫기 이벤트 핸들러
  const handleCloseCountryView = () => {
    console.log("Closing country view");
    // 애니메이션으로 줌 아웃
    const svg = d3.select(globeRef.current).select("svg");
    svg.transition().duration(1000)
      .attr("transform", `scale(1)`)
      .on("end", () => {
        setSelectedCountry(null); // 선택된 국가 상태를 null로 설정
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