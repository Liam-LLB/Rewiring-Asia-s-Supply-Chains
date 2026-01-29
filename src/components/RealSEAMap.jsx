import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Accurate country data with real geographic outlines
const countryData = {
  singapore: {
    name: "Singapore",
    fullName: "Republic of Singapore",
    color: "#ef4444",
    highlightColor: "#ff6b6b",
    info: "Global Financial Hub • Tech Center • Major Port",
    gdp: "$397B",
    population: "5.9M",
    role: "JS-SEZ Partner",
    // Simplified but accurate Singapore outline
    outline: [
      [103.605, 1.168], [103.65, 1.145], [103.70, 1.135], [103.76, 1.145],
      [103.82, 1.165], [103.87, 1.195], [103.92, 1.235], [103.97, 1.280],
      [104.01, 1.325], [104.04, 1.370], [104.05, 1.400], [104.03, 1.425],
      [103.99, 1.442], [103.94, 1.448], [103.88, 1.446], [103.82, 1.438],
      [103.77, 1.424], [103.72, 1.404], [103.68, 1.378], [103.64, 1.348],
      [103.62, 1.310], [103.60, 1.265], [103.60, 1.218], [103.605, 1.168]
    ],
    center: [103.82, 1.30],
    labelOffset: [0, 0.8]
  },
  johor: {
    name: "Johor",
    fullName: "Johor, Malaysia",
    color: "#3b82f6",
    highlightColor: "#60a5fa",
    info: "JS-SEZ Partner • Manufacturing Hub • Land Bridge",
    gdp: "$28B",
    population: "4.0M",
    role: "JS-SEZ Partner",
    outline: [
      [103.35, 1.45], [103.45, 1.50], [103.55, 1.52], [103.70, 1.55],
      [103.85, 1.52], [104.00, 1.58], [104.15, 1.70], [104.25, 1.88],
      [104.20, 2.05], [104.05, 2.18], [103.85, 2.25], [103.65, 2.22],
      [103.45, 2.28], [103.25, 2.18], [103.15, 2.00], [103.18, 1.82],
      [103.25, 1.65], [103.35, 1.45]
    ],
    center: [103.70, 1.85],
    labelOffset: [0, 0.6]
  },
  malaysia: {
    name: "Malaysia",
    fullName: "Peninsular Malaysia",
    color: "#1e40af",
    highlightColor: "#3b82f6",
    info: "Manufacturing • Electronics • Palm Oil",
    gdp: "$373B",
    population: "32.7M",
    role: "Regional Partner",
    outline: [
      [103.35, 1.45], [103.25, 1.65], [103.15, 2.00], [103.25, 2.35],
      [103.35, 2.85], [103.40, 3.45], [103.38, 4.05], [103.42, 4.65],
      [103.25, 5.25], [102.70, 5.78], [102.10, 6.12], [101.45, 6.45],
      [100.75, 6.52], [100.18, 6.42], [99.72, 6.35], [99.58, 6.08],
      [99.88, 5.58], [100.12, 5.08], [100.22, 4.58], [100.38, 4.08],
      [100.52, 3.58], [100.72, 3.08], [100.98, 2.68], [101.35, 2.28],
      [101.82, 1.92], [102.38, 1.68], [102.98, 1.48], [103.35, 1.45]
    ],
    center: [101.5, 4.0],
    labelOffset: [-0.5, 0]
  },
  thailand: {
    name: "Thailand",
    fullName: "Kingdom of Thailand",
    color: "#8b5cf6",
    highlightColor: "#a78bfa",
    info: "Automotive Hub • Tourism • Agriculture",
    gdp: "$506B",
    population: "69.8M",
    role: "ASEAN Partner",
    outline: [
      [100.08, 6.42], [99.62, 6.52], [99.18, 7.02], [98.68, 7.72],
      [98.32, 8.42], [98.22, 9.12], [98.42, 9.72], [98.68, 10.32],
      [99.02, 10.92], [99.22, 11.62], [99.08, 12.32], [99.22, 13.02],
      [99.48, 13.72], [99.18, 14.42], [98.92, 15.12], [98.52, 15.72],
      [98.22, 16.32], [97.82, 16.82], [97.52, 17.32], [97.72, 17.92],
      [98.32, 18.42], [98.92, 18.92], [99.52, 19.32], [100.12, 19.72],
      [100.58, 20.12], [100.92, 20.42], [101.42, 19.92], [101.92, 19.02],
      [102.32, 18.52], [102.82, 18.02], [103.32, 17.52], [103.82, 17.02],
      [104.32, 16.52], [104.72, 16.02], [105.12, 15.52], [105.42, 15.02],
      [105.52, 14.52], [105.32, 14.02], [104.92, 13.52], [104.42, 13.02],
      [103.92, 12.52], [103.42, 12.02], [102.92, 11.52], [102.42, 11.02],
      [101.92, 10.52], [101.42, 10.02], [100.92, 9.52], [100.42, 9.02],
      [100.02, 8.42], [99.98, 7.72], [99.98, 7.02], [100.08, 6.42]
    ],
    center: [101.0, 13.0],
    labelOffset: [0, 0]
  },
  vietnam: {
    name: "Vietnam",
    fullName: "Socialist Republic of Vietnam",
    color: "#10b981",
    highlightColor: "#34d399",
    info: "Electronics • Textiles • Growing Tech",
    gdp: "$363B",
    population: "97.3M",
    role: "Regional Partner",
    outline: [
      [103.92, 22.52], [104.42, 22.82], [105.02, 23.02], [105.52, 22.82],
      [106.02, 22.52], [106.52, 22.22], [106.82, 21.82], [107.02, 21.42],
      [106.82, 21.02], [106.52, 20.52], [106.22, 20.02], [106.02, 19.52],
      [105.82, 19.02], [105.92, 18.52], [106.22, 18.02], [106.52, 17.52],
      [107.02, 17.02], [107.52, 16.52], [108.02, 16.22], [108.32, 15.82],
      [108.62, 15.42], [108.82, 15.02], [109.02, 14.52], [109.22, 14.02],
      [109.32, 13.52], [109.32, 13.02], [109.22, 12.52], [109.02, 12.02],
      [108.72, 11.52], [108.22, 11.02], [107.52, 10.52], [107.02, 10.32],
      [106.52, 10.02], [106.22, 9.52], [105.82, 9.02], [105.52, 8.72],
      [105.02, 8.52], [104.52, 8.62], [104.02, 8.82], [103.52, 9.02],
      [103.22, 9.52], [103.02, 10.02], [102.82, 10.52], [102.92, 11.02],
      [103.12, 11.52], [103.52, 12.02], [104.02, 12.52], [104.52, 13.02],
      [104.82, 13.52], [105.02, 14.02], [105.32, 14.52], [105.52, 15.02],
      [105.42, 15.52], [105.22, 16.02], [104.82, 16.52], [104.52, 17.02],
      [104.22, 17.52], [104.02, 18.02], [103.92, 18.52], [104.02, 19.02],
      [104.22, 19.52], [104.52, 20.02], [104.32, 20.52], [103.92, 21.02],
      [103.62, 21.52], [103.52, 22.02], [103.92, 22.52]
    ],
    center: [106.0, 16.0],
    labelOffset: [0.5, 0]
  },
  indonesia: {
    name: "Indonesia",
    fullName: "Republic of Indonesia (Sumatra)",
    color: "#f59e0b",
    highlightColor: "#fbbf24",
    info: "Natural Resources • Palm Oil • Mining",
    gdp: "$1.19T",
    population: "273.5M",
    role: "Regional Partner",
    outline: [
      [95.32, 5.62], [95.52, 5.22], [96.02, 4.82], [96.52, 4.42],
      [97.02, 4.02], [97.52, 3.52], [98.02, 3.02], [98.52, 2.52],
      [99.02, 2.02], [99.52, 1.52], [100.02, 1.02], [100.52, 0.52],
      [101.02, 0.02], [101.52, -0.48], [102.02, -0.98], [102.52, -1.48],
      [103.02, -1.98], [103.52, -2.48], [104.02, -2.98], [104.52, -3.48],
      [105.02, -3.98], [105.52, -4.48], [106.02, -4.98], [105.52, -5.48],
      [105.02, -5.78], [104.52, -5.48], [104.02, -5.18], [103.52, -4.78],
      [103.02, -4.48], [102.52, -3.98], [102.02, -3.48], [101.52, -2.98],
      [101.02, -2.48], [100.52, -1.98], [100.02, -1.48], [99.52, -0.98],
      [99.02, -0.48], [98.52, 0.02], [98.02, 0.52], [97.52, 1.02],
      [97.02, 1.52], [96.52, 2.02], [96.02, 2.52], [95.52, 3.02],
      [95.22, 3.52], [95.02, 4.02], [95.02, 4.52], [95.12, 5.02],
      [95.32, 5.62]
    ],
    center: [101.0, 0.5],
    labelOffset: [0, 0]
  },
  philippines: {
    name: "Philippines",
    fullName: "Republic of the Philippines",
    color: "#ec4899",
    highlightColor: "#f472b6",
    info: "BPO Services • Electronics • Remittances",
    gdp: "$394B",
    population: "109.6M",
    role: "Regional Partner",
    outline: [
      [117.02, 5.02], [117.52, 5.52], [118.02, 6.02], [118.52, 6.52],
      [119.02, 7.02], [119.52, 7.52], [120.02, 8.02], [120.52, 8.52],
      [121.02, 9.02], [121.52, 9.52], [122.02, 10.02], [122.52, 10.52],
      [123.02, 11.02], [123.52, 11.52], [124.02, 12.02], [124.52, 12.52],
      [124.52, 13.02], [124.22, 13.52], [123.82, 14.02], [123.52, 14.52],
      [123.02, 15.02], [122.52, 15.52], [122.02, 16.02], [121.52, 16.52],
      [121.02, 17.02], [120.52, 17.52], [120.02, 18.02], [119.82, 18.52],
      [120.22, 18.22], [120.52, 17.82], [120.32, 17.32], [119.82, 17.02],
      [119.32, 16.52], [118.82, 16.02], [118.52, 15.52], [118.22, 15.02],
      [118.02, 14.52], [117.82, 14.02], [117.52, 13.52], [117.22, 13.02],
      [117.02, 12.52], [116.82, 12.02], [116.52, 11.52], [116.22, 11.02],
      [116.02, 10.52], [116.02, 10.02], [116.22, 9.52], [116.52, 9.02],
      [116.52, 8.52], [116.32, 8.02], [116.02, 7.52], [116.02, 7.02],
      [116.22, 6.52], [116.52, 6.02], [116.82, 5.52], [117.02, 5.02]
    ],
    center: [122.0, 12.0],
    labelOffset: [0, 0]
  },
  cambodia: {
    name: "Cambodia",
    fullName: "Kingdom of Cambodia",
    color: "#6366f1",
    highlightColor: "#818cf8",
    info: "Textiles • Agriculture • Tourism",
    gdp: "$27B",
    population: "16.7M",
    role: "ASEAN Partner",
    outline: [
      [102.52, 14.52], [103.02, 14.32], [103.52, 14.22], [104.02, 14.32],
      [104.52, 14.42], [105.02, 14.32], [105.52, 14.02], [106.02, 13.52],
      [106.52, 13.02], [106.82, 12.52], [106.52, 12.02], [106.02, 11.52],
      [105.52, 11.02], [105.02, 10.82], [104.52, 10.52], [104.02, 10.52],
      [103.52, 10.82], [103.22, 11.22], [103.02, 11.82], [102.82, 12.32],
      [102.62, 12.82], [102.52, 13.32], [102.42, 13.82], [102.52, 14.52]
    ],
    center: [104.5, 12.5],
    labelOffset: [0, 0]
  }
};

