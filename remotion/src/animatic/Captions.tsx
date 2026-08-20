import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { C } from "../theme";
import type { Caption } from "./shots";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const t = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

/** Line mask reveal used by every caption line. */
const Line: React.FC<{
  frame: number;
  delay: number;
  children: React.ReactNode;
}> = ({ frame, delay, children }) => {
  const p = t(frame, delay, delay + 14);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6 }}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 46}px)`,
          opacity: p,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const CaptionBlock: React.FC<{
  c: Caption;
  frame: number; // frames since caption start
  frames: number; // caption length in frames
  display: string;
  body: string;
}> = ({ c, frame, frames, display, body }) => {
  const out = interpolate(frame, [frames - 12, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  if (c.kind === "card") {
    // Full-bleed navy pattern interruption.
    const wipe = t(frame, 0, 16);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <AbsoluteFill
          style={{
            background: C.navyDeep,
            clipPath: `inset(0% 0% ${(1 - wipe) * 100}% 0%)`,
          }}
        />
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
          <div
            style={{
              width: t(frame, 14, 40) * 160,
              height: 3,
              background: C.gold,
              marginBottom: 46,
            }}
          />
          {c.lines.map((l, i) => (
            <Line key={l} frame={frame} delay={16 + i * 10}>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 94,
                  lineHeight: 1.1,
                  letterSpacing: "-0.024em",
                  color: i === 0 ? "rgba(247,246,243,0.62)" : C.pearl,
                }}
              >
                {l}
              </div>
            </Line>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (c.kind === "title") {
    return (
      <AbsoluteFill
        style={{ justifyContent: "flex-end", padding: "0 130px 120px", opacity: out }}
      >
        <div
          style={{
            width: t(frame, 6, 40) * 130,
            height: 3,
            background: C.gold,
            marginBottom: 34,
          }}
        />
        {c.title.map((l, i) => (
          <Line key={l} frame={frame} delay={10 + i * 11}>
            <div
              style={{
                fontFamily: display,
                fontSize: 78,
                lineHeight: 1.1,
                letterSpacing: "-0.022em",
                color: C.pearl,
                textShadow: "0 2px 30px rgba(0,0,0,0.55)",
              }}
            >
              {l}
            </div>
          </Line>
        ))}
        <Line frame={frame} delay={40}>
          <div
            style={{
              fontFamily: body,
              fontSize: 25,
              marginTop: 22,
              color: "rgba(247,246,243,0.88)",
              letterSpacing: "0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            {c.sub}
          </div>
        </Line>
      </AbsoluteFill>
    );
  }

  if (c.kind === "end") {
    return (
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 150px", opacity: out }}>
        <AbsoluteFill style={{ background: "rgba(10,18,43,0.72)" }} />
        <div style={{ position: "relative" }}>
          <Line frame={frame} delay={2}>
            <div
              style={{
                fontFamily: display,
                fontSize: 62,
                letterSpacing: "-0.015em",
                color: C.pearl,
              }}
            >
              {c.firm}
            </div>
          </Line>
          <div
            style={{
              width: t(frame, 16, 46) * 210,
              height: 2,
              background: C.gold,
              margin: "34px 0 34px",
            }}
          />
          <Line frame={frame} delay={22}>
            <div
              style={{
                fontFamily: body,
                fontSize: 34,
                fontWeight: 500,
                color: C.goldSoft,
                letterSpacing: "0.02em",
              }}
            >
              {c.cta}
            </div>
          </Line>
          <Line frame={frame} delay={34}>
            <div
              style={{
                fontFamily: body,
                fontSize: 24,
                color: "rgba(247,246,243,0.86)",
                marginTop: 18,
              }}
            >
              {c.url}
            </div>
          </Line>
          <Line frame={frame} delay={46}>
            <div
              style={{
                fontFamily: body,
                fontSize: 17,
                color: "rgba(247,246,243,0.58)",
                marginTop: 30,
                letterSpacing: "0.06em",
              }}
            >
              {c.note}
            </div>
          </Line>
        </div>
      </AbsoluteFill>
    );
  }

  // statement + question: lower-left, navy scrim, gold hairline
  const isQ = c.kind === "question";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", opacity: out }}>
      <div
        style={{
        background:
          "linear-gradient(0deg, rgba(10,18,43,0.96) 0%, rgba(10,18,43,0.86) 45%, rgba(10,18,43,0.35) 78%, rgba(10,18,43,0) 100%)",
        padding: "170px 130px 92px",

        }}
      >
        <div style={{ display: "flex", gap: 30 }}>
          <div
            style={{
              width: 3,
              background: C.gold,
              height: t(frame, 0, 18) * (c.lines.length * 66 + 12),
              flex: "0 0 auto",
            }}
          />
          <div>
            {c.lines.map((l, i) => (
              <Line key={l} frame={frame} delay={4 + i * 9}>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 54,
                    lineHeight: 1.22,
                    letterSpacing: "-0.018em",
                    color: isQ ? C.goldSoft : C.pearl,
                    textShadow: "0 2px 26px rgba(0,0,0,0.5)",
                  }}
                >
                  {l}
                </div>
              </Line>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
