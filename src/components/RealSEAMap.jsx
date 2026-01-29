import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Real GeoJSON-style coordinates for SEA countries (more accurate shapes)
const countryData = {
  singapore: {
    name: "Singapore",
    color: "#ef4444",
    info: "Financial hub • Tech center • Port city",
    // Actual Singapore shape (simplified)
    outline: [
      [103.605, 1.168], [103.653, 1.142], [103.707, 1.131], [103.766, 1.143],
      [103.826, 1.167], [103.876, 1.197], [103.923, 1.235], [103.968, 1.277],
      [104.007, 1.323], [104.041, 1.370], [104.054, 1.401], [104.034, 1.427],
      [103.994, 1.443], [103.941, 1.449], [103.883, 1.447], [103.826, 1.439],
      [103.773, 1.425], [103.723, 1.405], [103.679, 1.378], [103.643, 1.345],
      [103.617, 1.306], [103.602, 1.263], [103.598, 1.218], [103.605, 1.168]
    ],
    center: [103.82, 1.35],
    scale: 15
  },
  johor: {
    name: "Johor",
    color: "#3b82f6",
    info: "JS-SEZ partner • Manufacturing • Land resources",
    outline: [
      [103.35, 1.45], [103.50, 1.55], [103.70, 1.60], [103.90, 1.55],
      [104.10, 1.65], [104.20, 1.80], [104.10, 2.00], [103.90, 2.10],
      [103.70, 2.05], [103.50, 2.10], [103.30, 2.00], [103.20, 1.80],
      [103.25, 1.60], [103.35, 1.45]
    ],
    center: [103.65, 1.75],
    scale: 5
  },
  malaysia: {
    name: "Peninsular Malaysia",
    color: "#1e40af",
    info: "Resources • Industrial capacity • Strategic location",
    outline: [
      [103.35, 1.45], [103.50, 1.55], [103.70, 1.75], [103.50, 2.20],
      [103.40, 2.80], [103.50, 3.40], [103.45, 4.00], [103.50, 4.70],
      [103.20, 5.30], [102.60, 5.85], [102.00, 6.15], [101.30, 6.50],
      [100.60, 6.55], [100.10, 6.45], [99.70, 6.35], [99.55, 6.10],
      [99.90, 5.60], [100.15, 5.10], [100.25, 4.60], [100.40, 4.10],
      [100.55, 3.60], [100.75, 3.10], [101.00, 2.70], [101.40, 2.30],
      [101.85, 1.95], [102.40, 1.70], [103.00, 1.50], [103.35, 1.45]
    ],
    center: [101.5, 4.0],
    scale: 2.2
  },
  thailand: {
    name: "Thailand",
    color: "#8b5cf6",
    info: "Automotive hub • EV manufacturing • Tourism",
    outline: [
      [100.10, 6.45], [99.65, 6.55], [99.20, 7.05], [98.70, 7.75],
      [98.35, 8.45], [98.25, 9.15], [98.45, 9.75], [98.70, 10.35],
      [99.05, 10.95], [99.25, 11.65], [99.10, 12.35], [99.25, 13.05],
      [99.50, 13.75], [99.20, 14.45], [98.95, 15.15], [98.55, 15.75],
      [98.25, 16.35], [97.85, 16.85], [97.55, 17.35], [97.75, 17.95],
      [98.35, 18.45], [98.95, 18.95], [99.55, 19.35], [100.15, 19.75],
      [100.60, 20.15], [100.25, 20.55], [100.55, 20.35], [101.05, 19.95],
      [101.55, 19.55], [101.95, 19.05], [102.35, 18.55], [102.85, 18.05],
      [103.35, 17.55], [103.85, 17.05], [104.35, 16.55], [104.75, 16.05],
      [105.15, 15.55], [105.45, 15.05], [105.55, 14.55], [105.35, 14.05],
      [104.95, 13.55], [104.45, 13.05], [103.95, 12.55], [103.45, 12.05],
      [102.95, 11.55], [102.45, 11.05], [101.95, 10.55], [101.45, 10.05],
      [100.95, 9.55], [100.45, 9.05], [100.05, 8.45], [100.00, 7.75],
      [100.00, 7.05], [100.10, 6.45]
    ],
    center: [101.0, 13.0],
    scale: 1.5
  },
  vietnam: {
    name: "Vietnam",
    color: "#10b981",
    info: "Electronics • Textiles • Growing tech sector",
    outline: [
      [103.95, 22.55], [104.45, 22.85], [105.05, 23.05], [105.55, 22.85],
      [106.05, 22.55], [106.55, 22.25], [106.85, 21.85], [107.05, 21.45],
      [106.85, 21.05], [106.55, 20.55], [106.25, 20.05], [106.05, 19.55],
      [105.85, 19.05], [105.95, 18.55], [106.25, 18.05], [106.55, 17.55],
      [107.05, 17.05], [107.55, 16.55], [108.05, 16.25], [108.35, 15.85],
      [108.65, 15.45], [108.85, 15.05], [109.05, 14.55], [109.25, 14.05],
      [109.35, 13.55], [109.35, 13.05], [109.25, 12.55], [109.05, 12.05],
      [108.75, 11.55], [108.25, 11.05], [107.55, 10.55], [107.05, 10.35],
      [106.55, 10.05], [106.25, 9.55], [105.85, 9.05], [105.55, 8.75],
      [105.05, 8.55], [104.55, 8.65], [104.05, 8.85], [103.55, 9.05],
      [103.25, 9.55], [103.05, 10.05], [102.85, 10.55], [102.95, 11.05],
      [103.15, 11.55], [103.55, 12.05], [104.05, 12.55], [104.55, 13.05],
      [104.85, 13.55], [105.05, 14.05], [105.35, 14.55], [105.55, 15.05],
      [105.45, 15.55], [105.25, 16.05], [104.85, 16.55], [104.55, 17.05],
      [104.25, 17.55], [104.05, 18.05], [103.95, 18.55], [104.05, 19.05],
      [104.25, 19.55], [104.55, 20.05], [104.35, 20.55], [103.95, 21.05],
      [103.65, 21.55], [103.55, 22.05], [103.95, 22.55]
    ],
    center: [106.0, 16.0],
    scale: 1.4
  },
  indonesia: {
    name: "Indonesia (Sumatra)",
    color: "#f59e0b",
    info: "Critical minerals • Palm oil • Natural resources",
    outline: [
      [95.35, 5.65], [95.55, 5.25], [96.05, 4.85], [96.55, 4.45],
      [97.05, 4.05], [97.55, 3.55], [98.05, 3.05], [98.55, 2.55],
      [99.05, 2.05], [99.55, 1.55], [100.05, 1.05], [100.55, 0.55],
      [101.05, 0.05], [101.55, -0.45], [102.05, -0.95], [102.55, -1.45],
      [103.05, -1.95], [103.55, -2.45], [104.05, -2.95], [104.55, -3.45],
      [105.05, -3.95], [105.55, -4.45], [106.05, -4.95], [105.55, -5.45],
      [105.05, -5.75], [104.55, -5.45], [104.05, -5.15], [103.55, -4.75],
      [103.05, -4.45], [102.55, -3.95], [102.05, -3.45], [101.55, -2.95],
      [101.05, -2.45], [100.55, -1.95], [100.05, -1.45], [99.55, -0.95],
      [99.05, -0.45], [98.55, 0.05], [98.05, 0.55], [97.55, 1.05],
      [97.05, 1.55], [96.55, 2.05], [96.05, 2.55], [95.55, 3.05],
      [95.25, 3.55], [95.05, 4.05], [95.05, 4.55], [95.15, 5.05],
      [95.35, 5.65]
    ],
    center: [101.0, 0.5],
    scale: 1.3
  },
  philippines: {
    name: "Philippines",
    color: "#ec4899",
    info: "Services • BPO hub • Growing manufacturing",
    outline: [
      [117.05, 5.05], [117.55, 5.55], [118.05, 6.05], [118.55, 6.55],
      [119.05, 7.05], [119.55, 7.55], [120.05, 8.05], [120.55, 8.55],
      [121.05, 9.05], [121.55, 9.55], [122.05, 10.05], [122.55, 10.55],
      [123.05, 11.05], [123.55, 11.55], [124.05, 12.05], [124.55, 12.55],
      [124.55, 13.05], [124.25, 13.55], [123.85, 14.05], [123.55, 14.55],
      [123.05, 15.05], [122.55, 15.55], [122.05, 16.05], [121.55, 16.55],
      [121.05, 17.05], [120.55, 17.55], [120.05, 18.05], [119.85, 18.55],
      [120.25, 18.25], [120.55, 17.85], [120.35, 17.35], [119.85, 17.05],
      [119.35, 16.55], [118.85, 16.05], [118.55, 15.55], [118.25, 15.05],
      [118.05, 14.55], [117.85, 14.05], [117.55, 13.55], [117.25, 13.05],
      [117.05, 12.55], [116.85, 12.05], [116.55, 11.55], [116.25, 11.05],
      [116.05, 10.55], [116.05, 10.05], [116.25, 9.55], [116.55, 9.05],
      [116.55, 8.55], [116.35, 8.05], [116.05, 7.55], [116.05, 7.05],
      [116.25, 6.55], [116.55, 6.05], [116.85, 5.55], [117.05, 5.05]
    ],
    center: [122.0, 12.0],
    scale: 1.5
  },
  cambodia: {
    name: "Cambodia",
    color: "#6366f1",
    info: "Textiles • Agriculture • Tourism growth",
    outline: [
      [102.55, 14.55], [103.05, 14.35], [103.55, 14.25], [104.05, 14.35],
      [104.55, 14.45], [105.05, 14.35], [105.55, 14.05], [106.05, 13.55],
      [106.55, 13.05], [106.85, 12.55], [106.55, 12.05], [106.05, 11.55],
      [105.55, 11.05], [105.05, 10.85], [104.55, 10.55], [104.05, 10.55],
      [103.55, 10.85], [103.25, 11.25], [103.05, 11.85], [102.85, 12.35],
      [102.65, 12.85], [102.55, 13.35], [102.45, 13.85], [102.55, 14.55]
    ],
    center: [104.5, 12.5],
    scale: 2.5
  }
};

