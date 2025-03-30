"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useDeviceType } from "@/hooks/use-device-type"
import { motion } from "framer-motion"

interface MousePosition {
  x: number
  y: number
}

// 3D Model Component
function Model({ mousePosition }: { mousePosition: MousePosition }) {
  const modelRef = useRef<THREE.Group>(null!)
  const [modelError, setModelError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Preload the model
    const loadModel = async () => {
      try {
        setIsLoading(true)
        const model = await useGLTF.preload('/models/Whisker_Bright_0325220149_texture.glb')
        console.log('Model loaded successfully:', model)
      } catch (error) {
        console.error('Error preloading model:', error)
        setModelError('Failed to load 3D model')
      } finally {
        setIsLoading(false)
      }
    }

    loadModel()
  }, [])

  // Calculate rotation based on mouse position
  useFrame(() => {
    if (modelRef.current && mousePosition) {
      // Smooth rotation
      const targetRotationY = mousePosition.x * 1.5
      const targetRotationX = -mousePosition.y * 1

      // Smooth rotation response
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, 0.08)
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotationX, 0.08)
    }
  })

  if (isLoading) {
    return (
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </Float>
    )
  }

  if (modelError) {
    return (
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </Float>
    )
  }

  const { scene } = useGLTF('/models/Whisker_Bright_0325220149_texture.glb')

  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0} position={[0, 0, 0]}>
      <group ref={modelRef}>
        <primitive object={scene} scale={0.5} />
      </group>
    </Float>
  )
}

// Scene setup with mouse tracking
function Scene() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Skip during SSR
    if (typeof window === "undefined") return

    // Use requestAnimationFrame to ensure the browser is ready
    const frameId = requestAnimationFrame(() => {
      const updateMousePosition = (e: MouseEvent) => {
        // Convert mouse position to normalized coordinates (-1 to 1)
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        })
      }

      // Add event listener
      window.addEventListener("mousemove", updateMousePosition)

      // Return cleanup function
      return () => {
        window.removeEventListener("mousemove", updateMousePosition)
      }
    })

    // Clean up the initial requestAnimationFrame
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <>
      <Model mousePosition={mousePosition} />
      <Environment preset="city" />
    </>
  )
}

export function CursorFollowingCharacter() {
  const { isDesktop } = useDeviceType()
  const [isMounted, setIsMounted] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const [showFloatingText, setShowFloatingText] = useState(false)

  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return

    // Use requestAnimationFrame to ensure the browser is ready
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true)
    })

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  // Track mouse movement to show floating text
  const handleMouseMove = () => {
    if (interactionCount < 5) {
      setInteractionCount(prev => prev + 1)
      if (interactionCount === 3) {
        setShowFloatingText(true)
        setTimeout(() => setShowFloatingText(false), 3000)
      }
    }
  }

  // Only render on desktop devices and client-side
  if (!isDesktop || !isMounted) {
    return null
  }

  const floatingTexts = [
    { text: "Hello!", color: "text-blue-300", x: -110, y: -60, delay: 0 },
    { text: "I'm here to help!", color: "text-purple-300", x: 100, y: -40, delay: 0.5 },
    { text: "Try algorithms!", color: "text-green-300", x: 80, y: 50, delay: 1 }
  ]

  return (
    <div 
      className="w-full h-[400px] overflow-hidden rounded-lg relative"
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>

      {/* Floating text animations */}
      {showFloatingText && (
        <div className="absolute inset-0 pointer-events-none">
          {floatingTexts.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute top-1/2 left-1/2 ${item.color} text-lg font-medium tracking-wide`}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0, 
                scale: 0.5 
              }}
              animate={{ 
                x: item.x, 
                y: item.y, 
                opacity: [0, 1, 0.8, 0], 
                scale: [0.5, 1.2, 1, 0.8] 
              }}
              transition={{ 
                duration: 2.5, 
                delay: item.delay,
                ease: "easeOut" 
              }}
            >
              {item.text}
            </motion.div>
          ))}
        </div>
      )}

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full bg-purple-400/50"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: 0
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-3 left-0 right-0 text-center text-white/70 text-sm pointer-events-none">
        Move your cursor to interact with the model
      </div>
    </div>
  )
}

