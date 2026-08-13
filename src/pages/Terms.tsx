import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CancellationFaq from "@/components/CancellationFaq";
import CpdHoursFaq from "@/components/CpdHoursFaq";


const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

type SectionBody =
  | string
  | { subheading: string; paragraphs: string[] }
  | { list: string[] };

type Section = {
  heading: string;
  body: SectionBody[];
};

const sections: Section[] = [
  {
    heading: "These terms",
    body: [
      "This website is operated by Bright Business Solutions (Int’l) Company Limited, trading as Bright Leadership Consulting (Company No. 07258400), registered office: 82 James Carter Road, Mildenhall, England IP28 7DE. Registered in England and Wales. By using the site you accept these terms.",
      "Programme, purchase, cancellation and access enquiries should be sent to admin@brightleadershipconsulting.com.",
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
    heading: "Executive Programme Purchases",
    body: [
      {
        subheading: "Platform and contracting party",
        paragraphs: [
          "Bright Leadership Consulting's self-directed executive programmes are delivered through a third-party learning platform. The programme description, price, payment options, access arrangements and applicable completion requirements displayed at purchase form part of the terms of the purchase.",
          "The platform processes enrolment, payment and programme access. Its technical and payment-processing terms may also apply, but they do not remove any statutory rights that cannot lawfully be excluded.",
        ],
      },
      {
        subheading: "Prices, taxes and payment",
        paragraphs: [
          "Programme fees are stated in British Pounds unless otherwise shown. The price, payment schedule and any tax or VAT applicable to the purchaser are displayed at checkout before payment is completed.",
          "Where an instalment plan is selected, the purchaser is responsible for all instalments forming part of the agreed total price. An instalment plan is a method of paying the full programme fee and is not a monthly subscription that may be cancelled at will.",
        ],
      },
      {
        subheading: "Access",
        paragraphs: [
          "Access to programme materials is currently not subject to a fixed expiry date on the learning platform. Purchasers requiring assistance with access should write to admin@brightleadershipconsulting.com.",
          "Bright Leadership Consulting may temporarily restrict access where payment is overdue, the platform is misused, programme materials are shared without permission or these terms are materially breached.",
          "Bright Leadership Consulting reserves the right to make reasonable changes to the learning platform or programme-delivery arrangements. Any such change will not affect access rights already granted to a purchaser without appropriate notice or an appropriate alternative arrangement.",
        ],

      },
      {
        subheading: "Cancellation by individual consumers",
        paragraphs: [
          "Individual consumers purchasing online may have a statutory right to cancel within 14 days, subject to the applicable law governing digital content and services.",
          "Where a purchaser expressly requests or consents to immediate access to digital programme content during the cancellation period and acknowledges that beginning the supply will result in the loss of the statutory cancellation right, that right may be lost once access to the digital content begins.",
          "Agreement to these terms alone does not constitute a separate request, consent or acknowledgement for immediate supply of digital content during the statutory cancellation period. That declaration must be given separately and expressly, and the learning platform does not presently capture it.",
          "If the required separate request and acknowledgement have not been obtained, the purchaser's statutory cancellation rights remain unaffected. Nothing in these terms excludes rights or remedies that cannot lawfully be limited.",
          "To request cancellation, the purchaser must write to admin@brightleadershipconsulting.com, providing their name, programme, purchase date and the email address used to enrol.",
        ],
      },
      {
        subheading: "Digital-content problems",
        paragraphs: [
          "If programme content is faulty, unavailable or not supplied as described, the purchaser should notify admin@brightleadershipconsulting.com promptly so that the issue can be investigated and, where appropriate, repaired, restored or otherwise resolved.",
          "Nothing in these terms limits the purchaser's statutory rights concerning digital content or services.",
        ],
      },
      {
        subheading: "Organisational and cohort purchases",
        paragraphs: [
          "Organisational, cohort, facilitated and advisory-supported purchases are governed by the proposal, order form or written agreement issued for that engagement.",
          "Cancellation, postponement, substitution of participants, payment and refund arrangements for those purchases will be stated in the relevant written agreement. Consumer cancellation provisions do not ordinarily apply to purchases made wholly for business purposes.",
        ],
      },
      {
        subheading: "Receipts, invoices and purchase orders",
        paragraphs: [
          "A receipt showing the order details is provided following a completed online purchase. Organisational invoices and purchase-order arrangements must be agreed before enrolment or delivery begins.",
          "Providing a purchase-order number does not replace the organisation's obligation to pay an invoice in accordance with the agreed payment terms.",
        ],
      },
      {
        subheading: "Completion and certificates",
        paragraphs: [
          "Each programme has stated completion requirements. Completion is reviewed and approved by Bright Leadership Consulting.",
          "Participants who satisfy the approved requirements for a CPD-accredited activity receive the official CPDSO Certificate of Attendance manually from Bright Leadership Consulting, using the standard template supplied by The CPD Standards Office. Certificates are normally issued within ten working days of approved completion and are not generated or downloaded automatically through the learning platform.",
          "A CPDSO Certificate of Attendance records participation in an accredited CPD activity. It is not a qualification, professional certification or academic award. Participants remain responsible for recording CPD with their own professional institute, regulator or employer.",
        ],
      },
      {
        subheading: "Platform availability",
        paragraphs: [
          "Bright Leadership Consulting will take reasonable steps to maintain programme availability but cannot guarantee uninterrupted access where disruption is caused by maintenance, third-party platform failure or circumstances outside its reasonable control.",
          "Where a material interruption prevents access for a significant period, Bright Leadership Consulting may provide an appropriate remedy or access adjustment.",
        ],
      },
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
      "These terms are governed by the laws of England and Wales. Where the purchaser is a consumer resident elsewhere, they retain the benefit of any mandatory consumer-protection rights available under the law of their country of residence, and may bring proceedings in that country where the applicable law permits.",
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
                    {section.body.map((item, i) => {
                      if (typeof item === "string") {
                        return (
                          <p
                            key={item}
                            className="text-[15px] leading-relaxed text-muted-foreground"
                          >
                            {item}
                          </p>
                        );
                      }
                      if ("list" in item) {
                        return (
                          <ul
                            key={`list-${i}`}
                            className="list-disc pl-5 space-y-1 text-[15px] leading-relaxed text-muted-foreground"
                          >
                            {item.list.map((li) => (
                              <li key={li}>{li}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <div
                          key={`${item.subheading}-${i}`}
                          className="space-y-3"
                        >
                          <h3 className="font-serif text-base font-medium text-foreground">
                            {item.subheading}
                          </h3>
                          {item.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-[15px] leading-relaxed text-muted-foreground"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="max-w-[680px] pt-16">
              <motion.h2
                className="font-serif text-xl font-medium text-foreground mb-6"
                {...fade}
              >
                Cancellation for online consumers
              </motion.h2>
              <CancellationFaq />
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
