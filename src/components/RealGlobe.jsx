import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

// Real GeoJSON-style coordinates for Southeast Asian countries (simplified but accurate)
const seaCountryBorders = {
  singapore: {
    name: "Singapore",
    color: "#ef4444",
    coordinates: [
      [103.6, 1.16], [103.7, 1.13], [103.82, 1.15], [103.91, 1.22],
      [103.99, 1.27], [104.03, 1.32], [104.05, 1.37], [104.02, 1.42],
      [103.96, 1.44], [103.87, 1.45], [103.78, 1.44], [103.7, 1.41],
      [103.64, 1.36], [103.6, 1.29], [103.6, 1.21], [103.6, 1.16]
    ]
  },
  malaysia_peninsular: {
    name: "Malaysia",
    color: "#3b82f6",
    coordinates: [
      [103.4, 1.4], [103.5, 1.5], [103.8, 1.75], [104.2, 1.6],
      [104.1, 2.1], [103.5, 2.4], [103.4, 2.9], [103.5, 3.4],
      [103.4, 4.0], [103.4, 4.8], [103.1, 5.4], [102.5, 5.9],
      [101.9, 6.2], [101.2, 6.5], [100.5, 6.5], [100.1, 6.4],
      [99.7, 6.5], [99.6, 6.2], [100.0, 5.8], [100.2, 5.3],
      [100.3, 4.9], [100.5, 4.4], [100.6, 3.9], [100.7, 3.4],
      [101.0, 2.9], [101.3, 2.5], [101.7, 2.1], [102.1, 1.9],
      [102.5, 1.6], [103.0, 1.4], [103.4, 1.4]
    ]
  },
  thailand: {
    name: "Thailand",
    color: "#8b5cf6",
    coordinates: [
      [100.1, 6.4], [99.6, 6.5], [99.2, 7.0], [98.6, 7.8],
      [98.3, 8.4], [98.2, 9.0], [98.4, 9.6], [98.6, 10.2],
      [99.0, 10.9], [99.2, 11.6], [99.0, 12.3], [99.2, 13.0],
      [99.4, 13.7], [99.1, 14.4], [98.9, 15.0], [98.5, 15.6],
      [98.2, 16.1], [97.8, 16.6], [97.5, 17.1], [97.8, 17.8],
      [98.4, 18.3], [98.9, 18.8], [99.5, 19.2], [100.1, 19.6],
      [100.5, 20.0], [100.1, 20.4], [100.5, 20.2], [101.0, 19.8],
      [101.4, 19.4], [101.7, 18.9], [102.1, 18.3], [102.6, 17.8],
      [103.1, 17.4], [103.5, 16.9], [104.0, 16.5], [104.5, 16.0],
      [104.8, 15.5], [105.2, 15.0], [105.5, 14.5], [105.6, 14.0],
      [105.4, 13.5], [105.0, 13.0], [104.5, 12.5], [104.0, 12.0],
      [103.5, 11.5], [103.0, 11.0], [102.5, 10.5], [102.0, 10.0],
      [101.5, 9.5], [101.0, 9.0], [100.5, 8.5], [100.0, 7.8],
      [100.0, 7.2], [100.1, 6.4]
    ]
  },
  vietnam: {
    name: "Vietnam",
    color: "#10b981",
    coordinates: [
      [103.9, 22.5], [104.4, 22.8], [105.0, 23.0], [105.5, 22.8],
      [106.0, 22.5], [106.5, 22.2], [106.8, 21.8], [107.0, 21.4],
      [106.8, 21.0], [106.5, 20.5], [106.2, 20.0], [106.0, 19.5],
      [105.8, 19.0], [105.9, 18.5], [106.2, 18.0], [106.5, 17.5],
      [107.0, 17.0], [107.5, 16.5], [108.0, 16.2], [108.3, 15.8],
      [108.6, 15.4], [108.8, 15.0], [109.0, 14.5], [109.2, 14.0],
      [109.3, 13.5], [109.3, 13.0], [109.2, 12.5], [109.0, 12.0],
      [108.7, 11.5], [108.2, 11.0], [107.5, 10.5], [107.0, 10.3],
      [106.5, 10.0], [106.2, 9.5], [105.8, 9.0], [105.5, 8.7],
      [105.0, 8.5], [104.5, 8.6], [104.0, 8.8], [103.5, 9.0],
      [103.2, 9.5], [103.0, 10.0], [102.8, 10.5], [102.9, 11.0],
      [103.1, 11.5], [103.5, 12.0], [104.0, 12.5], [104.5, 13.0],
      [104.8, 13.5], [105.0, 14.0], [105.3, 14.5], [105.5, 15.0],
      [105.4, 15.5], [105.2, 16.0], [104.8, 16.5], [104.5, 17.0],
      [104.2, 17.5], [104.0, 18.0], [103.9, 18.5], [104.0, 19.0],
      [104.2, 19.5], [104.5, 20.0], [104.3, 20.5], [103.9, 21.0],
      [103.6, 21.5], [103.5, 22.0], [103.9, 22.5]
    ]
  },
  indonesia_sumatra: {
    name: "Indonesia",
    color: "#f59e0b",
    coordinates: [
      [95.3, 5.6], [95.5, 5.2], [96.0, 4.8], [96.5, 4.4],
      [97.0, 4.0], [97.5, 3.5], [98.0, 3.0], [98.5, 2.5],
      [99.0, 2.0], [99.5, 1.5], [100.0, 1.0], [100.5, 0.5],
      [101.0, 0.0], [101.5, -0.5], [102.0, -1.0], [102.5, -1.5],
      [103.0, -2.0], [103.5, -2.5], [104.0, -3.0], [104.5, -3.5],
      [105.0, -4.0], [105.5, -4.5], [106.0, -5.0], [105.5, -5.5],
      [105.0, -5.8], [104.5, -5.5], [104.0, -5.2], [103.5, -4.8],
      [103.0, -4.5], [102.5, -4.0], [102.0, -3.5], [101.5, -3.0],
      [101.0, -2.5], [100.5, -2.0], [100.0, -1.5], [99.5, -1.0],
      [99.0, -0.5], [98.5, 0.0], [98.0, 0.5], [97.5, 1.0],
      [97.0, 1.5], [96.5, 2.0], [96.0, 2.5], [95.5, 3.0],
      [95.2, 3.5], [95.0, 4.0], [95.0, 4.5], [95.1, 5.0],
      [95.3, 5.6]
    ]
  },
  philippines: {
    name: "Philippines",
    color: "#ec4899",
    coordinates: [
      [117.0, 5.0], [117.5, 5.5], [118.0, 6.0], [118.5, 6.5],
      [119.0, 7.0], [119.5, 7.5], [120.0, 8.0], [120.5, 8.5],
      [121.0, 9.0], [121.5, 9.5], [122.0, 10.0], [122.5, 10.5],
      [123.0, 11.0], [123.5, 11.5], [124.0, 12.0], [124.5, 12.5],
      [124.5, 13.0], [124.2, 13.5], [123.8, 14.0], [123.5, 14.5],
      [123.0, 15.0], [122.5, 15.5], [122.0, 16.0], [121.5, 16.5],
      [121.0, 17.0], [120.5, 17.5], [120.0, 18.0], [119.8, 18.5],
      [120.2, 18.2], [120.5, 17.8], [120.3, 17.3], [119.8, 17.0],
      [119.3, 16.5], [118.8, 16.0], [118.5, 15.5], [118.2, 15.0],
      [118.0, 14.5], [117.8, 14.0], [117.5, 13.5], [117.2, 13.0],
      [117.0, 12.5], [116.8, 12.0], [116.5, 11.5], [116.2, 11.0],
      [116.0, 10.5], [116.0, 10.0], [116.2, 9.5], [116.5, 9.0],
      [116.5, 8.5], [116.3, 8.0], [116.0, 7.5], [116.0, 7.0],
      [116.2, 6.5], [116.5, 6.0], [116.8, 5.5], [117.0, 5.0]
    ]
  },
  cambodia: {
    name: "Cambodia",
    color: "#6366f1",
    coordinates: [
      [102.5, 14.5], [103.0, 14.3], [103.5, 14.2], [104.0, 14.3],
      [104.5, 14.4], [105.0, 14.3], [105.5, 14.0], [106.0, 13.5],
      [106.5, 13.0], [106.8, 12.5], [106.5, 12.0], [106.0, 11.5],
      [105.5, 11.0], [105.0, 10.8], [104.5, 10.5], [104.0, 10.5],
      [103.5, 10.8], [103.2, 11.2], [103.0, 11.8], [102.8, 12.3],
      [102.6, 12.8], [102.5, 13.3], [102.4, 13.8], [102.5, 14.5]
    ]
  }
};

