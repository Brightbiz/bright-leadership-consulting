import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
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


const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

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
  

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", role: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { data: result, error } = await supabase.functions.invoke("submit-form", {
        body: {
          formType: "contact",
          formData: {
            name: data.name,
            email: data.email,
            phone: null,
            company: data.company || null,
            message: `${data.role ? `Role: ${data.role}\n\n` : ""}${data.message}`,
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
        description="Enquire about executive alignment advisory, the Executive Alignment Index™, or CPD-accredited leadership programmes. All engagements are discussed confidentially."
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
