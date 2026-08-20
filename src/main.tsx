import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";
import { initPaymentSurfaceMonitor } from "./lib/paymentSurfaceMonitor";
import { enforceCanonicalHost } from "./lib/canonicalHost";

enforceCanonicalHost();
initAnalytics();
initPaymentSurfaceMonitor();

createRoot(document.getElementById("root")!).render(<App />);
