import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Captions } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { individualEnquiryPath } from "@/data/programmes";
import { trackEvent, ELM_EMPLOYER_FUNDED_ENQUIRY } from "@/lib/analytics";
import video from "@/assets/elm-webinar.mp4.asset.json";
import poster from "@/assets/elm-webinar-poster.jpg.asset.json";
import captions from "@/assets/elm-webinar-captions.vtt.asset.json";

const INDIVIDUAL_PATH = individualEnquiryPath("Executive Leadership Mastery Programme");
const EMPLOYER_PATH = `/contact?enquiry=${ELM_EMPLOYER_FUNDED_ENQUIRY}`;

const track = (name: string, destination: string, label: string) =>
  trackEvent(name, { cta_surface: "elm_webinar", destination_url: destination, cta_label: label });

type CaptionCue = {
  start: number;
  end: number;
  text: string;
};

const timestampToSeconds = (timestamp: string) => {
  const parts = timestamp.replace(",", ".").split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
};

const parseCaptions = (source: string): CaptionCue[] =>
  source
    .replace(/\r/g, "")
    .split("\n\n")
    .flatMap((block) => {
      const lines = block.split("\n").filter(Boolean);
      const timingIndex = lines.findIndex((line) => line.includes(" --> "));
      if (timingIndex < 0) return [];

      const [start, endWithSettings] = lines[timingIndex].split(" --> ");
      const end = endWithSettings?.split(/\s+/)[0];
      const text = lines
        .slice(timingIndex + 1)
        .join(" ")
        .replace(/<[^>]+>/g, "")
        .trim();

      if (!start || !end || !text) return [];
      return [{ start: timestampToSeconds(start), end: timestampToSeconds(end), text }];
    });

const ElmWebinar = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [captionCues, setCaptionCues] = useState<CaptionCue[]>([]);
  const [activeCaption, setActiveCaption] = useState("");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    fetch(captions.url)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error("Captions unavailable"))))
      .then((source) => {
        if (isCurrent) setCaptionCues(parseCaptions(source));
      })
      .catch(() => {
        if (isCurrent) setCaptionCues([]);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const updateCaption = () => {
    const currentTime = videoRef.current?.currentTime;
    if (currentTime === undefined) return;
    setActiveCaption(captionCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end)?.text ?? "");
  };

  return (
    <div className="min-h-screen bg-background">
    <SEOHead
      title="On-Demand Webinar | Executive Leadership Mastery"
      description="On-demand webinar: developing the leaders your organisation depends on."
      path="/executive-leadership-mastery/webinar"
      noindex
    />
    <Header />
    <main className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">On-demand webinar</p>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
          Developing the leaders your organisation depends on
        </h1>
        <div className="w-full aspect-video bg-primary overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={video.url}
            poster={poster.url}
            controls
            preload="metadata"
            playsInline
            crossOrigin="anonymous"
            onTimeUpdate={updateCaption}
            onSeeked={updateCaption}
          >
            <track kind="captions" src={captions.url} srcLang="en-GB" label="English" />
          </video>
        </div>
        <div className="flex min-h-20 items-center gap-3 border-x border-b border-border bg-muted px-4 py-3 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-sm"
            aria-label={captionsEnabled ? "Turn captions off" : "Turn captions on"}
            aria-pressed={captionsEnabled}
            title={captionsEnabled ? "Turn captions off" : "Turn captions on"}
            onClick={() => setCaptionsEnabled((enabled) => !enabled)}
          >
            <Captions aria-hidden="true" />
          </Button>
          <p className="flex-1 text-center text-sm leading-relaxed text-foreground sm:text-base" aria-live="polite">
            {captionsEnabled ? activeCaption : ""}
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to={INDIVIDUAL_PATH}
            onClick={() => track("elm_webinar_individual_enrolment_click", INDIVIDUAL_PATH, "Request Individual Enrolment")}
            className="inline-flex justify-center items-center px-6 py-3 border border-primary bg-primary text-primary-foreground text-sm hover:bg-accent hover:border-accent transition-colors"
          >
            Request Individual Enrolment
          </Link>
          <Link
            to={EMPLOYER_PATH}
            onClick={() => track("elm_webinar_employer_funded_click", EMPLOYER_PATH, "Request Employer-Funded Enrolment Information")}
            className="inline-flex justify-center items-center px-6 py-3 border border-primary text-primary text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Request Employer-Funded Enrolment Information
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
};

export default ElmWebinar;
