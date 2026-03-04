import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { useRateLimit } from "@/hooks/useRateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Please complete this field." }).max(100),
  email: z.string().trim().email({ message: "Email format appears invalid." }).max(255),
  company: z.string().trim().max(100).optional(),
  role: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, { message: "Please provide further detail." }).max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { checkRateLimit, recordSubmission, isChecking } = useRateLimit();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", role: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const rateLimitResult = await checkRateLimit("contact");
      if (!rateLimitResult.allowed) {
        toast({
          title: "Please try again later",
          description: rateLimitResult.message || "Too many submissions.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: null,
        company: data.company || null,
        message: `${data.role ? `Role: ${data.role}\n\n` : ""}${data.message}`,
      });

      if (error) throw error;
      await recordSubmission("contact");
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
        description="Executive alignment engagements are discussed confidentially and by arrangement."
        path="/contact"
      />
      <Header />

      <main className="pt-32 pb-24">
        <div className="container-brief">
          <div className="prose-narrow mx-auto">
            {/* Heading */}
            <p className="kicker mb-6">Confidential Enquiry</p>
            <h1 className="heading-hero mb-8">
              Confidential Executive Enquiries
            </h1>
            <p className="body-brief mb-16">
              Executive alignment engagements are discussed confidentially and by arrangement.
            </p>

            {/* Divider */}
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
                      disabled={form.formState.isSubmitting || isChecking}
                    >
                      {form.formState.isSubmitting || isChecking ? (
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
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