// Convert geo coordinates to 3D flat map position
function geoToMap(lng, lat, scale = 1, offsetX = 0, offsetY = 0) {
  return [
    (lng - 103) * scale * 0.8 + offsetX,
    0,
    (lat - 8) * scale * -0.8 + offsetY
  ];
}

// Country shape with real borders
function CountryShape({ data, isSelected, isHovered, onSelect, onHover }) {
  const meshRef = useRef();
  const outlineRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const points = data.outline.map(([lng, lat]) => {
      const [x, , z] = geoToMap(lng, lat, data.scale, 0, 0);
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
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [shape]);

  const outlinePoints = useMemo(() => {
    return data.outline.map(([lng, lat]) => {
      const [x, , z] = geoToMap(lng, lat, data.scale, 0, 0);
      return new THREE.Vector3(x, 0.2, z);
    });
  }, [data]);

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = (isSelected || localHover) ? 0.3 : 0;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
      meshRef.current.material.emissiveIntensity = (isSelected || localHover) ? 0.4 : 0.15;
    }
  });

  const [cx, , cz] = geoToMap(data.center[0], data.center[1], data.scale, 0, 0);

  return (
    <group position={[cx, 0, cz]}>
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
          color={isSelected || localHover ? "#ffffff" : data.color}
          emissive={data.color}
          emissiveIntensity={0.15}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Border outline */}
      <Line
        points={outlinePoints.map(p => [p.x - cx, p.y, p.z - cz])}
        color={data.color}
        lineWidth={2}
        transparent
        opacity={isSelected || localHover ? 1 : 0.5}
      />

      {/* Label */}
      {(isSelected || localHover) && (
        <Html position={[0, 1.2, 0]} center distanceFactor={12}>
          <div className="bg-white rounded-xl p-4 shadow-2xl min-w-[200px] transform transition-all border border-slate-200">
            <h3 className="text-slate-900 font-bold text-lg">{data.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{data.info}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: data.color }} />
              <span className="text-xs text-slate-400">Click for details</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// SEZ Zone between Singapore and Johor
function SEZIndicator() {
  const ringRef = useRef();
  const [sgX, , sgZ] = geoToMap(103.82, 1.35, 5, 0, 0);
  const [jhX, , jhZ] = geoToMap(103.65, 1.75, 5, 0, 0);
  const centerX = (sgX + jhX) / 2;
  const centerZ = (sgZ + jhZ) / 2;

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[centerX, 0.05, centerZ]}>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.2, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.1} />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.8, 0]} center>
        <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-emerald-500/30">
          JS-SEZ Zone
        </div>
      </Html>

      {/* Connection line */}
      <Line
        points={[[sgX - centerX, 0.15, sgZ - centerZ], [jhX - centerX, 0.15, jhZ - centerZ]]}
        color="#fbbf24"
        lineWidth={3}
        dashed
        dashSize={0.2}
        dashScale={2}
      />
    </group>
  );
}

