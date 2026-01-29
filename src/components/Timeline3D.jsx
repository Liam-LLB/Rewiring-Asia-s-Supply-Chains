import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

function TimelineEvent({ position, year, title, description, color = "#ef4444", index }) {
  const meshRef = useRef();
  const floatRef = useRef(0);

  useFrame((state) => {
    floatRef.current += 0.02;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(floatRef.current + index) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Event marker */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Year label */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {year}
      </Text>

      {/* Info card */}
      <Html position={[0, 0.8, 0]} center distanceFactor={8}>
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-[150px] max-w-[200px] border border-white/20 text-center transform transition-transform hover:scale-105">
          <p className="text-white font-bold text-sm">{title}</p>
          {description && (
            <p className="text-white/70 text-xs mt-1">{description}</p>
          )}
        </div>
      </Html>

      {/* Connector line to base */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function TimelineLine({ events }) {
  const totalWidth = (events.length - 1) * 3;

  return (
    <group>
      {/* Main timeline line */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, totalWidth + 2, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glowing line overlay */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, totalWidth + 2, 8]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function Timeline3D({ events = [], height = "350px", className = "" }) {
  const defaultEvents = [
    { year: "1800s", title: "British Rule", color: "#6b7280" },
    { year: "1946", title: "Separation", color: "#6b7280" },
    { year: "1957", title: "Malaysia Independence", color: "#fbbf24" },
    { year: "1963", title: "Singapore Joins", color: "#3b82f6" },
    { year: "1965", title: "Singapore Splits", color: "#ef4444" },
    { year: "2024", title: "JS-SEZ Created", color: "#10b981" },
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, 5]} intensity={0.5} color="#3b82f6" />

        <TimelineLine events={timelineEvents} />

        {timelineEvents.map((event, i) => {
          const xPos = (i - (timelineEvents.length - 1) / 2) * 3;
          return (
            <TimelineEvent
              key={i}
              index={i}
              position={[xPos, 0, 0]}
              year={event.year}
              title={event.title}
              description={event.description}
              color={event.color}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
