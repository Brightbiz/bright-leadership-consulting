import { useState, useEffect, useCallback, RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface ParallaxValues {
  x: number;
  y: number;
}

interface UseMouseParallaxOptions {
  /** Sensitivity multiplier (default: 0.02) */
  sensitivity?: number;
  /** Maximum movement in pixels (default: 30) */
  maxMovement?: number;
  /** Whether to invert the movement direction (default: false) */
  invert?: boolean;
  /** Smoothing factor for lerp (default: 0.1) */
  smoothing?: number;
}

export const useMouseParallax = (
  containerRef: RefObject<HTMLElement | null>,
  options: UseMouseParallaxOptions = {}
): ParallaxValues => {
  const {
    sensitivity = 0.02,
    maxMovement = 30,
    invert = false,
    smoothing = 0.1,
  } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [parallaxValues, setParallaxValues] = useState<ParallaxValues>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const deltaX = (e.clientX - centerX) * sensitivity;
    const deltaY = (e.clientY - centerY) * sensitivity;

    // Clamp values
    const clampedX = Math.max(-maxMovement, Math.min(maxMovement, deltaX));
    const clampedY = Math.max(-maxMovement, Math.min(maxMovement, deltaY));

    setMousePosition({
      x: invert ? -clampedX : clampedX,
      y: invert ? -clampedY : clampedY,
    });
  }, [containerRef, sensitivity, maxMovement, invert]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  // Smooth interpolation
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setParallaxValues((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * smoothing,
        y: prev.y + (mousePosition.y - prev.y) * smoothing,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, smoothing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, handleMouseMove, handleMouseLeave]);

  return parallaxValues;
};

// Helper component for parallax elements
interface ParallaxLayerProps {
  children: React.ReactNode;
  parallax: ParallaxValues;
  depth?: number; // 0-1, higher = more movement
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer = ({
  children,
  parallax,
  depth = 0.5,
  className = "",
  style = {},
}: ParallaxLayerProps) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translate(${parallax.x * depth}px, ${parallax.y * depth}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
};
