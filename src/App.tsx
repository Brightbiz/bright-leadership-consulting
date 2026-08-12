import { Suspense, lazy, useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { AnimatePresence, MotionConfig } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageLoader from "@/components/PageLoader";
import CookieConsent from "@/components/CookieConsent";

// Core pages
const Index = lazy(() => import("./pages/Index"));
const ExecutiveAlignmentIndex = lazy(() => import("./pages/ExecutiveAlignmentIndex"));
const SelectedEngagements = lazy(() => import("./pages/SelectedEngagements"));
const ExecutiveAlignmentBrief = lazy(() => import("./pages/ExecutiveAlignmentBrief"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Programme pages
const ExecutiveLeadershipMastery = lazy(() => import("./pages/ExecutiveLeadershipMastery"));
const Courses = lazy(() => import("./pages/Courses"));
const StrategicLeadershipAI = lazy(() => import("./pages/StrategicLeadershipAI"));
const StrategicAiLeadershipOrganisations = lazy(
  () => import("./pages/StrategicAiLeadershipOrganisations")
);
const AugmentedLeadership = lazy(() => import("./pages/AugmentedLeadership"));
const FutureOfWork = lazy(() => import("./pages/FutureOfWork"));
const StrategicProductivity = lazy(() => import("./pages/StrategicProductivity"));

const AdvisoryProcess = lazy(() => import("./pages/AdvisoryProcess"));
const Principal = lazy(() => import("./pages/Principal"));

// Legal
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Admin (not in public nav)
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const AdminCRM = lazy(() => import("./pages/AdminCRM"));
const AdminOutreach = lazy(() => import("./pages/AdminOutreach"));
const AdminCpdAudit = lazy(() => import("./pages/AdminCpdAudit"));


const queryClient = new QueryClient();

/** Redirect that carries the query string across, keeping campaign params. */
const KeepQueryRedirect = ({ to }: { to: string }) => {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();


  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);



  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/executive-alignment-index" element={<PageTransition><ExecutiveAlignmentIndex /></PageTransition>} />
          <Route path="/selected-engagements" element={<PageTransition><SelectedEngagements /></PageTransition>} />
          <Route path="/executive-alignment-brief" element={<PageTransition><ExecutiveAlignmentBrief /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/executive-leadership-mastery" element={<PageTransition><ExecutiveLeadershipMastery /></PageTransition>} />
          <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
          <Route path="/strategic-leadership-ai" element={<PageTransition><StrategicLeadershipAI /></PageTransition>} />
          <Route path="/augmented-leadership" element={<PageTransition><AugmentedLeadership /></PageTransition>} />
          <Route path="/future-of-work" element={<PageTransition><FutureOfWork /></PageTransition>} />
          <Route path="/strategic-productivity-peak-performance" element={<PageTransition><StrategicProductivity /></PageTransition>} />

          <Route path="/advisory-process" element={<PageTransition><AdvisoryProcess /></PageTransition>} />
          <Route path="/principal" element={<PageTransition><Principal /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />

          {/* Legacy indexed URLs — redirect rather than 404 so existing search
              results and inbound links land on the closest live equivalent.
              The query string is preserved so campaign parameters
              (gclid / gbraid / wbraid / utm_*) survive the redirect. */}
          <Route path="/about" element={<KeepQueryRedirect to="/advisory-process" />} />
          <Route path="/resources" element={<KeepQueryRedirect to="/courses" />} />
          <Route path="/faq" element={<KeepQueryRedirect to="/advisory-process" />} />
          <Route path="/programs/ai-leadership" element={<KeepQueryRedirect to="/strategic-leadership-ai" />} />
          <Route path="/ai-leadership" element={<KeepQueryRedirect to="/strategic-leadership-ai" />} />
          <Route path="/programs/*" element={<KeepQueryRedirect to="/courses" />} />
          <Route path="/programmes" element={<KeepQueryRedirect to="/courses" />} />



          
          {/* Admin routes */}
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/forgot-password" element={<PageTransition><AdminForgotPassword /></PageTransition>} />
          <Route path="/admin/reset-password" element={<PageTransition><AdminResetPassword /></PageTransition>} />
          
          <Route path="/admin" element={<PageTransition><AdminSubmissions /></PageTransition>} />
          <Route path="/admin/crm" element={<PageTransition><AdminCRM /></PageTransition>} />
          <Route path="/admin/outreach" element={<PageTransition><AdminOutreach /></PageTransition>} />
          <Route path="/admin/cpd-audit" element={<PageTransition><AdminCpdAudit /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </MotionConfig>
  </HelmetProvider>
);


export default App;
