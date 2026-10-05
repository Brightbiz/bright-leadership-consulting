import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MARKETING_CONSENT_TEXT, MARKETING_CONSENT_VERSION } from "@/data/marketingConsent";

const SOURCE_PAGE = "/executive-leadership-mastery/webinar";

/**
 * Optional follow-up opt-in. Separate from the worksheet download, which needs
 * no details. Details are collected only when the consent box is ticked.
 */
const WebinarFollowUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus("sending");
    const { data, error } = await supabase.functions.invoke("marketing-optin", {
      body: { name, email, consent, consentVersion: MARKETING_CONSENT_VERSION, sourcePage: SOURCE_PAGE, website },
    });
    if (error || data?.error) {
      setStatus("error");
      setMessage(data?.error ?? "Your request could not be saved. Please try again later.");
      return;
    }
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div aria-live="polite">
        <h2 className="font-serif text-xl text-foreground mb-3">Follow-up material</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Thank you. Your preference has been recorded. Every email includes a link to unsubscribe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" aria-labelledby="followup-heading">
      <h2 id="followup-heading" className="font-serif text-xl text-foreground">
        Email me follow-up material about Executive Leadership Mastery
      </h2>
      <p className="text-sm text-muted-foreground">Optional. Not required to watch the webinar or download the worksheet.</p>
      <div className="space-y-2">
        <Label htmlFor="followup-name">Name</Label>
        <Input id="followup-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="followup-email">Email</Label>
        <Input id="followup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required autoComplete="email" />
      </div>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
      />
      <div className="flex items-start gap-3">
        <input
          id="followup-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-primary"
        />
        <Label htmlFor="followup-consent" className="text-sm font-normal leading-relaxed text-foreground">
          {MARKETING_CONSENT_TEXT}
        </Label>
      </div>
      {status === "error" && <p className="text-sm text-destructive" role="alert">{message}</p>}
      <Button type="submit" variant="outline" className="rounded-sm" disabled={!consent || status === "sending"}>
        {status === "sending" ? "Sending…" : "Send me follow-up material"}
      </Button>
    </form>
  );
};

export default WebinarFollowUpForm;
