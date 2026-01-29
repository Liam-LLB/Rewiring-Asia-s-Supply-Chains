import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

function TimelineNode({ position, year, title, description, color, index, isActive, onClick }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = position[1] + (hovered || isActive ? 0.3 : 0);
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      ringRef.current.scale.setScalar(hovered || isActive ? scale * 1.2 : scale);
    }
  });

  return (
    <group position={position}>
      {/* Main node */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={hovered || isActive ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered || isActive ? 0.8 : 0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={hovered || isActive ? 0.8 : 0.4} />
      </mesh>

      {/* Year label */}
      <Html position={[0, -0.6, 0]} center>
        <div
          className={`text-center cursor-pointer transition-all ${hovered || isActive ? 'scale-110' : ''}`}
          onClick={onClick}
        >
          <p className="text-white font-bold text-lg">{year}</p>
        </div>
      </Html>

      {/* Info card */}
      {(hovered || isActive) && (
        <Html position={[0, 0.8, 0]} center distanceFactor={6}>
          <div className="bg-black/95 backdrop-blur-md rounded-xl p-4 min-w-[220px] border border-white/20 transform transition-all animate-fadeIn">
            <h3 className="text-white font-bold text-lg">{title}</h3>
            {description && (
              <p className="text-white/70 text-sm mt-2">{description}</p>
            )}
          </div>
        </Html>
      )}

      {/* Connector to base line */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function TimelinePath({ events }) {
  const pathRef = useRef();
  const width = (events.length - 1) * 2.5;

  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.material.dashOffset = -state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main path line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, width + 2, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glow effect */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, width + 2, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function TimelineScene({ events, activeEvent, onEventClick }) {
  return (
    <>
      <TimelinePath events={events} />

      {events.map((event, i) => {
        const xPos = (i - (events.length - 1) / 2) * 2.5;
        return (
          <TimelineNode
            key={i}
            index={i}
            position={[xPos, 0, 0]}
            year={event.year}
            title={event.title}
            description={event.description}
            color={event.color}
            isActive={activeEvent === i}
            onClick={() => onEventClick?.(i)}
          />
        );
      })}
    </>
  );
}

export default function Timeline3DNew({
  events = [],
  height = "400px",
  className = "",
  activeEvent,
  onEventClick
}) {
  const defaultEvents = [
    { year: "1965", title: "Singapore Independence", description: "Singapore separates from Malaysia", color: "#ef4444" },
    { year: "1962", title: "Water Agreement", description: "Long-term water supply contract signed", color: "#3b82f6" },
    { year: "2006", title: "Iskandar Malaysia", description: "Economic development corridor launched", color: "#8b5cf6" },
    { year: "2024", title: "JS-SEZ Agreement", description: "Special Economic Zone framework signed", color: "#10b981" },
    { year: "2027", title: "RTS Link", description: "Rapid Transit System operational", color: "#fbbf24" },
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, 5]} intensity={0.5} color="#3b82f6" />

        <TimelineScene
          events={timelineEvents}
          activeEvent={activeEvent}
          onEventClick={onEventClick}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
