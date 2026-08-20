/**
 * Runtime watchdog for payment-provider UI.
 *
 * No page on this site takes payment: individual places are arranged directly
 * with Bright Leadership Consulting via an enquiry, and any card payment
 * happens on the third-party learning platform. The build gate
 * (`scripts/validate-payment-scripts.mjs`) keeps provider scripts out of our
 * own source and bundles; this module covers what a build gate cannot see —
 * a provider surface injected at runtime by a tag manager, browser extension,
 * embedded widget or third-party script.
 *
 * It reports two kinds of events to the dataLayer:
 *   • `payment_surface_detected`    — a provider script/iframe/embed appeared
 *   • `payment_surface_interaction` — a visitor clicked or submitted inside one
 *
 * Detection-only: nothing here loads, blocks or alters a provider. Each unique
 * signature is reported once per page session so an unexpected connection is
 * visible immediately without flooding the dataLayer.
 */
import { trackEvent } from "./analytics";

interface PaymentSurfaceEvent {
  provider: string;
  surface: string;
  page: string;
}

function trackPaymentSurfaceDetected(
  event: PaymentSurfaceEvent & { expected: boolean },
) {
  trackEvent("payment_surface_detected", {
    payment_provider: event.provider,
    payment_surface: event.surface,
    page_path: event.page,
    expected_surface: event.expected,
  });
}

function trackPaymentSurfaceInteraction(
  event: PaymentSurfaceEvent & { action: string },
) {
  trackEvent("payment_surface_interaction", {
    payment_provider: event.provider,
    payment_surface: event.surface,
    interaction: event.action,
    page_path: event.page,
    expected_surface: false,
  });
}

/** Provider signatures matched against script/iframe/link/form URLs. */
const PROVIDER_URL_SIGNATURES: { provider: string; re: RegExp }[] = [
  { provider: "stripe", re: /(?:js|checkout|buy|api)\.stripe\.com/i },
  { provider: "stripe", re: /\bstripe\.com\/(?:pay|payments)/i },
  { provider: "paypal", re: /www\.paypal(?:objects)?\.com/i },
  { provider: "paypal", re: /paypal\.com\/(?:sdk|cgi-bin\/webscr|donate|checkoutnow)/i },
  { provider: "braintree", re: /braintreegateway\.com/i },
];

/** DOM attributes/classes providers stamp on their own mounted UI. */
const PROVIDER_MARKUP_SELECTORS: { provider: string; selector: string }[] = [
  { provider: "stripe", selector: "[class*='StripeElement'],[data-stripe],iframe[name^='__privateStripe']" },
  { provider: "paypal", selector: "[data-pp-message],[data-pp-button],[id^='paypal-button'],.paypal-buttons" },
  { provider: "braintree", selector: "[data-braintree-id],[class*='braintree-']" },
];

const reported = new Set<string>();

/** Report a signature at most once per page session. */
function reportOnce(key: string, send: () => void) {
  if (reported.has(key)) return;
  reported.add(key);
  send();
}

/** Match a URL-bearing element against the provider signatures. */
function providerForUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const { provider, re } of PROVIDER_URL_SIGNATURES) {
    if (re.test(url)) return provider;
  }
  return null;
}

/** Match an element (or an ancestor) against provider-mounted markup. */
function providerForElement(el: Element | null): { provider: string; how: string } | null {
  if (!el) return null;
  for (const { provider, selector } of PROVIDER_MARKUP_SELECTORS) {
    if (el.closest(selector)) return { provider, how: "provider_markup" };
  }
  const withUrl = el.closest<HTMLElement>("a[href],form[action],iframe[src],script[src]");
  if (withUrl) {
    const url =
      withUrl.getAttribute("href") ??
      withUrl.getAttribute("action") ??
      withUrl.getAttribute("src");
    const provider = providerForUrl(url);
    if (provider) return { provider, how: withUrl.tagName.toLowerCase() };
  }
  return null;
}

/** Inspect one node (and its subtree) for a provider surface. */
function inspect(node: Node) {
  if (!(node instanceof Element)) return;

  const candidates: Element[] = [node, ...Array.from(node.querySelectorAll("script,iframe,a,form,div"))];

  for (const el of candidates) {
    const url =
      el.getAttribute?.("src") ??
      el.getAttribute?.("href") ??
      el.getAttribute?.("action");
    const provider = providerForUrl(url);
    if (provider) {
      reportOnce(`${provider}:${el.tagName}:${url}`, () =>
        trackPaymentSurfaceDetected({
          provider,
          surface: `${el.tagName.toLowerCase()}[${url}]`,
          page: window.location.pathname,
          expected: false,
        }),
      );
      continue;
    }
    for (const { provider: p, selector } of PROVIDER_MARKUP_SELECTORS) {
      if (el.matches?.(selector)) {
        reportOnce(`${p}:markup:${el.tagName}`, () =>
          trackPaymentSurfaceDetected({
            provider: p,
            surface: `${el.tagName.toLowerCase()}.provider-markup`,
            page: window.location.pathname,
            expected: false,
          }),
        );
      }
    }
  }
}

let started = false;

/**
 * Start watching for payment-provider UI. Safe to call once at app startup;
 * repeat calls are ignored. Returns a teardown function for tests.
 */
export function initPaymentSurfaceMonitor(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined" || started) {
    return () => {};
  }
  started = true;

  // Anything already on the page (index.html, an early third-party injection).
  inspect(document.documentElement);

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach(inspect);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Interaction: a visitor actually engaging with a provider surface is the
  // highest-signal event, so it is reported per provider+action, not once only.
  const onInteraction = (event: Event) => {
    const match = providerForElement(event.target as Element | null);
    if (!match) return;
    trackPaymentSurfaceInteraction({
      provider: match.provider,
      surface: match.how,
      action: event.type,
      page: window.location.pathname,
    });
  };

  document.addEventListener("click", onInteraction, true);
  document.addEventListener("submit", onInteraction, true);

  // A provider iframe taking focus is the closest proxy for interaction inside
  // a cross-origin payment frame, where clicks are invisible to this document.
  const onBlur = () => {
    const active = document.activeElement;
    if (!(active instanceof HTMLIFrameElement)) return;
    const provider = providerForUrl(active.getAttribute("src"));
    if (!provider) return;
    trackPaymentSurfaceInteraction({
      provider,
      surface: "iframe_focus",
      action: "focus",
      page: window.location.pathname,
    });
  };
  window.addEventListener("blur", onBlur);

  return () => {
    observer.disconnect();
    document.removeEventListener("click", onInteraction, true);
    document.removeEventListener("submit", onInteraction, true);
    window.removeEventListener("blur", onBlur);
    started = false;
    reported.clear();
  };
}
