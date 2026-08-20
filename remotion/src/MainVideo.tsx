import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadDisplay } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

import { Hook } from "./scenes/Hook";
import { Thesis } from "./scenes/Thesis";
import { Structure } from "./scenes/Structure";
import { Programme } from "./scenes/Programme";
import { Close } from "./scenes/Close";
import type { Variant } from "./variants";

const display = loadDisplay("normal", { weights: ["400", "700"], subsets: ["latin"] })
  .fontFamily;
const body = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] })
  .fontFamily;

export const SCENE = { hook: 120, thesis: 156, structure: 192, programme: 174, close: 126 };
export const TRANS = { a: 16, b: 22, c: 22, d: 16 };
export const TOTAL =
  SCENE.hook +
  SCENE.thesis +
  SCENE.structure +
  SCENE.programme +
  SCENE.close -
  (TRANS.a + TRANS.b + TRANS.c + TRANS.d);

export const MainVideo: React.FC<{ v: Variant }> = ({ v }) => {
  const f = { v, display, body };
  return (
    <AbsoluteFill style={{ background: "#0A122B" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <Hook {...f} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANS.a })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.thesis}>
          <Thesis {...f} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANS.b })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.structure}>
          <Structure {...f} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANS.c })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.programme}>
          <Programme {...f} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS.d })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.close}>
          <Close {...f} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
