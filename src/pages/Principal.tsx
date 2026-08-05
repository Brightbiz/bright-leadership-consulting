import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/**
 * Verification page, not a destination. Deliberately excluded from the primary
 * navigation and linked only from the footer and /advisory-process.
 *
 * Copy discipline: third person, no career narrative, no first-person voice,
 * no photograph. Every statement here is one the practice already stands
 * behind elsewhere on the site. Specific tenures, named client organisations
 * and accreditation bodies are intentionally absent until supplied and
 * verifiable — do not add unverified specifics to this page.
 */
const Principal = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Principal | Bright Leadership Consulting"
        description="Who leads Executive Alignment Index™ engagements at Bright Leadership Consulting, and the basis on which the diagnostic and advisory work is conducted."
        path="/principal"
        type="profile"
      />
      <Header />

      <main className="pt-32 pb-24">
        <div className="container-brief">
          <motion.div {...fade} className="max-w-[680px]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Bright Leadership Consulting
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">Principal</h1>

            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Engagements are led personally by Irene Bright. There is no account layer and no
              delegated delivery team: the person who scopes a mandate is the person who conducts
              the diagnostic, writes the Executive Alignment Report™ and sits in the room when it
              is put to the board.
            </p>
          </motion.div>





          <motion.section {...fade} className="mt-16 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Remit</h2>
            <p className="leading-relaxed text-muted-foreground">
              The practice works with chairs, chief executives and nominations committees on a
              single question: whether the senior team is aligned closely enough for strategy to
              survive execution. That work is deliberately narrow. It does not extend to
              recruitment, remuneration benchmarking, organisational restructuring or general
              management consulting.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Advisory mandates are held at board level and reported to the commissioning party
              directly. Individual diagnostic responses are never disclosed to the client
              organisation, and client identities are not published.
            </p>
          </motion.section>

          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Basis of the instrument</h2>
            <p className="leading-relaxed text-muted-foreground">
              The Executive Alignment Index™ was developed inside advisory practice rather than
              adapted from a licensed psychometric. It exists because the recurring failure
              observed across senior teams was not capability but dispersion — the quiet variance
              between what individual executives believe has been decided.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              The instrument measures that variance, reports it at group level, and is
              re-administered to establish whether it has narrowed. Its scope, group-size
              thresholds, anonymity conditions and current validation status are set out in full
              on the diagnostic page.
            </p>
            <Link
              to="/executive-alignment-index"
              className="inline-block border-b border-foreground/25 pb-0.5 text-sm tracking-[0.03em] transition-colors hover:border-foreground"
            >
              Methodology and data governance
            </Link>
          </motion.section>

          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">How engagements are taken on</h2>
            <p className="leading-relaxed text-muted-foreground">
              Capacity is limited by design, because the work is not delegated. Organisational
              mandates begin with a confidential conversation to establish whether measurement is
              the appropriate first step. Where it is not, that is said plainly.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Individual executives enrolling on a programme do not require a diagnostic and do not
              need to speak to the practice first.
            </p>
          </motion.section>

          <motion.section {...fade} className="mt-14 max-w-[680px] border-t border-border pt-10">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link
                to="/contact"
                className="btn-brief px-6 py-2.5 text-sm"
              >
                Discuss Executive Alignment
              </Link>
              <Link
                to="/advisory-process"
                className="self-center border-b border-foreground/25 pb-0.5 text-sm tracking-[0.03em] transition-colors hover:border-foreground"
              >
                How we work
              </Link>
            </div>
            <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
              Bright Leadership Consulting is registered in England and Wales, company number
              07258400.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Principal;
