import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, navyBg, reveal, ease, drift } from "../theme";
import { Grain, StructureLines } from "../components/Layers";
import type { Variant } from "../variants";

export const Structure: React.FC<{ v: Variant; display: string; body: string }> = ({
  v,
  display,
  body,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: navyBg }}>
      <StructureLines dark />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 130,
          transform: `translateY(${drift(frame, 3, 240)}px)`,
        }}
      >
        <div style={{ ...reveal(frame, 0, 18) }}>
          <div
            style={{
              fontFamily: body,
              color: C.gold,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontSize: 17,
              fontWeight: 500,
              marginBottom: 30,
            }}
          >
            {v.structure.eyebrow}
          </div>
        </div>
        <div style={{ ...reveal(frame, 10, 24) }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 66,
              color: C.pearl,
              letterSpacing: "-0.02em",
              marginBottom: 66,
            }}
          >
            {v.structure.heading}
          </div>
        </div>

        {v.structure.rows.map((row, i) => {
          const d = 34 + i * 18;
          const r = reveal(frame, d, 24);
          const lineW = ease(frame, d + 6, d + 40, 0, 100);
          return (
            <div
              key={row[0]}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 40,
                paddingBottom: 26,
                marginBottom: 26,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 1,
                  width: `${lineW}%`,
                  background: "rgba(247,246,243,0.16)",
                }}
              />
              <div
                style={{
                  ...r,
                  fontFamily: body,
                  fontSize: 20,
                  color: C.gold,
                  letterSpacing: "0.18em",
                  minWidth: 62,
                  fontWeight: 500,
                }}
              >
                {row[0]}
              </div>
              <div
                style={{
                  ...r,
                  fontFamily: display,
                  fontSize: 37,
                  color: "rgba(247,246,243,0.94)",
                  letterSpacing: "-0.012em",
                  lineHeight: 1.3,
                }}
              >
                {row[1]}
              </div>
            </div>
          );
        })}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
