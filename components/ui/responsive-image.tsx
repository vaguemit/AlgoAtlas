"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  fill?: boolean
  quality?: number
  onLoad?: () => void
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  className,
  imgClassName,
  fill = false,
  quality = 85,
  onLoad,
  ...props
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isIntersected, setIsIntersected] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!priority && imageRef.current && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsIntersected(true)
              observer.disconnect()
            }
          })
        },
        { rootMargin: "200px" },
      )

      observer.observe(imageRef.current)

      return () => {
        if (imageRef.current) {
          observer.disconnect()
        }
      }
    } else {
      setIsIntersected(true)
    }
  }, [priority])

  const handleImageLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  return (
    <div ref={imageRef} className={cn("overflow-hidden relative", fill ? "w-full h-full" : "", className)}>
      {(isIntersected || priority) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          quality={quality}
          priority={priority}
          fill={fill}
          className={cn(
            "transition-opacity duration-500 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          onLoad={handleImageLoad}
          {...props}
        />
      )}
    </div>
  )
}

