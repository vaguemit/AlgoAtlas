// Animation utility functions and constants for consistent micro-interactions

// Durations (in seconds)
export const DURATIONS = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.5,
  extraSlow: 0.8,
}

// Easing functions
export const EASINGS = {
  // Smooth deceleration
  easeOut: [0.16, 1, 0.3, 1],
  // Smooth acceleration
  easeIn: [0.7, 0, 0.84, 0],
  // Smooth acceleration and deceleration
  easeInOut: [0.65, 0, 0.35, 1],
  // Bouncy effect with slight overshoot
  spring: [0.34, 1.56, 0.64, 1],
}

// Common animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeOut,
    },
  },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeOut,
    },
  },
}

export const staggerChildren = (staggerTime = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
    },
  },
})

// Button hover animations
export const buttonHover = {
  scale: 1.05,
  transition: {
    duration: DURATIONS.fast,
    ease: EASINGS.spring,
  },
}

export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: DURATIONS.fast,
    ease: EASINGS.easeOut,
  },
}

// Link hover animations
export const linkHover = {
  color: "rgba(168, 85, 247, 1)", // purple-500
  transition: {
    duration: DURATIONS.fast,
    ease: EASINGS.easeOut,
  },
}

// Performance optimization CSS classes
export const PERFORMANCE_CLASSES = {
  hardwareAccelerated: "will-change-transform will-change-opacity",
  smoothTransition: "transition-all duration-300 ease-out",
  smoothTransformTransition: "transition-transform duration-300 ease-out",
  smoothOpacityTransition: "transition-opacity duration-300 ease-out",
}

