import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

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

function GlobeMesh({ highlightPoints = [], connectionLines = [], autoRotate = true }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = meshRef.current?.rotation.y || 0;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pts.push(
        2.01 * Math.sin(phi) * Math.cos(theta),
        2.01 * Math.cos(phi),
        2.01 * Math.sin(phi) * Math.sin(theta)
      );
    }
    return new Float32Array(pts);
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main globe sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a365d"
          transparent
          opacity={0.85}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Globe wireframe */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Scattered points for land masses effect */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#60a5fa" transparent opacity={0.6} />
      </points>

      {/* Highlight points (cities/locations) */}
      {highlightPoints.map((point, i) => {
        const pos = latLngToVector3(point.lat, point.lng, 2.05);
        return (
          <group key={i} position={pos}>
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={point.color || "#ef4444"} />
            </mesh>
            {point.label && (
              <Html distanceFactor={6} style={{ pointerEvents: 'none' }}>
                <div className="px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                  {point.label}
                </div>
              </Html>
            )}
            {/* Pulse effect */}
            <mesh>
              <ringGeometry args={[0.06, 0.12, 32]} />
              <meshBasicMaterial color={point.color || "#ef4444"} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Connection lines between points */}
      {connectionLines.map((line, i) => {
        const start = latLngToVector3(line.from.lat, line.from.lng, 2.05);
        const end = latLngToVector3(line.to.lat, line.to.lng, 2.05);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(2.5);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const curvePoints = curve.getPoints(50);

        return (
          <Line
            key={i}
            points={curvePoints}
            color={line.color || "#fbbf24"}
            lineWidth={1.5}
            transparent
            opacity={0.7}
          />
        );
      })}

      {/* Atmosphere glow */}
      <Sphere args={[2.15, 64, 64]} ref={glowRef}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

export default function Globe3D({
  highlightPoints = [],
  connectionLines = [],
  autoRotate = true,
  height = "400px",
  className = ""
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

        <GlobeMesh
          highlightPoints={highlightPoints}
          connectionLines={connectionLines}
          autoRotate={autoRotate}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
