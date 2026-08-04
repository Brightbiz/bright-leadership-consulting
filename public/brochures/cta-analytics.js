/**
 * Brochure CTA analytics.
 *
 * Static brochures are plain HTML, so they can't use the app's analytics
 * module. This mirrors it: every `.cta-btn` carrying `data-programme` pushes a
 * `course_cta_click` event to window.dataLayer (and gtag, when present).
 */
(function () {
  window.dataLayer = window.dataLayer || [];

  document.addEventListener("click", function (e) {
    var link = e.target && e.target.closest ? e.target.closest("a[data-programme]") : null;
    if (!link) return;

    var payload = {
      event: "course_cta_click",
      programme_name: link.getAttribute("data-programme"),
      destination_url: link.href,
      cta_surface: "brochure:" + document.location.pathname.replace(/^.*\//, "").replace(/\.html$/, ""),
      cta_label: (link.textContent || "").trim().replace(/\s+/g, " "),
      outbound: true,
    };

    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", "course_cta_click", payload);
    }
  });
})();
