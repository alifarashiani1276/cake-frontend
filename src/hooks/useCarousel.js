import { useCallback, useEffect, useRef, useState } from 'react'

// "position" is a decimal number: 0 means the first card is exactly in the
// middle, 1.5 means we are halfway between the 2nd and 3rd card, and so on.
// It keeps growing (or shrinking) forever, so the carousel loops with no end.
const mod = (n, m) => ((n % m) + m) % m

export default function useCarousel(count, { autoplayMs = 4000 } = {}) {
  const [position, setPosition] = useState(0)
  const [paused, setPaused] = useState(false)

  const positionRef = useRef(0) // where the cards are right now
  const targetRef = useRef(0) // where the cards are moving to
  const frameRef = useRef(null)

  // Every frame, move a little closer to the target. Stops when it arrives.
  const animate = useCallback(() => {
    const diff = targetRef.current - positionRef.current
    if (Math.abs(diff) < 0.001) {
      positionRef.current = targetRef.current
      frameRef.current = null
    } else {
      positionRef.current += diff * 0.12
      frameRef.current = requestAnimationFrame(animate)
    }
    setPosition(positionRef.current)
  }, [])

  const start = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(animate)
  }, [animate])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const next = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) + 1
    start()
  }, [start])

  const prev = useCallback(() => {
    targetRef.current = Math.round(targetRef.current) - 1
    start()
  }, [start])

  // Go to a card by its index, using the shortest way around.
  const goTo = useCallback(
    (index) => {
      const base = Math.round(targetRef.current)
      let diff = index - mod(base, count)
      if (diff > count / 2) diff -= count
      if (diff < -count / 2) diff += count
      targetRef.current = base + diff
      start()
    },
    [count, start],
  )

  // While dragging: move the cards immediately (no easing).
  const dragBy = useCallback(
    (amount) => {
      positionRef.current += amount
      targetRef.current = positionRef.current
      start()
    },
    [start],
  )

  // When the finger/mouse is released: snap to the nearest card.
  // "velocity" lets a fast swipe slide a bit further (max 1 card).
  const release = useCallback(
    (velocity = 0) => {
      const push = Math.max(-1, Math.min(1, velocity * 150))
      targetRef.current = Math.round(positionRef.current + push)
      start()
    },
    [start],
  )

  // Slow automatic rotation. It stops while the user hovers or drags.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduceMotion || !autoplayMs) return undefined
    const id = setInterval(next, autoplayMs)
    return () => clearInterval(id)
  }, [paused, autoplayMs, next])

  return {
    position,
    activeIndex: mod(Math.round(position), count),
    next,
    prev,
    goTo,
    dragBy,
    release,
    setPaused,
  }
}