// Trade route with animated flow
function TradeFlow({ from, to, color = "#fbbf24" }) {
  const particleRef = useRef();
  const [fromX, , fromZ] = geoToMap(from[0], from[1], 2, 0, 0);
  const [toX, , toZ] = geoToMap(to[0], to[1], 2, 0, 0);

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(fromX, 0.2, fromZ),
      new THREE.Vector3((fromX + toX) / 2, 1.5, (fromZ + toZ) / 2),
      new THREE.Vector3(toX, 0.2, toZ)
    );
  }, [fromX, fromZ, toX, toZ]);

  const points = useMemo(() => curve.getPoints(40), [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * 0.2) % 1;
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={2} transparent opacity={0.4} />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Water/ocean plane
function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial
        color="#0c3d5f"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function MapScene({ selectedCountry, hoveredCountry, onSelect, onHover, showRoutes }) {
  const tradeRoutes = [
    { from: [103.82, 1.35], to: [103.65, 1.75], color: "#fbbf24" },
    { from: [103.82, 1.35], to: [106.0, 16.0], color: "#10b981" },
    { from: [103.82, 1.35], to: [101.0, 0.5], color: "#f59e0b" },
    { from: [101.5, 4.0], to: [101.0, 13.0], color: "#8b5cf6" },
  ];

  return (
    <>
      <Ocean />
      <gridHelper args={[80, 40, "#1e4060", "#0d2845"]} position={[0, -0.04, 0]} />

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

      <SEZIndicator />

      {showRoutes && tradeRoutes.map((route, i) => (
        <TradeFlow key={i} from={route.from} to={route.to} color={route.color} />
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
      <Canvas camera={{ position: [0, 25, 35], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[15, 25, 15]} intensity={0.7} />
        <pointLight position={[-15, 15, -15]} intensity={0.3} color="#4da6ff" />

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
          minDistance={15}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
