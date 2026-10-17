
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function NeuralStructure() {
  const core = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const particles = useRef<THREE.Points>(null);

  const particlePositions = new Float32Array(1800 * 3);

  for (let i = 0; i < 1800; i++) {
    const radius = 2.1 + Math.random() * 2.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i * 3] =
      radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] =
      radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] =
      radius * Math.cos(phi);
  }

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (core.current) {
      core.current.rotation.y += delta * 0.12;
      core.current.rotation.x =
        Math.sin(time * 0.2) * 0.12;
    }

    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08;
      const pulse = 1 + Math.sin(time * 1.4) * 0.025;
      shell.current.scale.setScalar(pulse);
    }

    if (ringA.current) {
      ringA.current.rotation.x = time * 0.12;
      ringA.current.rotation.y = time * 0.18;
    }

    if (ringB.current) {
      ringB.current.rotation.x = 1.1 + Math.sin(time * 0.3) * 0.15;
      ringB.current.rotation.y = -time * 0.14;
      ringB.current.rotation.z = time * 0.08;
    }

    if (particles.current) {
      particles.current.rotation.y = time * 0.012;
      particles.current.rotation.x = Math.sin(time * 0.08) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[3, 3, 3]} intensity={24} color="#63ffe0" />
      <pointLight position={[-3, -2, -3]} intensity={15} color="#438cff" />
      <pointLight position={[0, 2, -2]} intensity={8} color="#a78bfa" />

      <Stars
        radius={70}
        depth={40}
        count={1300}
        factor={2}
        saturation={0.3}
        fade
        speed={0.35}
      />

      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#69ffe1"
          size={0.012}
          transparent
          opacity={0.72}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <Float speed={0.8} rotationIntensity={0.12} floatIntensity={0.2}>
        <group ref={core} scale={0.94}>
          <mesh ref={shell}>
            <icosahedronGeometry args={[1.05, 2]} />
            <meshBasicMaterial
              color="#21f5d0"
              wireframe
              transparent
              opacity={0.5}
            />
          </mesh>

          <mesh>
            <icosahedronGeometry args={[0.78, 1]} />
            <meshBasicMaterial
              color="#0a756d"
              wireframe
              transparent
              opacity={0.75}
            />
          </mesh>

          <mesh>
            <icosahedronGeometry args={[0.45, 2]} />
            <meshStandardMaterial
              color="#25e9c5"
              emissive="#087c72"
              emissiveIntensity={2.5}
              metalness={0.6}
              roughness={0.25}
              wireframe
              transparent
              opacity={0.9}
            />
          </mesh>

          <mesh>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial color="#c6fff3" />
          </mesh>

          <mesh ref={ringA} rotation={[1.05, 0.2, 0.35]}>
            <torusGeometry args={[1.42, 0.009, 8, 180]} />
            <meshBasicMaterial color="#35f4d3" transparent opacity={0.85} />
          </mesh>

          <mesh ref={ringB} rotation={[0.5, 0.9, 1.2]}>
            <torusGeometry args={[1.7, 0.005, 8, 180]} />
            <meshBasicMaterial color="#5b9dff" transparent opacity={0.8} />
          </mesh>

          <mesh rotation={[1.3, 0.6, 0]}>
            <torusGeometry args={[1.28, 0.004, 8, 160]} />
            <meshBasicMaterial color="#b5fff0" transparent opacity={0.65} />
          </mesh>
        </group>
      </Float>
    </>
  );
}

export default function NeuralCore() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at center, rgba(14,100,87,0.18), transparent 65%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <NeuralStructure />
      </Canvas>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(29, 242, 202, 0.055)",
          filter: "blur(45px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
