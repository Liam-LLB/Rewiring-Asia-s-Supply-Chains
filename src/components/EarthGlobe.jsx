import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Animated connection arc between two points
function ConnectionArc({ from, to, color = "#fbbf24", radius = 2.02 }) {
  const curve = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, radius);
    const end = latLngToVector3(to.lat, to.lng, radius);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(radius + distance * 0.3);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to, radius]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
  }, [curve]);

  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.dashOffset -= 0.01;
    }
  });

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Location marker with pulse effect
function LocationMarker({ lat, lng, label, color = "#ef4444", radius = 2, onClick, isActive }) {
  const position = useMemo(() => latLngToVector3(lat, lng, radius + 0.02), [lat, lng, radius]);
  const meshRef = useRef();
  const pulseRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={hovered || isActive ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered || isActive ? 1 : 0.5}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.08, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      {(hovered || isActive) && label && (
        <Html distanceFactor={5} style={{ pointerEvents: 'none' }}>
          <div className="px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20 whitespace-nowrap transform -translate-y-8">
            <span className="font-semibold">{label}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main Earth sphere with textures
function Earth({ locations = [], connections = [], onLocationClick, activeLocation, autoRotate = true }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }
  });

  // Create procedural earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#0c2d48');
    oceanGradient.addColorStop(0.5, '#145374');
    oceanGradient.addColorStop(1, '#0c2d48');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise for ocean texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(20, 83, 116, ${Math.random() * 0.3})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Simplified continents (approximate positions)
    ctx.fillStyle = '#1a472a';

    // Asia
    ctx.beginPath();
    ctx.ellipse(1400, 400, 400, 250, 0, 0, Math.PI * 2);
    ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.ellipse(1100, 300, 150, 100, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(1100, 550, 150, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    // North America
    ctx.beginPath();
    ctx.ellipse(400, 350, 250, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.ellipse(550, 650, 120, 200, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(1700, 650, 120, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add terrain noise
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(34, 89, 54, ${Math.random() * 0.5})`;
      ctx.fillRect(x, y, 4, 4);
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 64) {
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
    <group ref={earthRef}>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#1e90ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Location markers */}
      {locations.map((loc, i) => (
        <LocationMarker
          key={i}
          lat={loc.lat}
          lng={loc.lng}
          label={loc.label}
          color={loc.color}
          onClick={() => onLocationClick?.(loc)}
          isActive={activeLocation?.label === loc.label}
        />
      ))}

      {/* Connection arcs */}
      {connections.map((conn, i) => (
        <ConnectionArc
          key={i}
          from={conn.from}
          to={conn.to}
          color={conn.color}
        />
      ))}
    </group>
  );
}

export default function EarthGlobe({
  locations = [],
  connections = [],
  onLocationClick,
  activeLocation,
  height = "500px",
  className = "",
  showStars = true,
  autoRotate = true
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4da6ff" />

        {showStars && <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />}

        <Earth
          locations={locations}
          connections={connections}
          onLocationClick={onLocationClick}
          activeLocation={activeLocation}
          autoRotate={autoRotate}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
