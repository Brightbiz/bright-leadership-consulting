/**
 * Neutral page shell shown while a route chunk loads.
 * Deliberately silent — no spinner, no "Loading..." text — so the first
 * paint reads as an unfinished page rather than a broken one.
 */
const PageLoader = () => {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <div className="h-20 border-b border-border/40" />
      <div className="container-brief pt-36 lg:pt-44">
        <div className="max-w-[680px] space-y-6">
          <div className="h-3 w-32 rounded-sm bg-muted" />
          <div className="h-10 w-full rounded-sm bg-muted/70" />
          <div className="h-10 w-4/5 rounded-sm bg-muted/70" />
          <div className="h-4 w-full rounded-sm bg-muted/40" />
          <div className="h-4 w-11/12 rounded-sm bg-muted/40" />
        </div>
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
};

export default PageLoader;
