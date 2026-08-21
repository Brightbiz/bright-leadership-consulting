import {
  RESULT_DISCLAIMER,
  SCALING_CAUTION_COPY,
} from "@/data/aiAudit/questions";
import {
  bandFor,
  priorityDimension,
  readinessTotal,
  showsScalingCaution,
  strongestDimension,
  type AuditState,
} from "@/data/aiAudit/logic";

const position = (score: number) => Math.round(((score - 8) / 24) * 100);

/** Readiness band, score and dimensions. No peer comparison is ever shown. */
const ReadinessResult = ({ state }: { state: AuditState }) => {
  const score = readinessTotal(state);
  const band = bandFor(score);
  const marks = [14, 21, 27].map(position);

  return (
    <section aria-labelledby="readiness-heading">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Readiness result</p>

      <div className="relative mt-6 h-6">
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-navy-foreground/20" />
        {marks.map((m) => (
          <div
            key={m}
            className="absolute top-1/2 h-3 w-[1px] -translate-y-1/2 bg-navy-foreground/30"
            style={{ left: `${m}%` }}
            aria-hidden="true"
          />
        ))}
        <div
          className="absolute top-1/2 h-5 w-[2px] -translate-y-1/2 bg-gold"
          style={{ left: `${position(score)}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-navy-foreground/50">
        <span>Tool-led</span>
        <span>Experimenting</span>
        <span>Directed</span>
        <span>Aligned</span>
      </div>

      <p className="mt-6 font-mono text-sm tracking-[0.08em] text-navy-foreground/70">
        {score} / 32
      </p>
      <h1 id="readiness-heading" className="mt-2 font-serif text-3xl leading-tight">
        {band.title}
      </h1>
      <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-navy-foreground/75">
        {band.teaser} {band.body}
      </p>

      <dl className="mt-6 space-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-navy-foreground/60">
        <div className="flex flex-wrap gap-2">
          <dt>Strongest dimension:</dt>
          <dd className="text-navy-foreground/90">{strongestDimension(state)}</dd>
        </div>
        <div className="flex flex-wrap gap-2">
          <dt>Priority dimension:</dt>
          <dd className="text-navy-foreground/90">{priorityDimension(state)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-[13px] leading-relaxed text-navy-foreground/50">{RESULT_DISCLAIMER}</p>

      {showsScalingCaution(state) && (
        <p className="mt-6 border-l-2 border-gold/70 bg-navy-foreground/[0.05] px-4 py-3 text-[14px] leading-relaxed text-navy-foreground/80">
          {SCALING_CAUTION_COPY}
        </p>
      )}
    </section>
  );
};

export default ReadinessResult;
