import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import confetti from "@/utils/confetti";

const BookingConfirmed = () => {
  useEffect(() => {
    confetti();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        path="/booking-confirmed"
        title="Booking Confirmed | Bright Leadership Consulting"
        description="Your consultation has been booked successfully. We look forward to speaking with you."
      />
      <Header />
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="max-w-xl w-full text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="mb-8 inline-flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            You're All Set!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-3 text-lg text-muted-foreground max-w-md mx-auto"
          >
            Your free consultation has been booked successfully. Check your email for the calendar invite and meeting details.
          </motion.p>

          {/* What to expect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-10 rounded-2xl border border-border bg-card p-6 text-left"
          >
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              What to Expect
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "A confirmation email with your meeting link and calendar invite",
                "A 30-minute one-on-one session with a leadership consultant",
                "A personalised assessment of your leadership development needs",
                "Tailored recommendations for your growth journey",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button variant="default" size="lg" asChild>
              <Link to="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Our Courses
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmed;
