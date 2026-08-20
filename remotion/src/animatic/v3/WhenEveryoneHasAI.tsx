import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { C } from "../../theme";
import { Grain } from "../../components/Layers";
import { CaptionBlockV3 } from "./CaptionsV3";
import { CAPTIONS_69, SHOTS_69, type CaptionV3, type ShotV3 } from "./shotsV3";

const display = loadDisplay("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

const EASE = Easing.bezier(0.33, 0, 0.67, 1);

const ShotLayer: React.FC<{ s: ShotV3; frames: number; fps: number }> = ({ s, frames, fps }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, frames], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const [s0, s1, x0, x1, y0, y1] = s.cam;
  const inOpacity = s.dissolve
    ? interpolate(frame, [0, s.dissolve * fps], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  // Gold judgement beat: a warm key light arrives on the act of judgement.
  const goldStart = Math.round((s.goldAt ?? 0) * fps);
  const goldIn = s.gold
    ? interpolate(frame, [goldStart, goldStart + Math.round(fps * 1.1)], [0, s.gold], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 0;

  return (
    <AbsoluteFill style={{ background: C.navyDeep, opacity: inOpacity }}>
      <AbsoluteFill
        style={{
          transform: `scale(${s0 + (s1 - s0) * p}) translate(${x0 + (x1 - x0) * p}px, ${
            y0 + (y1 - y0) * p
          }px)`,
        }}
      >
        <Img
          src={staticFile(`images/${s.img}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(15,27,61,0.30) 0%, rgba(15,27,61,0.05) 45%, rgba(10,18,43,0.42) 100%)",
        }}
      />
      {goldIn > 0 ? (
        <>
          <AbsoluteFill
            style={{
              background: `radial-gradient(52% 46% at 62% 40%, rgba(201,168,76,${
                goldIn * 0.85
              }) 0%, rgba(201,168,76,0) 70%)`,
              mixBlendMode: "screen",
            }}
          />
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, rgba(224,200,126,${
                goldIn * 0.16
              }) 0%, rgba(201,168,76,0) 60%)`,
            }}
          />
        </>
      ) : null}
      {s.dim ? <AbsoluteFill style={{ background: `rgba(10,18,43,${s.dim})` }} /> : null}
    </AbsoluteFill>
  );
};

const CaptionInner: React.FC<{ c: CaptionV3; frames: number }> = ({ c, frames }) => {
  const frame = useCurrentFrame();
  return <CaptionBlockV3 c={c} frame={frame} frames={frames} display={display} body={body} />;
};

export const WhenEveryoneHasAI: React.FC<{
  shots?: ShotV3[];
  captions?: CaptionV3[];
}> = ({ shots = SHOTS_69, captions = CAPTIONS_69 }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.navyDeep }}>
      {shots.map((s, i) => {
        if (!s.img) return null;
        const from = Math.round(s.from * fps);
        const frames = Math.round((s.to - s.from) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={frames} layout="none">
            <ShotLayer s={s} frames={frames} fps={fps} />
          </Sequence>
        );
      })}

      {captions.map((c, i) => {
        const from = Math.round(c.from * fps);
        const frames = Math.round((c.to - c.from) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={frames} layout="none">
            <CaptionInner c={c} frames={frames} />
          </Sequence>
        );
      })}

      <Grain />
    </AbsoluteFill>
  );
};