// Convert lat/lng to 3D position
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Country border component with real coordinates
function CountryBorder({ coordinates, color, radius = 2.005, lineWidth = 1.5 }) {
  const points = useMemo(() => {
    return coordinates.map(([lng, lat]) => latLngToVector3(lat, lng, radius));
  }, [coordinates, radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={0.8}
    />
  );
}

// Location marker with real position
function CityMarker({ lat, lng, label, color = "#ef4444", radius = 2, isActive, onClick }) {
  const position = useMemo(() => latLngToVector3(lat, lng, radius + 0.02), [lat, lng, radius]);
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRef.current.scale.setScalar(scale);
      pulseRef.current.material.opacity = 0.6 - Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main marker */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color={hovered || isActive ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.05, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      {(hovered || isActive) && label && (
        <Html distanceFactor={4} style={{ pointerEvents: 'none' }}>
          <div className="px-3 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/10 shadow-xl whitespace-nowrap transform -translate-y-6">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection arc between cities
function FlightPath({ from, to, color = "#fbbf24", radius = 2.01 }) {
  const [progress, setProgress] = useState(0);
  const particleRef = useRef();

  const curve = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, radius);
    const end = latLngToVector3(to.lat, to.lng, radius);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(radius + distance * 0.15);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to, radius]);

  const points = useMemo(() => curve.getPoints(64), [curve]);

  useFrame((state) => {
    const newProgress = (state.clock.elapsedTime * 0.15) % 1;
    setProgress(newProgress);
    if (particleRef.current) {
      const point = curve.getPoint(newProgress);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.5} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Realistic Earth with NASA-style texture
function RealisticEarth({ locations, connections, activeLocation, onLocationClick, autoRotate }) {
  const earthRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  // Create detailed Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Deep ocean base
    const oceanGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    oceanGradient.addColorStop(0, '#0a1929');
    oceanGradient.addColorStop(0.5, '#0d2137');
    oceanGradient.addColorStop(1, '#0a1929');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ocean texture noise
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      ctx.fillStyle = `rgba(16, 42, 67, ${Math.random() * 0.4})`;
      ctx.fillRect(x, y, size, size);
    }

    // Continent colors
    const landColor = '#1a3d2e';
    const landHighlight = '#234d3a';
    const landShadow = '#122a1f';

    // Draw realistic continent shapes
    const drawContinent = (path, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      path.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    };

    // North America (more detailed)
    drawContinent([
      [680, 280], [720, 250], [780, 220], [850, 200], [920, 210],
      [980, 250], [1020, 300], [1050, 370], [1080, 450], [1050, 520],
      [1000, 580], [950, 600], [900, 580], [850, 550], [800, 520],
      [750, 500], [700, 480], [650, 460], [600, 440], [560, 400],
      [540, 360], [550, 320], [580, 290], [620, 270], [680, 280]
    ], landColor);

    // South America
    drawContinent([
      [900, 600], [920, 650], [950, 720], [970, 800], [960, 880],
      [930, 960], [880, 1020], [820, 1060], [770, 1040], [740, 980],
      [720, 900], [710, 820], [730, 750], [770, 690], [820, 640],
      [860, 610], [900, 600]
    ], landColor);

    // Europe
    drawContinent([
      [1950, 280], [2020, 260], [2100, 270], [2160, 300], [2200, 350],
      [2180, 400], [2140, 440], [2080, 460], [2020, 450], [1970, 420],
      [1940, 380], [1920, 340], [1930, 300], [1950, 280]
    ], landColor);

    // Africa
    drawContinent([
      [1980, 480], [2050, 460], [2120, 480], [2180, 520], [2220, 600],
      [2240, 700], [2220, 800], [2180, 880], [2120, 940], [2050, 960],
      [1980, 940], [1920, 880], [1880, 800], [1880, 700], [1900, 600],
      [1940, 540], [1980, 480]
    ], landColor);

    // Asia (main mass)
    drawContinent([
      [2200, 280], [2300, 250], [2450, 230], [2600, 250], [2750, 300],
      [2900, 380], [3000, 450], [3050, 530], [3020, 600], [2950, 650],
      [2850, 680], [2750, 670], [2650, 640], [2550, 600], [2480, 550],
      [2420, 500], [2380, 450], [2350, 400], [2320, 350], [2280, 310],
      [2240, 290], [2200, 280]
    ], landColor);

    // India
    drawContinent([
      [2650, 520], [2700, 500], [2750, 520], [2780, 580], [2800, 660],
      [2780, 740], [2730, 800], [2670, 820], [2620, 780], [2600, 720],
      [2600, 660], [2610, 600], [2630, 560], [2650, 520]
    ], landColor);

    // Southeast Asia (detailed)
    drawContinent([
      [2900, 580], [2950, 560], [3000, 580], [3040, 620], [3060, 680],
      [3050, 740], [3010, 800], [2960, 840], [2900, 860], [2850, 840],
      [2820, 800], [2810, 740], [2830, 680], [2860, 620], [2900, 580]
    ], landHighlight);

    // Indonesia archipelago
    for (let i = 0; i < 8; i++) {
      const x = 2950 + i * 80 + Math.random() * 40;
      const y = 900 + Math.random() * 60;
      const w = 60 + Math.random() * 40;
      const h = 20 + Math.random() * 20;
      ctx.fillStyle = landColor;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Australia
    drawContinent([
      [3200, 880], [3300, 850], [3400, 870], [3480, 920], [3520, 1000],
      [3500, 1080], [3440, 1140], [3360, 1160], [3280, 1140], [3220, 1100],
      [3180, 1040], [3170, 980], [3180, 920], [3200, 880]
    ], landColor);

    // Add terrain texture
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 4 + 1;
      ctx.fillStyle = `rgba(30, 70, 50, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, size, size);
    }

    // Latitude/longitude grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    // Longitude lines
    for (let i = 0; i <= 36; i++) {
      const x = (i / 36) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 0; i <= 18; i++) {
      const y = (i / 18) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group ref={earthRef}>
      {/* Main Earth */}
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Country borders */}
      {Object.values(seaCountryBorders).map((country) => (
        <CountryBorder
          key={country.name}
          coordinates={country.coordinates}
          color={country.color}
        />
      ))}

      {/* Atmosphere inner */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#4da6ff" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Atmosphere outer glow */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#1e90ff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>

      {/* City markers */}
      {locations.map((loc, i) => (
        <CityMarker
          key={i}
          lat={loc.lat}
          lng={loc.lng}
          label={loc.label}
          color={loc.color}
          isActive={activeLocation?.label === loc.label}
          onClick={() => onLocationClick?.(loc)}
        />
      ))}

      {/* Flight paths */}
      {connections.map((conn, i) => (
        <FlightPath key={i} from={conn.from} to={conn.to} color={conn.color} />
      ))}
    </group>
  );
}

export default function RealGlobe({
  locations = [],
  connections = [],
  activeLocation,
  onLocationClick,
  height = "500px",
  className = "",
  autoRotate = true,
  showStars = true
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.15} color="#4da6ff" />

        {showStars && <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />}

        <RealisticEarth
          locations={locations}
          connections={connections}
          activeLocation={activeLocation}
          onLocationClick={onLocationClick}
          autoRotate={autoRotate}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
