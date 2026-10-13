import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";
import { withCampaignTags } from "@/lib/campaignTags";

/**
 * Insights article. Text is reproduced exactly as supplied; the publication
 * date stays a placeholder until approved for publishing.
 *
 * The closing webinar link adds no campaign tags of its own: it only carries
 * the visitor's existing in-memory tags (if any). The article origin is
 * recorded separately in the consent-gated `article_cta_click` event.
 */
const SLUG = "four-question-decision-test";
const WEBINAR_PATH = "/executive-leadership-mastery/webinar";

const rows = [
  ["What exactly are we deciding?", "\u201CThe future of the department\u201D", "Whether to merge two teams from April"],
  ["Who owns the decision?", "Unclear: no agreed decision owner or process", "The operations director decides, within their authority and subject to required approvals and consultation, after hearing finance and HR"],
  ["What evidence would make us reconsider?", "Not discussed", "If the expected saving falls below an agreed threshold, or if service disruption or people risks become unacceptable"],
  ["When will we decide, and how will we communicate it?", "\u201CSoon\u201D", "At the meeting on a stated date; the operations director briefs both teams the same week"],
];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-14 font-serif text-2xl text-foreground">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-5 leading-relaxed text-muted-foreground">{children}</p>
);

const InsightFourQuestionDecisionTest = () => {
  const webinarHref = withCampaignTags(WEBINAR_PATH);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="The four-question decision test | Insights | Bright Leadership Consulting"
        description="Why some decisions keep coming back, and four questions that help them stick."
        path={`/insights/${SLUG}`}
        type="article"
      />
      <Header />
      <main className="pt-32 pb-24">
        <article className="container-brief">
          <div className="max-w-[680px]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <Link to="/insights" className="hover:text-foreground">Insights</Link>
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">The four-question decision test</h1>
            <p className="mt-6 text-lg font-semibold leading-relaxed text-foreground">
              Why some decisions keep coming back, and four questions that help them stick.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              By Irene A. Agunbiade, Principal Consultant, Bright Leadership Consulting · [Publication date]
            </p>

            <H2>When a decision keeps coming back</H2>
            <P>More information is not always what a stalled decision needs. The harder task is turning competing information into a clear, owned decision.</P>
            <P>Most leaders will recognise the pattern. A team discusses an issue, appears to agree, and moves on. A week later the same issue is back on the agenda. Someone has had second thoughts, someone else was never sure what had been agreed, and the conversation starts again.</P>
            <P>When nobody is certain what is being decided, who owns the call or when it becomes final, decisions tend to be delayed, revisited or quietly ignored. More discussion rarely fixes that. What helps is clarity about the decision itself, before the debate begins.</P>

            <H2>The four questions</H2>
            <P>Before a significant decision, agree the answers to four questions.</P>
            <P><strong className="text-foreground">1. What exactly are we deciding?</strong><br />State the specific choice, not the general topic. "The structure of the operations function" is a topic. "Whether to merge the two operations teams from April" is a decision. Different people can sit in the same meeting solving different problems until this is clear.</P>
            <P><strong className="text-foreground">2. Who owns the decision?</strong><br />Distinguish the decision-maker from everyone who contributes advice. Many people can shape a decision; the owner should be named. If a committee or leadership team owns the decision, specify how it will reach and record the decision.</P>
            <P><strong className="text-foreground">3. What evidence would make us reconsider?</strong><br />Agree what changes in evidence, assumptions or risk would justify reopening it. New concerns should still be heard, especially where they involve safety, legality or significant harm.</P>
            <P><strong className="text-foreground">4. When will we decide, and how will we communicate it?</strong><br />Set a date for the decision and agree who will hear about it, from whom, and how. A decision that is made but not communicated can end up being made again.</P>

            <H2>An illustrative example</H2>
            <P>Imagine a senior team discussing whether to restructure a department. The conversation circles. The finance director is thinking about cost, the operations director about service levels, and the HR director about how people will experience the change. Each is right, and each is solving a different problem.</P>
            <P>The four questions change the discussion:</P>
          </div>

          <div className="mt-6 max-w-[880px] overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/40">
                  <th scope="col" className="py-3 pr-4 font-semibold text-foreground">Question</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-foreground">Before</th>
                  <th scope="col" className="py-3 font-semibold text-foreground">After</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([q, before, after]) => (
                  <tr key={q} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">{q}</th>
                    <td className="py-3 pr-4 text-muted-foreground">{before}</td>
                    <td className="py-3 text-muted-foreground">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-[680px]">
            <P>Disagreement may remain. But it becomes useful, because everyone knows what is being decided, who owns the decision and what happens next.</P>

            <H2>Try it this week</H2>
            <P>Choose one decision that has been drifting: the one that has come back to your agenda most often recently.</P>
            <ol className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-muted-foreground">
              <li>Write down your answer to each of the four questions.</li>
              <li>Share the answers with the people involved before the next discussion.</li>
              <li>Notice where their answers differ from yours. Those differences show where the next conversation needs to start.</li>
            </ol>
            <P>Start with a ten-minute review.</P>

            <H2>Beyond one decision</H2>
            <P>One clear decision helps. The greater challenge is making this kind of judgement part of how a leader works, consistently, alongside accountability and the ability to turn strategy into coordinated action.</P>
            <P>Those three disciplines are the subject of our free 13-minute webinar, <em>Developing the leaders your organisation depends on</em>, with a practical action for each.</P>
            <p className="mt-8">
              <Link
                to={webinarHref}
                className="btn-brief inline-block font-semibold"
                onClick={() =>
                  trackEvent("article_cta_click", {
                    article: SLUG,
                    origin: "insights_article",
                    destination: WEBINAR_PATH,
                  })
                }
              >
                Watch the free webinar
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default InsightFourQuestionDecisionTest;
