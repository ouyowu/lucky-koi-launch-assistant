'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const smoothPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true)
      }
    }

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseEnter)
    document.addEventListener('mouseout', onMouseLeave)

    function animate() {
      const lag = 0.15
      smoothPosRef.current.x += (posRef.current.x - smoothPosRef.current.x) * lag
      smoothPosRef.current.y += (posRef.current.y - smoothPosRef.current.y) * lag

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${smoothPosRef.current.x - 16}px, ${smoothPosRef.current.y - 16}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseEnter)
      document.removeEventListener('mouseout', onMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Dot — exact mouse position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#F5F0E8',
          opacity: isHovering ? 0 : 1,
        }}
      />
      {/* Ring — lagged, expands on hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ease-out hidden md:block"
        style={{
          width: isHovering ? 32 : 32,
          height: isHovering ? 32 : 32,
          borderRadius: '50%',
          border: `1px solid #F5F0E8`,
          backgroundColor: 'transparent',
          opacity: isHovering ? 1 : 0,
          transform: isHovering ? 'scale(1)' : 'scale(0.5)',
        }}
      />
    </>
  )
}
