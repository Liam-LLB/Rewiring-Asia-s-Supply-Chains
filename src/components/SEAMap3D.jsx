import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Country shapes (simplified 3D representations)
function CountryMesh({ position, size, color, name, info, isHighlighted, onClick, rotationY = 0 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + (hovered || isHighlighted ? 0.15 : 0) + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      meshRef.current.material.emissiveIntensity = hovered || isHighlighted ? 0.5 : 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[0, rotationY, 0]}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered || isHighlighted ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Country label */}
      {(hovered || isHighlighted) && (
        <Html position={[0, size[1] / 2 + 0.5, 0]} center distanceFactor={8}>
          <div className="bg-black/90 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[200px] transform transition-all">
            <h3 className="text-white font-bold text-lg">{name}</h3>
            {info && <p className="text-white/70 text-sm mt-2">{info}</p>}
          </div>
        </Html>
      )}
    </group>
  );
}

// Animated trade route
function TradeRoute({ start, end, color = "#fbbf24", label }) {
  const lineRef = useRef();
  const particleRef = useRef();
  const [progress, setProgress] = useState(0);

  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + 1,
      (start[2] + end[2]) / 2
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  useFrame((state) => {
    setProgress((state.clock.elapsedTime * 0.2) % 1);
    if (particleRef.current) {
      const point = curve.getPoint(progress);
      particleRef.current.position.copy(point);
    }
  });

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 32, 0.03, 8, false), [curve]);

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Animated particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Water plane with animated waves
function WaterPlane() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[30, 30, 32, 32]} />
      <meshStandardMaterial
        color="#0c4a6e"
        transparent
        opacity={0.8}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

// SEZ Zone highlight
function SEZZone({ position, radius = 1 }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      ringRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Glowing ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius * 0.8, radius, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[radius * 0.8, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>

      {/* Label */}
      <Html position={[0, 1, 0]} center>
        <div className="bg-emerald-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-emerald-500/50 animate-pulse">
          <p className="text-emerald-400 font-bold">JS-SEZ</p>
          <p className="text-emerald-300/80 text-xs">Special Economic Zone</p>
        </div>
      </Html>
    </group>
  );
}

function MapScene({ selectedCountry, onCountrySelect, showTradeRoutes = true }) {
  const countries = [
    { name: "Malaysia", position: [-1.5, 0.2, 0], size: [3, 0.3, 1.8], color: "#3b82f6", info: "Land, labor & manufacturing capacity" },
    { name: "Singapore", position: [0.8, 0.15, -1], size: [0.5, 0.25, 0.4], color: "#ef4444", info: "Finance, tech & innovation hub" },
    { name: "Thailand", position: [-2.5, 0.2, -2.5], size: [2, 0.3, 2], color: "#8b5cf6", info: "Automotive & EV manufacturing" },
    { name: "Vietnam", position: [1.5, 0.2, -3.5], size: [1.2, 0.3, 2.5], color: "#f59e0b", info: "Electronics & textiles hub" },
    { name: "Indonesia", position: [0, 0.2, 2.5], size: [4, 0.25, 1.5], color: "#10b981", info: "Critical minerals & consumer market" },
    { name: "Philippines", position: [3.5, 0.2, -2], size: [1, 0.25, 2], color: "#ec4899", info: "Services & regional connector" },
  ];

  const tradeRoutes = [
    { start: [0.8, 0.3, -1], end: [-0.5, 0.3, 0], color: "#fbbf24" }, // SG to Johor
    { start: [0.8, 0.3, -1], end: [1.5, 0.3, -3.5], color: "#3b82f6" }, // SG to Vietnam
    { start: [-1.5, 0.3, 0], end: [-2.5, 0.3, -2.5], color: "#8b5cf6" }, // MY to Thailand
    { start: [0.8, 0.3, -1], end: [0, 0.3, 2.5], color: "#10b981" }, // SG to Indonesia
  ];

  return (
    <>
      <WaterPlane />

      {/* Grid */}
      <gridHelper args={[30, 30, "#1e3a5f", "#0f2744"]} position={[0, -0.29, 0]} />

      {/* Countries */}
      {countries.map((country, i) => (
        <CountryMesh
          key={country.name}
          {...country}
          isHighlighted={selectedCountry === country.name}
          onClick={() => onCountrySelect?.(country.name)}
        />
      ))}

      {/* SEZ Zone between SG and Johor */}
      <SEZZone position={[0, 0.1, -0.5]} radius={1.2} />

      {/* Trade routes */}
      {showTradeRoutes && tradeRoutes.map((route, i) => (
        <TradeRoute key={i} {...route} />
      ))}
    </>
  );
}

export default function SEAMap3D({
  height = "500px",
  className = "",
  onCountrySelect,
  selectedCountry,
  showTradeRoutes = true
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [5, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[10, 5, 10]} intensity={0.3} color="#ef4444" />

        <MapScene
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
          showTradeRoutes={showTradeRoutes}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
