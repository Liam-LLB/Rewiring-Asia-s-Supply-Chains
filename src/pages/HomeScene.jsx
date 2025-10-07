import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

export default function HomeScene() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        {/* Lumières */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="white" />
        <pointLight position={[0, 0, 4]} color="#417BFF" intensity={0.6} />
        <pointLight position={[0, 0, -4]} color="#FF3B3B" intensity={0.6} />

        <Suspense fallback={null}>
          <Stars radius={150} depth={80} count={2500} factor={6} fade speed={0.6} />
          <Planet />
          <ColorRing />
          <FloatingText />
          <CinematicZoom />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* Musique d’ambiance */}
      <audio
        autoPlay
        loop
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_ba4a82e64e.mp3?filename=cinematic-space-ambient-11277.mp3"
        volume="0.05"
      />
    </div>
  );
}

/* 🌍 Terre 3D */
function Planet() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0015;
  });

  return (
    <mesh ref={meshRef} rotation={[0.3, 2, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        color="#0b1120"
        metalness={0.6}
        roughness={0.5}
        emissive="#1a2a5f"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

/* 🔵🔴 Halo coloré tournant autour de la Terre */
function ColorRing() {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.25;
      const hue = (Math.sin(state.clock.elapsedTime * 0.8) + 1) / 2;
      ringRef.current.material.color.setHSL(0.03 + hue * 0.1, 1, 0.45);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.3, 2.6, 128]} />
      <meshBasicMaterial side={THREE.DoubleSide} transparent opacity={0.7} />
    </mesh>
  );
}

/* ✨ Texte central “USA vs Chine” */
function FloatingText() {
  const textRef = useRef();
  const [opacity, setOpacity] = useState(0);

  // Animation du fondu
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    setOpacity(Math.min(1, t / 3)); // apparition lente sur 3s
  });

  return (
    <Center position={[0, -0.2, 0]}>
      <Text3D
        ref={textRef}
        font="https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/fonts/inter_regular.typeface.json"
        size={0.35}
        height={0.05}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
      >
        USA vs Chine
        <meshStandardMaterial
          color={new THREE.Color("#ffffff")}
          metalness={0.9}
          roughness={0.1}
          emissive={new THREE.Color("#4a90ff")}
          emissiveIntensity={0.8 * opacity}
        />
      </Text3D>
    </Center>
  );
}

/* 🎥 Zoom cinématique façon Universal */
function CinematicZoom() {
  const [start, setStart] = useState(false);

  useFrame(({ camera, clock }) => {
    if (!start) setStart(true);

    // Zoom et légère oscillation de caméra
    if (start && camera.position.z > 5) {
      camera.position.z -= 0.02;
      camera.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.05;
      camera.rotation.x = Math.sin(clock.elapsedTime * 0.03) * 0.03;
    }
  });

  return null;
}
