import { Link, useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { isStagingHost } from "@/lib/auditSession";

/**
 * PREVIEW ONLY. Three Insights articles approved (v3, 4 Nov 2026) for
 * preparation as preview pages. They render only away from the public custom
 * domain, always carry noindex, and are not listed on /insights or in the
 * sitemap. Publication needs separate approval and a publication date.
 * Copy is reproduced from the approved v3 files.
 */
type Block =
  | { h: string }
  | { p: React.ReactNode }
  | { ol: string[] };

interface Article {
  title: string;
  standfirst: string;
  blocks: Block[];
  links: { to: string; label: string }[];
}

const B = ({ children }: { children: React.ReactNode }) => <strong className="text-foreground">{children}</strong>;

export const PREVIEW_ARTICLES: Record<string, Article> = {
  "decisions-that-dont-stay-decided": {
    title: "Decisions that don't stay decided",
    standfirst: "Three questions to examine when an agreed decision returns to the agenda.",
    blocks: [
      { h: "The third time on the agenda" },
      { p: "Picture a decision made in March, revisited in May and reopened in September. This is an illustrative sequence, not a real case. The minutes record agreement, yet the issue keeps coming back in a different form. What should the team examine before deciding again?" },
      { p: "There may be new evidence, or a legitimate reason to reconsider. There may also be differences in how people understood the original choice, the authority behind it or the conditions for reopening it. A returning decision does not, on its own, tell you which." },
      { h: "Three points to examine" },
      { p: "Start with the decision record and the accounts of those involved." },
      { p: <><B>Was the decision stated as a choice, rather than a topic?</B> “We discussed the regional structure” records a discussion. “The northern region reports to the group operations director from 1 April” records a choice. Check whether the agreed record names the action and when it takes effect.</> },
      { p: <><B>Was the authority to make it clear?</B> If two executives each understood that they held the final call, look at the relevant decision rights. Confirm who had authority to decide and who is responsible for carrying the decision forward.</> },
      { p: <><B>Did the team share the same understanding of what was decided?</B> Ask people to state the outcome independently, then compare their accounts with the agreed record. Differences call for clarification; by themselves, they do not explain why the decision has returned.</> },
      { h: "Before discussing it again" },
      { p: "A further discussion may well be necessary. First, separate a disagreement about the substance of the decision from a disagreement about what was agreed or who had authority to decide. Then check whether circumstances have changed since the original meeting." },
      { p: "These questions give the next discussion a clearer starting point: what remains agreed, what is being reconsidered and on what grounds." },
      { h: "A practical test" },
      { p: "Take an issue that has returned to your agenda and ask the people involved three questions:" },
      { ol: ["What exactly was decided — in one sentence?", "Whose decision was it to make?", "What would legitimately reopen it?"] },
      { p: "Compare the answers. Where they differ, record the points that need clarifying. Where the decision is being reopened for a valid reason, state that reason and agree how it will be reconsidered." },
      { h: "The wider pattern" },
      { p: "If several decisions keep returning, ask whether there are recurring differences in strategic interpretation, decision authority or accountability. Treat this as a question to investigate, not a conclusion about the team or its performance." },
      { p: "The Executive Alignment Index™ provides a structured view of executive alignment, including differences in interpretation, decision authority and accountability. Its findings support executive discussion." },
    ],
    links: [{ to: "/executive-alignment-index", label: "The Executive Alignment Index™" }],
  },
  "first-ninety-days-managing-people": {
    title: "The first ninety days of managing people",
    standfirst: "Practical questions for taking on responsibility for people — and revisiting how that responsibility is exercised.",
    blocks: [
      { h: "The promotion that changes the job" },
      { p: "Taking on responsibility for people adds a different set of demands to individual work: setting expectations, delegating, giving feedback and addressing difficulties. Technical competence still matters, but it is no longer the whole job." },
      { p: "Use the first ninety days to review these responsibilities. Managers with longer experience can use the same questions to reassess their practice." },
      { h: "Three shifts to examine" },
      { p: <><B>From doing to deciding what gets done.</B> Review which tasks and decisions you keep and which belong to the team. Where you need to check or redo work, explain why and set out the standard required. Ask whether the boundaries are clear enough for people to act without seeking approval for every step.</> },
      { p: <><B>From assumed to explicit expectations.</B> State what good work looks like, who owns each responsibility and how concerns should be raised. Check understanding rather than assuming an expectation has landed because it has been said. Clarity and respectful working relationships are not alternatives.</> },
      { p: <><B>From your results to their conditions.</B> Look beyond your own contribution. Do people know what is expected of them? Can they get the decisions they need? Which obstacles need you to step in? Discuss these questions with the team rather than inferring the answers from output alone.</> },
      { h: "What remains relevant" },
      { p: "Keep your understanding of the work current, and recognise where specialist knowledge sits elsewhere in the team. Consider how you show consistency and fairness in allocating work, giving feedback and responding to concerns." },
      { p: "These are points for review, not a single model of how every manager should work. Responsibilities and the right support will depend on the role and its context." },
      { h: "For the employer" },
      { p: "Agree what the manager is responsible for, what authority they hold and where they can get support. Set a review point to discuss delegation, expectations, feedback and any difficulties encountered. Use examples from the work to identify what further development is needed." },
      { p: "Do not limit that support to newly appointed managers. A manager who already supervises people may still benefit from the chance to review and develop their practice." },
      { p: "Leading People serves managers who already supervise people, including those beyond their first few months. It comprises four two-hour online workshops over six weeks for employer cohorts, supported by a participant workbook and workplace application." },
    ],
    links: [{ to: "/leading-people", label: "Leading People" }],
  },
  "before-funding-executive-development": {
    title: "What to ask before funding executive development",
    standfirst: "Four questions to clarify the purpose, requirements and review of a development investment.",
    blocks: [
      { h: "Before the budget is agreed" },
      { p: "Before funding a programme place, make the purpose explicit. What does the participant need to develop, and what does the organisation hope to see in their work afterwards?" },
      { p: "The four questions below provide a basis for that discussion." },
      { h: "1. What constraint is this development meant to address?" },
      { p: "“Developing our leaders” names a broad category. Be more specific. Illustrative examples include decisions that stall at a particular level, different interpretations of strategy, a manager needing support with supervision, or a workforce strategy that needs review." },
      { p: "Use the identified need to judge the programme's relevance. Check its content and intended audience rather than choosing on the strength of its title. Consider, too, whether development is the right response or whether another issue needs addressing first." },
      { h: "2. Is the need individual or structural?" },
      { p: "An executive may need to develop their own strategic capability. A leadership team may also need to clarify shared priorities, decision rights or accountability. Both needs can exist at once; individual programme places should not be assumed to resolve a team-level issue." },
      { p: "Identify which part of the need the proposed development is meant to address, and which part requires organisational attention." },
      { h: "3. What does completion require, and who verifies it?" },
      { p: "Ask what the participant must do, how completion is evidenced and what documentation is issued. Ask for the programme’s approved CPD hours and completion requirements." },
      { p: "Distinguish accredited CPD activity from a qualification or professional certification. Confirm the programme-specific requirements rather than inferring them from provider status or a stated hour range." },
      { h: "4. How will you know it worked?" },
      { p: "Agree what you will review, and when. Illustrative examples include how an executive records and delegates decisions, how the team explains agreed priorities, or how a manager prepares for and conducts one-to-ones." },
      { p: "Use participant feedback alongside examples from work. Allow for other influences on any observed change; a change after a programme does not, on its own, show that the programme caused it." },
      { h: "A note on sequence" },
      { p: "For an organisational need, a structured review of strategic interpretation, decision authority and accountability can inform the development discussion. Decide whether that review suits the issue in hand, rather than treating a diagnostic as a universal prerequisite." },
      { p: "Individuals can request a programme place without first commissioning the Executive Alignment Index™. Select the programme against the individual's development need, and confirm its audience and completion requirements before requesting a place." },
    ],
    links: [
      { to: "/courses", label: "Executive programmes" },
      { to: "/executive-alignment-index", label: "The Executive Alignment Index™" },
    ],
  },
};

const InsightPreviewArticle = () => {
  const { slug = "" } = useParams();
  const article = PREVIEW_ARTICLES[slug];
  if (!article || !isStagingHost()) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} | Insights | Bright Leadership Consulting`}
        description={article.standfirst}
        path={`/insights/${slug}`}
        type="article"
        noindex
      />
      <Header />
      <main className="pt-32 pb-24">
        <article className="container-brief">
          <div className="max-w-[680px]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Link to="/insights" className="hover:text-foreground">Insights</Link> · Preview — not published
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{article.title}</h1>
            <p className="mt-6 text-lg font-semibold leading-relaxed text-foreground">{article.standfirst}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              By Irene A. Agunbiade, Principal Consultant, Bright Leadership Consulting · date to be set on publication
            </p>
            {article.blocks.map((b, i) =>
              "h" in b ? (
                <h2 key={i} className="mt-14 font-serif text-2xl text-foreground">{b.h}</h2>
              ) : "ol" in b ? (
                <ol key={i} className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-muted-foreground">
                  {b.ol.map((x) => <li key={x}>{x}</li>)}
                </ol>
              ) : (
                <p key={i} className="mt-5 leading-relaxed text-muted-foreground">{b.p}</p>
              )
            )}
            <div className="mt-14 flex flex-wrap gap-6 border-t border-border pt-6">
              {article.links.map((l) => (
                <Link key={l.to} to={l.to} className="link-quiet">{l.label}</Link>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default InsightPreviewArticle;
