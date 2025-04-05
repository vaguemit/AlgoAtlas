"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Environment } from "@react-three/drei"
import { useInView } from "framer-motion"
import type * as THREE from "three"

function CodeSymbol(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)

  // Animate rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t / 4) / 4
    meshRef.current.rotation.z = Math.sin(t / 4) / 8
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group {...props} ref={meshRef}>
        {/* Main octahedron */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <MeshDistortMaterial
            color="#9333ea"
            emissive="#9333ea"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
            speed={0.5}
            distort={0.2}
          />
        </mesh>

        {/* Orbiting torus */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.15, 16, 32]} />
          <MeshWobbleMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.3}
            factor={0.3}
            speed={2}
            roughness={0.4}
          />
        </mesh>

        {/* Small spheres */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 2) * 2.5, Math.sin((i * Math.PI) / 2) * 2.5, 0]}
            scale={0.4}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

export function FloatingMascot() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <div
      ref={ref}
      className="w-full h-full"
      style={{
        opacity: isInView ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <CodeSymbol />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

