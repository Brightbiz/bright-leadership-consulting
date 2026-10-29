import { Link } from "react-router-dom";

const AcademyIntroduction = () => (
  <section className="section-brief section-pearl">
    <div className="container-brief">
      <div className="max-w-[680px]">
        <p className="kicker mb-6">Leadership and management development</p>
        <h2 className="heading-section mb-6">Bright Leadership Academy</h2>
        <p className="body-brief mb-8">Leadership and management development from Bright Leadership Consulting, with separate routes for managers with direct reports and experienced or aspiring senior leaders.</p>
        <div className="space-y-8 mb-8">
          <div>
            <h3 className="font-serif text-xl mb-3">Leading People</h3>
            <p className="body-brief mb-4">For new and developing managers with direct reports. Employer cohorts can be commissioned without an Executive Alignment Index™ diagnostic.</p>
            <Link to="/leading-people" className="link-quiet">Explore Leading People</Link>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-3">Executive development</h3>
            <p className="body-brief mb-4">For experienced and aspiring senior leaders.</p>
            <Link to="/courses" className="link-quiet">Explore the executive catalogue</Link>
          </div>
        </div>
        <Link to="/academy" className="btn-brief">Explore Bright Leadership Academy</Link>
      </div>
    </div>
  </section>
);

export default AcademyIntroduction;