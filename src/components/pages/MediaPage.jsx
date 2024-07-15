import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const dummyData = [
  { type: 'image', url: '/media/photo-1506748686214-e9df14d4d9d0?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'image', url: '/media/photo-1516117172878-fd2c41f4a759?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'image', url: '/media/photo-1533227268428-e9a1c7fb5a83?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'image', url: '/media/photo-1503023345310-bd7c1de61c7d?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'image', url: '/media/photo-1516275461783-d98497e6cf44?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' },
  { type: 'image', url: '/media/photo-1489587029467-5e19e4e3673e?fit=crop&w=300&h=200&q=80' },
  { type: 'video', url: '/video/mov_bbb.mp4' }
];

// www.w3schools.com/html/video/mov_bbb.mp4

const MediaBox = ({ url, type }) => {
  const meshRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (type === 'video') {
      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'Anonymous';
      video.loop = true;
      video.muted = true;
      video.play();
      videoRef.current = video;

      const videoTexture = new THREE.VideoTexture(video);
      meshRef.current.material.map = videoTexture;
      meshRef.current.material.needsUpdate = true;
    } else {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        meshRef.current.material.map = texture;
        meshRef.current.material.needsUpdate = true;
      });
    }
  }, [url, type]);

  useFrame(() => {
    if (videoRef.current) {
      const videoTexture = meshRef.current.material.map;
      if (videoTexture) videoTexture.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[3, 2, 0.1]} />
      <meshBasicMaterial />
    </mesh>
  );
};

const Layer = ({ data, radius, rotationSpeed, height }) => {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    groupRef.current.rotation.y += rotationSpeed * delta;
  });

  const angleStep = (2 * Math.PI) / data.length;
  
  return (
    <group ref={groupRef} position={[0, height, 0]}>
      {data.map((item, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        return (
          <group key={index} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <MediaBox url={item.url} type={item.type} />
          </group>
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