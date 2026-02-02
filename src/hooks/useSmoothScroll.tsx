import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface UseSmoothScrollOptions {
  offset?: number;
  duration?: number;
}

export const useSmoothScroll = (options: UseSmoothScrollOptions = {}) => {
  const { offset = 80, duration = 800 } = options;
  const navigate = useNavigate();
  const location = useLocation();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothScrollTo = useCallback((targetY: number) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + difference * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [duration]);

  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      smoothScrollTo(offsetPosition);
    }
  }, [offset, smoothScrollTo]);

  const handleAnchorClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Check if it's a hash link
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.substring(2);
      
      // If we're not on the home page, navigate there first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToElement(targetId);
        }, 100);
      } else {
        scrollToElement(targetId);
      }
    } else if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToElement(targetId);
    }
  }, [location.pathname, navigate, scrollToElement]);

  return {
    scrollToElement,
    handleAnchorClick,
    smoothScrollTo,
  };
};

export default useSmoothScroll;
