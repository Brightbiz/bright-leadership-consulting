import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

// ── Types ──
interface WorkbookData {
  [sectionKey: string]: { [fieldKey: string]: string };
}

interface SectionDef {
  id: string;
  number: string;
  title: string;
  render: (data: WorkbookData, onChange: FieldHandler) => React.ReactNode;
}

type FieldHandler = (section: string, field: string, value: string) => void;

// ── Validation ──
const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);
const nameSchema = z.string().trim().max(100).optional();

// ── Reusable UI Blocks ──
const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="mb-8">
    <p className="text-xs font-medium tracking-[0.18em] uppercase text-primary mb-3">{number}</p>
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">{title}</h2>
    <div className="w-14 h-[3px] bg-[hsl(var(--amber-500))]" />
  </div>
);

const InstructionBox = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-[3px] border-primary bg-accent px-5 py-4 my-6">
    <p className="text-sm leading-relaxed text-foreground">{children}</p>
  </div>
);

const FieldGroup = ({
  label, value, onChange, placeholder, rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) => (
  <div className="my-5">
    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-2">{label}</label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-muted border-border focus:border-primary resize-y text-sm"
    />
  </div>
);

const InputField = ({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
  <div className="my-4">
    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-2">{label}</label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-transparent border-0 border-b border-border rounded-none px-0 focus:border-primary text-sm"
    />
  </div>
);

// ── Table Component ──
const WorkbookTable = ({
  headers, rows, sectionId, data, onChange,
}: {
  headers: string[];
  rows: { label?: string; fields: string[] }[];
  sectionId: string;
  data: WorkbookData;
  onChange: FieldHandler;
}) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-accent border-b-2 border-primary">
          {headers.map((h) => (
            <th key={h} className="text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-primary px-3 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-border">
            {row.label && (
              <td className="px-3 py-3 font-medium text-foreground whitespace-nowrap align-top text-sm">{row.label}</td>
            )}
            {row.fields.map((fieldKey) => (
              <td key={fieldKey} className="px-1 py-1 align-top">
                <Textarea
                  value={data[sectionId]?.[fieldKey] || ""}
                  onChange={(e) => onChange(sectionId, fieldKey, e.target.value)}
                  rows={2}
                  className="bg-transparent border-0 text-sm resize-y min-h-[50px] focus:bg-muted"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Maturity Level Selector ──
const MaturitySelector = ({
  selected, onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) => {
  const levels = [
    { level: "1", name: "Awareness", desc: "AI is recognised but rarely used in practice." },
    { level: "2", name: "Experimentation", desc: "Pilot projects and early experimentation underway." },
    { level: "3", name: "Operational Adoption", desc: "AI integrated into operational processes." },
    { level: "4", name: "Strategic Integration", desc: "AI supports strategic decision-making at executive level." },
    { level: "5", name: "Intelligent Enterprise", desc: "AI embedded across the entire organisation." },
  ];

  return (
    <div className="my-6 space-y-0">
      {levels.map((ml) => (
        <button
          key={ml.level}
          type="button"
          onClick={() => onSelect(ml.level)}
          className={`w-full flex items-center gap-4 px-5 py-3.5 border-b border-border text-left transition-colors ${
            selected === ml.level ? "bg-accent" : "hover:bg-muted"
          }`}
        >
          <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
            selected === ml.level ? "border-primary bg-primary" : "border-border"
          }`} />
          <span className="font-serif text-lg font-bold text-primary w-6">{ml.level}</span>
          <span className="font-semibold text-foreground min-w-[140px]">{ml.name}</span>
          <span className="text-sm text-muted-foreground">{ml.desc}</span>
        </button>
      ))}
    </div>
  );
};

// ── Governance Pillar Card ──
const GovernancePillar = ({
  title, question, value, onChange,
}: {
  title: string; question: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="border-t-[3px] border-primary bg-muted p-4">
    <h4 className="text-xs font-semibold tracking-[0.08em] uppercase text-primary mb-1">{title}</h4>
    <p className="text-xs text-muted-foreground italic mb-3">{question}</p>
    <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="bg-background border-border text-sm" />
  </div>
);

// ── Phase Block ──
const PhaseBlock = ({
  num, title, desc, value, onChange,
}: {
  num: string; title: string; desc: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="border-l-[3px] border-primary bg-muted px-5 py-4 my-4">
    <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-primary mb-1">Phase {num}</p>
    <p className="font-serif text-lg font-bold text-foreground mb-1">{title}</p>
    <p className="text-xs text-muted-foreground mb-3">{desc}</p>
    <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} placeholder="Key actions, stakeholders, and milestones..." className="bg-background border-border text-sm" />
  </div>
);

// ── Decision Matrix ──
const DecisionMatrix = ({
  data, sectionId, onChange,
}: {
  data: WorkbookData; sectionId: string; onChange: FieldHandler;
}) => {
  const quadrants = [
    { key: "ai_led", title: "AI-Led Decisions" },
    { key: "ai_augmented", title: "AI-Augmented Decisions" },
    { key: "human_led", title: "Human-Led Decisions" },
    { key: "collaborative", title: "Collaborative Decisions" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border my-6">
      {quadrants.map((q) => (
        <div key={q.key} className="p-4 border border-border">
          <h4 className="text-[11px] font-semibold tracking-[0.1em] uppercase text-primary mb-2">{q.title}</h4>
          <Textarea
            value={data[sectionId]?.[q.key] || ""}
            onChange={(e) => onChange(sectionId, q.key, e.target.value)}
            rows={3}
            className="bg-transparent border-0 text-sm"
          />
        </div>
      ))}
    </div>
  );
};

// ── Prompt Example ──
const PromptExample = ({ category, text }: { category: string; text: string }) => (
  <div className="bg-muted border border-border px-5 py-4 my-3">
    <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-primary mb-1">{category}</p>
    <p className="font-serif italic text-sm text-foreground">"{text}"</p>
  </div>
);

// ══════════════════════════════════════════════
//  SECTION DEFINITIONS
// ══════════════════════════════════════════════
const g = (data: WorkbookData, section: string, field: string) => data[section]?.[field] || "";

const SECTIONS: SectionDef[] = [
  // ── Section 0: Email Capture ──
  {
    id: "intro",
    number: "Getting Started",
    title: "Your Details",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Enter your details to begin the workbook. Your progress will be saved automatically so you can return and continue at any time.
        </p>
        <InputField label="Your Name" value={g(data, "intro", "name")} onChange={(v) => onChange("intro", "name", v)} placeholder="Full name" />
        <InputField label="Email Address" value={g(data, "intro", "email")} onChange={(v) => onChange("intro", "email", v)} placeholder="you@organisation.com" />
        <InstructionBox>
          By the end of the programme, you will complete an <strong>AI Leadership Blueprint</strong> — a strategic action document you can present to your board or executive team.
        </InstructionBox>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[
            { step: "1", title: "Read & Reflect", desc: "Engage with each section's context before completing the exercises." },
            { step: "2", title: "Complete Exercises", desc: "Use the fields to capture your thinking in real time." },
            { step: "3", title: "Build Your Blueprint", desc: "Each section feeds into your final AI Leadership Blueprint Canvas." },
            { step: "4", title: "Take Action", desc: "Translate insights into a concrete Leadership Action Plan." },
          ].map((s) => (
            <div key={s.step} className="border border-border p-4">
              <span className="font-serif text-xl font-bold text-primary">{s.step}</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mt-1">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  // ── Section 1: Leadership in the Age of AI ──
  {
    id: "s1",
    number: "Section 1",
    title: "Leadership in the Age of AI",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Artificial intelligence is transforming industries, organisations, and leadership responsibilities. Before exploring specific frameworks, reflect on where you and your organisation stand today.
        </p>
        <h3 className="font-serif text-lg font-bold text-foreground mt-8 mb-4">Reflection Exercise</h3>
        <ol className="list-none space-y-2 mb-6">
          {[
            "How is AI currently used within your organisation?",
            "Which decisions in your organisation rely heavily on data?",
            "Which leadership responsibilities cannot be automated?",
            "How might AI change leadership roles in the next five years?",
          ].map((q, i) => (
            <li key={i} className="pl-10 relative py-2 border-b border-border text-sm">
              <span className="absolute left-0 top-2 font-serif text-base font-bold text-primary">{i + 1}</span>
              {q}
            </li>
          ))}
        </ol>
        <FieldGroup label="Your Reflections" value={g(data, "s1", "reflections")} onChange={(v) => onChange("s1", "reflections", v)} placeholder="Write your reflections here..." rows={6} />
      </>
    ),
  },
  // ── Section 2: AI Opportunity Mapping ──
  {
    id: "s2",
    number: "Section 2",
    title: "AI Opportunity Mapping",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          AI creates opportunities to improve efficiency, decision-making, and innovation. Identify potential AI opportunities across your organisation's key business areas.
        </p>
        <WorkbookTable
          headers={["Business Area", "Current Challenge", "AI Opportunity", "Potential Value"]}
          rows={[
            { label: "Customer Service", fields: ["cs_challenge", "cs_opportunity", "cs_value"] },
            { label: "Supply Chain", fields: ["sc_challenge", "sc_opportunity", "sc_value"] },
            { label: "HR & Talent", fields: ["hr_challenge", "hr_opportunity", "hr_value"] },
            { label: "Finance", fields: ["fi_challenge", "fi_opportunity", "fi_value"] },
            { label: "Operations", fields: ["op_challenge", "op_opportunity", "op_value"] },
          ]}
          sectionId="s2"
          data={data}
          onChange={onChange}
        />
      </>
    ),
  },
  // ── Section 3: AI Strategy Canvas ──
  {
    id: "s3",
    number: "Section 3",
    title: "AI Strategy Canvas",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Use this canvas to align AI initiatives with your organisation's strategic objectives.
        </p>
        <WorkbookTable
          headers={["Strategic Objective", "AI Initiative", "Expected Impact", "Timeline"]}
          rows={[
            { label: "Improve Customer Experience", fields: ["cx_initiative", "cx_impact", "cx_timeline"] },
            { label: "Reduce Operational Costs", fields: ["cost_initiative", "cost_impact", "cost_timeline"] },
            { label: "Increase Decision Speed", fields: ["speed_initiative", "speed_impact", "speed_timeline"] },
            { label: "Strengthen Governance", fields: ["gov_initiative", "gov_impact", "gov_timeline"] },
          ]}
          sectionId="s3"
          data={data}
          onChange={onChange}
        />
      </>
    ),
  },
  // ── Section 4: AI Leadership Maturity Assessment ──
  {
    id: "s4",
    number: "Section 4",
    title: "AI Leadership Maturity Assessment",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Organisations typically progress through five stages of AI maturity. Understanding where your organisation sits today is the first step toward a deliberate transformation strategy.
        </p>
        <MaturitySelector
          selected={g(data, "s4", "maturity_level")}
          onSelect={(v) => onChange("s4", "maturity_level", v)}
        />
        <FieldGroup label="Why? What evidence supports your assessment?" value={g(data, "s4", "evidence")} onChange={(v) => onChange("s4", "evidence", v)} placeholder="Explain your reasoning..." />
        <FieldGroup label="What would need to change to reach the next level?" value={g(data, "s4", "next_level")} onChange={(v) => onChange("s4", "next_level", v)} placeholder="Identify the barriers and enablers..." />
      </>
    ),
  },
  // ── Section 5: AI-Augmented Decision Making ──
  {
    id: "s5",
    number: "Section 5",
    title: "AI-Augmented Decision Making",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          AI can support decision-making by providing insights, forecasts, and analysis. However, leaders must combine:
        </p>
        <InstructionBox><strong>Data</strong> + <strong>AI Insights</strong> + <strong>Human Judgement</strong></InstructionBox>
        <h3 className="font-serif text-lg font-bold text-foreground mt-8 mb-4">Reflection Questions</h3>
        <FieldGroup label="1. Which decisions could benefit from AI insights?" value={g(data, "s5", "q1")} onChange={(v) => onChange("s5", "q1", v)} placeholder="Consider strategic, operational, and tactical decisions..." />
        <FieldGroup label="2. Where should human judgement remain central?" value={g(data, "s5", "q2")} onChange={(v) => onChange("s5", "q2", v)} placeholder="Identify decisions that require empathy, ethics, or contextual nuance..." />
        <FieldGroup label="3. How can leaders prevent over-reliance on AI?" value={g(data, "s5", "q3")} onChange={(v) => onChange("s5", "q3", v)} placeholder="Consider governance, training, and cultural safeguards..." />
        <h3 className="font-serif text-lg font-bold text-foreground mt-8 mb-4">Decision Classification Matrix</h3>
        <DecisionMatrix data={data} sectionId="s5" onChange={onChange} />
      </>
    ),
  },
  // ── Section 6: Executive AI Prompt Library ──
  {
    id: "s6",
    number: "Section 6",
    title: "Executive AI Prompt Library",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Generative AI tools can assist leaders in exploring strategic questions. The quality of AI output is directly proportional to the quality of the prompt.
        </p>
        <PromptExample category="Market Analysis" text="Analyse emerging opportunities in the renewable energy sector and identify three strategic implications for a mid-cap industrial company." />
        <PromptExample category="Risk Analysis" text="Identify the top five strategic risks facing the global banking industry over the next 24 months, with probability and impact assessment." />
        <PromptExample category="Innovation" text="Suggest three AI-enabled service innovations for healthcare providers that could be piloted within six months." />
        <h3 className="font-serif text-lg font-bold text-foreground mt-8 mb-4">Exercise</h3>
        <p className="text-sm text-muted-foreground mb-4">Write three prompts relevant to your organisation and leadership context.</p>
        <FieldGroup label="Prompt 1" value={g(data, "s6", "prompt1")} onChange={(v) => onChange("s6", "prompt1", v)} placeholder="Write a strategic AI prompt relevant to your organisation..." rows={3} />
        <FieldGroup label="Prompt 2" value={g(data, "s6", "prompt2")} onChange={(v) => onChange("s6", "prompt2", v)} placeholder="Write a strategic AI prompt..." rows={3} />
        <FieldGroup label="Prompt 3" value={g(data, "s6", "prompt3")} onChange={(v) => onChange("s6", "prompt3", v)} placeholder="Write a strategic AI prompt..." rows={3} />
      </>
    ),
  },
  // ── Section 7: Cross-Functional AI Leadership ──
  {
    id: "s7",
    number: "Section 7",
    title: "Cross-Functional AI Leadership",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          AI initiatives require collaboration across functions. Successful AI transformation is never a technology project alone — it is a leadership coordination challenge.
        </p>
        <InstructionBox>
          AI initiatives require alignment between: <strong>Technology Teams</strong>, <strong>Business Units</strong>, <strong>Operations</strong>, <strong>Compliance</strong>, and <strong>Senior Leadership</strong>.
        </InstructionBox>
        <h3 className="font-serif text-lg font-bold text-foreground mt-8 mb-4">Stakeholder Mapping Exercise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {["CTO", "Head of Operations", "Chief People Officer", "Compliance Lead"].map((role, i) => (
            <div key={i} className="border border-border p-4">
              <InputField label="Role / Function" value={g(data, "s7", `role_${i}`)} onChange={(v) => onChange("s7", `role_${i}`, v)} placeholder={`e.g. ${role}`} />
              <FieldGroup label="Responsibility in AI Initiative" value={g(data, "s7", `resp_${i}`)} onChange={(v) => onChange("s7", `resp_${i}`, v)} placeholder="Define their role..." rows={3} />
            </div>
          ))}
        </div>
      </>
    ),
  },
  // ── Section 8: AI Transformation Taskforce ──
  {
    id: "s8",
    number: "Section 8",
    title: "AI Transformation Taskforce",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Many organisations create a dedicated AI leadership group to coordinate transformation. Design the composition and mandate of your organisation's AI taskforce.
        </p>
        <WorkbookTable
          headers={["Role", "Suggested Owner", "Key Mandate"]}
          rows={[
            { label: "Executive Sponsor", fields: ["sponsor_owner", "sponsor_mandate"] },
            { label: "AI Strategy Lead", fields: ["strategy_owner", "strategy_mandate"] },
            { label: "Technology Lead", fields: ["tech_owner", "tech_mandate"] },
            { label: "Operations Lead", fields: ["ops_owner", "ops_mandate"] },
            { label: "Risk & Compliance Lead", fields: ["risk_owner", "risk_mandate"] },
            { label: "HR / Talent Lead", fields: ["hr_owner", "hr_mandate"] },
          ]}
          sectionId="s8"
          data={data}
          onChange={onChange}
        />
      </>
    ),
  },
  // ── Section 9: Responsible AI Governance ──
  {
    id: "s9",
    number: "Section 9",
    title: "Responsible AI Governance",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Responsible AI leadership requires strong governance. Without clear principles, AI initiatives risk eroding trust, creating compliance exposure, and producing unintended consequences.
        </p>
        <h3 className="font-serif text-lg font-bold text-foreground mt-6 mb-4">Governance Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <GovernancePillar title="Transparency" question="How will AI decisions be explained?" value={g(data, "s9", "transparency")} onChange={(v) => onChange("s9", "transparency", v)} />
          <GovernancePillar title="Fairness & Bias" question="How will you prevent algorithmic bias?" value={g(data, "s9", "fairness")} onChange={(v) => onChange("s9", "fairness", v)} />
          <GovernancePillar title="Accountability" question="Who is responsible when AI makes an error?" value={g(data, "s9", "accountability")} onChange={(v) => onChange("s9", "accountability", v)} />
          <GovernancePillar title="Data Privacy" question="How will sensitive data be protected?" value={g(data, "s9", "privacy")} onChange={(v) => onChange("s9", "privacy", v)} />
        </div>
        <FieldGroup label="Governance principles your organisation should adopt" value={g(data, "s9", "principles")} onChange={(v) => onChange("s9", "principles", v)} placeholder="Define your organisation's AI governance principles..." rows={5} />
      </>
    ),
  },
  // ── Section 10: AI Leadership Blueprint Canvas ──
  {
    id: "s10",
    number: "Section 10",
    title: "AI Leadership Blueprint Canvas",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          This is the centrepiece of your workbook. Synthesise everything you have learned into a single strategic document that can be presented to your board or executive team.
        </p>
        <InstructionBox>This canvas draws from every previous section. Take time to consolidate your insights into clear, actionable statements.</InstructionBox>
        <WorkbookTable
          headers={["Area", "Key Insights & Strategic Direction"]}
          rows={[
            { label: "Organisational Context", fields: ["context"] },
            { label: "AI Opportunities", fields: ["opportunities"] },
            { label: "Leadership Capabilities Required", fields: ["capabilities"] },
            { label: "Governance Considerations", fields: ["governance"] },
            { label: "Transformation Roadmap", fields: ["roadmap"] },
          ]}
          sectionId="s10"
          data={data}
          onChange={onChange}
        />
      </>
    ),
  },
  // ── Section 11: AI Transformation Roadmap ──
  {
    id: "s11",
    number: "Section 11",
    title: "AI Transformation Roadmap",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Define the phases of your organisation's AI transformation. Each phase builds on the previous, creating a structured pathway from awareness to enterprise-wide integration.
        </p>
        {[
          { num: "1", title: "Discover", desc: "Identify opportunities and evaluate feasibility." },
          { num: "2", title: "Design", desc: "Develop strategy and define use cases." },
          { num: "3", title: "Deploy", desc: "Launch pilot initiatives and validate assumptions." },
          { num: "4", title: "Develop", desc: "Build organisational capability and refine processes." },
          { num: "5", title: "Scale", desc: "Integrate AI across the enterprise." },
        ].map((p) => (
          <PhaseBlock key={p.num} num={p.num} title={p.title} desc={p.desc} value={g(data, "s11", `phase_${p.num}`)} onChange={(v) => onChange("s11", `phase_${p.num}`, v)} />
        ))}
      </>
    ),
  },
  // ── Section 12: Leadership Action Plan ──
  {
    id: "s12",
    number: "Section 12",
    title: "Leadership Action Plan",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Define concrete leadership actions you will take following this programme. Be specific about ownership, timelines, and expected outcomes.
        </p>
        <WorkbookTable
          headers={["Action", "Owner", "Timeline", "Expected Outcome"]}
          rows={Array.from({ length: 5 }, (_, i) => ({
            fields: [`action_${i}`, `owner_${i}`, `timeline_${i}`, `outcome_${i}`],
          }))}
          sectionId="s12"
          data={data}
          onChange={onChange}
        />
      </>
    ),
  },
  // ── Section 13: Final Reflection ──
  {
    id: "s13",
    number: "Section 13",
    title: "Final Reflection",
    render: (data, onChange) => (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          After completing the programme, take time to consolidate your thinking. These four questions are designed to crystallise your most important commitments.
        </p>
        <FieldGroup label="1. What is the most important AI opportunity for your organisation?" value={g(data, "s13", "q1")} onChange={(v) => onChange("s13", "q1", v)} rows={4} />
        <FieldGroup label="2. What leadership capability must you strengthen most?" value={g(data, "s13", "q2")} onChange={(v) => onChange("s13", "q2", v)} rows={4} />
        <FieldGroup label="3. What will be your first leadership action after this programme?" value={g(data, "s13", "q3")} onChange={(v) => onChange("s13", "q3", v)} rows={4} />
        <FieldGroup label="4. How will you communicate AI transformation to your team?" value={g(data, "s13", "q4")} onChange={(v) => onChange("s13", "q4", v)} rows={4} />
        <hr className="border-border my-10" />
        <div className="text-center py-10">
          <p className="font-serif text-xl italic text-foreground max-w-md mx-auto leading-relaxed">
            "Artificial intelligence will transform organisations.<br />Leadership will determine which ones succeed."
          </p>
          <p className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground mt-4">
            Augmented Leadership™ Framework · Bright Leadership Consulting
          </p>
        </div>
      </>
    ),
  },
];

// ══════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════
const AIWorkbook = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState<WorkbookData>({});
  const [responseId, setResponseId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS[currentSection];

  // ── Auto-save debounce ──
  const saveToDb = useCallback(async (workbookData: WorkbookData, sectionIdx: number, rid: string | null) => {
    const email = workbookData.intro?.email?.trim();
    if (!email) return;

    try {
      emailSchema.parse(email);
    } catch {
      return; // Don't save if email is invalid
    }

    setSaving(true);
    try {
      if (rid) {
        await supabase.from("workbook_responses").update({
          section_data: workbookData as any,
          current_section: sectionIdx + 1,
          name: workbookData.intro?.name?.trim() || null,
          email,
        }).eq("id", rid);
      } else {
        // Check for existing response by email
        const { data: existing } = await supabase
          .from("workbook_responses")
          .select("id, section_data, current_section")
          .eq("email", email)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (existing && existing.length > 0) {
          setResponseId(existing[0].id);
          await supabase.from("workbook_responses").update({
            section_data: workbookData as any,
            current_section: sectionIdx + 1,
            name: workbookData.intro?.name?.trim() || null,
          }).eq("id", existing[0].id);
        } else {
          const { data: inserted } = await supabase
            .from("workbook_responses")
            .insert({
              email,
              name: workbookData.intro?.name?.trim() || null,
              section_data: workbookData as any,
              current_section: sectionIdx + 1,
            })
            .select("id")
            .single();
          if (inserted) setResponseId(inserted.id);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }, []);

  const debouncedSave = useCallback((workbookData: WorkbookData, sectionIdx: number, rid: string | null) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveToDb(workbookData, sectionIdx, rid), 2000);
  }, [saveToDb]);

  // ── Field change handler ──
  const handleChange: FieldHandler = useCallback((sectionId, field, value) => {
    setData((prev) => {
      const updated = {
        ...prev,
        [sectionId]: { ...prev[sectionId], [field]: value },
      };
      if (started) debouncedSave(updated, currentSection, responseId);
      return updated;
    });
  }, [started, debouncedSave, currentSection, responseId]);

  // ── Navigation ──
  const goNext = useCallback(() => {
    if (currentSection === 0) {
      // Validate email before proceeding
      const email = data.intro?.email?.trim();
      if (!email) {
        toast.error("Please enter your email address to continue.");
        return;
      }
      try {
        emailSchema.parse(email);
      } catch {
        toast.error("Please enter a valid email address.");
        return;
      }
      setStarted(true);
      // Immediate save on start
      saveToDb(data, 1, responseId);
    }

    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection((p) => p + 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSection, data, responseId, saveToDb]);

  const goPrev = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((p) => p - 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSection]);

  const handleComplete = useCallback(async () => {
    // Save final state
    if (responseId) {
      await supabase.from("workbook_responses").update({
        section_data: data as any,
        current_section: SECTIONS.length,
        completed: true,
      }).eq("id", responseId);
    }
    setCompleted(true);
    toast.success("Workbook completed! Your responses have been saved.");
  }, [responseId, data]);

  // ── Load existing response on email blur ──
  const loadExisting = useCallback(async () => {
    const email = data.intro?.email?.trim();
    if (!email) return;
    try {
      emailSchema.parse(email);
    } catch {
      return;
    }

    const { data: existing } = await supabase
      .from("workbook_responses")
      .select("id, section_data, current_section")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (existing && existing.length > 0) {
      const record = existing[0];
      setResponseId(record.id);
      if (record.section_data && typeof record.section_data === "object") {
        setData(record.section_data as WorkbookData);
        toast.info("Welcome back! Your previous progress has been restored.");
      }
    }
  }, [data.intro?.email]);

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md space-y-6"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-foreground">Programme Complete</h2>
          <p className="text-sm text-muted-foreground">
            Your AI Leadership Workbook has been saved. You can return at any time using your email address to review or update your responses.
          </p>
          <p className="font-serif italic text-foreground mt-6">
            "Artificial intelligence will transform organisations.<br />Leadership will determine which ones succeed."
          </p>
          <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
            Augmented Leadership™ Framework
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {section.number} of {SECTIONS.length - 1} · <span className="font-medium text-foreground">{section.title}</span>
          </p>
          <div className="flex items-center gap-2">
            {saving && <span className="text-[10px] text-muted-foreground animate-pulse">Saving...</span>}
            {started && !saving && <span className="text-[10px] text-primary flex items-center gap-1"><Save className="w-3 h-3" /> Saved</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <SectionHeader number={section.number} title={section.title} />

            {/* For intro section, add email blur handler */}
            {currentSection === 0 ? (
              <div onBlur={(e) => {
                if ((e.target as HTMLInputElement)?.type === "text" && data.intro?.email) {
                  loadExisting();
                }
              }}>
                {section.render(data, handleChange)}
              </div>
            ) : (
              section.render(data, handleChange)
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentSection === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {currentSection < SECTIONS.length - 1 ? (
            <Button onClick={goNext} className="gap-2">
              {currentSection === 0 ? "Begin Workbook" : "Next Section"} <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2 bg-[hsl(var(--amber-500))] text-foreground hover:bg-[hsl(var(--amber-600))]">
              <CheckCircle2 className="w-4 h-4" /> Complete Workbook
            </Button>
          )}
        </div>
      </div>

      {/* Branding footer */}
      <div className="text-center py-6 border-t border-border">
        <p className="text-[10px] text-muted-foreground tracking-wider">
          © Bright Leadership Consulting · CPD Accredited Programme · Confidential
        </p>
      </div>
    </div>
  );
};

export default AIWorkbook;
