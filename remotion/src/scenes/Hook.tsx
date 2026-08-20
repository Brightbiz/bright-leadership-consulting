import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, navyBg, ease, drift, reveal } from "../theme";
import { Grain, StructureLines } from "../components/Layers";
import type { Variant } from "../variants";

export const Hook: React.FC<{ v: Variant; display: string; body: string }> = ({
  v,
  display,
  body,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = ease(frame, 0, 120, 1.06, 1.0);

  return (
    <AbsoluteFill style={{ background: navyBg }}>
      <StructureLines dark />
      <AbsoluteFill
        style={{
          transform: `scale(${push}) translateY(${drift(frame, 5, 260)}px)`,
          padding: "0 150px",
          justifyContent: "center",
        }}
      >
        <div style={{ ...reveal(frame, 4, 20) }}>
          <div
            style={{
              fontFamily: body,
              color: C.gold,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              fontSize: 19,
              fontWeight: 500,
              marginBottom: 44,
            }}
          >
            {v.hookKicker}
          </div>
        </div>

        <div style={{ maxWidth: 1360 }}>
          {v.hook.map((line, i) => {
            const d = 16 + i * 11;
            const s = spring({
              frame: frame - d,
              fps,
              config: { damping: 200 },
            });
            return (
              <div
                key={line}
                style={{
                  overflow: "hidden",
                  paddingBottom: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    color: C.pearl,
                    fontSize: 104,
                    lineHeight: 1.07,
                    letterSpacing: "-0.022em",
                    transform: `translateY(${(1 - s) * 108}px)`,
                    opacity: s,
                  }}
                >
                  {line}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 52,
            width: ease(frame, 74, 108, 0, 300),
            height: 2,
            background: `linear-gradient(90deg, ${C.gold}, ${C.gold}00)`,
          }}
        />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
