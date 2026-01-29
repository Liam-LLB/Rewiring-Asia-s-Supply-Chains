import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function FlowingParticles({ start, end, color = "#fbbf24", count = 20 }) {
  const particlesRef = useRef();
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        offset: i / count,
        speed: 0.3 + Math.random() * 0.2
      });
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      const children = particlesRef.current.children;
      children.forEach((child, i) => {
        const t = ((state.clock.elapsedTime * positions[i].speed + positions[i].offset) % 1);
        child.position.x = start[0] + (end[0] - start[0]) * t;
        child.position.y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.3;
        child.position.z = start[2] + (end[2] - start[2]) * t;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {positions.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Node({ position, label, icon, color = "#3b82f6", size = 0.4, description }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      <group position={position}>
        {/* Main node */}
        <RoundedBox ref={meshRef} args={[size, size, size]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.6}
          />
        </RoundedBox>

        {/* Glow effect */}
        <mesh>
          <sphereGeometry args={[size * 0.8, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>

        {/* Label */}
        <Html position={[0, size + 0.3, 0]} center distanceFactor={6}>
          <div className="bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center border border-white/20 min-w-[100px]">
            <p className="text-white font-bold text-sm">{label}</p>
            {description && (
              <p className="text-white/60 text-xs mt-1">{description}</p>
            )}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function ConnectionLine({ start, end, color = "#374151" }) {
  const curve = useMemo(() => {
    const mid = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5,
      (start[2] + end[2]) / 2
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, [curve]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function SupplyChainScene({ variant = "simple" }) {
  const nodes = {
    simple: [
      { pos: [-3, 0, 0], label: "Raw Materials", color: "#6b7280", description: "Natural Resources" },
      { pos: [0, 0, 0], label: "JS-SEZ", color: "#10b981", description: "Manufacturing Hub" },
      { pos: [3, 0, 0], label: "Global Markets", color: "#3b82f6", description: "Distribution" },
    ],
    detailed: [
      { pos: [-4, 1, 0], label: "Malaysia", color: "#3b82f6", description: "Land & Labor" },
      { pos: [-4, -1, 0], label: "ASEAN", color: "#8b5cf6", description: "Regional Trade" },
      { pos: [-1.5, 0, 0], label: "Johor", color: "#ef4444", description: "Manufacturing" },
      { pos: [1.5, 0, 0], label: "Singapore", color: "#ef4444", description: "Finance & Tech" },
      { pos: [4, 1, 0], label: "Global Markets", color: "#10b981", description: "Export" },
      { pos: [4, -1, 0], label: "Investors", color: "#fbbf24", description: "FDI" },
    ]
  };

  const connections = {
    simple: [
      { start: [-3, 0, 0], end: [0, 0, 0], color: "#fbbf24" },
      { start: [0, 0, 0], end: [3, 0, 0], color: "#10b981" },
    ],
    detailed: [
      { start: [-4, 1, 0], end: [-1.5, 0, 0], color: "#3b82f6" },
      { start: [-4, -1, 0], end: [-1.5, 0, 0], color: "#8b5cf6" },
      { start: [-1.5, 0, 0], end: [1.5, 0, 0], color: "#fbbf24" },
      { start: [1.5, 0, 0], end: [4, 1, 0], color: "#10b981" },
      { start: [1.5, 0, 0], end: [4, -1, 0], color: "#fbbf24" },
      { start: [4, -1, 0], end: [1.5, 0, 0], color: "#fbbf24" },
    ]
  };

  const currentNodes = nodes[variant] || nodes.simple;
  const currentConnections = connections[variant] || connections.simple;

  return (
    <>
      {currentNodes.map((node, i) => (
        <Node
          key={i}
          position={node.pos}
          label={node.label}
          color={node.color}
          description={node.description}
        />
      ))}

      {currentConnections.map((conn, i) => (
        <React.Fragment key={i}>
          <ConnectionLine start={conn.start} end={conn.end} color={conn.color} />
          <FlowingParticles start={conn.start} end={conn.end} color={conn.color} count={15} />
        </React.Fragment>
      ))}
    </>
  );
}

export default function SupplyChain3D({
  variant = "simple",
  height = "400px",
  className = ""
}) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, 5]} intensity={0.5} color="#3b82f6" />

        {/* Grid floor */}
        <gridHelper args={[12, 24, "#1e3a5f", "#0f2744"]} position={[0, -1, 0]} />

        <SupplyChainScene variant={variant} />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
