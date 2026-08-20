import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, navyBg, reveal, ease, drift } from "../theme";
import { Grain, StructureLines } from "../components/Layers";
import type { Variant } from "../variants";

export const Close: React.FC<{ v: Variant; display: string; body: string }> = ({
  v,
  display,
  body,
}) => {
  const frame = useCurrentFrame();
  const settle = ease(frame, 0, 90, 1.03, 1);

  return (
    <AbsoluteFill style={{ background: navyBg }}>
      <StructureLines dark />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 150px",
          transform: `scale(${settle}) translateY(${drift(frame, 4, 280)}px)`,
        }}
      >
        <div style={{ ...reveal(frame, 0, 22) }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 44,
              color: C.pearl,
              letterSpacing: "0.01em",
              lineHeight: 1.2,
            }}
          >
            Bright Leadership Consulting
          </div>
        </div>

        <div
          style={{
            width: ease(frame, 18, 54, 0, 200),
            height: 2,
            background: C.gold,
            margin: "34px 0 40px",
          }}
        />

        <div style={{ ...reveal(frame, 34, 26) }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 66,
              color: C.gold,
              letterSpacing: "-0.02em",
              marginBottom: 40,
            }}
          >
            {v.close.line}
          </div>
        </div>

        <div style={{ ...reveal(frame, 56, 26) }}>
          <div
            style={{
              fontFamily: body,
              fontSize: 25,
              color: "rgba(247,246,243,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            {v.close.sub}
          </div>
        </div>

        <div style={{ ...reveal(frame, 74, 26), marginTop: 54 }}>
          <div
            style={{
              fontFamily: body,
              fontSize: 15,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,0.42)",
              fontWeight: 500,
            }}
          >
            CPD Standards Office — Provider 50838
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
