import React from "react";
import { Composition } from "remotion";
import { MainVideo, TOTAL } from "./MainVideo";
import { conviction, provocative } from "./variants";
import { LeadershipGap } from "./animatic/LeadershipGap";
import { DURATION_SECONDS } from "./animatic/shots";
import { SHOTS_30, CAPTIONS_30, DURATION_SECONDS_30 } from "./animatic/shots30";
import { WhenEveryoneHasAI } from "./animatic/v3/WhenEveryoneHasAI";
import {
  SHOTS_30_V3,
  CAPTIONS_30_V3,
  DURATION_30,
  DURATION_69,
} from "./animatic/v3/shotsV3";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="when-everyone-has-ai-69"
      component={WhenEveryoneHasAI}
      durationInFrames={DURATION_69 * 30}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="when-everyone-has-ai-30"
      component={WhenEveryoneHasAI}
      durationInFrames={DURATION_30 * 30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ shots: SHOTS_30_V3, captions: CAPTIONS_30_V3 }}
    />

    <Composition
      id="leadership-gap"
      component={LeadershipGap}
      durationInFrames={DURATION_SECONDS * 30}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="leadership-gap-30"
      component={LeadershipGap}
      durationInFrames={DURATION_SECONDS_30 * 30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ shots: SHOTS_30, captions: CAPTIONS_30 }}
    />
    <Composition


      id="conviction"
      component={MainVideo}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ v: conviction }}
    />
    <Composition
      id="provocative"
      component={MainVideo}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ v: provocative }}
    />
  </>
);
