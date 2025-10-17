import { useEffect, useRef } from "react";

export default function GlowBackground() {
  const glowRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const glow = glowRef.current;

    const move = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty("--x", `${x}%`);
      root.style.setProperty("--y", `${y}%`);

      if (glow) glow.style.animationPlayState = "paused";

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (glow) glow.style.animationPlayState = "running";
      }, 1500);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div className="glow-bg" ref={glowRef}></div>;
}