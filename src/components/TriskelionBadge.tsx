import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  useFrame((_state, delta) => {
    time.current += delta * 0.5;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time.current * 0.4;
      ring1Ref.current.rotation.x = Math.sin(time.current * 0.2) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time.current * 0.6;
      ring2Ref.current.rotation.y = Math.cos(time.current * 0.3) * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time.current * 0.8;
      ring3Ref.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Ring 1 - outer */}
      <mesh ref={ring1Ref} scale={1.2}>
        <torusGeometry args={[1, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#ff0004"
          metalness={0.8}
          roughness={0.2}
          emissive="#ff0004"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Ring 2 - middle */}
      <mesh ref={ring2Ref} scale={0.8}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#ffca29"
          metalness={0.9}
          roughness={0.15}
          emissive="#ffca29"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Ring 3 - inner */}
      <mesh ref={ring3Ref} scale={0.4}>
        <torusGeometry args={[1, 0.06, 16, 100]} />
        <meshStandardMaterial
          color="#ff0004"
          metalness={1.0}
          roughness={0.1}
          emissive="#ff0004"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Center glowing core */}
      <mesh>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="#ffca29"
          metalness={0.5}
          roughness={0.3}
          emissive="#ffca29"
          emissiveIntensity={2.0}
        />
      </mesh>
      <pointLight
        color="#ffca29"
        intensity={1.5}
        distance={5}
        position={[0, 0, 0.5]}
      />
    </group>
  );
}

interface TriskelionBadgeProps {
  size?: number;
}

export default function TriskelionBadge({ size = 300 }: TriskelionBadgeProps) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <RotatingRings />
      </Canvas>
    </div>
  );
}
