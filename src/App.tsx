import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageLoader from "@/components/PageLoader";

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
const Slides = lazy(() => import("./pages/Slides"));
const GenerateWorkbook = lazy(() => import("./pages/GenerateWorkbook"));
const AIWorkbook = lazy(() => import("./pages/AIWorkbook"));

// Admin (not in public nav)
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

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
          <Route path="/slides" element={<PageTransition><Slides /></PageTransition>} />
          <Route path="/generate-workbook" element={<GenerateWorkbook />} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/register" element={<PageTransition><AdminRegister /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminSubmissions /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
