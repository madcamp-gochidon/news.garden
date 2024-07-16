import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import axios from 'axios';

const getExtendedData = (data, count) => {
  const extendedData = [...data];
  while (extendedData.length < count) {
    const randomIndex = Math.floor(Math.random() * data.length);
    extendedData.push(data[randomIndex]);
  }
  return extendedData;
};

const MediaBox = ({ url, type, group }) => {
  const objectRef = useRef();

  useEffect(() => {
    if (!group) return;

    const div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    const iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';

    if (type === 'youtube') {
      iframe.src = `https://www.youtube.com/embed/${url}?rel=0&autoplay=1`;
    } else if (type === 'video') {
      iframe.src = url;
    } else {
      iframe.src = url;
    }

    div.appendChild(iframe);

    const object = new CSS3DObject(div);
    group.add(object);
    objectRef.current = object;

    return () => {
      group.remove(object);
    };
  }, [url, type, group]);

  return null;
};

const Layer = ({ data, radius, rotationSpeed, height }) => {
  const groupRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (groupRef.current) {
      scene.add(groupRef.current);
      return () => {
        scene.remove(groupRef.current);
      };
    }
  }, [scene]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * rotationSpeed;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const itemAngle = index * (2 * Math.PI / data.length) + angle;
        const x = radius * Math.cos(itemAngle);
        const z = radius * Math.sin(itemAngle);
        const y = height;
        child.position.set(x, y, z);
        child.rotation.set(0, -itemAngle + Math.PI / 2, 0);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {groupRef.current && data.map((item, index) => (
        <MediaBox
          key={index}
          url={item.url}
          type={item.type}
          group={groupRef.current}
        />
      ))}
    </group>
  );
};

const CSS3DRendererComponent = () => {
  const rendererRef = useRef();
  const { scene, camera, gl, size } = useThree();

  useEffect(() => {
    if (!scene || !camera) {
      console.log("No scene or camera found");
      return;
    }

    const renderer = new CSS3DRenderer();
    renderer.setSize(size.width, size.height);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.zIndex = 1;
    document.getElementById('css3d-container').appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const render = () => {
      renderer.render(scene, camera);
    };

    gl.setAnimationLoop(render);

    return () => {
      gl.setAnimationLoop(null);
      if (document.getElementById('css3d-container')) {
        document.getElementById('css3d-container').removeChild(renderer.domElement);
      }
    };
  }, [gl, scene, camera, size]);

  return null;
};

const MediaPage = ({ countryData, onBack }) => {
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await axios.get(`http://13.124.216.160:3000/api/get_video_ids/${countryData.properties.iso_a2}`);
        const videoData = response.data.map(id => ({ type: 'youtube', url: id }));
        setMediaData(getExtendedData(videoData, 36));
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    fetchMediaData();
  }, [countryData]);

  const CameraSetup = () => {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(-431.3940708246844, -261.9332732513346, 343.39226925342376);
      camera.rotation.set(0.651631214980874, -0.7848259495328591, 0.49440462095593685);
    }, [camera]);

    useFrame(() => {
      console.log(`Camera Position: ${camera.position.x}, ${camera.position.y}, ${camera.position.z}`);
      console.log(`Camera Rotation: ${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}`);
    }, [camera]);

    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '30px',
          cursor: 'pointer',
          zIndex: 2,
        }}
        onClick={onBack}
      >
        x
      </button>
      <div id="css3d-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
      <Canvas>
        <CameraSetup />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableRotate={true} maxPolarAngle={Math.PI} minPolarAngle={0} />
        <CSS3DRendererComponent />
        <Layer data={mediaData.slice(0, 9)} radius={1600} rotationSpeed={0.1} height={0} />
        <Layer data={mediaData.slice(9, 18)} radius={1400} rotationSpeed={0.2} height={500} />
        <Layer data={mediaData.slice(18, 27)} radius={1200} rotationSpeed={0.3} height={1000} />
        <Layer data={mediaData.slice(27, 36)} radius={1000} rotationSpeed={0.4} height={1500} />
      </Canvas>
    </div>
  );
};

export default MediaPage;