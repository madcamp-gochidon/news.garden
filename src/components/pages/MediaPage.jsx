import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

const dummyData = [
  { type: 'image', url: '/media/photo-1506748686214-e9df14d4d9d0?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'youtube', url: 'SJOz3qjfQXU' }, // YouTube video ID
  { type: 'image', url: '/media/photo-1516117172878-fd2c41f4a759?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'youtube', url: 'Y2-xZ-1HE-Q' }, // YouTube video ID
];

const getExtendedData = (data, count) => {
  const extendedData = [...data];
  while (extendedData.length < count) {
    const randomIndex = Math.floor(Math.random() * data.length);
    extendedData.push(data[randomIndex]);
  }
  return extendedData;
};

const extendedData = getExtendedData(dummyData, 54);

const MediaBox = ({ url, type, position, rotation }) => {
  const { scene } = useThree();
  const objectRef = useRef();

  useEffect(() => {
    const div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    const iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';

    if (type === 'youtube') {
      iframe.src = `https://www.youtube.com/embed/${url}?rel=0&autoplay=1&mute=1`;
    } else if (type === 'video') {
      iframe.src = url;
    } else {
      iframe.src = url;
    }

    div.appendChild(iframe);

    const object = new CSS3DObject(div);
    object.position.set(position.x, position.y, position.z);
    object.rotation.set(rotation.x, rotation.y, rotation.z);

    scene.add(object);
    objectRef.current = object;

    return () => {
      scene.remove(object);
    };
  }, [url, type, position, rotation, scene]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * 0.1;
    objectRef.current.position.set(
      position.x * Math.cos(angle) - position.z * Math.sin(angle),
      position.y,
      position.x * Math.sin(angle) + position.z * Math.cos(angle)
    );
    objectRef.current.rotation.set(
      0, 
      rotation.y - angle, 
      0,
    );
  });

  return null;
};

const Layer = ({ data, radius, rotationSpeed, height }) => {
  const groupRef = useRef();

  // useFrame(() => {
  //   const elapsedTime = performance.now() * 0.001;
  //   const angle = elapsedTime * rotationSpeed;
  //   groupRef.current.children.forEach((child, index) => {
  //     const itemAngle = index * (2 * Math.PI / data.length) + angle;
  //     const x = radius * Math.cos(itemAngle);
  //     const z = radius * Math.sin(itemAngle);
  //     child.position.set(x, height, z);
  //     child.rotation.y = -itemAngle;
  //   });
  // });

  return (
    <group ref={groupRef}>
      {data.map((item, index) => (
        <MediaBox
          key={index}
          url={item.url}
          type={item.type}
          position={{ x: radius * Math.cos(index * (2 * Math.PI / data.length)), y: height, z: radius * Math.sin(index * (2 * Math.PI / data.length)) }}
          rotation={{ x: 0, y: Math.PI / 2 -index * (2 * Math.PI / data.length), z: 0 }}
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
    // Replace with actual API call
    // axios.get(`/api/media/${countryData.properties.code}`)
    //   .then(response => {
    //     setMediaData(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching media data:', error);
    //   });

    setMediaData(extendedData);
  }, [countryData]);

  const CameraSetup = () => {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(0, 3000, 4000);
      camera.lookAt(0, 0, 0);
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
        <OrbitControls enablePan={false} enableRotate={true} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
        <CSS3DRendererComponent />
        <Layer data={mediaData.slice(0, 6)} radius={2600} rotationSpeed={0.1} height={0} />
        <Layer data={mediaData.slice(6, 12)} radius={2400} rotationSpeed={0.2} height={500} />
        <Layer data={mediaData.slice(12, 18)} radius={2200} rotationSpeed={0.3} height={1000} />
        <Layer data={mediaData.slice(18, 24)} radius={2000} rotationSpeed={0.4} height={1500} />
        <Layer data={mediaData.slice(24, 30)} radius={1800} rotationSpeed={0.5} height={2000} />
        <Layer data={mediaData.slice(30, 36)} radius={1600} rotationSpeed={0.5} height={2500} />
        <Layer data={mediaData.slice(36, 42)} radius={1400} rotationSpeed={0.5} height={3000} />
        <Layer data={mediaData.slice(42, 48)} radius={1200} rotationSpeed={0.5} height={3500} />
        <Layer data={mediaData.slice(48, 54)} radius={1000} rotationSpeed={0.5} height={4000} />
      </Canvas>
    </div>
  );
};

export default MediaPage;