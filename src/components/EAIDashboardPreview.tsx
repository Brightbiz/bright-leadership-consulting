import { motion } from "framer-motion";

const dimensions = [
  { name: "Strategic Interpretation", score: 3.8, pct: 76, variance: "Low" as const },
  { name: "Decision Rights Clarity", score: 2.9, pct: 58, variance: "Elevated" as const },
  { name: "Cross-Functional Coordination", score: 3.2, pct: 64, variance: "Moderate" as const },
  { name: "Escalation Pathways", score: 2.6, pct: 52, variance: "Elevated" as const },
  { name: "Accountability Architecture", score: 3.6, pct: 72, variance: "Low" as const },
  { name: "Risk Ownership", score: 3.4, pct: 68, variance: "Moderate" as const },
];

const dispersionDims = [
  { name: "Strategic Interpretation", rangeLeft: 56, rangeWidth: 22, median: 72 },
  { name: "Decision Rights Clarity", rangeLeft: 22, rangeWidth: 42, median: 44 },
  { name: "Escalation Pathways", rangeLeft: 20, rangeWidth: 40, median: 38 },
  { name: "Risk Ownership", rangeLeft: 42, rangeWidth: 28, median: 56 },
];

const varianceStyles: Record<string, string> = {
  Low: "bg-[hsl(180,25%,94%)] text-[hsl(180,30%,60%)]",
  Moderate: "bg-[hsl(180,40%,90%)] text-[hsl(180,60%,26%)]",
  Elevated: "bg-[hsl(180,35%,85%)] text-[hsl(180,70%,18%)]",
};

const barStyles: Record<string, string> = {
  Low: "bg-[hsl(180,25%,65%)]",
  Moderate: "bg-[hsl(180,25%,65%)]",
  Elevated: "bg-[hsl(180,70%,18%)]",
};

const EAIDashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="border border-border rounded bg-card shadow-sm overflow-hidden"
    >
      {/* Inner page with generous padding */}
      <div className="px-8 py-10 sm:px-12 sm:py-12">

        {/* Header */}
        <div className="flex justify-between items-start pb-6 mb-8 border-b border-border">
          <div>
            <p className="text-[10px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-0.5">
              Executive Alignment Index™
            </p>
            <h3 className="font-serif text-lg font-semibold text-foreground">Alignment Index Report</h3>
          </div>
          <div className="text-right text-[11px] text-muted-foreground leading-relaxed hidden sm:block">
            <div><span className="font-semibold text-foreground">Organisation:</span> [Client Name]</div>
            <div><span className="font-semibold text-foreground">Date:</span> March 2026</div>
          </div>
        </div>

        {/* Composite Score */}
        <div className="text-center py-8 mb-8 border border-border rounded-sm">
          <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-2">
            Composite Alignment Score
          </p>
          <div className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-none">
            3.4 <span className="text-lg text-muted-foreground font-normal">/ 5.0</span>
          </div>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-sm bg-[hsl(180,40%,90%)] text-[hsl(180,60%,26%)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(180,60%,26%)]" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">Moderate Variance</span>
          </div>
          <p className="mt-4 text-xs sm:text-[13px] text-muted-foreground italic max-w-md mx-auto leading-relaxed">
            Executive alignment is directionally coherent with material dispersion in decision authority and cross-functional coordination.
          </p>
        </div>

        {/* Two-Column: Dimensions + Dispersion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Dimensions */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Alignment Dimension Breakdown
            </p>
            <div className="space-y-0">
              {dimensions.map((d) => (
                <div key={d.name} className="py-3 border-b border-border last:border-b-0">
                  <p className="text-xs font-semibold text-foreground mb-1.5">{d.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      <span className="font-bold text-foreground text-sm">{d.score}</span>
                    </span>
                    <div className="flex-1 h-1 bg-muted rounded-sm">
                      <div
                        className={`h-full rounded-sm ${barStyles[d.variance]}`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm ${varianceStyles[d.variance]}`}>
                      {d.variance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispersion */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Executive Dispersion Mapping
            </p>
            <div className="flex justify-between mb-4">
              <span className="text-[11px] text-muted-foreground">Range: <span className="font-bold text-foreground">2.6 — 4.1</span></span>
              <span className="text-[11px] text-muted-foreground">Median: <span className="font-bold text-foreground">3.4</span></span>
            </div>
            <div className="space-y-3">
              {dispersionDims.map((d) => (
                <div key={d.name}>
                  <p className="text-[10px] text-muted-foreground mb-1">{d.name}</p>
                  <div className="h-3.5 bg-muted rounded-sm relative">
                    <div
                      className="absolute top-0.5 h-2.5 bg-[hsl(180,40%,90%)] border-l border-r border-[hsl(180,60%,26%)] rounded-[1px]"
                      style={{ left: `${d.rangeLeft}%`, width: `${d.rangeWidth}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-foreground"
                      style={{ left: `${d.median}%` }}
                    >
                      <span className="absolute -top-0.5 -left-[3px] w-2 h-2 rounded-full bg-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              <span>1.0</span><span>2.0</span><span>3.0</span><span>4.0</span><span>5.0</span>
            </div>
          </div>

        </div>

        {/* Alignment Variance & Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Alignment Variance */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Alignment Variance
            </p>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-center">
                {[
                  { label: "Low", desc: "Executive views are closely aligned", active: false },
                  { label: "Moderate", desc: "Some structural interpretation differences exist", active: true },
                  { label: "High", desc: "Significant divergence in leadership interpretation", active: false },
                ].map((level) => (
                  <div
                    key={level.label}
                    className={`px-3 py-4 sm:border-r sm:border-b-0 border-b border-border last:border-b-0 sm:last:border-r-0 ${
                      level.active
                        ? "bg-[hsl(180,40%,90%)]"
                        : ""
                    }`}
                  >
                    <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      level.active ? "text-[hsl(180,60%,26%)]" : "text-muted-foreground"
                    }`}>
                      {level.label}
                    </span>
                    <span className="block text-[9px] text-muted-foreground leading-snug">
                      {level.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence Level */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Confidence Level
            </p>
            <div className="border border-border rounded-sm p-5">
              <div className="flex items-center gap-4 mb-3">
                {["Low", "Medium", "High"].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                      level === "High"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30 bg-background"
                    }`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      level === "High" ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {level}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Represents consistency of executive responses across the assessed dimensions.
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column: Matrix + Commentary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Priority Matrix */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Priority Action Matrix
            </p>
            <div className="grid grid-cols-2 border border-border rounded-sm overflow-hidden text-xs">
              <div className="col-span-2 grid grid-cols-2 border-b border-border">
                <span className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground text-center">High Urgency</span>
                <span className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground text-center">Lower Urgency</span>
              </div>
              <div className="p-3 border-r border-border">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[hsl(180,70%,18%)] mb-2">Critical</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-1">Clarify escalation authority between COO and regional leaders</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Formalise decision rights across business units</p>
              </div>
              <div className="p-3">
                <p className="text-[9px] font-bold uppercase tracking-wide text-primary mb-2">Strategic</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Formalise AI governance ownership at executive level</p>
              </div>
              <div className="p-3 border-r border-border border-t">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Operational</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Align strategic interpretation of growth targets</p>
              </div>
              <div className="p-3 border-t border-border">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Monitor</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Risk ownership within acceptable range</p>
              </div>
            </div>
          </div>

          {/* Commentary */}
          <div>
            <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-muted-foreground mb-4">
              Governance Risk &amp; Escalation Commentary
            </p>
            <ul className="space-y-0">
              {[
                "Variance in decision authority may slow execution during growth acceleration.",
                "Escalation pathways across regional leadership remain inconsistent.",
                "Strategic interpretation of AI investment priorities differs between executive roles.",
                "Cross-functional coordination lacks defined ownership at interface points.",
                "Accountability architecture is well-defined; no immediate action required.",
              ].map((item, i) => (
                <li key={i} className="relative pl-4 py-2 text-xs text-muted-foreground leading-relaxed border-b border-border last:border-b-0">
                  <span className="absolute left-0 top-3.5 w-1.5 h-1.5 rounded-full border border-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground tracking-wide">
          <div>
            Executive Alignment Index™<br />
            Bright Leadership Consulting
          </div>
          <div>Confidential Advisory Document</div>
        </div>

      </div>
    </motion.div>
  );
};

export default EAIDashboardPreview;