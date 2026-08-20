import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, pearlBg, reveal, ease, drift } from "../theme";
import { Grain, StructureLines } from "../components/Layers";
import type { Variant } from "../variants";

export const Thesis: React.FC<{ v: Variant; display: string; body: string }> = ({
  v,
  display,
  body,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: pearlBg }}>
      <StructureLines />
      {/* Off-centre, edge-aligned block — deliberately not centred */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 320,
          top: 190,
          transform: `translateY(${drift(frame, 4, 220)}px)`,
        }}
      >
        <div style={{ ...reveal(frame, 2, 22) }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 62,
              color: C.navy,
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              marginBottom: 46,
            }}
          >
            {v.thesis.lead}
          </div>
        </div>

        <div
          style={{
            width: ease(frame, 22, 52, 0, 96),
            height: 2,
            background: C.gold,
            marginBottom: 46,
          }}
        />

        {v.thesis.lines.map((line, i) => (
          <div key={line} style={{ ...reveal(frame, 34 + i * 16, 26) }}>
            <div
              style={{
                fontFamily: body,
                fontSize: 34,
                lineHeight: 1.55,
                color: C.charcoal,
                fontWeight: 400,
                maxWidth: 980,
                marginBottom: 12,
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Navy counterweight bar, right edge */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: ease(frame, 8, 44, 0, 150),
          background: C.navy,
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};
