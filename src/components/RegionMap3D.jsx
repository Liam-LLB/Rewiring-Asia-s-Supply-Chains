import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function MalaysiaShape({ onClick, isHighlighted }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <group position={[-1, 0, 0]}>
      {/* Simplified Malaysia/Johor shape */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        position={[0, 0.1, 0]}
      >
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial
          color={isHighlighted ? "#3b82f6" : "#1e40af"}
          emissive="#3b82f6"
          emissiveIntensity={isHighlighted ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Johor region highlight */}
      <mesh position={[1.2, 0.15, -0.5]}>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <Html position={[0, 0.8, 0]} center>
        <div className="text-white font-bold text-lg bg-black/50 px-3 py-1 rounded">
          MALAYSIA
        </div>
      </Html>

      <Html position={[1.2, 0.6, -0.5]} center>
        <div className="text-red-400 font-semibold text-sm bg-black/70 px-2 py-1 rounded">
          Johor
        </div>
      </Html>
    </group>
  );
}

function SingaporeShape({ onClick, isHighlighted }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.material.emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  return (
    <group position={[1.5, 0, -0.5]}>
      {/* Singapore island shape */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        position={[0, 0.1, 0]}
      >
        <boxGeometry args={[0.6, 0.15, 0.4]} />
        <meshStandardMaterial
          color={isHighlighted ? "#ef4444" : "#dc2626"}
          emissive="#ef4444"
          emissiveIntensity={isHighlighted ? 0.4 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <Html position={[0, 0.6, 0]} center>
        <div className="text-red-400 font-bold text-sm bg-black/70 px-2 py-1 rounded">
          SINGAPORE
        </div>
      </Html>
    </group>
  );
}

function ConnectionBridge() {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group>
      {/* Causeway connection */}
      <mesh position={[0.9, 0.15, -0.5]} ref={lineRef}>
        <boxGeometry args={[0.8, 0.05, 0.1]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>

      {/* RTS Link label */}
      <Html position={[0.9, 0.4, -0.5]} center>
        <div className="text-yellow-400 text-xs bg-black/80 px-2 py-1 rounded animate-pulse">
          RTS Link 2027
        </div>
      </Html>
    </group>
  );
}

function SEZZone() {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
      <group position={[0.7, 0.5, -0.5]}>
        {/* SEZ area indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>

        <Html position={[0, 0.8, 0]} center>
          <div className="bg-emerald-900/90 border border-emerald-500/50 px-3 py-2 rounded-lg text-center">
            <p className="text-emerald-400 font-bold text-sm">JS-SEZ</p>
            <p className="text-emerald-300/80 text-xs">Special Economic Zone</p>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function WaterPlane() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color="#0c4a6e"
        transparent
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function Grid() {
  return (
    <group position={[0, -0.04, 0]}>
      <gridHelper args={[10, 20, "#1e3a5f", "#0f2744"]} />
    </group>
  );
}

export default function RegionMap3D({
  height = "400px",
  className = "",
  onRegionClick,
  showSEZ = true
}) {
  const [highlightedRegion, setHighlightedRegion] = useState(null);

  const handleClick = (region) => {
    setHighlightedRegion(region);
    onRegionClick?.(region);
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [3, 4, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} />

        <WaterPlane />
        <Grid />

        <MalaysiaShape
          onClick={() => handleClick('malaysia')}
          isHighlighted={highlightedRegion === 'malaysia'}
        />

        <SingaporeShape
          onClick={() => handleClick('singapore')}
          isHighlighted={highlightedRegion === 'singapore'}
        />

        <ConnectionBridge />

        {showSEZ && <SEZZone />}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
