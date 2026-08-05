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

          {/* Deliberately the last content section before the CTA, and deliberately short:
              two paragraphs establishing who applies the method, not a founder story. No
              photograph, no autobiography, no first-person voice. Restricted to claims the
              practice already makes elsewhere on the site (EAI™ authorship, the
              four-programme catalogue, board-level clientele). Do not add tenures, sectors
              or client names until supplied and verifiable, and do not promote this section
              higher up the page. */}
          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Who applies the method</h2>
            <p className="leading-relaxed text-muted-foreground">
              Irene Bright is the principal of Bright Leadership Consulting. She authored the
              Executive Alignment Index™ and the executive programmes the practice publishes, and
              she conducts, interprets and reports every diagnostic engagement herself.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              The instrument came out of advisory work rather than academic study: the recurring
              constraint observed across senior teams was not capability but dispersion, and no
              existing measure reported it at group level in terms a board could act on.
            </p>
          </motion.section>

          {/* Accreditation. The accrediting body and point value are the claims the practice
              already makes on its programme pages and brochures. CPD_PROVIDER_NUMBER stays
              null until the certificate reference is supplied — the line is suppressed rather
              than filled with a placeholder, because a fabricated provider number on a
              verification page is worse than an absent one. */}
          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Accreditation</h2>
            <p className="leading-relaxed text-muted-foreground">
              The executive programmes are accredited by The CPD Certification Service.
              Completion of all thirty-three modules of Executive Leadership Mastery confers 66
              CPD points, awarded at two points per module, and a certificate is issued on
              completion.
            </p>
            {CPD_PROVIDER_NUMBER && (
              <p className="leading-relaxed text-muted-foreground">
                Bright Leadership Consulting is a registered CPD provider, provider number{" "}
                {CPD_PROVIDER_NUMBER}.
              </p>
            )}
            <p className="leading-relaxed text-muted-foreground">
              Accreditation applies to the programmes only. The Executive Alignment Index™ and
              the advisory work built on it are proprietary to the practice and are not
              accredited, certified or endorsed by any third party; neither is presented as a
              regulated or licensed activity.
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
