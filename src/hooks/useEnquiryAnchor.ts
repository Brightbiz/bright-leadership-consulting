import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Focus only the explicitly requested section after its route has mounted. */
export function useEnquiryAnchor(id: string) {
  const { hash, pathname, search } = useLocation();
  useEffect(() => {
    if (hash !== `#${id}`) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname, search, id]);
}