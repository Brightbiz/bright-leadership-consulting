import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { programmes } from "@/data/programmes";
import { CPD_PROVIDER_STATEMENT, CPD_PARTICIPANT_STATEMENT, CPD_CERTIFICATE_SCOPE_NOTE, CPD_SCOPE_STATEMENT } from "@/data/accreditation";

const Cpd = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="CPD information | Bright Leadership Consulting" description="The CPD Standards Office Provider 50838: accredited executive programmes, approved CPD hours and Certificate of Attendance. Leading People is a separate, non-accredited offer." path="/cpd" />
    <ScrollProgress />
    <Header />
    <main>
      <section className="pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="container-brief">
          <div className="max-w-[680px]">
            <p className="kicker mb-6">The CPD Standards Office · Provider 50838</p>
            <h1 className="heading-hero mb-8">CPD information</h1>
            <p className="body-brief">{CPD_PROVIDER_STATEMENT}</p>
          </div>
        </div>
      </section>
      <section className="section-brief section-pearl">
        <div className="container-brief">
          <div className="max-w-[680px]">
            <h2 className="heading-section mb-8">Accredited executive programmes</h2>
            <p className="body-brief mb-8">The following four executive programmes carry accredited CPD-hours ranges.</p>
            <dl className="divide-y divide-border border-y border-border">
              {programmes.map((programme) => (
                <div key={programme.title} className="py-6">
                  <dt className="font-serif text-lg leading-relaxed">
                    <Link to={programme.detailPage ?? programme.link} className="link-quiet">{programme.title}</Link>
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{programme.cpdHours}</dd>
                </div>
              ))}
            </dl>
            <p className="body-brief mt-8">{CPD_SCOPE_STATEMENT}</p>
          </div>
        </div>
      </section>
      <section className="section-brief">
        <div className="container-brief">
          <div className="max-w-[680px] space-y-6">
            <h2 className="heading-section">Certificate of Attendance</h2>
            <p className="body-brief">{CPD_PARTICIPANT_STATEMENT}</p>
            <p className="body-brief">{CPD_CERTIFICATE_SCOPE_NOTE}</p>
          </div>
        </div>
      </section>
      <section className="section-brief section-pearl">
        <div className="container-brief">
          <div className="max-w-[680px] space-y-6">
            <h2 className="heading-section">Leading People: separate professional development</h2>
            <p className="body-brief">Practical professional development; no qualification, external accreditation or CPD-hours claim is made for Leading People.</p>
            <p className="body-brief">Bright's CPDSO provider status and the accredited executive programmes listed above do not confer accreditation on Leading People.</p>
            <Link to="/leading-people" className="link-quiet">Review Leading People</Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Cpd;