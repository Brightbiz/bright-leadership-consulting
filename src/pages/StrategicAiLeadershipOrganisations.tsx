import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { supabase } from "@/integrations/supabase/client";
import { reportEnquiryConversion } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

/**
 * Enquiry type recorded for every submission from this page. The Google Ads
 * conversion "AI Programme Organisational Enquiry" is scoped to exactly this
 * value, so it can never be triggered by an individual-interest enquiry.
 */
const ENQUIRY_TYPE = "AI programme — organisational, cohort or in-house delivery";

const leadershipQuestions = [
  "where AI supports strategic priorities, and where it does not;",
  "which decisions must remain subject to human accountability;",
  "how AI-related risk and governance will be managed;",
  "how roles, workflows and operating assumptions may change;",
  "how executive and functional leaders will coordinate adoption;",
  "what leadership capability is required for responsible implementation.",
];

const outcomes = [
  "stronger executive understanding of AI's strategic implications;",
  "clearer leadership accountability for AI-related decisions;",
  "improved alignment between strategy, technology, governance, people and operations;",
  "a more disciplined approach to responsible AI adoption;",
  "greater readiness to lead organisational and workforce change;",
  "an applied AI Leadership Blueprint™ connecting learning to organisational priorities.",
];

const audience = [
  "executive and senior-leadership teams;",
  "CEOs, directors and senior functional leaders;",
  "Chief People Officers and HR leadership teams;",
  "technology, transformation and operational leaders;",
  "Learning and Development leaders commissioning executive capability;",
  "boards or leadership groups examining AI governance and organisational readiness.",
];

