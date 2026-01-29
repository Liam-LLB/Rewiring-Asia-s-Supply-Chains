import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

// Real cities with accurate coordinates
const majorCities = {
  singapore: { name: "Singapore", lat: 1.3521, lng: 103.8198, color: "#ef4444", description: "Financial Hub & Tech Center" },
  johorBahru: { name: "Johor Bahru", lat: 1.4927, lng: 103.7414, color: "#3b82f6", description: "JS-SEZ Partner" },
  kualaLumpur: { name: "Kuala Lumpur", lat: 3.1390, lng: 101.6869, color: "#8b5cf6", description: "Capital of Malaysia" },
  bangkok: { name: "Bangkok", lat: 13.7563, lng: 100.5018, color: "#f59e0b", description: "Thailand's Capital" },
  jakarta: { name: "Jakarta", lat: -6.2088, lng: 106.8456, color: "#10b981", description: "Indonesia's Capital" },
  manila: { name: "Manila", lat: 14.5995, lng: 120.9842, color: "#ec4899", description: "Philippines Capital" },
  hoChiMinh: { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, color: "#06b6d4", description: "Vietnam's Economic Center" },
  hanoi: { name: "Hanoi", lat: 21.0285, lng: 105.8542, color: "#14b8a6", description: "Vietnam's Capital" },
  tokyo: { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: "#f43f5e", description: "Japan's Capital" },
  shanghai: { name: "Shanghai", lat: 31.2304, lng: 121.4737, color: "#eab308", description: "China's Financial Hub" },
  hongKong: { name: "Hong Kong", lat: 22.3193, lng: 114.1694, color: "#a855f7", description: "Special Admin Region" },
  shenzhen: { name: "Shenzhen", lat: 22.5431, lng: 114.0579, color: "#6366f1", description: "Tech Manufacturing Hub" },
  seoul: { name: "Seoul", lat: 37.5665, lng: 126.9780, color: "#0ea5e9", description: "South Korea's Capital" },
  taipei: { name: "Taipei", lat: 25.0330, lng: 121.5654, color: "#84cc16", description: "Taiwan's Capital" },
  newYork: { name: "New York", lat: 40.7128, lng: -74.0060, color: "#3b82f6", description: "US Financial Hub" },
  london: { name: "London", lat: 51.5074, lng: -0.1278, color: "#6366f1", description: "UK Financial Hub" },
  dubai: { name: "Dubai", lat: 25.2048, lng: 55.2708, color: "#f97316", description: "UAE Trade Hub" },
  sydney: { name: "Sydney", lat: -33.8688, lng: 151.2093, color: "#22c55e", description: "Australia's Largest City" },
};

