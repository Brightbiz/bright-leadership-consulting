import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageLoader from "@/components/PageLoader";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import SocialProofNotifications from "@/components/SocialProofNotifications";
import FloatingChatWidget from "@/components/FloatingChatWidget";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const LeadershipChecklist = lazy(() => import("./pages/LeadershipChecklist"));
const Courses = lazy(() => import("./pages/Courses"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const ThinkificExport = lazy(() => import("./pages/ThinkificExport"));
const Brochures = lazy(() => import("./pages/Brochures"));
const Masterclass = lazy(() => import("./pages/Masterclass"));
const PreAssessment = lazy(() => import("./pages/PreAssessment"));
const PostAssessment = lazy(() => import("./pages/PostAssessment"));
const Quiz = lazy(() => import("./pages/Quiz"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/leadership-checklist" element={<PageTransition><LeadershipChecklist /></PageTransition>} />
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/register" element={<PageTransition><AdminRegister /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminSubmissions /></PageTransition>} />
          <Route path="/brochures" element={<PageTransition><Brochures /></PageTransition>} />
          <Route path="/admin/thinkific-export" element={<PageTransition><ThinkificExport /></PageTransition>} />
          <Route path="/masterclass" element={<Masterclass />} />
          <Route path="/pre-assessment" element={<PageTransition><PreAssessment /></PageTransition>} />
          <Route path="/post-assessment" element={<PageTransition><PostAssessment /></PageTransition>} />
          <Route path="/quiz" element={<Quiz />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            {/* Conversion Optimization Components */}
            <ExitIntentPopup />
            <StickyMobileCTA />
            <SocialProofNotifications />
            <FloatingChatWidget />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
