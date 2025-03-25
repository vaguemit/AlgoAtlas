"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"

// 3D Background Elements Component
function FloatingShapes() {
  return (
    <>
      {/* Purple Octahedron */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.6} position={[-2, -0.5, 0]}>
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <MeshDistortMaterial
            color="#9333ea"
            emissive="#9333ea"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.8}
            speed={0.4}
            distort={0.2}
          />
        </mesh>
      </Float>

      {/* Blue Torus */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.5} position={[2, 0.5, -1]}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <torusGeometry args={[0.9, 0.25, 16, 32]} />
          <MeshWobbleMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            factor={0.3}
            speed={1}
            roughness={0.4}
          />
        </mesh>
      </Float>

      {/* Small Spheres */}
      {[
        { position: [3, -1, 0], color: "#c084fc", size: 0.5 },
        { position: [-3, 1, -1], color: "#60a5fa", size: 0.4 },
        { position: [0, 2, -2], color: "#f472b6", size: 0.3 },
      ].map((sphere, i) => (
        <Float
          key={i}
          speed={2 + Math.random()}
          rotationIntensity={0.4}
          floatIntensity={0.7}
          position={sphere.position}
        >
          <mesh>
            <sphereGeometry args={[sphere.size, 32, 32]} />
            <meshStandardMaterial
              color={sphere.color}
              emissive={sphere.color}
              emissiveIntensity={0.4}
              roughness={0.5}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
    </>
  )
}

export function SignupHeroSection() {
  const [email, setEmail] = useState("")

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[180px] opacity-10 animate-pulse"></div>
      <div
        className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-blue-500 rounded-full blur-[150px] opacity-8 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Two-column layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left column: Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
                  Elevate Your Competitive Programming Journey
                </h2>
                <p className="text-lg md:text-xl text-blue-200/90 mb-8">
                  Join thousands of developers mastering algorithms, solving challenges, and climbing the ranks in the
                  competitive programming world.
                </p>

                {/* Email signup form for mobile */}
                <div className="lg:hidden">
                  <div className="relative mb-4 max-w-md mx-auto">
                    <FloatingLabelInput
                      label="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="relative group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-md transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                      Sign up for AlgoAtlas
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:border-purple-500/70 text-white hover:bg-purple-500/10"
                    >
                      Try AlgoAtlas Assistant
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column: 3D visualization and form for desktop */}
            <div className="relative h-64 sm:h-80 lg:h-96">
              {/* 3D Canvas */}
              <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                  <FloatingShapes />
                </Canvas>
              </div>

              {/* Email signup form for desktop */}
              <div className="absolute inset-0 flex items-center justify-center z-10 hidden lg:flex">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-full max-w-md p-6 rounded-xl backdrop-blur-sm bg-navy-800/40 border border-purple-500/30 shadow-xl"
                >
                  <div className="relative mb-6">
                    <FloatingLabelInput
                      label="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button className="relative group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-md transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]">
                      Sign up for AlgoAtlas
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:border-purple-500/70 text-white hover:bg-purple-500/10"
                    >
                      Try AlgoAtlas Assistant
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent"></div>
    </section>
  )
}