// Convert geo coordinates to 3D flat map position
function geoToMap(lng, lat, scale = 0.6) {
  return [
    (lng - 103) * scale,
    0,
    (lat - 8) * -scale
  ];
}

// Country shape with realistic borders
function CountryShape({ data, isSelected, isHovered, onSelect, onHover }) {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const points = data.outline.map(([lng, lat]) => {
      const [x, , z] = geoToMap(lng, lat);
      return [x, -z];
    });

    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.closePath();
    return s;
  }, [data]);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      depth: isSelected || localHover ? 0.25 : 0.15,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [shape, isSelected, localHover]);

  const outlinePoints = useMemo(() => {
    return data.outline.map(([lng, lat]) => {
      const [x, , z] = geoToMap(lng, lat);
      return new THREE.Vector3(x, 0.3, z);
    });
  }, [data]);

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = (isSelected || localHover) ? 0.2 : 0;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.12;

      const targetEmissive = (isSelected || localHover) ? 0.5 : 0.2;
      meshRef.current.material.emissiveIntensity += (targetEmissive - meshRef.current.material.emissiveIntensity) * 0.1;
    }
  });

  const [cx, , cz] = geoToMap(data.center[0], data.center[1]);
  const active = isSelected || localHover;

  return (
    <group>
      {/* Country mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onSelect(data.name)}
        onPointerOver={() => { setLocalHover(true); onHover(data.name); }}
        onPointerOut={() => { setLocalHover(false); onHover(null); }}
      >
        <meshStandardMaterial
          color={active ? data.highlightColor : data.color}
          emissive={data.color}
          emissiveIntensity={0.2}
          metalness={0.15}
          roughness={0.75}
        />
      </mesh>

      {/* Border outline */}
      <Line
        points={outlinePoints}
        color={active ? "#ffffff" : data.color}
        lineWidth={active ? 2.5 : 1.5}
        transparent
        opacity={active ? 1 : 0.6}
      />

      {/* Country label */}
      {active && (
        <Html
          position={[cx + (data.labelOffset?.[0] || 0), 1.5, cz + (data.labelOffset?.[1] || 0)]}
          center
          distanceFactor={15}
        >
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl min-w-[240px] border border-slate-600/50">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ background: data.color, boxShadow: `0 0 12px ${data.color}` }}
              />
              <h3 className="text-white font-bold text-lg">{data.name}</h3>
            </div>
            <p className="text-slate-300 text-sm mb-3">{data.info}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/50 rounded-lg p-2">
                <div className="text-slate-400">GDP</div>
                <div className="text-white font-semibold">{data.gdp}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <div className="text-slate-400">Population</div>
                <div className="text-white font-semibold">{data.population}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ background: `${data.color}30`, color: data.color }}
              >
                {data.role}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// JS-SEZ Zone indicator
function SEZIndicator() {
  const ringRef = useRef();
  const pulseRef = useRef();
  const [sgX, , sgZ] = geoToMap(103.82, 1.35);
  const [jhX, , jhZ] = geoToMap(103.70, 1.85);
  const centerX = (sgX + jhX) / 2;
  const centerZ = (sgZ + jhZ) / 2;

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      pulseRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={[centerX, 0.1, centerZ]}>
      {/* Outer rotating ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.1, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner pulsing ring */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.4, 0.6, 64]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Center fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.4, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>

      {/* Connection line between Singapore and Johor */}
      <Line
        points={[[sgX - centerX, 0.2, sgZ - centerZ], [jhX - centerX, 0.2, jhZ - centerZ]]}
        color="#fbbf24"
        lineWidth={3}
        dashed
        dashSize={0.1}
        dashScale={3}
      />

      {/* Label */}
      <Html position={[0, 0.6, 0]} center>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-emerald-500/40 whitespace-nowrap">
          🔗 JS-SEZ Zone
        </div>
      </Html>
    </group>
  );
}

