import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, pearlBg, reveal, ease, drift } from "../theme";
import { Grain, StructureLines } from "../components/Layers";
import type { Variant } from "../variants";

export const Programme: React.FC<{ v: Variant; display: string; body: string }> = ({
  v,
  display,
  body,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: pearlBg }}>
      <StructureLines />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 140,
          top: 160,
          transform: `translateY(${drift(frame, 4, 260)}px)`,
        }}
      >
        <div style={{ ...reveal(frame, 0, 18) }}>
          <div
            style={{
              fontFamily: body,
              color: C.slate,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 34,
            }}
          >
            {v.programme.eyebrow}
          </div>
        </div>

        {/* Accent moment — the hero title gets the dramatic entrance */}
        {v.programme.title.map((line, i) => {
          const s = spring({
            frame: frame - (10 + i * 12),
            fps,
            config: { damping: 200, stiffness: 90, mass: 1.1 },
          });
          return (
            <div key={line} style={{ overflow: "hidden", paddingBottom: 6 }}>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 88,
                  color: C.navy,
                  lineHeight: 1.08,
                  letterSpacing: "-0.026em",
                  transform: `translateY(${(1 - s) * 100}px) scale(${0.985 + s * 0.015})`,
                  opacity: s,
                }}
              >
                {line}
              </div>
            </div>
          );
        })}

        <div
          style={{
            width: ease(frame, 46, 84, 0, 420),
            height: 3,
            background: C.gold,
            margin: "44px 0 52px",
          }}
        />

        <div style={{ display: "flex", gap: 78 }}>
          {v.programme.facts.map((f, i) => (
            <div key={f[0]} style={{ ...reveal(frame, 58 + i * 14, 24), maxWidth: 340 }}>
              <div
                style={{
                  fontFamily: body,
                  fontSize: 14,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.slate,
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {f[0]}
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 25,
                  color: C.charcoal,
                  lineHeight: 1.34,
                }}
              >
                {f[1]}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...reveal(frame, 104, 26), marginTop: 56 }}>
          <div
            style={{
              fontFamily: body,
              fontSize: 22,
              color: C.slate,
              lineHeight: 1.5,
              maxWidth: 820,
            }}
          >
            {v.programme.note}
          </div>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
