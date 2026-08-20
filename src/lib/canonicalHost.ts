/**
 * Redirects visitors who land on the Lovable-managed hosting subdomain
 * to the canonical custom domain.
 *
 * Deliberately narrow: only the exact published subdomain is redirected.
 * Preview hosts (id-preview--*.lovable.app), sandbox hosts and localhost
 * are left untouched so editing and QA continue to work.
 */
const CANONICAL_HOST = "brightleadershipconsulting.com";

export function enforceCanonicalHost() {
  if (typeof window === "undefined") return;

  const { hostname, pathname, search, hash } = window.location;

  // Never redirect previews, sandboxes or local development.
  if (
    hostname.includes("-preview--") ||
    hostname.includes("lovableproject.com") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return;
  }

  const isLovableHost = hostname.endsWith(".lovable.app");
  if (!isLovableHost) return;

  window.location.replace(
    `https://www.${CANONICAL_HOST}${pathname}${search}${hash}`,
  );
}
