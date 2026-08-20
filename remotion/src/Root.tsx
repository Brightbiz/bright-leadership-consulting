import React from "react";
import { Composition } from "remotion";
import { MainVideo, TOTAL } from "./MainVideo";
import { conviction, provocative } from "./variants";

export const RemotionRoot: React.FC = () => (
  <>
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
