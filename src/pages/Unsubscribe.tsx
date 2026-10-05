import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    if (!/^[a-f0-9]{64}$/.test(token)) {
      setState("error");
      return;
    }
    supabase.functions
      .invoke("marketing-unsubscribe", { body: { token } })
      .then(({ data, error }) => setState(error || data?.error ? "error" : "done"));
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Unsubscribe | Bright Leadership Consulting" description="Unsubscribe from follow-up emails." path="/unsubscribe" noindex />
      <Header />
      <main className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-[680px]" aria-live="polite">
          <h1 className="font-serif text-3xl text-foreground mb-6">Email preferences</h1>
          {state === "working" && <p className="text-muted-foreground">Processing your request…</p>}
          {state === "done" && (
            <p className="text-foreground">You have been unsubscribed. No further follow-up emails will be sent to this address.</p>
          )}
          {state === "error" && (
            <p className="text-foreground">
              This unsubscribe link could not be processed. Please email info@brightleadershipconsulting.com and we will remove you.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
