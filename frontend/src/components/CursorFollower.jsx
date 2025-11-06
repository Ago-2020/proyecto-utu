import React, { useEffect, useState } from "react"
import boo from "@/img/boo.gif" // gif lol

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [target, setTarget] = useState({ x: 0, y: 0 })
  const [facingRight, setFacingRight] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // emm se supone que detecta si el cursor se mueve hacia la derecha o izquierda
      setFacingRight(e.movementX >= 0)
      setTarget({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationFrame
    const followMouse = () => {
      setPosition((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.005,
        y: prev.y + (target.y - prev.y) * 0.005,
      }))
      animationFrame = requestAnimationFrame(followMouse)
    }

    followMouse()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [target.x, target.y])

  return (
    <img
      src={boo}
      alt="Cursor Follower"
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "60px",
        height: "auto",
        pointerEvents: "none",
        transform: `translate(-50%, -50%) scaleX(${facingRight ? 1 : -1})`,
        transition: "transform 0.1s ease-out",
        zIndex: 9999,
      }}
    />
  )
}
