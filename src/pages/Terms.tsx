import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CpdHoursFaq from "@/components/CpdHoursFaq";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const sections = [
  {
    heading: "These terms",
    body: [
      "This website is operated by Bright Leadership Consulting (company number 07258400, registered in England and Wales). By using the site you accept these terms.",
    ],
  },
  {
    heading: "Nature of the material published here",
    body: [
      "Material on this site describes the nature and scope of advisory work and executive programmes. It is provided for information and does not constitute professional, legal, financial or governance advice, and should not be relied upon as such.",
      "Case material is presented as composite examples developed from advisory and leadership experience. Details have been adapted and combined to preserve confidentiality and are not accounts of individual, identifiable clients.",
      "The Executive Alignment Index™ is a structured diagnostic instrument. It has not been independently psychometrically validated and no such claim is made.",
    ],
  },
  {
    heading: "Engagements",
    body: [
      "No advisory engagement arises from the use of this site or from submitting an enquiry. Engagements are governed exclusively by a separate written agreement setting out scope, fees, confidentiality and deliverables.",
      "Fees are quoted in British Pounds (£) unless otherwise agreed in writing.",
    ],
  },
  {
    heading: "Programmes and third-party platforms",
    body: [
      "Executive programmes are delivered through a third-party learning platform. Enrolment, payment, access and refunds for those programmes are subject to that platform's own terms and to any programme terms provided at the point of enrolment.",
      "Accredited CPD hours are stated as ranges at programme level; participants remain responsible for recording CPD with their own professional body.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The Executive Alignment Index™, Executive Alignment Report™, ALIGN™, Executive Oversight™ and Augmented Leadership™, together with all site content, frameworks and diagnostic materials, are the intellectual property of Bright Leadership Consulting.",
      "Content may not be reproduced, distributed or used to develop a competing instrument or programme without written permission.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "The site is provided without warranty as to accuracy or continuous availability. To the extent permitted by law, we accept no liability for loss arising from reliance on site content. Nothing in these terms limits liability that cannot lawfully be limited.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Use | Bright Leadership Consulting"
        description="Terms governing use of the Bright Leadership Consulting website, published material, programmes and intellectual property."
        path="/terms"
      />
      <Header />

      <main>
        <section className="pt-36 pb-20 lg:pt-44 lg:pb-24">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Legal
              </motion.p>
              <motion.h1 className="heading-hero mb-8" {...fade}>
                Terms of Use
              </motion.h1>
              <motion.p className="body-brief text-muted-foreground" {...fade}>
                The basis on which this website and the material published on it
                are made available.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="pb-32">
          <div className="container-brief">
            <div className="max-w-[680px] border-t border-border">
              {sections.map((section) => (
                <motion.div
                  key={section.heading}
                  className="border-b border-border py-10"
                  {...fade}
                >
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-[15px] leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="max-w-[680px] pt-16">
              <motion.h2
                className="font-serif text-xl font-medium text-foreground mb-6"
                {...fade}
              >
                How CPD hours are determined
              </motion.h2>
              <CpdHoursFaq />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
