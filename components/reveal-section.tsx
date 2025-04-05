"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { fadeInUp, DURATIONS, EASINGS } from "@/lib/animation-utils"

interface RevealSectionProps {
  children: React.ReactNode
  animation?: "fadeIn" | "fadeInUp" | "fadeInLeft" | "fadeInRight"
  delay?: number
  duration?: number
  threshold?: number
  className?: string
}

export function RevealSection({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = DURATIONS.medium,
  threshold = 0.2,
  className = "",
}: RevealSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Define animation variants based on the animation prop
  const getVariants = () => {
    switch (animation) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: EASINGS.easeOut,
            },
          },
        }
      case "fadeInUp":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: EASINGS.easeOut,
            },
          },
        }
      case "fadeInLeft":
        return {
          hidden: { opacity: 0, x: -30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: EASINGS.easeOut,
            },
          },
        }
      case "fadeInRight":
        return {
          hidden: { opacity: 0, x: 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: EASINGS.easeOut,
            },
          },
        }
      default:
        return fadeInUp
    }
  }

  // Only render animations on client side
  if (!isMounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      className={`hw-accelerated ${className}`}
    >
      {children}
    </motion.div>
  )
}

