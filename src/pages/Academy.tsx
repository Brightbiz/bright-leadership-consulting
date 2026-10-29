import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const Academy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Bright Leadership Academy | Bright Leadership Consulting" description="Leadership and management development from Bright Leadership Consulting. Leading People for managers with direct reports and executive development for senior leaders." path="/academy" />
    <ScrollProgress />
    <Header />
    <main>
      <section className="pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="container-brief">
          <div className="max-w-[680px]">
            <p className="kicker mb-6">Leadership and management development</p>
            <h1 className="heading-hero mb-8">Bright Leadership Academy</h1>
            <p className="body-brief">Leadership and management development from Bright Leadership Consulting. Separate pathways for new and developing managers with direct reports and for experienced or aspiring senior leaders.</p>
          </div>
        </div>
      </section>
      <section className="section-brief section-pearl">
        <div className="container-brief">
          <div className="max-w-[680px]">
            <p className="kicker mb-6">Employer cohorts · Managers with direct reports</p>
            <h2 className="heading-section mb-6">Leading People</h2>
            <p className="body-brief mb-6">For new and developing managers with direct reports. Four two-hour online workshops over six weeks, for an employer cohort of 8–12 managers.</p>
            <p className="body-brief mb-6">£4,800 total per employer cohort; no VAT added.</p>
            <p className="body-brief mb-8">Leading People can be commissioned without an Executive Alignment Index™ diagnostic.</p>
            <Link to="/leading-people" className="btn-brief">Explore Leading People</Link>
          </div>
        </div>
      </section>
      <section className="section-brief">
        <div className="container-brief">
          <div className="max-w-[680px]">
            <p className="kicker mb-6">Experienced and aspiring senior leaders</p>
            <h2 className="heading-section mb-6">Executive development</h2>
            <p className="body-brief mb-8">Review Bright's existing executive programmes, including Executive Leadership Mastery and Strategic Leadership in the Age of AI. Individual places do not require a diagnostic.</p>
            <div className="flex flex-col items-start gap-6">
              <Link to="/executive-leadership-mastery" className="link-quiet">Executive Leadership Mastery Programme</Link>
              <Link to="/strategic-leadership-ai" className="link-quiet">Strategic Leadership in the Age of AI</Link>
              <Link to="/courses" className="btn-brief">Explore the executive catalogue</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Academy;