// Trade route with animated particle
function TradeRoute({ from, to, color = "#fbbf24", label }) {
  const particleRef = useRef();
  const [fromX, , fromZ] = geoToMap(from[0], from[1]);
  const [toX, , toZ] = geoToMap(to[0], to[1]);

  const curve = useMemo(() => {
    const height = Math.sqrt((toX - fromX) ** 2 + (toZ - fromZ) ** 2) * 0.4;
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(fromX, 0.25, fromZ),
      new THREE.Vector3((fromX + toX) / 2, height, (fromZ + toZ) / 2),
      new THREE.Vector3(toX, 0.25, toZ)
    );
  }, [fromX, fromZ, toX, toZ]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * 0.15) % 1;
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={2} transparent opacity={0.45} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Ocean plane with realistic appearance
function Ocean() {
  return (
    <group>
      {/* Main ocean */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#0a3d62"
          metalness={0.85}
          roughness={0.15}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Ocean depth layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial color="#051c2c" />
      </mesh>
    </group>
  );
}

// Grid overlay
function MapGrid() {
  return (
    <gridHelper
      args={[60, 60, "#1a4d70", "#0d2d45"]}
      position={[0, -0.05, 0]}
    />
  );
}

// Main map scene
function MapScene({ selectedCountry, hoveredCountry, onSelect, onHover, showRoutes }) {
  const tradeRoutes = [
    { from: [103.82, 1.35], to: [103.70, 1.85], color: "#10b981", label: "SG-JB" },
    { from: [103.82, 1.35], to: [101.5, 4.0], color: "#3b82f6", label: "SG-MY" },
    { from: [103.82, 1.35], to: [106.0, 16.0], color: "#10b981", label: "SG-VN" },
    { from: [103.82, 1.35], to: [101.0, 13.0], color: "#8b5cf6", label: "SG-TH" },
    { from: [103.82, 1.35], to: [101.0, 0.5], color: "#f59e0b", label: "SG-ID" },
    { from: [103.82, 1.35], to: [122.0, 12.0], color: "#ec4899", label: "SG-PH" },
    { from: [101.5, 4.0], to: [101.0, 13.0], color: "#6366f1", label: "MY-TH" },
    { from: [101.0, 13.0], to: [104.5, 12.5], color: "#f97316", label: "TH-KH" },
  ];

  return (
    <>
      <Ocean />
      <MapGrid />

      {/* Countries */}
      {Object.entries(countryData).map(([key, data]) => (
        <CountryShape
          key={key}
          data={data}
          isSelected={selectedCountry === data.name}
          isHovered={hoveredCountry === data.name}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {/* JS-SEZ Zone */}
      <SEZIndicator />

      {/* Trade routes */}
      {showRoutes && tradeRoutes.map((route, i) => (
        <TradeRoute
          key={i}
          from={route.from}
          to={route.to}
          color={route.color}
          label={route.label}
        />
      ))}
    </>
  );
}

export default function RealSEAMap({
  height = "500px",
  className = "",
  onCountrySelect,
  selectedCountry,
  showRoutes = true
}) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 18, 22], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <pointLight position={[-10, 15, -10]} intensity={0.3} color="#4da6ff" />
        <pointLight position={[10, 10, 10]} intensity={0.2} color="#10b981" />

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
          minDistance={10}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
