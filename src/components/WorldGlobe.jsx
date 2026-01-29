import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

// Simplified country outlines (lat/lng coordinates for key Southeast Asian countries)
const countryOutlines = {
  singapore: [
    [1.26, 103.60], [1.26, 104.10], [1.47, 104.10], [1.47, 103.60], [1.26, 103.60]
  ],
  malaysia: [
    // Peninsular Malaysia
    [1.4, 103.5], [1.5, 104.2], [2.0, 103.4], [2.5, 103.8], [3.5, 103.4],
    [4.2, 103.4], [5.5, 103.1], [6.2, 102.1], [6.7, 101.5], [6.5, 100.2],
    [5.5, 100.0], [4.2, 100.5], [3.0, 101.3], [2.5, 101.9], [1.4, 103.5]
  ],
  thailand: [
    [5.6, 100.5], [6.5, 101.0], [7.5, 100.5], [9.5, 99.0], [10.5, 99.0],
    [13.0, 100.5], [15.0, 100.0], [17.5, 102.5], [20.0, 100.0], [20.5, 100.5],
    [18.5, 103.5], [17.5, 104.5], [15.5, 105.5], [14.0, 105.0], [12.5, 102.5],
    [10.0, 99.0], [7.0, 99.5], [5.6, 100.5]
  ],
  vietnam: [
    [8.5, 104.5], [10.0, 106.5], [11.0, 108.0], [12.5, 109.5], [14.0, 109.0],
    [16.0, 108.0], [17.5, 106.5], [20.0, 106.0], [21.5, 107.5], [23.0, 105.5],
    [22.5, 103.5], [21.0, 103.0], [19.5, 104.0], [18.0, 105.5], [16.5, 107.5],
    [15.0, 108.5], [12.0, 109.0], [10.5, 107.0], [9.0, 105.5], [8.5, 104.5]
  ],
  indonesia: [
    // Sumatra
    [-5.5, 105.0], [-3.0, 104.5], [-1.0, 104.0], [2.0, 99.0], [5.5, 95.5],
    [5.0, 97.5], [2.0, 99.5], [-1.0, 103.0], [-3.5, 104.0], [-5.5, 105.0]
  ],
  philippines: [
    [5.0, 119.5], [7.0, 122.0], [9.0, 123.5], [11.0, 124.5], [13.0, 124.0],
    [15.0, 121.5], [18.0, 122.5], [18.5, 121.0], [16.0, 120.0], [14.0, 120.5],
    [12.0, 121.5], [10.0, 119.5], [7.5, 117.0], [5.0, 119.5]
  ]
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

// Country border lines
function CountryBorder({ coordinates, color = "#ffffff", radius = 2.01 }) {
  const points = useMemo(() => {
    return coordinates.map(([lat, lng]) => latLngToVector3(lat, lng, radius));
  }, [coordinates, radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.6}
    />
  );
}

// Location marker with pulse
function LocationMarker({ lat, lng, label, color = "#ef4444", radius = 2, isActive, onClick }) {
  const position = useMemo(() => latLngToVector3(lat, lng, radius + 0.03), [lat, lng, radius]);
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef();

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={hovered || isActive ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>

      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {(hovered || isActive) && label && (
        <Html distanceFactor={5} style={{ pointerEvents: 'none' }}>
          <div className="px-3 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg shadow-xl whitespace-nowrap transform -translate-y-8">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection arc between two points
function ConnectionArc({ from, to, color = "#3b82f6", radius = 2.02 }) {
  const curve = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, radius);
    const end = latLngToVector3(to.lat, to.lng, radius);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(radius + distance * 0.25);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to, radius]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.7}
    />
  );
}

// Main realistic globe
function RealisticGlobe({ locations, connections, activeLocation, onLocationClick, autoRotate }) {
  const globeRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
    }
  });

  // Create Earth texture with realistic colors
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Ocean - deep blue gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#0a1628');
    oceanGradient.addColorStop(0.3, '#0f2847');
    oceanGradient.addColorStop(0.5, '#0f2847');
    oceanGradient.addColorStop(0.7, '#0f2847');
    oceanGradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Land masses with more realistic shapes and positions
    ctx.fillStyle = '#1a3d2e';

    // North America
    ctx.beginPath();
    ctx.moveTo(180, 180);
    ctx.bezierCurveTo(280, 150, 380, 200, 420, 280);
    ctx.bezierCurveTo(480, 350, 520, 400, 450, 450);
    ctx.bezierCurveTo(380, 500, 280, 480, 220, 420);
    ctx.bezierCurveTo(150, 350, 120, 280, 180, 180);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.moveTo(380, 500);
    ctx.bezierCurveTo(420, 550, 450, 650, 420, 750);
    ctx.bezierCurveTo(380, 850, 340, 900, 320, 850);
    ctx.bezierCurveTo(300, 750, 320, 650, 350, 550);
    ctx.bezierCurveTo(360, 520, 370, 510, 380, 500);
    ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.moveTo(980, 200);
    ctx.bezierCurveTo(1050, 180, 1100, 200, 1120, 250);
    ctx.bezierCurveTo(1140, 300, 1100, 350, 1050, 350);
    ctx.bezierCurveTo(1000, 350, 970, 320, 960, 280);
    ctx.bezierCurveTo(950, 240, 960, 210, 980, 200);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.moveTo(1000, 380);
    ctx.bezierCurveTo(1080, 360, 1150, 400, 1180, 480);
    ctx.bezierCurveTo(1200, 580, 1180, 680, 1120, 750);
    ctx.bezierCurveTo(1060, 800, 1000, 780, 980, 720);
    ctx.bezierCurveTo(950, 640, 940, 560, 960, 480);
    ctx.bezierCurveTo(970, 420, 980, 390, 1000, 380);
    ctx.fill();

    // Asia (main landmass)
    ctx.beginPath();
    ctx.moveTo(1150, 180);
    ctx.bezierCurveTo(1300, 150, 1500, 180, 1650, 250);
    ctx.bezierCurveTo(1750, 300, 1800, 380, 1780, 450);
    ctx.bezierCurveTo(1750, 520, 1650, 550, 1550, 520);
    ctx.bezierCurveTo(1450, 500, 1350, 450, 1300, 400);
    ctx.bezierCurveTo(1250, 350, 1200, 300, 1180, 250);
    ctx.bezierCurveTo(1160, 220, 1150, 200, 1150, 180);
    ctx.fill();

    // Southeast Asia / Indonesia region
    ctx.beginPath();
    ctx.moveTo(1450, 480);
    ctx.bezierCurveTo(1500, 500, 1580, 520, 1650, 540);
    ctx.bezierCurveTo(1700, 560, 1750, 580, 1720, 620);
    ctx.bezierCurveTo(1680, 650, 1600, 640, 1520, 620);
    ctx.bezierCurveTo(1450, 600, 1400, 560, 1420, 520);
    ctx.bezierCurveTo(1430, 500, 1440, 490, 1450, 480);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.moveTo(1600, 650);
    ctx.bezierCurveTo(1700, 620, 1800, 660, 1850, 720);
    ctx.bezierCurveTo(1880, 780, 1850, 850, 1780, 880);
    ctx.bezierCurveTo(1700, 900, 1620, 880, 1580, 820);
    ctx.bezierCurveTo(1550, 760, 1560, 700, 1600, 650);
    ctx.fill();

    // Add subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    // Longitude lines
    for (let i = 0; i <= canvas.width; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 0; i <= canvas.height; i += 128) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group ref={globeRef}>
      {/* Main globe */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Country borders */}
      {Object.entries(countryOutlines).map(([country, coords]) => (
        <CountryBorder key={country} coordinates={coords} color="#4ade80" />
      ))}

      {/* Atmosphere */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Locations */}
      {locations.map((loc, i) => (
        <LocationMarker
          key={i}
          lat={loc.lat}
          lng={loc.lng}
          label={loc.label}
          color={loc.color}
          isActive={activeLocation?.label === loc.label}
          onClick={() => onLocationClick?.(loc)}
        />
      ))}

      {/* Connections */}
      {connections.map((conn, i) => (
        <ConnectionArc key={i} from={conn.from} to={conn.to} color={conn.color} />
      ))}
    </group>
  );
}

export default function WorldGlobe({
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
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#60a5fa" />

        {showStars && <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />}

        <RealisticGlobe
          locations={locations}
          connections={connections}
          activeLocation={activeLocation}
          onLocationClick={onLocationClick}
          autoRotate={autoRotate}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
