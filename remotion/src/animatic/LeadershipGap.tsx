import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { C } from "../theme";
import { Grain } from "../components/Layers";
import { SHOTS, CAPTIONS } from "./shots";
import { CaptionBlock } from "./Captions";

const display = loadDisplay("normal", { weights: ["400", "700"], subsets: ["latin"] })
  .fontFamily;
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] })
  .fontFamily;

const EASE = Easing.bezier(0.33, 0, 0.67, 1);

const ShotLayer: React.FC<{
  img: string;
  frames: number;
  cam: [number, number, number, number, number, number];
  dissolve?: number;
  dim?: number;
  fps: number;
}> = ({ img, frames, cam, dissolve, dim, fps }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, frames], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const [s0, s1, x0, x1, y0, y1] = cam;
  const inOpacity = dissolve
    ? interpolate(frame, [0, dissolve * fps], [0, 1], { extrapolateRight: "clamp" })
    : 1;
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
          src={staticFile(`images/${img}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {/* grade: cool the highlights toward navy, keep it institutional */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(15,27,61,0.30) 0%, rgba(15,27,61,0.05) 45%, rgba(10,18,43,0.42) 100%)",
        }}
      />
      {dim ? <AbsoluteFill style={{ background: `rgba(10,18,43,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

export const LeadershipGap: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.navyDeep }}>
      {SHOTS.map((s, i) => {
        if (!s.img) return null;
        const from = Math.round(s.from * fps);
        const frames = Math.round((s.to - s.from) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={frames} layout="none">
            <ShotLayer
              img={s.img}
              frames={frames}
              cam={s.cam}
              dissolve={s.dissolve}
              dim={s.dim}
              fps={fps}
            />
          </Sequence>
        );
      })}

      {CAPTIONS.map((c, i) => {
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

const CaptionInner: React.FC<{ c: (typeof CAPTIONS)[number]; frames: number }> = ({
  c,
  frames,
}) => {
  const frame = useCurrentFrame();
  return <CaptionBlock c={c} frame={frame} frames={frames} display={display} body={body} />;
};
