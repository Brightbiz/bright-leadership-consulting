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
 * Verified from the accreditation certificate issued by The CPD Standards Office.
 * Do not alter without a corresponding certificate.
 */
const CPD_PROVIDER_NUMBER = "50838";
const CPD_ACCREDITATION_PERIOD = "2025–2026";

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
              Engagements are led personally by Irene A. Agunbiade. There is no account layer and
              no delegated delivery team: the person who scopes a mandate is the person who
              conducts the diagnostic, writes the Executive Alignment Report™ and sits in the room
              when it is put to the board.
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

          {/* Deliberately the last content section before the CTA. A restrained bio establishing
              who applies the method, not a founder story. No photograph, no autobiography, no
              first-person voice. Do not promote this section higher up the page. */}
          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Who applies the method</h2>
            <p className="leading-relaxed text-muted-foreground">
              Irene A. Agunbiade is the Principal Adviser at Bright Leadership Consulting. Her
              background spans senior leadership in UK banking, management consulting and business
              advisory, with academic foundations in Industrial Engineering and an MBA in
              International Business.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              She developed the Executive Alignment Index™ and the executive programmes that sit
              beneath it. Client engagements are principal-led, ensuring senior attention,
              continuity and discretion throughout the advisory process.
            </p>
          </motion.section>

          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Questions chairs and chief executives ask</h2>
            <div className="space-y-0">
              <details name="principal-faq" className="border-b border-border py-4">
                <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                  What does a typical engagement look like?
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Organisational mandates begin with a confidential conversation to establish whether
                  measurement is the appropriate first step. Where it is, the Executive Alignment
                  Index™ is administered to the senior team, individual responses are anonymised,
                  and a group-level Executive Alignment Report™ is produced for the commissioning
                  board. The report is then presented in person.
                </p>
              </details>

              <details name="principal-faq" className="border-b border-border py-4">
                <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                  How is confidentiality maintained?
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Individual diagnostic responses are never disclosed to the client organisation.
                  The output is an aggregated group-level report. Client identities are not published,
                  and no case material is used for marketing or social proof.
                </p>
              </details>

              <details name="principal-faq" className="border-b border-border py-4">
                <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                  What does the Executive Alignment Index™ measure?
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  It measures the variance between what individual executives believe has been
                  decided — the quiet dispersion that often undermines execution. The instrument
                  reports that variance at group level and can be re-administered to establish
                  whether it has narrowed.
                </p>
              </details>

              <details name="principal-faq" className="border-b border-border py-4">
                <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                  What does principal-led delivery mean?
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The person who scopes the mandate is the person who conducts the diagnostic,
                  writes the report and sits in the room when it is put to the board. Capacity is
                  limited by design because the work is not delegated.
                </p>
              </details>

              <details name="principal-faq" className="border-b border-border py-4">
                <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                  What can a client expect after the diagnostic?
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  A clear, board-ready statement of alignment variance and, where appropriate, a
                  recommended advisory path to narrow it. If measurement is not the appropriate first
                  step, that is said plainly.
                </p>
              </details>
            </div>
          </motion.section>



          {/* Accreditation. Body, provider number and period are taken from the certificate
              issued by The CPD Standards Office. The accredited-activity mark is reproduced
              as required by the accreditation terms — it is a verification mark, not
              decoration, and is the only image permitted on this page. */}
          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-5">
            <h2 className="font-serif text-2xl">Accreditation</h2>
            <p className="leading-relaxed text-muted-foreground">
              The executive programmes are accredited by The CPD Standards Office, CPD provider
              number {CPD_PROVIDER_NUMBER} ({CPD_ACCREDITATION_PERIOD}). Completion of all
              thirty-three modules of Executive Leadership Mastery confers 66 CPD points, awarded
              at two points per module, and a certificate is issued on completion.
            </p>
            <div className="flex items-start gap-5 border-t border-border pt-6">
              <img
                src="/cpd-standards-office-accredited.png"
                alt="Accredited CPD Activity — The CPD Standards Office, CPD provider 50838, 2025–2026"
                width={96}
                height={96}
                loading="lazy"
                className="h-24 w-24 flex-shrink-0 object-contain"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Accredited CPD Activity · The CPD Standards Office · CPD Provider {CPD_PROVIDER_NUMBER}
                {" "}· {CPD_ACCREDITATION_PERIOD}. Participants remain responsible for recording
                CPD with their own professional body.
              </p>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Accreditation applies to the programmes only. The Executive Alignment Index™ and
              the advisory work built on it are proprietary to the practice and are not
              accredited, certified or endorsed by any third party; neither is presented as a
              regulated or licensed activity.
            </p>
          </motion.section>



          <motion.section {...fade} className="mt-14 max-w-[680px] space-y-6 border-t border-border pt-10">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl">Start with a confidential conversation</h2>
              <p className="leading-relaxed text-muted-foreground">
                There is no fee and no commitment. The first step is simply to establish whether
                the Executive Alignment Index™ is the appropriate starting point for the board or
                executive team.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link
                to="/contact"
                className="btn-brief px-6 py-2.5 text-sm"
              >
                Request a confidential initial conversation
              </Link>
              <Link
                to="/advisory-process"
                className="self-center border-b border-foreground/25 pb-0.5 text-sm tracking-[0.03em] transition-colors hover:border-foreground"
              >
                How we work
              </Link>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground/70">
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
