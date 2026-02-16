// Leadership Assessment Questions - Mixed Format (Self-Rating + Scenario-Based)
// 20 items per assessment: 10 self-rating (Likert 1-5) + 10 scenario-based (weighted 1-4)

export interface SelfRatingQuestion {
  type: 'self-rating';
  id: string;
  text: string;
  competency: string;
  maxScore: 5;
}

export interface ScenarioQuestion {
  type: 'scenario';
  id: string;
  scenario: string;
  competency: string;
  options: { label: string; score: number; feedback: string }[];
  maxScore: 4;
}

export type AssessmentQuestion = SelfRatingQuestion | ScenarioQuestion;

export const COMPETENCIES = [
  'Strategic Thinking',
  'Emotional Intelligence',
  'Change Leadership',
  'Team Empowerment',
  'Communication',
  'Decision Making',
  'Innovation',
  'Executive Presence',
] as const;

export type Competency = typeof COMPETENCIES[number];

export const preAssessmentQuestions: AssessmentQuestion[] = [
  // Self-Rating Questions (1-5 Likert Scale)
  {
    type: 'self-rating',
    id: 'pre-sr-1',
    text: 'I consistently align my team\'s daily activities with the organisation\'s long-term strategic objectives.',
    competency: 'Strategic Thinking',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-2',
    text: 'I am able to recognise and manage my own emotional responses during high-pressure situations.',
    competency: 'Emotional Intelligence',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-3',
    text: 'I proactively identify and address resistance when leading organisational change initiatives.',
    competency: 'Change Leadership',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-4',
    text: 'I delegate strategically, empowering my team members with both authority and accountability.',
    competency: 'Team Empowerment',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-5',
    text: 'I adapt my communication style effectively when engaging with different stakeholder groups.',
    competency: 'Communication',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-6',
    text: 'I make complex decisions confidently, even when working with incomplete information.',
    competency: 'Decision Making',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-7',
    text: 'I actively create space for experimentation and innovative thinking within my team.',
    competency: 'Innovation',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-8',
    text: 'I project confidence and credibility when presenting to senior leadership or board-level audiences.',
    competency: 'Executive Presence',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-9',
    text: 'I regularly use data and evidence to inform my strategic planning and forecasting.',
    competency: 'Strategic Thinking',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'pre-sr-10',
    text: 'I actively seek feedback from peers and direct reports to improve my leadership effectiveness.',
    competency: 'Emotional Intelligence',
    maxScore: 5,
  },

  // Scenario-Based Questions (1-4 weighted)
  {
    type: 'scenario',
    id: 'pre-sc-1',
    scenario: 'Your organisation is entering a new market segment. You have limited data but the board expects a recommendation within 48 hours. How do you approach this?',
    competency: 'Strategic Thinking',
    options: [
      { label: 'Request more time to gather comprehensive data before making any recommendation', score: 1, feedback: 'While thorough, executive leaders must balance analysis with decisiveness under time pressure.' },
      { label: 'Rely on your industry intuition and present a confident recommendation immediately', score: 2, feedback: 'Intuition matters, but the strongest leaders combine experience with structured rapid analysis.' },
      { label: 'Conduct rapid analysis using available data, identify key assumptions, and present a recommendation with clear risk mitigation strategies', score: 4, feedback: 'Excellent. This balances speed, rigour, and transparency about uncertainties.' },
      { label: 'Delegate the analysis entirely to your strategy team and review their findings', score: 2, feedback: 'Delegation is important, but this situation calls for your direct strategic involvement.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-2',
    scenario: 'During a critical leadership meeting, a respected peer publicly challenges your proposed restructuring plan, calling it "short-sighted." How do you respond?',
    competency: 'Emotional Intelligence',
    options: [
      { label: 'Defend your plan firmly, pointing out the flaws in their perspective', score: 1, feedback: 'Defensiveness can escalate conflict and undermine collaborative problem-solving.' },
      { label: 'Acknowledge their concern, ask clarifying questions, and suggest incorporating their perspective into a revised approach', score: 4, feedback: 'Outstanding. This demonstrates emotional maturity, active listening, and collaborative leadership.' },
      { label: 'Remain silent and move to the next agenda item to avoid conflict', score: 1, feedback: 'Avoidance can signal a lack of conviction and miss an opportunity for constructive dialogue.' },
      { label: 'Thank them for the feedback and offer to discuss it privately after the meeting', score: 3, feedback: 'Good composure, though addressing it openly can build trust with the wider group.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-3',
    scenario: 'You are leading a major digital transformation. Six months in, adoption rates are at 35% and key stakeholders are losing confidence. What is your next move?',
    competency: 'Change Leadership',
    options: [
      { label: 'Push harder on compliance, setting mandatory adoption deadlines with consequences', score: 1, feedback: 'Forced compliance typically increases resistance and rarely achieves sustainable change.' },
      { label: 'Identify the top resistors and engage them as change champions by addressing their specific concerns and involving them in solution design', score: 4, feedback: 'Converting resistors to champions is a hallmark of masterful change leadership.' },
      { label: 'Scale back the initiative and take a more gradual approach', score: 2, feedback: 'While pragmatic, this risks losing momentum entirely. A targeted intervention is stronger.' },
      { label: 'Launch an internal marketing campaign to improve awareness and excitement', score: 2, feedback: 'Communication helps, but at 35% adoption, the issue is likely deeper than awareness.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-4',
    scenario: 'Your highest-performing direct report asks to lead a cross-functional project that is outside their current expertise. They are passionate but inexperienced in this domain. How do you respond?',
    competency: 'Team Empowerment',
    options: [
      { label: 'Assign them the project with full autonomy - their track record speaks for itself', score: 2, feedback: 'Autonomy without support in unfamiliar territory can set up even strong performers for failure.' },
      { label: 'Decline the request and assign someone with relevant domain expertise instead', score: 1, feedback: 'This misses an opportunity to develop talent and may demotivate a key performer.' },
      { label: 'Approve the assignment, pair them with a domain expert as mentor, and establish structured check-ins to provide support without micromanaging', score: 4, feedback: 'This maximises growth while managing risk - the mark of a leader who develops others strategically.' },
      { label: 'Ask them to shadow the current domain expert for 3 months before deciding', score: 2, feedback: 'Measured but overly cautious. Growth happens through doing, with appropriate support structures.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-5',
    scenario: 'You must communicate a 15% budget reduction to your division while maintaining team morale and productivity. How do you frame this message?',
    competency: 'Communication',
    options: [
      { label: 'Send a detailed email outlining the cuts and the financial rationale behind each one', score: 1, feedback: 'Email lacks the personal touch needed for difficult news. Leaders show up for hard conversations.' },
      { label: 'Hold a team meeting, be transparent about the situation, outline your strategy for maintaining quality, and invite input on implementation', score: 4, feedback: 'Transparency, vision, and participative leadership build trust during challenging times.' },
      { label: 'Minimise the severity and focus only on the positive opportunities that might emerge', score: 1, feedback: 'Sugar-coating erodes trust. People respect honest leadership over false optimism.' },
      { label: 'Meet individually with each team lead to discuss impact and then announce the plan', score: 3, feedback: 'Good stakeholder management, though collective transparency can build broader team resilience.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-6',
    scenario: 'Two equally qualified internal candidates are vying for a critical leadership role. One is a long-tenured loyalist; the other is a recent hire with fresh perspective. The decision is contentious. How do you decide?',
    competency: 'Decision Making',
    options: [
      { label: 'Reward loyalty and promote the long-tenured candidate to maintain cultural stability', score: 2, feedback: 'Loyalty matters, but the best decision aligns with strategic needs, not tenure alone.' },
      { label: 'Choose the recent hire to signal that the organisation values innovation and new thinking', score: 2, feedback: 'Fresh thinking is valuable, but selecting based on signalling rather than fit can backfire.' },
      { label: 'Define the strategic competencies the role demands, assess both candidates against them objectively, and make a transparent decision based on organisational need', score: 4, feedback: 'Excellent. Criteria-based decision-making ensures fairness and strategic alignment.' },
      { label: 'Create two roles to avoid conflict and keep both candidates engaged', score: 1, feedback: 'Avoiding difficult decisions creates structural inefficiency and signals weak leadership.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-7',
    scenario: 'Your industry is being disrupted by AI and automation. Your board wants a 5-year innovation strategy, but your leadership team is divided between aggressive investment and cautious observation. What do you recommend?',
    competency: 'Innovation',
    options: [
      { label: 'Recommend waiting for competitors to move first and then fast-following their approach', score: 1, feedback: 'Fast-following often means falling behind. In disruptive environments, proactive positioning is essential.' },
      { label: 'Propose a balanced approach: invest in strategic pilot programmes, create an innovation lab, and establish clear metrics for scaling successful experiments', score: 4, feedback: 'This combines boldness with prudence - the hallmark of innovation leadership at the executive level.' },
      { label: 'Go all-in with aggressive investment to establish first-mover advantage', score: 2, feedback: 'Bold, but without structured experimentation, this carries significant downside risk.' },
      { label: 'Commission an external consultancy to develop the strategy on your behalf', score: 1, feedback: 'Outsourcing core strategy signals a lack of internal capability and ownership.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-8',
    scenario: 'You are presenting quarterly results to the board. Revenue is down 8%, but your strategic initiatives are showing early positive indicators. The chairman appears sceptical. How do you handle the presentation?',
    competency: 'Executive Presence',
    options: [
      { label: 'Focus entirely on the positive leading indicators and downplay the revenue shortfall', score: 1, feedback: 'Selective presentation erodes board trust. Credibility requires acknowledging reality.' },
      { label: 'Present the full picture with confidence: acknowledge the shortfall, explain root causes, demonstrate the strategic trajectory with data, and outline specific corrective actions with timelines', score: 4, feedback: 'Masterful. This shows command of the situation, transparency, and strategic confidence.' },
      { label: 'Apologise for the results and promise to do better next quarter', score: 1, feedback: 'Apologies without analysis signal a lack of strategic control and executive confidence.' },
      { label: 'Open with the revenue challenge, then quickly pivot to the long-term strategy and growth roadmap', score: 3, feedback: 'Good structure, but adding specific corrective actions would demonstrate stronger executive command.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-9',
    scenario: 'A key client relationship is deteriorating due to service quality issues. Your team blames resource constraints; the client is threatening to leave. How do you intervene?',
    competency: 'Decision Making',
    options: [
      { label: 'Personally visit the client, listen to their concerns, co-create a recovery plan with committed timelines, and reallocate internal resources to deliver on promises', score: 4, feedback: 'Executive-level relationship management combined with decisive resource allocation demonstrates leadership maturity.' },
      { label: 'Ask your account manager to handle it and report back with an update', score: 1, feedback: 'When key relationships are at risk, senior leaders must step in personally.' },
      { label: 'Offer the client a discount to retain the contract while you fix internal issues', score: 2, feedback: 'Discounts treat symptoms, not causes. The client wants quality, not price concessions.' },
      { label: 'Escalate the resource constraints to the COO and request additional headcount', score: 2, feedback: 'Helpful, but doesn\'t address the immediate client relationship crisis.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'pre-sc-10',
    scenario: 'You have been invited to deliver a keynote at a major industry conference. Your topic is "The Future of Leadership in the Age of AI." How do you prepare?',
    competency: 'Executive Presence',
    options: [
      { label: 'Ask your communications team to write the speech and rehearse it the day before', score: 1, feedback: 'Authenticity and personal expertise are essential for executive credibility at this level.' },
      { label: 'Decline the invitation - public speaking at this scale is outside your comfort zone', score: 1, feedback: 'Executive leaders must lean into visibility opportunities. Growth requires discomfort.' },
      { label: 'Research current trends, synthesise your own leadership insights and experiences, craft a narrative that combines data with storytelling, and rehearse with feedback from trusted advisors', score: 4, feedback: 'This shows intellectual rigour, personal authenticity, and strategic preparation - true executive presence.' },
      { label: 'Prepare a data-heavy slide deck covering all major AI leadership trends comprehensively', score: 2, feedback: 'Data matters, but executive keynotes require narrative, vision, and personal connection with the audience.' },
    ],
    maxScore: 4,
  },
];

export const postAssessmentQuestions: AssessmentQuestion[] = [
  // Self-Rating Questions (1-5 Likert Scale)
  {
    type: 'self-rating',
    id: 'post-sr-1',
    text: 'I now consistently use strategic frameworks to connect operational decisions with long-term organisational goals.',
    competency: 'Strategic Thinking',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-2',
    text: 'I can identify emotional triggers in myself and others, using this awareness to navigate complex interpersonal dynamics.',
    competency: 'Emotional Intelligence',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-3',
    text: 'I have developed a systematic approach to leading change that addresses both structural and human dimensions.',
    competency: 'Change Leadership',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-4',
    text: 'I create development-focused delegation plans that stretch my team while providing appropriate support.',
    competency: 'Team Empowerment',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-5',
    text: 'I confidently use storytelling and data to influence stakeholders across all levels of the organisation.',
    competency: 'Communication',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-6',
    text: 'I apply structured decision-making frameworks that account for cognitive biases and stakeholder impact.',
    competency: 'Decision Making',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-7',
    text: 'I have implemented innovation processes within my team that encourage controlled experimentation.',
    competency: 'Innovation',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-8',
    text: 'I present to senior audiences with authority, handling challenging questions with composure and clarity.',
    competency: 'Executive Presence',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-9',
    text: 'I balance short-term performance pressures with long-term strategic investments effectively.',
    competency: 'Strategic Thinking',
    maxScore: 5,
  },
  {
    type: 'self-rating',
    id: 'post-sr-10',
    text: 'I have built a personal leadership development plan informed by self-assessment and stakeholder feedback.',
    competency: 'Emotional Intelligence',
    maxScore: 5,
  },

  // Scenario-Based Questions (1-4 weighted)
  {
    type: 'scenario',
    id: 'post-sc-1',
    scenario: 'Your organisation\'s 3-year strategic plan is being rendered obsolete by a sudden regulatory shift. You have two weeks before the board meeting. How do you lead the response?',
    competency: 'Strategic Thinking',
    options: [
      { label: 'Convene a rapid strategic review with key stakeholders, scenario-plan three response options, stress-test each against the new regulatory landscape, and present recommendations with contingency paths', score: 4, feedback: 'Exceptional strategic agility. This demonstrates the ability to reframe strategy under pressure with structured thinking.' },
      { label: 'Request the board defer the meeting until a full analysis is complete', score: 1, feedback: 'In executive leadership, you lead through uncertainty rather than waiting for perfect clarity.' },
      { label: 'Engage external regulatory experts and present their findings to the board', score: 2, feedback: 'Expert input is useful, but the board expects your strategic vision and recommendation, not outsourced analysis.' },
      { label: 'Present the original plan with modifications noting the regulatory change', score: 2, feedback: 'Incremental adjustments may not be sufficient for a fundamental regulatory shift.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-2',
    scenario: 'Your newly formed leadership team has talented individuals, but deep interpersonal tensions are undermining collaboration. Two senior leaders have openly clashed in front of their teams. How do you address this?',
    competency: 'Emotional Intelligence',
    options: [
      { label: 'Ignore it and hope they work it out - they are both adults and professionals', score: 1, feedback: 'Ignoring interpersonal conflict at senior level erodes team culture and models avoidance to the broader organisation.' },
      { label: 'Have private conversations with each leader, then facilitate a structured mediation where both parties explore underlying needs, agree shared principles, and commit to new working norms', score: 4, feedback: 'This demonstrates emotional intelligence mastery: private diagnosis, structured resolution, and norm-setting for the future.' },
      { label: 'Restructure reporting lines so they no longer need to interact directly', score: 1, feedback: 'Structural workarounds avoid the root cause and create organizational dysfunction.' },
      { label: 'Address the conflict in a team meeting, setting clear expectations for professional behaviour', score: 3, feedback: 'Public accountability has merit, but private exploration of root causes first is more emotionally intelligent.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-3',
    scenario: 'Your organisation is 18 months into a culture transformation. Early momentum was strong, but engagement surveys show "change fatigue" is now a significant concern. How do you sustain momentum?',
    competency: 'Change Leadership',
    options: [
      { label: 'Pause the transformation programme to give people a break from change', score: 1, feedback: 'Pausing often kills momentum entirely. The key is sustaining energy through purposeful recalibration.' },
      { label: 'Celebrate visible wins, recommunicate the purpose and progress so far, introduce "change recovery" practices, and empower middle managers as energy sustainers', score: 4, feedback: 'Brilliant. This addresses fatigue holistically while maintaining forward momentum through distributed leadership.' },
      { label: 'Accelerate the remaining changes to get through them faster', score: 1, feedback: 'Acceleration during fatigue typically deepens resistance and risks burnout across the organisation.' },
      { label: 'Bring in an external change management consultancy to inject fresh energy', score: 2, feedback: 'External help can assist, but sustainable energy must come from internal leadership and purpose reconnection.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-4',
    scenario: 'A talented emerging leader in your division has been passed over for promotion twice. They are visibly disengaged and you suspect they are exploring external opportunities. How do you re-engage them?',
    competency: 'Team Empowerment',
    options: [
      { label: 'Fast-track their promotion in the next cycle to prevent losing them', score: 2, feedback: 'Reactive promotions can undermine meritocracy. Strategic development and transparency are more empowering.' },
      { label: 'Have an honest conversation about their career aspirations, co-create a tailored development plan with stretch assignments and sponsorship visibility, and commit to regular progress reviews', score: 4, feedback: 'This shows genuine investment in their growth while being transparent about the path forward - empowering leadership at its best.' },
      { label: 'Accept that some talent loss is inevitable and begin succession planning', score: 1, feedback: 'Accepting avoidable talent loss without intervention is a failure of leadership stewardship.' },
      { label: 'Offer a significant salary increase and enhanced benefits package', score: 1, feedback: 'Compensation alone rarely addresses disengagement rooted in career progression and recognition needs.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-5',
    scenario: 'You need to align three geographically dispersed teams behind a unified strategy. Each team has a strong local identity and historic autonomy. How do you build alignment without crushing local ownership?',
    competency: 'Communication',
    options: [
      { label: 'Impose the unified strategy from the top and expect compliance', score: 1, feedback: 'Top-down imposition destroys the local ownership that makes distributed teams effective.' },
      { label: 'Create a collaborative strategy workshop where each team contributes their local insights, co-creates shared goals, and retains autonomy over local execution within the strategic framework', score: 4, feedback: 'Masterful communication leadership. This honours local expertise while building genuine shared commitment.' },
      { label: 'Appoint one team leader to coordinate the others and communicate the strategy', score: 2, feedback: 'This creates hierarchy among peers and may breed resentment rather than genuine alignment.' },
      { label: 'Send a detailed strategy document and schedule follow-up calls to answer questions', score: 1, feedback: 'One-way communication rarely builds alignment. Strategic ownership requires participative engagement.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-6',
    scenario: 'You discover that a strategic initiative you championed is underperforming significantly. The data suggests the original assumptions were flawed. The board expects an update. How do you proceed?',
    competency: 'Decision Making',
    options: [
      { label: 'Continue the initiative with minor tweaks, hoping performance will improve in the next quarter', score: 1, feedback: 'Hope is not a strategy. Executive leaders confront underperformance with evidence and decisive action.' },
      { label: 'Present the data transparently, own the flawed assumptions, propose a pivot strategy based on what you have learned, and outline clear decision criteria for continuing or terminating', score: 4, feedback: 'This demonstrates intellectual honesty, learning agility, and strategic confidence - the highest level of executive decision-making.' },
      { label: 'Quietly wind down the initiative before the board meeting to minimise visibility of the failure', score: 1, feedback: 'Concealment destroys trust. Executive credibility is built through transparency, not damage control.' },
      { label: 'Blame external factors and market conditions for the underperformance', score: 1, feedback: 'Externalising blame signals a lack of accountability that boards find deeply concerning.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-7',
    scenario: 'Your competitors are launching AI-powered products while your organisation still relies on legacy systems. Your CTO says a full platform migration will take 3 years and cost significantly. What is your strategic recommendation?',
    competency: 'Innovation',
    options: [
      { label: 'Commit to the full 3-year migration - it\'s the only way to stay competitive', score: 2, feedback: 'Long-term investment matters, but waiting 3 years in a fast-moving market is risky without parallel quick wins.' },
      { label: 'Design a dual-track strategy: launch targeted AI pilots using cloud-based solutions for immediate competitive response, while simultaneously planning the phased platform modernisation for long-term capability', score: 4, feedback: 'This balances short-term competitive urgency with long-term strategic investment - sophisticated innovation leadership.' },
      { label: 'Acquire a tech startup to bolt on AI capability quickly', score: 2, feedback: 'Acquisitions can accelerate capability, but integration challenges often undermine the speed advantage.' },
      { label: 'Focus on other differentiators - AI may be overhyped and the market may not reward early movers', score: 1, feedback: 'Dismissing transformative technology as hype is a dangerous strategic posture for any executive.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-8',
    scenario: 'You are being considered for a C-suite role. During the final interview, the board chair asks: "What is the most significant leadership failure you have experienced, and what did you learn?" How do you respond?',
    competency: 'Executive Presence',
    options: [
      { label: 'Describe a minor setback to appear competent while avoiding any real vulnerability', score: 1, feedback: 'Playing it safe signals a lack of self-awareness and authenticity - qualities boards value highly at C-suite level.' },
      { label: 'Share a genuine leadership failure with candour, articulate the specific lessons learned, demonstrate how it shaped your leadership philosophy, and connect it to how you would lead in this new role', score: 4, feedback: 'Exceptional executive presence. Vulnerability combined with insight and forward-looking application demonstrates the highest level of leadership maturity.' },
      { label: 'Deflect by saying you prefer to focus on successes and forward-looking strategy', score: 1, feedback: 'Avoidance suggests a lack of reflective practice that is essential for executive effectiveness.' },
      { label: 'Describe a team failure, positioning yourself as the leader who fixed the problem', score: 2, feedback: 'This subtly avoids personal accountability. The best leaders own their failures, not just their rescues.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-9',
    scenario: 'Your organisation faces a reputational crisis following a product safety issue. Media coverage is intensifying, and stakeholders are demanding answers. How do you lead the response?',
    competency: 'Communication',
    options: [
      { label: 'Issue a carefully worded legal statement and avoid media engagement until the investigation is complete', score: 1, feedback: 'Legal caution is important, but silence in a crisis fuels speculation and erodes stakeholder trust.' },
      { label: 'Personally lead a transparent response: acknowledge the issue publicly, outline immediate safety actions, commit to a thorough investigation with timeline, and establish regular stakeholder updates', score: 4, feedback: 'This demonstrates crisis communication mastery: personal accountability, transparency, and structured stakeholder management.' },
      { label: 'Delegate the crisis response to your PR and legal teams while you focus on operations', score: 1, feedback: 'In a major crisis, stakeholders expect to see the leader. Delegation signals disengagement.' },
      { label: 'Hold a press conference emphasising the company\'s strong safety record and this incident being an anomaly', score: 2, feedback: 'Contextualisation helps, but leading with defensiveness rather than accountability can worsen the crisis.' },
    ],
    maxScore: 4,
  },
  {
    type: 'scenario',
    id: 'post-sc-10',
    scenario: 'After completing this programme, you are designing your personal leadership development plan for the next 12 months. What approach do you take?',
    competency: 'Executive Presence',
    options: [
      { label: 'Focus exclusively on areas where you scored lowest in this assessment', score: 2, feedback: 'Addressing weaknesses matters, but a balanced plan also leverages and deepens signature strengths.' },
      { label: 'Design a comprehensive plan that builds on your strengths, targets 2-3 development areas, incorporates peer coaching and executive mentoring, includes real-world application goals, and schedules quarterly self-assessments', score: 4, feedback: 'This reflects the highest level of leadership self-awareness and commitment to continuous executive development.' },
      { label: 'Continue with your current approach - the programme has already given you enough tools', score: 1, feedback: 'Leadership development is a lifelong journey. Complacency is the enemy of executive growth.' },
      { label: 'Hire an executive coach to guide your development entirely', score: 2, feedback: 'Coaching is valuable, but the best development plans are self-directed with coaching as one component.' },
    ],
    maxScore: 4,
  },
];

// Calculate max possible scores
export const PRE_MAX_SCORE = preAssessmentQuestions.reduce((acc, q) => acc + q.maxScore, 0);
export const POST_MAX_SCORE = postAssessmentQuestions.reduce((acc, q) => acc + q.maxScore, 0);

export const getCompetencyScores = (
  questions: AssessmentQuestion[],
  answers: Record<string, number>
): Record<string, { score: number; maxScore: number; percentage: number }> => {
  const competencyMap: Record<string, { score: number; maxScore: number }> = {};

  questions.forEach((q) => {
    if (!competencyMap[q.competency]) {
      competencyMap[q.competency] = { score: 0, maxScore: 0 };
    }
    competencyMap[q.competency].maxScore += q.maxScore;
    competencyMap[q.competency].score += answers[q.id] || 0;
  });

  const result: Record<string, { score: number; maxScore: number; percentage: number }> = {};
  Object.entries(competencyMap).forEach(([key, val]) => {
    result[key] = {
      ...val,
      percentage: Math.round((val.score / val.maxScore) * 100),
    };
  });
  return result;
};

export const getOverallLevel = (percentage: number): { level: string; description: string; color: string } => {
  if (percentage >= 85) return { level: 'Master Executive Leader', description: 'You demonstrate exceptional leadership capability across all competencies. Focus on mentoring others and tackling systemic challenges.', color: '#0f4c3a' };
  if (percentage >= 70) return { level: 'Advanced Leader', description: 'You show strong leadership in most areas. Targeted development in specific competencies will elevate your executive impact.', color: '#1e6b4f' };
  if (percentage >= 50) return { level: 'Developing Leader', description: 'You have a solid foundation with clear areas for growth. This programme will accelerate your development in key competencies.', color: '#c9a227' };
  return { level: 'Emerging Leader', description: 'You are at the beginning of your executive leadership journey. This programme will provide transformative frameworks and skills.', color: '#d97706' };
};
