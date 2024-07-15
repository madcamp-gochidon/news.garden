import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const dummyData = [
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://via.placeholder.com/300x200', 'https://www.w3schools.com/html/mov_bbb.mp4'
];

const Layer = ({ data, radius, rotationSpeed, height }) => {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    groupRef.current.rotation.y += rotationSpeed * delta;
  });

  const angleStep = (2 * Math.PI) / data.length;
  
  return (
    <group ref={groupRef} position={[0, height, 0]}>
      {data.map((url, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        return (
          <mesh key={index} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[3, 2, 0.1]} />
            <meshBasicMaterial>
              <texture attach="map" image={new THREE.TextureLoader().load(url)} />
            </meshBasicMaterial>
          </mesh>
        );
      })}
    </group>
  );
};

const MediaPage = ({ countryData, onBack }) => {
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    // Replace with actual API call
    // axios.get(`/api/media/${countryData.properties.code}`)
    //   .then(response => {
    //     setMediaData(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching media data:', error);
    //   });

    setMediaData(dummyData);
  }, [countryData]);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '30px',
          cursor: 'pointer',
          zIndex: 1,
        }}
        onClick={onBack}
      >
        x
      </button>
      <Canvas camera={{ position: [0, 20, 40], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={false} />

        <Layer data={mediaData.slice(0, 6)} radius={10} rotationSpeed={0.1} height={0} />
        <Layer data={mediaData.slice(6, 12)} radius={8} rotationSpeed={0.2} height={4} />
        <Layer data={mediaData.slice(12, 16)} radius={6} rotationSpeed={0.3} height={8} />
        <Layer data={mediaData.slice(16, 19)} radius={4} rotationSpeed={0.4} height={12} />
      </Canvas>
    </div>
  );
};

export default MediaPage;