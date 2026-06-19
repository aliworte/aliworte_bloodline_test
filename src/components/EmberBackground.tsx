import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;

  // Hash-based random
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Smooth star glow
  float starGlow(vec2 uv, vec2 pos, float size, float brightness) {
    float d = length(uv - pos);
    return brightness * exp(-d * d / (size * size));
  }

  // Twinkle
  float twinkle(float t, float offset) {
    return 0.5 + 0.5 * sin(t * (0.8 + offset * 0.3) + offset * 6.28);
  }

  void main() {
    vec2 st = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    vec2 p = (st - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    float t = u_time;

    // Deep dark blue-black base
    vec3 baseColor = vec3(0.02, 0.03, 0.06);
    vec3 color = baseColor;

    // Mouse interaction - soft stardust glow
    float mouseGlow = 0.0;
    if (u_mouse.x > 0.0) {
      vec2 mousePos = (u_mouse - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
      float mouseDist = length(p - mousePos);
      mouseGlow = exp(-mouseDist * mouseDist * 8.0) * 0.15;
    }
    color += vec3(0.6, 0.75, 1.0) * mouseGlow;

    // Large soft nebula patches
    for (float i = 0.0; i < 3.0; i++) {
      vec2 nebulaPos = vec2(
        sin(i * 2.1 + 0.7) * 0.6,
        cos(i * 1.7 + 0.3) * 0.5
      );
      float nebulaD = length(p - nebulaPos);
      float nebulaSize = 0.35 + i * 0.08;
      float nebulaGlow = exp(-nebulaD * nebulaD / (nebulaSize * nebulaSize));
      float nebulaPulse = 0.4 + 0.6 * twinkle(t * 0.15, i * 3.7);
      vec3 nebulaColor = mix(
        vec3(0.05, 0.08, 0.18),
        vec3(0.08, 0.12, 0.22),
        i / 3.0
      );
      color += nebulaColor * nebulaGlow * nebulaPulse * 0.3;
    }

    // Stars - fixed positions based on hash for consistency
    for (float i = 0.0; i < 80.0; i++) {
      vec2 starSeed = vec2(
        hash(vec2(i * 17.3, 42.0)),
        hash(vec2(i * 31.7, 99.0))
      );
      vec2 starPos = (starSeed - 0.5) * 2.2;

      // Subtle parallax drift
      starPos.x += sin(t * 0.02 + i) * 0.01;
      starPos.y += cos(t * 0.015 + i * 0.7) * 0.008;

      float starSize = 0.002 + hash(vec2(i * 5.1, 13.0)) * 0.004;
      float starBright = 0.3 + hash(vec2(i * 11.3, 77.0)) * 0.7;
      float tw = twinkle(t, hash(vec2(i * 3.3, 55.0)));

      float glow = starGlow(p, starPos, starSize, starBright * tw);

      // Star color: mostly white/blue-white, occasional warm
      vec3 starColor = mix(
        vec3(0.85, 0.9, 1.0),
        vec3(1.0, 0.95, 0.85),
        hash(vec2(i * 7.7, 33.0))
      );
      color += starColor * glow;
    }

    // A few larger, brighter stars
    for (float i = 0.0; i < 8.0; i++) {
      vec2 bigStarSeed = vec2(
        hash(vec2(i * 53.1 + 200.0, 17.0)),
        hash(vec2(i * 41.3 + 200.0, 61.0))
      );
      vec2 bigStarPos = (bigStarSeed - 0.5) * 2.0;
      float bigTw = twinkle(t * 0.7, i * 1.5);
      float bigGlow = starGlow(p, bigStarPos, 0.006, 0.8 * bigTw);
      color += vec3(0.9, 0.93, 1.0) * bigGlow;
    }

    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(p));
    color *= 0.85 + vignette * 0.15;

    // Very subtle overall pulse
    color *= 0.95 + 0.05 * sin(t * 0.1);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function StarfieldPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(-1, -1));
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(-1, -1) },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    []
  );

  useEffect(() => {
    uniforms.u_resolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.set(e.clientX, window.innerHeight - e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.u_time.value = state.clock.getElapsedTime();
      mat.uniforms.u_mouse.value.lerp(mouseRef.current, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function EmberBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <StarfieldPlane />
      </Canvas>
    </div>
  );
}
