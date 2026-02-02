import { useRef, useState, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export const useTiltEffect = (maxTilt: number = 10, scale: number = 1.02) => {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);
      
      setTilt({
        rotateX: -percentY * maxTilt,
        rotateY: percentX * maxTilt,
        scale: scale,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  const style = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: tilt.scale === 1 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
  };

  return {
    ref,
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};
