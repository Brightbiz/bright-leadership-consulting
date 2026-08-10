import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { reportEnquiryConversion } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { programmeInterestOptions } from "@/data/programmes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ORGANISATIONAL = "Organisational / leadership team";
const INDIVIDUAL = "Individual executive";

const tracks = [
  {
    value: ORGANISATIONAL,
    label: "Organisational",
    detail:
      "A board, chair or executive sponsor commissioning work for a leadership team. Engagements begin with the Executive Alignment Index™.",
  },
  {
    value: INDIVIDUAL,
    label: "Individual executive",
    detail:
      "An executive enrolling personally on a programme. No diagnostic is required to begin.",
  },
];

const deliveryFormats = [
  "Self-directed",
  "Cohort-based",
  "1:1 advisory",
  "In-house / bespoke delivery",
  "Not yet decided",
];

const timeframes = [
  "Immediate start",
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Exploratory",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Please complete this field." }).max(100),
  email: z.string().trim().email({ message: "Email format appears invalid." }).max(255),
  company: z.string().trim().max(100).optional(),
  role: z.string().trim().max(100).optional(),
  enquiryType: z.string().min(1, { message: "Please select an option." }),
  programme: z.string().optional(),
  deliveryFormat: z.string().optional(),
  participants: z.string().trim().max(20).optional(),
  timeframe: z.string().optional(),
  message: z.string().trim().min(10, { message: "Please provide further detail." }).max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const prefilledProgramme = programmeInterestOptions.find(
    (option) =>
      option.toLowerCase() === (searchParams.get("programme") ?? "").toLowerCase()
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      enquiryType: prefilledProgramme ? INDIVIDUAL : "",
      programme: prefilledProgramme ?? "",
      deliveryFormat: "",
      participants: "",
      timeframe: "",
      message: "",
    },
    mode: "onTouched",
  });

  const track = form.watch("enquiryType");



  const onSubmit = async (data: ContactFormData) => {
    const details = [
      data.role ? `Role: ${data.role}` : null,
      `Enquiry type: ${data.enquiryType}`,
      data.programme ? `Programme of interest: ${data.programme}` : null,
      data.deliveryFormat ? `Preferred delivery: ${data.deliveryFormat}` : null,
      data.participants ? `Approx. participants: ${data.participants}` : null,
      data.timeframe ? `Timeframe: ${data.timeframe}` : null,
    ].filter(Boolean);

    try {
      const { data: result, error } = await supabase.functions.invoke("submit-form", {
        body: {
          formType: "contact",
          formData: {
            name: data.name,
            email: data.email,
            phone: null,
            company: data.company || null,
            message: `${details.join("\n")}\n\n${data.message}`,
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

      // Confirmed success only: the request returned without a transport or
      // server error. Google Ads conversion for organisational / cohort
      // enquiries, fired at most once (guarded in reportEnquiryConversion).
      if (
        data.enquiryType === ORGANISATIONAL ||
        data.deliveryFormat === "Cohort-based" ||
        data.deliveryFormat === "In-house / bespoke delivery"
      ) {
        reportEnquiryConversion();
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
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
        title="Enquire — Bright Leadership Consulting"
        description="Enquire about executive alignment advisory, the Executive Alignment Index™, or CPD-accredited leadership programmes. Handled confidentially."
        path="/contact"
      />
      <ScrollProgress />
      <Header />

      <main>
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 section-pearl">
          <div className="container-brief">
            <div className="max-w-[520px]">
              {/* Heading */}
              <motion.p className="kicker mb-6" {...fade}>Confidential Enquiry</motion.p>
              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Confidential Executive Enquiries
              </motion.h1>
              <motion.p
                className="body-brief mb-16"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                Executive alignment engagements are discussed confidentially and by arrangement.
              </motion.p>

              <div className="section-divider mb-16" />

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <CheckCircle className="h-10 w-10 text-secondary mx-auto mb-6" />
                <h2 className="heading-section mb-4">Enquiry Received</h2>
                <p className="body-brief">
                  Your enquiry has been received.<br />
                  A member of our team will respond shortly.
                </p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="enquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Which applies to you?
                        </FormLabel>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {tracks.map((option) => {
                            const active = field.value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.onChange(option.value)}
                                aria-pressed={active}
                                className={`rounded-sm border p-4 text-left transition-colors ${
                                  active
                                    ? "border-secondary bg-secondary/5"
                                    : "border-border/50 bg-muted/20 hover:border-border"
                                }`}
                              >
                                <span className="block text-sm font-medium text-foreground">
                                  {option.label}
                                </span>
                                <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                                  {option.detail}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="section-divider !my-2" />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 bg-muted/30 border-border/50 focus:border-secondary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {track === ORGANISATIONAL && (
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Organisation</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 bg-muted/30 border-border/50 focus:border-secondary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Role</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 bg-muted/30 border-border/50 focus:border-secondary" />
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
                        <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-12 bg-muted/30 border-border/50 focus:border-secondary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {track === INDIVIDUAL && (
                    <>
                      <div className="section-divider !my-2" />

                      <FormField
                        control={form.control}
                        name="programme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Programme of interest
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-muted/30 border-border/50 focus:border-secondary">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {programmeInterestOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Preferred delivery format
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-muted/30 border-border/50 focus:border-secondary">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {deliveryFormats.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {track === ORGANISATIONAL && (
                    <>
                      <div className="section-divider !my-2" />

                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Size of the leadership team in scope
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                inputMode="numeric"
                                placeholder="e.g. 9 direct reports, or 12 including the executive committee"
                                className="h-12 bg-muted/30 border-border/50 focus:border-secondary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}


                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          Desired timeframe
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-muted/30 border-border/50 focus:border-secondary">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeframes.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="section-divider !my-2" />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="resize-none bg-muted/30 border-border/50 focus:border-secondary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="outline"
                      size="lg"
                      className="border-primary/20 text-foreground hover:border-secondary hover:text-secondary transition-colors"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="animate-pulse">Submitting…</span>
                      ) : (
                        "Submit Enquiry"
                      )}
                    </Button>
                  </div>
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

export default Contact;