const enquirySchema = z.object({
  name: z.string().trim().min(1, { message: "Please complete this field." }).max(100),
  email: z.string().trim().email({ message: "Email format appears invalid." }).max(255),
  organisation: z.string().trim().min(1, { message: "Please complete this field." }).max(100),
  role: z.string().trim().min(1, { message: "Please complete this field." }).max(100),
  cohortSize: z.string().trim().max(60).optional(),
  objective: z
    .string()
    .trim()
    .min(10, { message: "Please provide further detail." })
    .max(600),
  timeframe: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1000).optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const inputClass = "h-12 bg-muted/30 border-border/50 focus:border-secondary";

const StrategicAiLeadershipOrganisations = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      organisation: "",
      role: "",
      cohortSize: "",
      objective: "",
      timeframe: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: EnquiryFormData) => {
    const details = [
      `Enquiry type: ${ENQUIRY_TYPE}`,
      `Role: ${data.role}`,
      data.cohortSize ? `Approx. cohort or team size: ${data.cohortSize}` : null,
      data.timeframe ? `Preferred delivery timeframe: ${data.timeframe}` : null,
      `Organisational objective: ${data.objective}`,
    ].filter(Boolean);

    try {
      const { data: result, error } = await supabase.functions.invoke("submit-form", {
        body: {
          formType: "contact",
          formData: {
            name: data.name,
            email: data.email,
            phone: null,
            company: data.organisation,
            message: `${details.join("\n")}${data.message ? `\n\n${data.message}` : ""}`,
          },
        },
      });

      if (error) throw error;

      if (result?.error) {
        toast({
          title: "Please try again later",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Server-confirmed organisational enquiry only. Guarded inside
      // reportEnquiryConversion so it can fire at most once.
      reportEnquiryConversion();
      setIsSubmitted(true);
    } catch (submitError) {
      console.error("Error submitting form:", submitError);
      toast({
        title: "Submission could not be processed",
        description: "Please try again shortly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Strategic AI Leadership for Organisations | Bright Leadership Consulting"
        description="Facilitated Strategic Leadership in the Age of AI programmes for UK leadership teams, executive cohorts and organisations navigating AI strategy, governance and change."
        path="/strategic-ai-leadership-for-organisations"
        type="website"
      />
      <ScrollProgress />
      <Header />

      <main id="main-content">
        {/* ------------------------------------------------------------ hero */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-28 section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Strategic Leadership in the Age of AI
              </motion.p>
              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Convert AI Capability Into Strategic Advantage
              </motion.h1>
              <motion.div
                className="space-y-5"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="body-brief">
                  AI is expanding what organisations can analyse, imagine and
                  execute. But widely available capability does not
                  automatically create differentiation.
                </p>
                <p className="body-brief">
                  When organisations rely on comparable tools, similar data,
                  familiar assumptions and conventional approaches, they risk
                  producing comparable analysis, comparable options and
                  increasingly similar strategies.
                </p>
                <p className="body-brief">
                  The leadership challenge is to convert AI into new value,
                  stronger strategic choices and coordinated organisational
                  performance.
                </p>
              </motion.div>


              <motion.div
                className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
                {...fade}
                transition={{ ...fade.transition, delay: 0.3 }}
              >
                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-sm border border-secondary px-8 py-3.5 text-sm font-medium tracking-[0.03em] text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  Discuss Executive Alignment
                </a>
                <a
                  href="#outcomes"
                  className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-3.5 text-sm font-medium tracking-[0.03em] text-foreground transition-colors hover:border-foreground/40"
                >
                  Explore Programme Outcomes
                </a>
              </motion.div>

              <motion.p
                className="mt-8 max-w-[560px] text-[13px] leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.35 }}
              >
                For facilitated team cohorts and in-house organisational
                delivery. Enquiries about individual participation are handled
                separately on request.

              </motion.p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- the challenge */}
        <section className="py-24 lg:py-28">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2 className="heading-section mb-8" {...fade}>
                AI Creates Leadership Questions Before It Creates Technical
                Answers
              </motion.h2>
              <motion.p className="body-brief mb-8" {...fade}>
                Before technical delivery can be judged sound, organisations
                need leaders who can determine:
              </motion.p>
              <motion.ul className="space-y-4 border-t border-border pt-8" {...fade}>
                {leadershipQuestions.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-5 shrink-0 bg-border" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- the purpose */}
        <section className="py-24 lg:py-28 section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px] space-y-6">
              <motion.h2 className="heading-section mb-4" {...fade}>
                A Strategic Leadership Programme for Organisational Contexts
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                Strategic Leadership in the Age of AI helps senior leaders
                examine the organisational implications of AI through the lenses
                of strategy, governance, judgement, leadership and change.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                The programme is designed to support a shared leadership
                response—not simply individual awareness. Delivery is discussed
                in relation to the organisation's context, intended participants
                and strategic priorities.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                The programme comprises ten core leadership modules, supported by
                introductory content, applied assessment and the AI Leadership
                Blueprint™ capstone.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- outcomes */}
        <section id="outcomes" className="scroll-mt-24 py-24 lg:py-28">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2 className="heading-section mb-8" {...fade}>
                Intended Organisational Outcomes
              </motion.h2>
              <motion.p className="body-brief mb-8" {...fade}>
                The following are intended outcomes of participation, discussed
                during scoping. They are not guaranteed results.
              </motion.p>
              <motion.ul className="space-y-4 border-t border-border pt-8" {...fade}>
                {outcomes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-5 shrink-0 bg-border" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ team cohorts */}
        <section
          id="team-cohorts"
          className="scroll-mt-24 py-24 lg:py-28 section-pearl"
        >
          <div className="container-brief">
            <div className="max-w-[680px] space-y-6">
              <motion.h2 className="heading-section mb-4" {...fade}>
                Facilitated Team Cohorts
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                A facilitated cohort can help leaders develop shared language,
                examine common organisational questions and connect learning to
                the strategic environment in which they operate.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                This route may suit organisations seeking to develop a defined
                group of senior or cross-functional leaders together.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                Delivery format, participant numbers, facilitation arrangements
                and timing are confirmed during scoping.
              </motion.p>
              <motion.div className="pt-4" {...fade}>
                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-sm border border-secondary px-8 py-3.5 text-sm font-medium tracking-[0.03em] text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  Discuss a Team Cohort
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- in-house */}
        <section id="in-house" className="scroll-mt-24 py-24 lg:py-28">
          <div className="container-brief">
            <div className="max-w-[680px] space-y-6">
              <motion.h2 className="heading-section mb-4" {...fade}>
                In-House Organisational Delivery
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                In-house delivery provides a focused route for organisations
                seeking to connect executive learning with their own strategic,
                governance and transformation context.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                The scoping discussion considers the intended audience,
                organisational objectives, delivery environment and the
                practical application expected from participants.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                Any facilitation, advisory support or additional organisational
                component is confirmed in writing before engagement.
              </motion.p>
              <motion.div className="pt-4" {...fade}>
                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-sm border border-secondary px-8 py-3.5 text-sm font-medium tracking-[0.03em] text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  Discuss In-House Delivery
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ who it's for */}
        <section
          id="who-it-is-for"
          className="scroll-mt-24 py-24 lg:py-28 section-pearl"
        >
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2 className="heading-section mb-8" {...fade}>
                Who the Programme Is For
              </motion.h2>
              <motion.ul className="space-y-4 border-t border-border pt-8" {...fade}>
                {audience.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-5 shrink-0 bg-border" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
              <motion.p
                className="mt-10 text-[15px] leading-relaxed text-foreground"
                {...fade}
              >
                This programme is leadership-focused. It is not a coding or
                software-development course.
              </motion.p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- CPD and completion */}
        <section className="py-24 lg:py-28">
          <div className="container-brief">
            <div className="max-w-[680px] space-y-5">
              <motion.h2 className="heading-section mb-4" {...fade}>
                CPD and Completion
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                Strategic Leadership in the Age of AI is accredited for 20–30 CPD
                hours during the 2025–2026 accreditation period.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                Participants who satisfy the approved completion requirements
                receive the official CPDSO Certificate of Attendance manually
                from Bright Leadership Consulting, using the standard template
                supplied by The CPD Standards Office.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                The certificate records participation in an accredited CPD
                activity. It is not a qualification, professional certification
                or academic award.
              </motion.p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- principal */}
        <section className="py-24 lg:py-28 section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px] space-y-5">
              <motion.h2 className="heading-section mb-4" {...fade}>
                Principal-Led Delivery
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                Bright Leadership Consulting is led by Irene A. Agunbiade, whose
                background includes UK banking leadership, management consulting,
                business advisory work, Industrial Engineering and an MBA in
                International Business.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                The firm's work brings together leadership judgement,
                organisational structure, decision quality and practical
                execution.
              </motion.p>
              <motion.p className="body-brief" {...fade}>
                Every organisational programme discussion is principal-led and
                scoped around the organisation's context.
              </motion.p>
              <motion.p className="pt-2" {...fade}>
                <Link
                  to="/principal"
                  className="text-sm font-medium tracking-[0.02em] text-foreground underline underline-offset-4 transition-colors hover:text-secondary"
                >
                  About the Principal
                </Link>
              </motion.p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- enquiry */}
        <section id="enquiry" className="scroll-mt-24 py-24 lg:py-32">
          <div className="container-brief">
            <div className="max-w-[560px]">
              <motion.h2 className="heading-section mb-8" {...fade}>
                Discuss Strategic AI Leadership for Your Organisation
              </motion.h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <CheckCircle className="mx-auto mb-6 h-10 w-10 text-secondary" />
                  <h3 className="heading-section mb-4">Enquiry Received</h3>
                  <p className="body-brief">
                    Your enquiry has been received.
                    <br />
                    A principal-led response will follow shortly.
                  </p>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Work email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organisation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Organisation
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Role
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cohortSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Approximate cohort or team size{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. 12 senior leaders"
                              className={inputClass}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Organisational objective
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              className="resize-none border-border/50 bg-muted/30 focus:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Preferred delivery timeframe{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. within the next quarter"
                              className={inputClass}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Message{" "}
                            <span className="text-muted-foreground">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              className="resize-none border-border/50 bg-muted/30 focus:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      We use the information submitted to respond to your
                      enquiry.{" "}
                      <Link
                        to="/privacy"
                        className="underline underline-offset-4 transition-colors hover:text-foreground"
                      >
                        See our Privacy Notice
                      </Link>
                      .
                    </p>

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full rounded-sm text-sm font-medium tracking-[0.03em]"
                    >
                      {form.formState.isSubmitting
                        ? "Submitting…"
                        : "Discuss Organisational Delivery"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StrategicAiLeadershipOrganisations;
