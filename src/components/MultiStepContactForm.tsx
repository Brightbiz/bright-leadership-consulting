import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRateLimit } from "@/hooks/useRateLimit";

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

interface Step {
  id: number;
  title: string;
  fields: (keyof ContactFormData)[];
  icon: React.ElementType;
}

const steps: Step[] = [
  { id: 1, title: "Your Details", fields: ["name", "email"], icon: User },
  { id: 2, title: "Contact Info", fields: ["phone", "company"], icon: Building2 },
  { id: 3, title: "Your Message", fields: ["message"], icon: MessageSquare },
];

const MultiStepContactForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { checkRateLimit, recordSubmission, isChecking } = useRateLimit();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
    mode: "onTouched",
  });

  const progress = (currentStep / steps.length) * 100;

  const validateCurrentStep = async () => {
    const currentFields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(currentFields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Check rate limit before submission
      const rateLimitResult = await checkRateLimit("contact");
      
      if (!rateLimitResult.allowed) {
        toast({
          title: "Too many submissions",
          description: rateLimitResult.message || "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message,
      });

      if (error) throw error;

      // Record successful submission for rate limiting
      await recordSubmission("contact");

      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">
          Thank You!
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Your message has been sent successfully. We'll be in touch within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center gap-1",
                  currentStep >= step.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep >= step.id
                      ? "border-primary bg-primary/10"
                      : "border-muted bg-muted/50"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Step 1: Name & Email */}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name *
                        </FormLabel>
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
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </FormLabel>
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
                </>
              )}

              {/* Step 2: Phone & Company */}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number (Optional)
                        </FormLabel>
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
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Company (Optional)
                        </FormLabel>
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
                </>
              )}

              {/* Step 3: Message */}
              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Your Message *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your leadership goals and how we can help..."
                          {...field}
                          rows={6}
                          className="resize-none bg-muted/50 border-border/50 focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleNext}
                className="flex-1"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="teal"
                size="lg"
                className="flex-1"
                disabled={form.formState.isSubmitting || isChecking}
              >
                {form.formState.isSubmitting || isChecking ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MultiStepContactForm;
