import { useCallback, useRef } from "react";
import { hasAnalyticsConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

/**
 * Playback coverage = distinct one-second sections of the video actually
 * played, at any playback speed. It measures playback, not attention: a
 * video playing in an unattended tab counts the same. Seeking, buffering and paused time add
 * nothing; replaying a section adds nothing.
 *
 * Events (each at most once per page visit):
 *  - elm_webinar_play      first play
 *  - elm_webinar_progress  percent 25 / 50 / 75 of coverage
 *  - elm_webinar_complete  coverage reaches 95% (definition of "complete";
 *                          never reported as 100%)
 *
 * Nothing is sent, in code, unless Analytics consent is granted at send
 * time. No identifiers or personal details; no link to enquiry records.
 */
export const PROGRESS_THRESHOLDS = [25, 50, 75] as const;
export const COMPLETE_SHARE = 0.95;
// Max media-time advance between two timeupdates still treated as continuous
// playback (timeupdate fires ~4×/s; allows up to ~4× speed with headroom).
const MAX_CONTINUOUS_STEP = 2.5;

export function createWatchTracker(send: (name: string, params: Record<string, unknown>) => void) {
  let watched = new Set<number>();
  let last: number | null = null;
  let played = false;
  let completed = false;
  const fired = new Set<number>();

  const evaluate = (duration: number) => {
    const slots = Math.ceil(duration);
    if (!slots) return;
    const share = watched.size / slots;
    for (const pct of PROGRESS_THRESHOLDS) {
      if (share >= pct / 100 && !fired.has(pct)) {
        fired.add(pct);
        send("elm_webinar_progress", { percent: pct });
      }
    }
    if (!completed && share >= COMPLETE_SHARE) {
      completed = true;
      send("elm_webinar_complete", {});
    }
  };

  return {
    play() {
      if (played) return;
      played = true;
      send("elm_webinar_play", {});
    },
    /** Seeking or buffering breaks continuity. */
    interrupt(time: number) {
      last = time;
    },
    tick(time: number, duration: number, paused: boolean, buffering: boolean) {
      if (paused || buffering || !Number.isFinite(duration) || duration <= 0) {
        last = time;
        return;
      }
      if (last !== null && time > last && time - last <= MAX_CONTINUOUS_STEP) {
        for (let s = Math.floor(last); s <= Math.floor(time); s++) {
          if (s < Math.ceil(duration)) watched.add(s);
        }
        evaluate(duration);
      }
      last = time;
    },
    reset() {
      watched = new Set(); last = null; played = false; completed = false; fired.clear();
    },
    get watchedSeconds() { return watched.size; },
  };
}

const consentedSend = (name: string, params: Record<string, unknown>) => {
  if (!hasAnalyticsConsent()) return;
  trackEvent(name, { ...params, video_id: "elm_webinar" });
};

export function useWatchProgress() {
  const tracker = useRef(createWatchTracker(consentedSend));
  const onPlay = useCallback(() => tracker.current.play(), []);
  const interrupt = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    tracker.current.interrupt(e.currentTarget.currentTime);
  }, []);
  const onTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    tracker.current.tick(v.currentTime, v.duration, v.paused, v.readyState < 3);
  }, []);
  return { onPlay, onSeeking: interrupt, onWaiting: interrupt, onTimeUpdate };
}
