import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// More realistic country shapes using simplified coordinates
const countries = {
  singapore: {
    name: "Singapore",
    color: "#ef4444",
    center: [1.35, 103.82],
    shape: [[0, 0], [0.15, 0], [0.15, 0.2], [0, 0.2]],
    scale: 0.8,
    info: "Financial hub & Technology center",
    position: [2.8, 0.15, 1.5]
  },
  johor: {
    name: "Johor",
    color: "#3b82f6",
    center: [1.9, 103.5],
    shape: [[0, 0], [1.5, 0], [1.8, 0.8], [1.2, 1.2], [0.3, 1.0], [0, 0.5]],
    scale: 0.5,
    info: "Manufacturing & Land resources",
    position: [2.2, 0.15, 1.0]
  },
  malaysia: {
    name: "Malaysia",
    color: "#1e40af",
    center: [4.2, 101.9],
    shape: [[0, 0], [2, 0.5], [3, 0], [3.5, 1], [3, 2.5], [2.5, 3.5], [1.5, 4], [0.5, 3.5], [0, 2.5], [0.3, 1.5]],
    scale: 0.6,
    info: "Resources & Industrial capacity",
    position: [0, 0.15, -0.5]
  },
  thailand: {
    name: "Thailand",
    color: "#8b5cf6",
    center: [15.87, 100.99],
    shape: [[0.5, 0], [1.5, 0], [2, 1], [2.5, 2], [2, 3], [1.5, 4], [1, 4.5], [0.5, 4], [0, 3], [0, 2], [0.3, 1]],
    scale: 0.55,
    info: "Automotive & EV manufacturing",
    position: [-3, 0.15, -3]
  },
  vietnam: {
    name: "Vietnam",
    color: "#f59e0b",
    center: [14.06, 108.22],
    shape: [[0.3, 0], [0.8, 0.5], [1, 1.5], [0.8, 3], [0.5, 4], [0.3, 4.5], [0, 4], [0, 2], [0.2, 1]],
    scale: 0.5,
    info: "Electronics & Textiles hub",
    position: [0.5, 0.15, -4]
  },
  indonesia: {
    name: "Indonesia",
    color: "#10b981",
    center: [-0.79, 113.92],
    shape: [[0, 0.5], [1.5, 0], [3, 0.3], [4, 0.5], [4.5, 1], [4, 1.5], [3, 1.3], [1.5, 1.2], [0.5, 1]],
    scale: 0.7,
    info: "Critical minerals & Consumer market",
    position: [1, 0.15, 4]
  },
  philippines: {
    name: "Philippines",
    color: "#ec4899",
    center: [12.88, 121.77],
    shape: [[0.3, 0], [0.6, 0.5], [0.8, 1.5], [0.6, 2.5], [0.4, 3], [0.2, 2.5], [0, 1.5], [0.1, 0.5]],
    scale: 0.6,
    info: "Services & Regional connector",
    position: [5, 0.15, -2]
  }
};

// Country mesh component
function Country({ data, isSelected, isHovered, onSelect, onHover }) {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = data.position[1] + (isSelected || localHover ? 0.2 : 0);
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  // Create extruded shape
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = data.shape;
    shape.moveTo(points[0][0] * data.scale, points[0][1] * data.scale);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0] * data.scale, points[i][1] * data.scale);
    }
    shape.closePath();

    const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [data]);

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onSelect(data.name)}
        onPointerOver={() => { setLocalHover(true); onHover(data.name); }}
        onPointerOut={() => { setLocalHover(false); onHover(null); }}
      >
        <meshStandardMaterial
          color={isSelected || localHover ? "#ffffff" : data.color}
          emissive={data.color}
          emissiveIntensity={isSelected || localHover ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Country label */}
      {(isSelected || localHover) && (
        <Html position={[data.scale, 0.8, data.scale]} center distanceFactor={10}>
          <div className="bg-white rounded-xl p-4 shadow-2xl min-w-[180px] transform transition-all">
            <h3 className="text-slate-900 font-bold text-lg">{data.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{data.info}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// SEZ Zone indicator
function SEZZone() {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[2.5, 0.02, 1.2]}>
      {/* Animated ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.8, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.1} />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.5, 0]} center>
        <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          JS-SEZ
        </div>
      </Html>
    </group>
  );
}

// Trade route with animated particles
function TradeRoute({ start, end, color = "#fbbf24" }) {
  const particleRef = useRef();
  const [progress, setProgress] = useState(0);

  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2,
      Math.max(start[1], end[1]) + 0.8,
      (start[2] + end[2]) / 2
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  useFrame((state) => {
    const newProgress = (state.clock.elapsedTime * 0.3) % 1;
    setProgress(newProgress);
    if (particleRef.current) {
      const point = curve.getPoint(newProgress);
      particleRef.current.position.copy(point);
    }
  });

  const points = useMemo(() => curve.getPoints(30), [curve]);

  return (
    <group>
      <Line points={points} color={color} lineWidth={2} transparent opacity={0.4} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Water plane
function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial color="#0c4a6e" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function MapScene({ selectedCountry, hoveredCountry, onSelect, onHover, showRoutes }) {
  const tradeRoutes = [
    { start: [2.8, 0.3, 1.5], end: [2.2, 0.3, 1.0], color: "#fbbf24" }, // SG-Johor
    { start: [2.8, 0.3, 1.5], end: [0.5, 0.3, -4], color: "#f59e0b" }, // SG-Vietnam
    { start: [2.8, 0.3, 1.5], end: [1, 0.3, 4], color: "#10b981" }, // SG-Indonesia
    { start: [0, 0.3, -0.5], end: [-3, 0.3, -3], color: "#8b5cf6" }, // MY-Thailand
  ];

  return (
    <>
      <Water />
      <gridHelper args={[25, 25, "#1e3a5f", "#0f2744"]} position={[0, 0, 0]} />

      {Object.entries(countries).map(([key, data]) => (
        <Country
          key={key}
          data={data}
          isSelected={selectedCountry === data.name}
          isHovered={hoveredCountry === data.name}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <SEZZone />

      {showRoutes && tradeRoutes.map((route, i) => (
        <TradeRoute key={i} {...route} />
      ))}
    </>
  );
}

export default function AsiaMap3D({
  height = "500px",
  className = "",
  onCountrySelect,
  selectedCountry,
  showRoutes = true
}) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [8, 10, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.3} color="#3b82f6" />

        <MapScene
          selectedCountry={selectedCountry}
          hoveredCountry={hoveredCountry}
          onSelect={onCountrySelect}
          onHover={setHoveredCountry}
          showRoutes={showRoutes}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={8}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
