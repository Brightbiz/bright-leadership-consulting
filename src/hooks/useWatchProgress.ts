import { useCallback, useRef } from "react";
import { hasAnalyticsConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

/**
 * Viewing measurement based on the share of the video actually watched.
 *
 * The video is divided into one-second slots. A slot is marked only when
 * playback runs continuously through it at normal speed (≤1×): skipping
 * ahead marks nothing, and replaying already-watched slots adds nothing.
 * Play fires once; 25/50/75% fire once each when that share of slots is
 * watched; 100% fires at 95% of slots. State lives only in this page visit.
 * Events are sent only when the visitor has accepted Analytics and carry no
 * identifiers.
 */
export const WATCH_THRESHOLDS = [25, 50, 75, 100] as const;
const COMPLETE_SHARE = 0.95;
const MAX_CONTINUOUS_STEP = 1.5;

export function createWatchTracker(send: (name: string, params: Record<string, unknown>) => void) {
  let watched = new Set<number>();
  let last: number | null = null;
  let played = false;
  const fired = new Set<number>();

  const progress = (duration: number) => {
    const slots = Math.ceil(duration);
    if (!slots) return;
    const share = watched.size / slots;
    for (const pct of WATCH_THRESHOLDS) {
      const needed = pct === 100 ? COMPLETE_SHARE : pct / 100;
      if (share >= needed && !fired.has(pct)) {
        fired.add(pct);
        send("elm_webinar_progress", { percent: pct });
      }
    }
  };

  return {
    play() {
      if (played) return;
      played = true;
      send("elm_webinar_play", {});
    },
    seek(time: number) {
      last = time;
    },
    tick(time: number, duration: number, rate: number, paused: boolean) {
      if (paused || !Number.isFinite(duration) || duration <= 0) {
        last = time;
        return;
      }
      if (last !== null && rate <= 1 && time >= last && time - last <= MAX_CONTINUOUS_STEP) {
        for (let s = Math.floor(last); s <= Math.floor(time); s++) {
          if (s < Math.ceil(duration)) watched.add(s);
        }
        progress(duration);
      }
      last = time;
    },
    /** For tests only. */
    reset() {
      watched = new Set();
      last = null;
      played = false;
      fired.clear();
    },
    get watchedSeconds() {
      return watched.size;
    },
  };
}

const consentedSend = (name: string, params: Record<string, unknown>) => {
  if (hasAnalyticsConsent()) trackEvent(name, { ...params, video_id: "elm_webinar" });
};

export function useWatchProgress() {
  const tracker = useRef(createWatchTracker(consentedSend));
  const onPlay = useCallback(() => tracker.current.play(), []);
  const onSeeking = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    tracker.current.seek(e.currentTarget.currentTime);
  }, []);
  const onTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    tracker.current.tick(v.currentTime, v.duration, v.playbackRate, v.paused);
  }, []);
  return { onPlay, onSeeking, onTimeUpdate };
}
