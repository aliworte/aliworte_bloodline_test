import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ArmillaryRings() {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  // Gold material shared across rings
  const goldMaterial = (
    <meshStandardMaterial
      color="#c9a84c"
      metalness={0.95}
      roughness={0.15}
      emissive="#c9a84c"
      emissiveIntensity={0.15}
      transparent
      opacity={0.7}
      side={THREE.DoubleSide}
    />
  );

  // Bright gold for center sphere
  const centerMaterial = (
    <meshStandardMaterial
      color="#e8d5a3"
      metalness={1.0}
      roughness={0.1}
      emissive="#e8d5a3"
      emissiveIntensity={0.3}
      transparent
      opacity={0.9}
    />
  );

  useFrame((_state, delta) => {
    time.current += delta;

    // Entire structure slowly rotates
    if (groupRef.current) {
      groupRef.current.rotation.y = time.current * 0.15;
      groupRef.current.rotation.x = Math.sin(time.current * 0.08) * 0.1;
    }

    // Inner rings rotate at different speeds (counter-rotation)
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.z = time.current * 0.25;
      innerGroupRef.current.rotation.x = time.current * 0.18;
    }
  });

  const ringRadius = 1.0;
  const tubeRadius = 0.018;
  const segments = 64;

  return (
    <group ref={groupRef}>
      {/* ===== OUTER FIXED RINGS ===== */}

      {/* 1. Equatorial ring - horizontal (XZ plane, default) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, tubeRadius, 16, segments]} />
        {goldMaterial}
      </mesh>

      {/* 2. Prime meridian ring - vertical (YZ plane) */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[ringRadius, tubeRadius, 16, segments]} />
        {goldMaterial}
      </mesh>

      {/* 3. Another vertical ring, 90° rotated (XY plane) */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[ringRadius, tubeRadius, 16, segments]} />
        {goldMaterial}
      </mesh>

      {/* ===== CONNECTING BRACKETS (decorative arcs at intersections) ===== */}

      {/* Small connecting rings at 45° positions */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={`bracket-${i}`} rotation={[Math.PI / 4, angle, 0]}>
          <torusGeometry args={[ringRadius * 0.15, tubeRadius * 0.8, 8, 16]} />
          {goldMaterial}
        </mesh>
      ))}

      {/* ===== INNER ROTATING RINGS ===== */}
      <group ref={innerGroupRef}>
        {/* 4. Ecliptic ring - tilted 23.5° */}
        <mesh rotation={[0, 0, Math.PI * 0.13]}>
          <torusGeometry args={[ringRadius * 0.82, tubeRadius * 0.85, 16, segments]} />
          {goldMaterial}
        </mesh>

        {/* 5. Inner meridian ring */}
        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[ringRadius * 0.68, tubeRadius * 0.85, 16, segments]} />
          {goldMaterial}
        </mesh>

        {/* 6. Inner equatorial */}
        <mesh rotation={[0, Math.PI / 3, Math.PI / 2]}>
          <torusGeometry args={[ringRadius * 0.55, tubeRadius * 0.85, 16, segments]} />
          {goldMaterial}
        </mesh>

        {/* 7. Smallest tilted ring */}
        <mesh rotation={[Math.PI / 3, Math.PI / 6, Math.PI / 5]}>
          <torusGeometry args={[ringRadius * 0.42, tubeRadius * 0.8, 16, segments]} />
          {goldMaterial}
        </mesh>

        {/* ===== CENTER SPHERE (the "Earth" / core) ===== */}
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          {centerMaterial}
        </mesh>

        {/* Axis rod through center */}
        <mesh rotation={[0, 0, Math.PI * 0.13]}>
          <cylinderGeometry args={[tubeRadius * 0.5, tubeRadius * 0.5, ringRadius * 1.6, 8]} />
          {goldMaterial}
        </mesh>
      </group>

      {/* ===== OUTER DECORATIVE POINTER RINGS ===== */}

      {/* Thin outer halo ring */}
      <mesh rotation={[Math.PI / 6, Math.PI / 5, 0]}>
        <torusGeometry args={[ringRadius * 1.08, tubeRadius * 0.5, 8, segments]} />
        <meshStandardMaterial
          color="#c9a84c"
          metalness={0.9}
          roughness={0.2}
          emissive="#c9a84c"
          emissiveIntensity={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Top ornament ring */}
      <mesh position={[0, ringRadius * 0.85, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, tubeRadius * 0.8, 8, 16]} />
        {goldMaterial}
      </mesh>

      {/* Bottom ornament ring */}
      <mesh position={[0, -ringRadius * 0.85, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, tubeRadius * 0.8, 8, 16]} />
        {goldMaterial}
      </mesh>

      {/* ===== AMBIENT LIGHTING ===== */}
      <pointLight color="#e8d5a3" intensity={0.6} distance={6} position={[2, 2, 3]} />
      <pointLight color="#c9a84c" intensity={0.3} distance={5} position={[-2, -1, 2]} />
    </group>
  );
}

interface ArmillarySphereProps {
  size?: number;
}

export default function ArmillarySphere({ size = 300 }: ArmillarySphereProps) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0.3, 2.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#fff5e0" />
        <directionalLight position={[-3, -2, 3]} intensity={0.2} color="#c9a84c" />
        <ArmillaryRings />
      </Canvas>
    </div>
  );
}
