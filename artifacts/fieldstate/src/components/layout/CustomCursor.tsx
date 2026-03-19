import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useStore } from "@/store";

export function CustomCursor() {
  const cursorState = useStore((state) => state.cursorState);
  const setCursorState = useStore((state) => state.setCursorState);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = { stiffness: 800, damping: 60, mass: 0.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive")
      ) {
        setCursorState("interactive");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [rawX, rawY, setCursorState]);

  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;
  if (cursorState === "hidden") return null;

  const isInteractive = cursorState === "interactive";
  const offset = isInteractive ? 24 : 8;
  const size = isInteractive ? 48 : 16;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x,
        y,
        translateX: -offset,
        translateY: -offset,
        width: size,
        height: size,
        backgroundColor: isInteractive ? "transparent" : "hsl(var(--primary))",
        border: isInteractive ? "1px solid hsl(var(--primary))" : "none",
        mixBlendMode: isInteractive ? "normal" : "difference",
        opacity: isInteractive ? 0.8 : 1,
      }}
      animate={{ width: size, height: size, translateX: -offset, translateY: -offset }}
      transition={{ type: "spring", stiffness: 600, damping: 40, mass: 0.4 }}
    />
  );
}
