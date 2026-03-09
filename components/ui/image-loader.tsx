"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageLoaderProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallback?: string
  lowQualitySrc?: string
  containerClassName?: string
}

export function ImageLoader({
  src,
  alt,
  fallback = "/placeholder.svg?height=400&width=400",
  lowQualitySrc,
  containerClassName,
  className,
  ...props
}: ImageLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)

  useEffect(() => {
    // Reset states when src changes
    setLoading(true)
    setError(false)
    setCurrentSrc(lowQualitySrc || src)
  }, [src, lowQualitySrc])

  const handleLoad = () => {
    // If we're showing the low quality image, now load the high quality one
    if (lowQualitySrc && currentSrc === lowQualitySrc) {
      setCurrentSrc(src)
    } else {
      setLoading(false)
    }
  }

  const handleError = () => {
    setError(true)
    setLoading(false)
    setCurrentSrc(fallback)
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Low quality placeholder or loading state */}
      {loading && lowQualitySrc && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />}

      <Image
        src={error ? fallback : currentSrc}
        alt={alt}
        className={cn("transition-opacity duration-500", loading ? "opacity-0" : "opacity-100", className)}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

