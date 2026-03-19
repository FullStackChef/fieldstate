import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorState = useStore((state) => state.cursorState);
  const setCursorState = useStore((state) => state.setCursorState);

  useEffect(() => {
    // Only active on desktop
    if (window.innerWidth < 1024) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setCursorState('interactive');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [setCursorState]);

  if (window.innerWidth < 1024 || cursorState === 'hidden') return null;

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: "hsl(var(--primary))",
      mixBlendMode: "difference" as const,
      opacity: 1
    },
    interactive: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "transparent",
      border: "1px solid hsl(var(--primary))",
      mixBlendMode: "normal" as const,
      opacity: 0.8
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      variants={variants}
      animate={cursorState}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 2 }}
    />
  );
}
