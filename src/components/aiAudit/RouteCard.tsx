import { cn } from "@/lib/utils";
import { PRODUCT_META, PROGRAMME_PAGE_URL, type ProductKey } from "@/data/aiAudit/questions";
import {
  buildCtaPlan,
  isActionBlocked,
  isExactQtyValid,
  priceBlockFor,
  type Action,
  type AuditState,
} from "@/data/aiAudit/logic";

interface RouteCardProps {
  product: ProductKey;
  isRecommended: boolean;
  state: AuditState;
  /** Shown when no participant number has been established. */
  participantNote?: boolean;
  /** True once the checkout action has been used; blocks a second click. */
  checkoutStarted?: boolean;
  onExactQtyChange: (value: string) => void;
  onAction: (action: Action, emphasis: "primary" | "secondary" | "tertiary", product: ProductKey) => void;
}

const buttonBase =
  "min-h-[44px] w-full rounded-sm px-5 py-3 text-left text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-45";

/**
 * One product route. The recommended card is always visually primary and there
 * is never more than one primary action on a screen.
 */
const RouteCard = ({
  product,
  isRecommended,
  state,
  participantNote,
  checkoutStarted = false,
  onExactQtyChange,
  onAction,
}: RouteCardProps) => {
  const meta = PRODUCT_META[product];
  const price = priceBlockFor(product, state);
  const plan = buildCtaPlan(product, state);

  const renderAction = (
    action: Action,
    emphasis: "primary" | "secondary" | "tertiary",
    index: number,
  ) => {
    const locked = action.kind === "thinkific" && checkoutStarted;
    const blocked = isActionBlocked(action, state) || locked;
    const key = `${emphasis}-${action.kind}-${index}`;

    if (emphasis === "tertiary") {
      return (
        <div key={key}>
          <button
            type="button"
            disabled={blocked}
            onClick={() => onAction(action, emphasis, product)}
            className="min-h-[44px] text-left text-[14px] text-navy-foreground/70 underline underline-offset-4 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-45"
          >
            {locked ? "Opening the programme platform…" : action.label}
          </button>
          {action.note && (
            <p className="mt-1 text-[13px] leading-relaxed text-navy-note">{action.note}</p>
          )}
        </div>
      );
    }

    return (
      <div key={key}>
        <button
          type="button"
          disabled={blocked}
          onClick={() => onAction(action, emphasis, product)}
          className={cn(
            buttonBase,
            emphasis === "primary"
              ? "bg-gold font-medium text-navy hover:bg-gold-muted"
              : "border border-navy-foreground/25 text-navy-foreground hover:border-gold",
          )}
        >
          {locked ? "Opening the programme platform…" : action.label}
        </button>
        {action.note && (
          <p className="mt-2 text-[13px] leading-relaxed text-navy-note">{action.note}</p>
        )}
        {locked && (
          <p role="status" className="mt-2 text-[13px] leading-relaxed text-navy-note">
            You are being taken to the programme platform to complete payment and enrolment.
          </p>
        )}
        {blocked && !locked && (
          <p className="mt-2 text-[13px] leading-relaxed text-gold-muted">
            Enter the exact number of participants above to continue.
          </p>
        )}
      </div>
    );
  };

  return (
    <article
      className={cn(
        "rounded-sm border p-6",
        isRecommended ? "border-gold/70 bg-navy-foreground/[0.05]" : "border-navy-foreground/15",
      )}
    >
      <p
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.14em]",
          isRecommended ? "text-gold" : "text-navy-note",
        )}
      >
        {isRecommended ? "Recommended" : "Alternative"}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-snug">{meta.title}</h3>

      {participantNote && (
        <p className="mt-2 text-[13px] text-navy-note">
          Participant number to be confirmed.
        </p>
      )}

      <p className="mt-3 text-[14px] leading-relaxed text-navy-foreground/75">{meta.incl}</p>


      {price && (
        <div className="mt-5">
          <p className="font-mono text-[14px] tracking-[0.04em] text-navy-foreground">
            {price.total}
          </p>
          {price.note && (
            <p className="mt-1 text-[13px] leading-relaxed text-navy-note">{price.note}</p>
          )}
          {price.needsExactQty && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label
                htmlFor="exact-qty"
                className="text-[13px] text-navy-foreground/70"
              >
                Exact number of participants (2–9)
              </label>
              <input
                id="exact-qty"
                type="number"
                inputMode="numeric"
                min={2}
                max={9}
                step={1}
                defaultValue={state.exactQty ?? ""}
                onChange={(e) => onExactQtyChange(e.target.value)}
                aria-describedby="exact-qty-help"
                className="h-11 w-20 rounded-sm border border-navy-foreground/25 bg-navy px-3 text-[15px] text-navy-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              />
              <p id="exact-qty-help" className="sr-only">
                Whole numbers between 2 and 9 only. Purchase, invoice and purchase-order actions stay
                unavailable until an exact number is entered.
              </p>
              {state.exactQty !== null && !isExactQtyValid(state.exactQty) && (
                <p className="text-[13px] text-gold-muted">Enter a whole number between 2 and 9.</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {plan.primary.map((a, i) => renderAction(a, "primary", i))}
        {plan.secondary.map((a, i) => renderAction(a, "secondary", i))}
        {plan.tertiary.map((a, i) => renderAction(a, "tertiary", i))}
      </div>

      <a
        href={PROGRAMME_PAGE_URL}
        className="mt-5 inline-block text-[13px] text-navy-note underline underline-offset-4 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        View full programme information
      </a>
    </article>
  );
};

export default RouteCard;