// Convert latitude/longitude to 3D position on sphere
function latLngToVector3(lat, lng, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// Create highly detailed Earth texture with realistic appearance
function createRealisticEarthTexture() {
  const canvas = document.createElement('canvas');
  const width = 4096;
  const height = 2048;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep ocean base with realistic color
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, height);
  oceanGradient.addColorStop(0, '#0a3d62');
  oceanGradient.addColorStop(0.25, '#0c4a70');
  oceanGradient.addColorStop(0.5, '#0e527a');
  oceanGradient.addColorStop(0.75, '#0c4a70');
  oceanGradient.addColorStop(1, '#0a3d62');
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, width, height);

  // Add ocean depth variations
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 8 + 2;
    const alpha = Math.random() * 0.15;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(8, 60, 90, ${alpha})` : `rgba(15, 75, 105, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Helper function to convert geo coordinates to canvas coordinates
  const geoToCanvas = (lng, lat) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // Draw landmass with shading
  const drawLandmass = (coords, baseColor, highlightColor, shadowColor) => {
    // Main fill
    ctx.beginPath();
    const [startX, startY] = geoToCanvas(coords[0][0], coords[0][1]);
    ctx.moveTo(startX, startY);
    for (let i = 1; i < coords.length; i++) {
      const [x, y] = geoToCanvas(coords[i][0], coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill for 3D effect
    const gradient = ctx.createLinearGradient(startX, startY - 50, startX, startY + 100);
    gradient.addColorStop(0, highlightColor);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, shadowColor);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(40, 80, 60, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Continent coordinates (longitude, latitude) - more accurate shapes

  // North America
  const northAmerica = [
    [-170, 65], [-168, 58], [-155, 58], [-140, 60], [-130, 55],
    [-125, 50], [-124, 45], [-117, 35], [-110, 30], [-105, 25],
    [-100, 25], [-97, 26], [-97, 22], [-90, 20], [-87, 18],
    [-83, 10], [-80, 8], [-77, 8], [-82, 15], [-83, 22],
    [-80, 25], [-82, 28], [-80, 32], [-75, 36], [-70, 42],
    [-67, 45], [-65, 47], [-60, 47], [-55, 52], [-58, 55],
    [-65, 60], [-73, 65], [-85, 70], [-95, 73], [-110, 73],
    [-125, 72], [-140, 70], [-155, 68], [-165, 67], [-170, 65]
  ];
  drawLandmass(northAmerica, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Greenland
  const greenland = [
    [-45, 60], [-42, 65], [-35, 72], [-25, 78], [-20, 82],
    [-30, 83], [-45, 82], [-55, 78], [-60, 72], [-55, 65],
    [-50, 60], [-45, 60]
  ];
  drawLandmass(greenland, '#4a7a5a', '#5a9a6a', '#3a6a4a');

  // South America
  const southAmerica = [
    [-80, 10], [-77, 8], [-73, 5], [-70, 3], [-60, 5],
    [-52, 3], [-45, 0], [-40, -3], [-35, -8], [-35, -15],
    [-38, -18], [-42, -22], [-48, -25], [-53, -30], [-58, -35],
    [-63, -40], [-65, -50], [-68, -55], [-72, -52], [-72, -45],
    [-70, -40], [-72, -30], [-70, -20], [-75, -15], [-78, -5],
    [-78, 0], [-80, 5], [-80, 10]
  ];
  drawLandmass(southAmerica, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Europe
  const europe = [
    [-10, 58], [-8, 62], [0, 60], [10, 58], [20, 55],
    [28, 58], [35, 60], [45, 65], [55, 68], [65, 67],
    [70, 62], [60, 55], [50, 52], [40, 48], [35, 42],
    [28, 38], [22, 36], [18, 38], [12, 38], [8, 42],
    [5, 45], [2, 48], [-4, 48], [-8, 50], [-10, 55], [-10, 58]
  ];
  drawLandmass(europe, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Africa
  const africa = [
    [-15, 35], [-12, 32], [-5, 36], [10, 37], [12, 33],
    [25, 32], [32, 30], [35, 28], [38, 22], [42, 15],
    [48, 10], [52, 12], [48, 5], [42, -2], [40, -10],
    [38, -18], [35, -25], [28, -33], [22, -35], [18, -32],
    [15, -28], [14, -22], [12, -15], [15, -8], [12, 0],
    [8, 5], [3, 6], [-5, 5], [-10, 8], [-15, 12],
    [-17, 18], [-17, 22], [-13, 28], [-15, 35]
  ];
  drawLandmass(africa, '#3d6a4d', '#4d8a5d', '#2d5a3d');

  // Middle East
  const middleEast = [
    [35, 42], [42, 38], [50, 38], [55, 35], [60, 30],
    [65, 25], [60, 20], [55, 15], [50, 12], [45, 15],
    [40, 20], [35, 28], [35, 35], [35, 42]
  ];
  drawLandmass(middleEast, '#5a7a5a', '#6a9a6a', '#4a6a4a');

  // Russia / North Asia
  const russia = [
    [28, 58], [40, 55], [55, 55], [70, 55], [85, 52],
    [100, 50], [120, 52], [140, 55], [155, 60], [170, 65],
    [180, 68], [180, 75], [160, 78], [140, 77], [120, 75],
    [100, 75], [80, 73], [60, 70], [45, 68], [35, 62],
    [28, 58]
  ];
  drawLandmass(russia, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Central & South Asia
  const centralAsia = [
    [55, 55], [70, 55], [85, 50], [90, 45], [80, 38],
    [75, 35], [70, 35], [65, 38], [60, 42], [55, 50],
    [55, 55]
  ];
  drawLandmass(centralAsia, '#4a6a4a', '#5a8a5a', '#3a5a3a');

  // India
  const india = [
    [68, 35], [73, 33], [78, 35], [85, 28], [90, 26],
    [92, 22], [88, 22], [85, 18], [80, 12], [77, 8],
    [75, 10], [72, 18], [68, 23], [68, 30], [68, 35]
  ];
  drawLandmass(india, '#3d6a4d', '#4d8a5d', '#2d5a3d');

  // Southeast Asia mainland - highlighted
  const seAsiaMainland = [
    [92, 28], [98, 26], [100, 22], [102, 18], [103, 14],
    [104, 10], [106, 8], [108, 10], [108, 16], [106, 21],
    [103, 23], [100, 26], [95, 28], [92, 28]
  ];
  drawLandmass(seAsiaMainland, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Malaysia Peninsula - highlighted
  const malaysiaPeninsula = [
    [100, 7], [101, 6], [103, 5], [104, 3], [104, 1.5],
    [103.5, 1.2], [102, 1.5], [101, 2.5], [100, 4], [100, 7]
  ];
  drawLandmass(malaysiaPeninsula, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Borneo - highlighted
  const borneo = [
    [109, 7], [114, 7], [118, 5], [119, 2], [117, -1],
    [115, -4], [112, -3], [109, -1], [109, 3], [110, 5], [109, 7]
  ];
  drawLandmass(borneo, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Sumatra - highlighted
  const sumatra = [
    [95, 5.5], [97, 4], [100, 1], [103, -2], [106, -6],
    [104, -6], [101, -3], [98, 0], [96, 2], [95, 4], [95, 5.5]
  ];
  drawLandmass(sumatra, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Java
  const java = [
    [105, -6], [108, -6.5], [111, -7], [114, -7.5], [115, -8.2],
    [113, -8.5], [109, -8], [106, -7], [105, -6]
  ];
  drawLandmass(java, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Philippines - highlighted
  const philippines = [
    [117, 6], [119, 8], [121, 10], [123, 13], [125, 16],
    [124, 18], [122, 18], [120, 16], [119, 13], [118, 10],
    [117, 8], [117, 6]
  ];
  drawLandmass(philippines, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // China
  const china = [
    [85, 50], [95, 45], [105, 42], [115, 40], [122, 42],
    [128, 45], [135, 48], [135, 42], [127, 38], [122, 35],
    [118, 30], [115, 25], [110, 22], [108, 20], [106, 22],
    [103, 23], [100, 26], [95, 28], [85, 35], [80, 38],
    [85, 50]
  ];
  drawLandmass(china, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Japan
  const japan = [
    [130, 31], [132, 34], [135, 35], [137, 36], [140, 38],
    [141, 42], [145, 45], [145, 42], [142, 38], [140, 35],
    [138, 33], [134, 33], [130, 31]
  ];
  drawLandmass(japan, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Korea
  const korea = [
    [126, 34], [127, 36], [129, 38], [130, 40], [128, 42],
    [125, 40], [124, 37], [126, 34]
  ];
  drawLandmass(korea, '#2d5a3d', '#3d7a4d', '#1d4a2d');

  // Taiwan
  const taiwan = [
    [120, 22], [121, 23], [122, 25], [121.5, 25.5], [120, 24], [120, 22]
  ];
  drawLandmass(taiwan, '#3a8a5a', '#4aaa6a', '#2a7a4a');

  // Australia
  const australia = [
    [113, -22], [117, -20], [123, -17], [130, -12], [137, -12],
    [142, -11], [145, -15], [149, -20], [153, -27], [151, -34],
    [145, -39], [140, -38], [135, -35], [130, -32], [125, -34],
    [120, -34], [116, -33], [114, -28], [113, -24], [113, -22]
  ];
  drawLandmass(australia, '#4d6a4d', '#5d8a5d', '#3d5a3d');

  // New Zealand
  const nzNorth = [
    [173, -35], [175, -37], [178, -38], [177, -40], [175, -41], [173, -39], [173, -35]
  ];
  const nzSouth = [
    [168, -44], [170, -43], [174, -42], [173, -44], [171, -46], [167, -46], [168, -44]
  ];
  drawLandmass(nzNorth, '#3d6a4d', '#4d8a5d', '#2d5a3d');
  drawLandmass(nzSouth, '#3d6a4d', '#4d8a5d', '#2d5a3d');

  // Add terrain texture noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3 + 1;
    ctx.fillStyle = `rgba(40, 80, 50, ${Math.random() * 0.15})`;
    ctx.fillRect(x, y, size, size);
  }

  // Add subtle grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 0.5;

  // Longitude lines every 30 degrees
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Latitude lines every 30 degrees
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Equator (more visible)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// City marker component
function CityMarker({ city, position, isHighlighted, onClick }) {
  const markerRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = (hovered || isHighlighted) ? 1.8 : 1;
      markerRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  const normal = position.clone().normalize();

  return (
    <group position={position}>
      {/* Main marker */}
      <mesh
        ref={markerRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick && onClick(city)}
      >
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color={city.color} />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={city.color} transparent opacity={0.4} />
      </mesh>

      {/* Pulsing ring */}
      <mesh ref={ringRef} lookAt={normal.multiplyScalar(5)}>
        <ringGeometry args={[0.04, 0.055, 32]} />
        <meshBasicMaterial color={city.color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Label on hover */}
      {(hovered || isHighlighted) && (
        <Html position={[0.08, 0.08, 0]} distanceFactor={3.5}>
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap border border-slate-600/50 shadow-xl">
            <div className="font-bold text-base" style={{ color: city.color }}>{city.name}</div>
            <div className="text-slate-400 text-xs mt-1">{city.description}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection arc between cities
function ConnectionArc({ startCity, endCity, color = "#fbbf24" }) {
  const particleRef = useRef();

  const start = useMemo(() => latLngToVector3(startCity.lat, startCity.lng, 2.02), [startCity]);
  const end = useMemo(() => latLngToVector3(endCity.lat, endCity.lng, 2.02), [endCity]);

  const curve = useMemo(() => {
    const midPoint = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    midPoint.normalize().multiplyScalar(2 + distance * 0.25);
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(60), [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * 0.12) % 1;
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.35} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Main Earth component
function Earth({ highlightedCity, onCityClick, showConnections = true, autoRotate = true }) {
  const earthRef = useRef();
  const atmosphereRef = useRef();

  const earthTexture = useMemo(() => createRealisticEarthTexture(), []);

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.03;
    }
  });

  // City positions
  const cityPositions = useMemo(() => {
    const positions = {};
    Object.entries(majorCities).forEach(([key, city]) => {
      positions[key] = latLngToVector3(city.lat, city.lng, 2.03);
    });
    return positions;
  }, []);

  // Trade connections centered on Singapore
  const connections = [
    { from: 'singapore', to: 'johorBahru', color: '#10b981' },
    { from: 'singapore', to: 'kualaLumpur', color: '#8b5cf6' },
    { from: 'singapore', to: 'jakarta', color: '#f59e0b' },
    { from: 'singapore', to: 'bangkok', color: '#06b6d4' },
    { from: 'singapore', to: 'hoChiMinh', color: '#ec4899' },
    { from: 'singapore', to: 'manila', color: '#f43f5e' },
    { from: 'singapore', to: 'hongKong', color: '#a855f7' },
    { from: 'singapore', to: 'shanghai', color: '#eab308' },
    { from: 'singapore', to: 'tokyo', color: '#3b82f6' },
    { from: 'singapore', to: 'dubai', color: '#f97316' },
    { from: 'singapore', to: 'sydney', color: '#22c55e' },
  ];

  return (
    <group ref={earthRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* Inner atmosphere */}
      <mesh ref={atmosphereRef} scale={1.015}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh scale={1.06}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#1e90ff"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* City markers */}
      {Object.entries(majorCities).map(([key, city]) => (
        <CityMarker
          key={key}
          city={city}
          position={cityPositions[key]}
          isHighlighted={highlightedCity === key}
          onClick={onCityClick}
        />
      ))}

      {/* Trade connections */}
      {showConnections && connections.map((conn, i) => (
        <ConnectionArc
          key={i}
          startCity={majorCities[conn.from]}
          endCity={majorCities[conn.to]}
          color={conn.color}
        />
      ))}
    </group>
  );
}

export default function RealGlobe({
  height = "500px",
  className = "",
  showStars = true,
  autoRotate = true,
  onCityClick,
  highlightedCity = null,
  showConnections = true
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, 5, -10]} intensity={0.2} color="#4da6ff" />

        {showStars && (
          <Stars
            radius={150}
            depth={60}
            count={4000}
            factor={5}
            fade
            speed={0.5}
          />
        )}

        <Earth
          highlightedCity={highlightedCity}
          onCityClick={onCityClick}
          showConnections={showConnections}
          autoRotate={autoRotate}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={10}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
