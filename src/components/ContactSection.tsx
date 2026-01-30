import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
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
import AnimatedSection from "./AnimatedSection";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
      { message: "Please enter a valid phone number" }
    ),
  company: z
    .string()
    .trim()
    .max(100, { message: "Company name must be less than 100 characters" })
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          message: data.message,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-gradient-to-br from-muted/50 via-background to-primary/[0.04]">
      {/* Subtle corner accents */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-primary/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-secondary/[0.04] to-transparent" />
      
      <div className="container-narrow relative">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
              <MessageSquare className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                Get In Touch
              </span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              Start Your Leadership <span className="text-primary">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to transform your leadership? Contact us for a free consultation 
              and discover how we can help you achieve extraordinary results.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Contact Info */}
          <AnimatedSection className="lg:col-span-2" animation="slide-left">
            <div className="space-y-8">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">
                  Contact Information
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Schedule your free consultation today and take the first step 
                  towards leadership excellence.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Email</div>
                      <a
                        href="mailto:info@brightleadershipconsulting.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@brightleadershipconsulting.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Phone</div>
                      <a
                        href="tel:+441234567890"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +44 (0) 123 456 7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Location</div>
                      <span className="text-sm text-muted-foreground">
                        London, United Kingdom
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                <h4 className="mb-4 font-semibold text-foreground">Office Hours</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-card/50">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-card/50">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium text-foreground">By Appointment</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-white/50 dark:bg-card/50">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection className="lg:col-span-3" animation="slide-right" delay={100}>
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl shadow-primary/5">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Your message has been sent successfully. We'll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                {...field}
                                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
                              />
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
                            <FormLabel className="text-foreground">Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@company.com"
                                {...field}
                                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+44 123 456 7890"
                                {...field}
                                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
                              />
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
                            <FormLabel className="text-foreground">Company</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your Company"
                                {...field}
                                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Your Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your leadership goals and how we can help..."
                              {...field}
                              rows={5}
                              className="resize-none bg-muted/50 border-border/50 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      variant="teal"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
