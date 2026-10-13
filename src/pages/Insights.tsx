import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const articles = [
  {
    href: "/insights/four-question-decision-test",
    title: "The four-question decision test",
    standfirst: "Why some decisions keep coming back, and four questions that help them stick.",
    byline: "Irene A. Agunbiade · [Publication date]",
  },
];

const Insights = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Insights | Bright Leadership Consulting"
      description="Articles on leadership decisions and judgement from Bright Leadership Consulting."
      path="/insights"
    />
    <Header />
    <main className="pt-32 pb-24">
      <div className="container-brief">
        <div className="max-w-[680px]">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Bright Leadership Consulting
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">Insights</h1>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {articles.map((a) => (
              <li key={a.href} className="py-8">
                <Link to={a.href} className="group block">
                  <h2 className="font-serif text-2xl text-foreground group-hover:underline">{a.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{a.standfirst}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{a.byline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Insights;
