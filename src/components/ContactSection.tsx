import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";

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

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@brightleadershipconsulting.com",
    href: "mailto:info@brightleadershipconsulting.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0333 335 5045",
    href: "tel:03333355045",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "London, United Kingdom",
    href: null,
  },
];

const ContactSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(false);
      }, 2500);
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
    <section id="contact" className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-primary/[0.05]">
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-bl from-primary/[0.07] to-transparent" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-tr from-secondary/[0.05] to-transparent" />
      
      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
              <MessageSquare className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                Get In Touch
              </span>
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              <TextReveal>Start Your Leadership Journey</TextReveal>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Ready to transform your leadership? Contact us for a free consultation.
            </p>
          </div>

          {/* Contact Info Cards + CTA */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* Contact Info Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-full bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-primary group-hover:scale-110 transition-transform">
                        <info.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{info.value}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-card border border-border/50 shadow-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                        <info.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{info.value}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <MagneticButton
                variant="teal"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="group shadow-lg"
              >
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Get In Touch</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                Thank You!
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Your message has been sent successfully. We'll be in touch soon.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
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
                            className="h-11 bg-muted/50 border-border/50 focus:border-primary"
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
                        <FormLabel className="text-foreground">Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@company.com"
                            {...field}
                            className="h-11 bg-muted/50 border-border/50 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0333 335 5045"
                            {...field}
                            className="h-11 bg-muted/50 border-border/50 focus:border-primary"
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
                            className="h-11 bg-muted/50 border-border/50 focus:border-primary"
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
                      <FormLabel className="text-foreground">Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your leadership goals..."
                          {...field}
                          rows={4}
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
                  className="w-full"
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
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactSection;
