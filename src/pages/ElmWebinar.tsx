import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Captions } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { individualEnquiryPath } from "@/data/programmes";
import {
  trackEvent,
  ELM_EMPLOYER_FUNDED_ENQUIRY,
  ELM_INDIVIDUAL_ENROLMENT_ENQUIRY,
  ELM_WEBINAR_SOURCE,
} from "@/lib/analytics";
import video from "@/assets/elm-webinar.mp4.asset.json";
import poster from "@/assets/elm-webinar-poster.jpg.asset.json";
import captions from "@/assets/elm-webinar-captions.vtt.asset.json";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import { withCampaignTags } from "@/lib/campaignTags";
import { ELM_WEBINAR_WORKSHEET_URL } from "@/data/marketingConsent";
import WebinarFollowUpForm from "@/components/WebinarFollowUpForm";

const INDIVIDUAL_PATH = `${individualEnquiryPath("Executive Leadership Mastery Programme")}&enquiry=${ELM_INDIVIDUAL_ENROLMENT_ENQUIRY}&source=${ELM_WEBINAR_SOURCE}`;
const EMPLOYER_PATH = `/contact?enquiry=${ELM_EMPLOYER_FUNDED_ENQUIRY}&source=${ELM_WEBINAR_SOURCE}`;

const track = (name: string, destination: string, label: string) =>
  trackEvent(name, { cta_surface: "elm_webinar", destination_url: destination, cta_label: label });

type CaptionCue = { start: number; end: number; text: string };

const timestampToSeconds = (timestamp: string) => {
  const parts = timestamp.trim().split(":").map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
};

const parseCaptions = (source: string): CaptionCue[] =>
  source.replace(/\r/g, "").split("\n\n").flatMap((block) => {
    const lines = block.split("\n").filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes(" --> "));
    if (timingIndex < 0) return [];
    const [start, endWithSettings] = lines[timingIndex].split(" --> ");
    const end = endWithSettings?.split(/\s+/)[0];
    const text = lines.slice(timingIndex + 1).join(" ").replace(/<[^>]+>/g, "").trim();
    return start && end && text ? [{ start: timestampToSeconds(start), end: timestampToSeconds(end), text }] : [];
  });

const ElmWebinar = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [captionCues, setCaptionCues] = useState<CaptionCue[]>([]);
  const [activeCaption, setActiveCaption] = useState("");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const watch = useWatchProgress();
  // Campaign tags from the landing address travel with the enquiry links.
  const individualPath = withCampaignTags(INDIVIDUAL_PATH);
  const employerPath = withCampaignTags(EMPLOYER_PATH);

  useEffect(() => {
    let isCurrent = true;
    fetch(captions.url)
      .then((response) => response.text())
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
            onTimeUpdate={(e) => {
              updateCaption();
              watch.onTimeUpdate(e);
            }}
            onSeeking={watch.onSeeking}
            onSeeked={updateCaption}
            onPlay={watch.onPlay}
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
            to={individualPath}
            onClick={() => track("elm_webinar_individual_enrolment_click", INDIVIDUAL_PATH, "Request Individual Enrolment")}
            className="inline-flex justify-center items-center px-6 py-3 border border-primary bg-primary text-primary-foreground text-sm hover:bg-accent hover:border-accent transition-colors"
          >
            Request Individual Enrolment
          </Link>
          <Link
            to={employerPath}
            onClick={() => track("elm_webinar_employer_funded_click", EMPLOYER_PATH, "Request Employer-Funded Enrolment Information")}
            className="inline-flex justify-center items-center px-6 py-3 border border-primary text-primary text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Request Employer-Funded Enrolment Information
          </Link>
        </div>
        <section className="mt-16 grid gap-10 border-t border-border pt-12 md:grid-cols-2" aria-labelledby="worksheet-heading">
          <div>
            <h2 id="worksheet-heading" className="font-serif text-xl text-foreground mb-3">Webinar worksheet</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6 max-w-[420px]">
              A short worksheet to accompany the webinar. No details are required to download it.
            </p>
            {ELM_WEBINAR_WORKSHEET_URL ? (
              <a
                href={ELM_WEBINAR_WORKSHEET_URL}
                download
                onClick={() => track("elm_webinar_worksheet_download", ELM_WEBINAR_WORKSHEET_URL, "Download the worksheet")}
                className="inline-flex justify-center items-center px-6 py-3 border border-primary text-primary text-sm hover:border-accent hover:text-accent transition-colors"
              >
                Download the worksheet (PDF)
              </a>
            ) : (
              <span className="inline-flex px-6 py-3 border border-border text-muted-foreground text-sm" aria-disabled="true">
                Worksheet available shortly
              </span>
            )}
          </div>
          <WebinarFollowUpForm />
        </section>
      </div>
    </main>
    <Footer />
    </div>
  );
};

export default ElmWebinar;
