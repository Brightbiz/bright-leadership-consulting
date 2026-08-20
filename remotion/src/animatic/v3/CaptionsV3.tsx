import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C } from "../../theme";
import type { CaptionV3 } from "./shotsV3";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const t = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

const Line: React.FC<{ frame: number; delay: number; children: React.ReactNode }> = ({
  frame,
  delay,
  children,
}) => {
  const p = t(frame, delay, delay + 15);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6 }}>
      <div style={{ transform: `translateY(${(1 - p) * 44}px)`, opacity: p }}>{children}</div>
    </div>
  );
};

const lowerScrim =
  "linear-gradient(0deg, rgba(10,18,43,0.96) 0%, rgba(10,18,43,0.86) 45%, rgba(10,18,43,0.35) 78%, rgba(10,18,43,0) 100%)";

export const CaptionBlockV3: React.FC<{
  c: CaptionV3;
  frame: number;
  frames: number;
  display: string;
  body: string;
}> = ({ c, frame, frames, display, body }) => {
  const out = interpolate(frame, [frames - 12, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  /* ---------------------------------------------------- pattern interruption */
  if (c.kind === "card") {
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
              width: t(frame, 14, 42) * 160,
              height: 3,
              background: C.gold,
              marginBottom: 46,
            }}
          />
          {c.lines.map((l, i) => (
            <Line key={l} frame={frame} delay={16 + i * 11}>
              <div
                style={{
                  fontFamily: display,
                  fontSize: 90,
                  lineHeight: 1.12,
                  letterSpacing: "-0.024em",
                  color: i === 0 ? "rgba(247,246,243,0.6)" : C.pearl,
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

  /* ------------------------------------------- integrated kinetic capability */
  if (c.kind === "kinetic") {
    const wipe = t(frame, 0, 20);
    const recede = interpolate(frame, [frames - 26, frames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    });
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <AbsoluteFill
          style={{
            background: C.navyDeep,
            clipPath: `inset(0% 0% ${(1 - wipe) * 100}% 0%)`,
          }}
        />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            padding: "0 170px",
            transform: `translateY(${recede * -26}px) scale(${1 - recede * 0.02})`,
            opacity: 1 - recede * 0.55,
          }}
        >
          {c.phrases.map((p, i) => {
            const delay = 20 + i * 44;
            const rise = t(frame, delay, delay + 18);
            const rule = t(frame, delay + 8, delay + 34);
            return (
              <div key={p} style={{ marginBottom: 24 }}>
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      transform: `translateY(${(1 - rise) * 38}px)`,
                      opacity: interpolate(rise, [0, 1], [0, 1]),
                      fontFamily: display,
                      fontSize: 62,
                      lineHeight: 1.16,
                      letterSpacing: "-0.02em",
                      color: C.pearl,
                    }}
                  >
                    {p}
                  </div>
                </div>
                <div
                  style={{
                    width: rule * (240 + i * 46),
                    height: 2,
                    background: C.gold,
                    opacity: 0.85,
                    marginTop: 10,
                  }}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  /* --------------------------------------------------------------- the hinge */
  if (c.kind === "hinge") {
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", opacity: out }}>
        <div style={{ background: lowerScrim, padding: "180px 130px 96px" }}>
          <div style={{ display: "flex", gap: 30 }}>
            <div
              style={{
                width: 3,
                background: C.gold,
                height: t(frame, 0, 20) * (c.lines.length * 72 + 10),
                flex: "0 0 auto",
              }}
            />
            <div>
              {c.lines.map((tokens, i) => (
                <Line key={i} frame={frame} delay={4 + i * 10}>
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: 58,
                      lineHeight: 1.2,
                      letterSpacing: "-0.018em",
                      color: C.pearl,
                      textShadow: "0 2px 26px rgba(0,0,0,0.5)",
                    }}
                  >
                    {tokens.map((tk, j) => (
                      <span
                        key={j}
                        style={
                          tk.gold
                            ? {
                                color: C.goldSoft,
                                opacity: t(frame, 8, 26),
                              }
                            : undefined
                        }
                      >
                        {tk.text}
                      </span>
                    ))}
                  </div>
                </Line>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  /* ------------------------------------------------------------------- title */
  if (c.kind === "title") {
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 130px 120px", opacity: out }}>
        <div style={{ width: t(frame, 6, 40) * 130, height: 3, background: C.gold, marginBottom: 34 }} />
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
              letterSpacing: "0.03em",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            {c.sub}
          </div>
        </Line>
      </AbsoluteFill>
    );
  }

  /* ---------------------------------------------------------------- end card */
  if (c.kind === "end") {
    return (
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 150px", opacity: out }}>
        <AbsoluteFill style={{ background: "rgba(10,18,43,0.76)" }} />
        <div style={{ position: "relative" }}>
          {c.programme
            ? c.programme.map((l, i) => (
                <Line key={l} frame={frame} delay={2 + i * 10}>
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: 66,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: C.pearl,
                    }}
                  >
                    {l}
                  </div>
                </Line>
              ))
            : null}
          {!c.programme ? (
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
          ) : null}
          <div
            style={{
              width: t(frame, 16, 46) * 210,
              height: 2,
              background: C.gold,
              margin: "32px 0",
            }}
          />
          {c.programme ? (
            <Line frame={frame} delay={20}>
              <div
                style={{
                  fontFamily: body,
                  fontSize: 26,
                  color: "rgba(247,246,243,0.9)",
                  letterSpacing: "0.04em",
                  marginBottom: 16,
                }}
              >
                {c.firm}
              </div>
            </Line>
          ) : null}
          <Line frame={frame} delay={24}>
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
                color: "rgba(247,246,243,0.6)",
                marginTop: 28,
                letterSpacing: "0.05em",
                maxWidth: 1180,
                lineHeight: 1.5,
              }}
            >
              {c.note}
            </div>
          </Line>
        </div>
      </AbsoluteFill>
    );
  }

  /* --------------------------------------------- statement / campaign question */
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", opacity: out }}>
      <div style={{ background: lowerScrim, padding: "170px 130px 92px" }}>
        <div style={{ display: "flex", gap: 30 }}>
          <div
            style={{
              width: 3,
              background: c.kind === "question" ? C.gold : "rgba(201,168,76,0.55)",
              height: t(frame, 0, 18) * (c.lines.length * 68 + 12),
              flex: "0 0 auto",
            }}
          />
          <div>
            {c.lines.map((l, i) => (
              <Line key={l} frame={frame} delay={4 + i * 9}>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: c.kind === "question" ? 58 : 54,
                    lineHeight: 1.22,
                    letterSpacing: "-0.018em",
                    color: C.pearl,
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
