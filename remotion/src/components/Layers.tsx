import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, drift, ease } from "../theme";

/** Persistent grain + vignette, spans the whole film. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          transform: `translate(${drift(frame, 3, 90)}px, ${drift(frame, 3, 70, 20)}px)`,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </AbsoluteFill>
  );
};

/** Thin architectural rule that travels across the full duration. */
export const StructureLines: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const col = dark ? "rgba(247,246,243,0.10)" : "rgba(15,27,61,0.09)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[0.18, 0.5, 0.82].map((x, i) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: col,
            transform: `translateY(${drift(frame, 10, 300 + i * 60, i * 40)}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)`,
          opacity: 0.5,
          transform: `translateX(${drift(frame, 40, 420)}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Gold hairline that draws in — the recurring accent motif. */
export const GoldRule: React.FC<{
  delay?: number;
  width?: number;
  thickness?: number;
}> = ({ delay = 0, width = 120, thickness = 2 }) => {
  const frame = useCurrentFrame();
  const w = ease(frame, delay, delay + 30, 0, width);
  return (
    <div
      style={{
        width: w,
        height: thickness,
        background: C.gold,
        marginBottom: 26,
      }}
    />
  );
};
