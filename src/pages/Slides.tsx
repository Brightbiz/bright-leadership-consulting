import { Link } from "react-router-dom";
import { ArrowRight, Presentation } from "lucide-react";

const slides = [
  {
    number: 5,
    title: "The Leadership Paradox of AI",
    description: "How the role of the leader fundamentally shifts in an AI-augmented organisation.",
    file: "/slides/slide-05-leadership-paradox.html",
  },
];

const Slides = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to site
          </Link>
          <div className="flex items-center gap-3 mt-6">
            <Presentation className="h-6 w-6 text-secondary" />
            <h1 className="text-2xl font-semibold text-foreground">Presentation Slides</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Executive Leadership Mastery Programme — printable slide deck.
          </p>
        </div>

        <div className="space-y-3">
          {slides.map((slide) => (
            <a
              key={slide.number}
              href={slide.file}
              className="flex items-center gap-5 p-5 rounded-xl border border-border/50 bg-card hover:border-secondary/40 hover:shadow-sm transition-all group"
            >
              <span className="text-sm font-medium text-muted-foreground/50 w-8 text-right shrink-0">
                {String(slide.number).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {slide.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{slide.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-secondary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slides;
