import { Easing, interpolate } from "remotion";

export const C = {
  navy: "#0F1B3D",
  navyDeep: "#0A122B",
  gold: "#C9A84C",
  goldSoft: "#E0C87E",
  pearl: "#F7F6F3",
  pearlWarm: "#EFEDE7",
  charcoal: "#1F2328",
  slate: "#5A6272",
};

export const navyBg = `radial-gradient(120% 100% at 12% 0%, #17264E 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`;
export const pearlBg = `linear-gradient(165deg, #FCFBF9 0%, ${C.pearl} 55%, ${C.pearlWarm} 100%)`;

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** Default entrance: clip-path reveal from below + slight rise. */
export const reveal = (frame: number, delay = 0, dur = 26) => {
  const t = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return {
    clipPath: `inset(0% 0% ${(1 - t) * 100}% 0%)`,
    transform: `translateY(${(1 - t) * 14}px)`,
    opacity: interpolate(t, [0, 0.15], [0, 1], { extrapolateRight: "clamp" }),
  } as const;
};

/** Inverse exit for scene tails. */
export const exitFade = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

export const ease = (frame: number, from: number, to: number, a: number, b: number) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Slow sinusoidal drift so nothing is ever a static frame. */
export const drift = (frame: number, amp = 6, period = 240, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;
