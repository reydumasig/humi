import type {
  FamilyKey,
  InterestData,
  ParsedResume,
  Recommendation,
  Report,
  ResumeInput,
  SignupData,
  SkillCard,
  ToolCard,
} from "./types";

/**
 * Mock career intelligence engine.
 * Replace `parseResume` and `buildReport` with real AI API calls later —
 * the shapes (ParsedResume / Report) are the contract the UI depends on.
 */

interface Family {
  key: FamilyKey;
  label: string;
  keywords: string[];
  futureRole: string;
  explanation: string;
  recommendations: Recommendation[];
  automate: string[];
  assist: string[];
  human: string[];
  tools: ToolCard[];
  bullets: string[];
  defaultSkills: string[];
}

const t = (name: string, helpsWith: string, why: string): ToolCard => ({ name, helpsWith, why });

const GENERAL_TOOLS: ToolCard[] = [
  t("ChatGPT", "Drafting, summarizing, research and interview prep", "The fastest way to build everyday AI fluency."),
  t("Claude", "Long document analysis and careful writing", "Great for reviewing reports, policies and resumes."),
  t("Gemini", "Research with Google Workspace context", "Useful when your work lives in Docs, Sheets and Gmail."),
  t("Canva AI", "Presentations, visuals and simple design", "Helps you communicate ideas quickly and professionally."),
  t("Notion AI", "Notes, documentation and knowledge bases", "Turns messy notes into structured, shareable work."),
  t("Microsoft Copilot", "AI inside Excel, Word, Outlook and Teams", "Most workplaces already run on these tools."),
];

export const FAMILIES: Family[] = [
  {
    key: "support",
    label: "Customer Support",
    keywords: ["support", "customer service", "helpdesk agent", "call center", "csr", "ticket", "client service", "bpo"],
    futureRole: "AI-Powered Customer Experience Specialist",
    explanation:
      "Your role can evolve from manually responding to customer issues to managing AI-assisted support workflows, improving response quality, analyzing customer trends, and handling complex human conversations that require empathy and judgment.",
    recommendations: [
      {
        title: "AI-Powered Customer Experience Specialist",
        fit: "Your communication and issue-resolution experience maps directly to modern CX roles.",
        aiChange: "AI drafts first responses and summarizes tickets while you own quality, empathy and escalation.",
        nextSkills: ["Prompt writing", "Ticket analytics", "Knowledge base design"],
      },
      {
        title: "Customer Experience Associate",
        fit: "You already handle customers end-to-end across channels.",
        aiChange: "Sentiment analysis and smart routing become part of your daily toolkit.",
        nextSkills: ["CSAT analysis", "AI response review", "Journey mapping"],
      },
      {
        title: "Support Operations Coordinator",
        fit: "Your coordination and reporting habits fit an operations track.",
        aiChange: "Reporting is automated; you focus on process design and improvement.",
        nextSkills: ["Workflow automation", "Dashboard reading", "SLA management"],
      },
    ],
    automate: ["First response drafts", "Ticket classification", "FAQ answers", "Call summaries", "Follow-up reminders"],
    assist: [
      "Understanding customer sentiment",
      "Suggesting better responses",
      "Finding knowledge base answers",
      "Escalation recommendations",
      "Weekly support trend analysis",
    ],
    human: ["Empathy", "Judgment", "Conflict handling", "Trust-building", "Complex problem solving"],
    tools: [
      t("Zendesk AI", "Ticket triage and suggested replies", "The most common AI-enabled support suite."),
      t("Freshdesk", "Automated workflows and SLAs", "Shows you how support automation is set up."),
      t("Intercom", "AI chat and self-service deflection", "Teaches you conversational support design."),
      t("Knowledge base tools", "Writing reusable answers", "Great content makes AI answers accurate."),
    ],
    bullets: [
      "Used AI tools to draft faster and more consistent customer responses.",
      "Created a simple workflow to track, summarize, and escalate recurring customer issues.",
      "Analyzed support trends to improve service quality and response time.",
    ],
    defaultSkills: ["Communication", "Customer handling", "Ticket management", "Issue resolution", "Reporting", "CRM"],
  },
  {
    key: "sales",
    label: "Sales / Business Development",
    keywords: ["sales", "business development", "account executive", "lead generation", "bdr", "sdr", "revenue", "client acquisition"],
    futureRole: "AI-Powered Revenue Pipeline Builder",
    explanation:
      "Your role can evolve from manual prospecting and CRM updates to running an AI-assisted pipeline: research, personalization and follow-up are accelerated so you spend more time on relationships, negotiation and closing.",
    recommendations: [
      {
        title: "AI-Powered Revenue Pipeline Builder",
        fit: "Your prospecting and client conversations are the core of this role.",
        aiChange: "AI handles research and first drafts; you own qualification and closing.",
        nextSkills: ["AI research prompting", "Pipeline analytics", "Sequence automation"],
      },
      {
        title: "Sales Operations Coordinator",
        fit: "Your CRM discipline and follow-up habits fit a sales ops track.",
        aiChange: "Reporting and data hygiene get automated; you design the process.",
        nextSkills: ["CRM automation", "Forecast reporting", "Data hygiene"],
      },
      {
        title: "Account Management Associate",
        fit: "You build trust with existing customers.",
        aiChange: "AI surfaces churn and upsell signals before you meet the client.",
        nextSkills: ["Account planning", "Insight storytelling", "QBR preparation"],
      },
    ],
    automate: ["Lead research", "CRM updates", "First-draft outreach", "Meeting summaries", "Follow-up reminders"],
    assist: [
      "Account prioritization",
      "Personalized messaging",
      "Objection handling preparation",
      "Proposal drafting",
      "Pipeline analysis",
    ],
    human: ["Relationship building", "Negotiation", "Consultative selling", "Business judgment", "Closing complex deals"],
    tools: [
      t("LinkedIn Sales Navigator", "Finding and tracking the right buyers", "Prospecting quality decides pipeline quality."),
      t("Apollo", "Contact data and outreach sequences", "Teaches you modern outbound motion."),
      t("HubSpot", "CRM, sequences and reporting", "Widely used and easy to learn."),
      t("Clay", "AI-enriched lead research", "Shows what AI-native prospecting looks like."),
      t("Zapier / Make", "Connecting CRM to everything else", "Removes manual admin from your week."),
    ],
    bullets: [
      "Used AI-assisted research to identify and prioritize high-potential leads.",
      "Created personalized outreach messages using AI tools and improved prospect engagement.",
      "Built a simple CRM follow-up workflow to improve pipeline visibility.",
    ],
    defaultSkills: ["Lead generation", "Client calls", "Follow-ups", "CRM updates", "Negotiation", "Communication"],
  },
  {
    key: "marketing",
    label: "Marketing",
    keywords: ["marketing", "brand", "campaign", "social media", "content", "seo", "advertising", "communications"],
    futureRole: "AI Campaign & Growth Associate",
    explanation:
      "Your role can evolve from producing individual assets to orchestrating AI-assisted campaigns — faster content variations, sharper audience insight, and more time for strategy and creative direction.",
    recommendations: [
      {
        title: "AI Campaign & Growth Associate",
        fit: "Your content and campaign experience transfers directly.",
        aiChange: "AI generates variations; you own positioning, taste and measurement.",
        nextSkills: ["Prompt writing", "Campaign analytics", "Creative direction"],
      },
      {
        title: "Content Systems Specialist",
        fit: "You already produce content consistently.",
        aiChange: "Repurposing and localization become near-instant.",
        nextSkills: ["Content ops", "SEO basics", "AI editing"],
      },
      {
        title: "Marketing Operations Associate",
        fit: "Your coordination skills fit the martech stack.",
        aiChange: "Automation replaces manual list and reporting work.",
        nextSkills: ["Marketing automation", "Attribution basics", "Dashboarding"],
      },
    ],
    automate: ["First-draft copy", "Social post variations", "Campaign reporting", "Audience list building", "Basic image edits"],
    assist: ["Audience research", "Message testing", "SEO planning", "Creative concepting", "Performance analysis"],
    human: ["Brand judgment", "Creative taste", "Storytelling", "Customer empathy", "Strategic prioritization"],
    tools: [
      t("Canva AI", "Fast on-brand visuals", "Lets one person produce a full campaign kit."),
      t("Adobe Firefly", "Generative imagery", "Expands creative range without a studio."),
      t("HubSpot", "Campaign automation and CRM", "Connects marketing effort to revenue."),
      t("Mailchimp", "Email campaigns and testing", "Easy place to practice lifecycle marketing."),
      t("Google Analytics", "Traffic and conversion insight", "Turns campaigns into measurable results."),
    ],
    bullets: [
      "Used AI tools to produce and test multiple campaign message variations.",
      "Built a repeatable content workflow that shortened production time.",
      "Analyzed campaign performance data to improve conversion rates.",
    ],
    defaultSkills: ["Content creation", "Social media", "Campaign planning", "Copywriting", "Analytics", "Design basics"],
  },
  {
    key: "hr",
    label: "Human Resources",
    keywords: ["hr", "human resources", "recruit", "talent", "people operations", "onboarding", "payroll assistant"],
    futureRole: "AI-Enabled People Operations Associate",
    explanation:
      "Your role can evolve from manual coordination and paperwork to designing AI-supported people processes — faster screening and documentation, with more of your time going to candidate and employee experience.",
    recommendations: [
      {
        title: "AI-Enabled People Operations Associate",
        fit: "Your coordination and documentation experience is the foundation of people ops.",
        aiChange: "AI drafts communication and structures records; you own fairness and judgment.",
        nextSkills: ["HR automation", "People analytics", "Policy writing with AI"],
      },
      {
        title: "Talent Acquisition Associate",
        fit: "You already handle candidate flow and scheduling.",
        aiChange: "Sourcing and screening summaries speed up; interviews stay human.",
        nextSkills: ["Structured interviewing", "ATS automation", "Candidate experience"],
      },
      {
        title: "HR Operations Coordinator",
        fit: "Your records and onboarding work fits an operations track.",
        aiChange: "Onboarding checklists and documents auto-generate.",
        nextSkills: ["HRIS tools", "Workflow design", "Data accuracy"],
      },
    ],
    automate: ["Job description drafts", "Interview scheduling", "Onboarding checklists", "Policy FAQ answers", "Record updates"],
    assist: ["Candidate summary review", "Employee survey analysis", "Training content design", "Compensation research", "Engagement reporting"],
    human: ["Empathy", "Confidentiality", "Fair judgment", "Conflict resolution", "Culture building"],
    tools: [
      t("ChatGPT / Claude", "HR communication and policy drafting", "Saves hours on repetitive writing."),
      t("BambooHR / Darwinbox", "HRIS with AI features", "Where modern people data lives."),
      t("Survey tools", "Engagement and pulse feedback", "Turns sentiment into action."),
      t("Onboarding automation", "New hire journeys", "Great first impressions scale with automation."),
    ],
    bullets: [
      "Used AI tools to draft consistent job descriptions and candidate communication.",
      "Automated onboarding checklists to reduce manual coordination time.",
      "Analyzed employee feedback data to recommend experience improvements.",
    ],
    defaultSkills: ["Employee records", "Onboarding", "Coordination", "HR documentation", "Communication", "Scheduling"],
  },
  {
    key: "finance",
    label: "Finance / Accounting",
    keywords: ["finance", "account", "audit", "bookkeep", "reconcil", "invoice", "treasury", "tax", "financial analyst"],
    futureRole: "AI-Assisted Finance Analyst",
    explanation:
      "Your role can evolve from manual reconciliation and report building to AI-assisted analysis — the numbers assemble themselves while you focus on interpretation, controls and business advice.",
    recommendations: [
      {
        title: "AI-Assisted Finance Analyst",
        fit: "Your reporting and reconciliation experience is exactly the base for this role.",
        aiChange: "AI handles data prep and variance drafts; you own the insight and the controls.",
        nextSkills: ["Excel Copilot", "Power BI", "Forecast modelling"],
      },
      {
        title: "Business Intelligence Associate",
        fit: "You are comfortable with numbers and structure.",
        aiChange: "Dashboards replace static reports.",
        nextSkills: ["Data modelling", "Looker Studio", "KPI design"],
      },
      {
        title: "Finance Operations Coordinator",
        fit: "Your invoice and process work fits finance ops.",
        aiChange: "OCR and automation remove manual entry.",
        nextSkills: ["OCR tools", "Process automation", "Controls documentation"],
      },
    ],
    automate: ["Data entry", "Invoice matching", "Report generation", "Reconciliation checks", "Variance first drafts"],
    assist: ["Forecast scenarios", "Anomaly detection", "Commentary drafting", "Cash-flow analysis", "Budget reviews"],
    human: ["Professional judgment", "Ethics and controls", "Stakeholder advice", "Risk assessment", "Business context"],
    tools: [
      t("Excel with Copilot", "Formulas, cleanup and analysis", "Finance still runs on spreadsheets — now AI-assisted."),
      t("Power BI", "Interactive financial dashboards", "Turns reports into decisions."),
      t("Looker Studio", "Free reporting and sharing", "Easy way to practice dashboarding."),
      t("OCR invoice tools", "Automated document capture", "Removes the most repetitive finance task."),
    ],
    bullets: [
      "Used AI-assisted analysis to prepare faster monthly variance commentary.",
      "Automated recurring reconciliation checks to reduce manual review time.",
      "Built a dashboard that improved visibility of key financial metrics.",
    ],
    defaultSkills: ["Excel", "Reports", "Reconciliation", "Invoice checking", "Attention to detail", "Analysis"],
  },
  {
    key: "operations",
    label: "Operations",
    keywords: ["operations", "logistics", "supply chain", "process", "coordinator", "warehouse", "planner"],
    futureRole: "Workflow Automation Coordinator",
    explanation:
      "Your role can evolve from running processes manually to designing automated workflows — you become the person who redesigns how work flows, with AI handling the repetitive steps.",
    recommendations: [
      {
        title: "Workflow Automation Coordinator",
        fit: "You already know where the bottlenecks are.",
        aiChange: "You build the automations instead of doing the steps.",
        nextSkills: ["Zapier / Make", "Process mapping", "Dashboarding"],
      },
      {
        title: "Operations Analyst",
        fit: "Your process data experience fits analysis work.",
        aiChange: "AI surfaces patterns you would otherwise hunt for.",
        nextSkills: ["Data literacy", "KPI design", "SQL basics"],
      },
      {
        title: "Service Delivery Coordinator",
        fit: "You keep delivery on track across teams.",
        aiChange: "Status reporting becomes automatic.",
        nextSkills: ["Project tools", "SLA management", "Stakeholder comms"],
      },
    ],
    automate: ["Status reports", "Data consolidation", "Routine approvals routing", "Inventory alerts", "Recurring reminders"],
    assist: ["Bottleneck analysis", "Demand forecasting", "SOP drafting", "Vendor comparison", "Capacity planning"],
    human: ["Prioritization", "Cross-team coordination", "Exception handling", "Negotiation", "Continuous improvement"],
    tools: [
      t("Airtable", "Structured operational databases", "A spreadsheet that behaves like a system."),
      t("Notion", "SOPs and team knowledge", "Documentation is the base of automation."),
      t("Zapier", "No-code app connections", "Fastest first automation win."),
      t("Make", "Visual multi-step workflows", "Handles more complex logic."),
      t("n8n", "Advanced, self-hosted automation", "Great for AI-powered workflows."),
    ],
    bullets: [
      "Mapped a recurring manual process and automated it end to end.",
      "Built an operational dashboard that improved on-time delivery visibility.",
      "Used AI tools to draft and maintain standard operating procedures.",
    ],
    defaultSkills: ["Coordination", "Process improvement", "Excel", "Reporting", "Vendor management", "Planning"],
  },
  {
    key: "it",
    label: "IT / Helpdesk",
    keywords: ["it support", "helpdesk", "service desk", "sysadmin", "technician", "network"],
    futureRole: "AI Service Desk Support Specialist",
    explanation:
      "Your role can evolve from ticket-by-ticket troubleshooting to running AI-assisted service desk workflows — self-service deflection, automated diagnostics, and more time for complex incidents.",
    recommendations: [
      {
        title: "AI Service Desk Support Specialist",
        fit: "Your troubleshooting experience is directly transferable.",
        aiChange: "AI triages and suggests fixes; you handle escalation and root cause.",
        nextSkills: ["Automation scripting", "Knowledge base design", "ITSM tools"],
      },
      {
        title: "IT Operations Associate",
        fit: "You keep systems running day to day.",
        aiChange: "Monitoring and alerting become predictive.",
        nextSkills: ["Cloud basics", "Monitoring tools", "Scripting"],
      },
      {
        title: "Automation Support Engineer",
        fit: "You understand systems and users.",
        aiChange: "You automate the fixes rather than repeat them.",
        nextSkills: ["Python basics", "APIs", "Workflow tools"],
      },
    ],
    automate: ["Password resets", "Ticket routing", "Standard diagnostics", "Asset records", "Status updates"],
    assist: ["Root cause investigation", "Knowledge article drafting", "Script generation", "Incident summaries", "Trend analysis"],
    human: ["User empathy", "Prioritization under pressure", "Security judgment", "Clear explanation", "Escalation ownership"],
    tools: [
      t("ChatGPT", "Script and command generation", "Speeds up everyday troubleshooting."),
      t("ServiceNow / Freshservice", "ITSM with AI triage", "Enterprise standard for service desks."),
      t("Zapier / n8n", "Automating repetitive IT tasks", "Turns manual fixes into workflows."),
      t("Notion", "Runbooks and knowledge base", "Good documentation powers AI answers."),
    ],
    bullets: [
      "Automated common service desk requests to reduce resolution time.",
      "Used AI tools to generate troubleshooting scripts and knowledge articles.",
      "Analyzed ticket trends to prevent recurring incidents.",
    ],
    defaultSkills: ["Troubleshooting", "Ticketing systems", "Hardware/software support", "Documentation", "Communication"],
  },
  {
    key: "engineering",
    label: "Software Engineering",
    keywords: ["developer", "engineer", "software", "programmer", "frontend", "backend", "full stack", "qa"],
    futureRole: "AI-Augmented Product Engineer",
    explanation:
      "Your role can evolve from writing every line by hand to directing AI coding assistants — shipping faster while you own architecture, quality and product judgment.",
    recommendations: [
      {
        title: "AI-Augmented Product Engineer",
        fit: "Your build experience plus AI tooling multiplies your output.",
        aiChange: "AI writes boilerplate and tests; you own design and review.",
        nextSkills: ["AI pair programming", "Code review discipline", "System design"],
      },
      {
        title: "AI Integration Engineer",
        fit: "You can wire models into real products.",
        aiChange: "LLM APIs become a standard part of the stack.",
        nextSkills: ["LLM APIs", "Prompt engineering", "Evaluation"],
      },
      {
        title: "Automation Engineer",
        fit: "You can turn manual processes into software.",
        aiChange: "Internal tooling becomes a high-value specialty.",
        nextSkills: ["Workflow platforms", "APIs", "Data pipelines"],
      },
    ],
    automate: ["Boilerplate code", "Unit test drafts", "Documentation", "Code formatting", "Release notes"],
    assist: ["Debugging", "Refactoring proposals", "Architecture options", "Code review", "Performance analysis"],
    human: ["System design", "Trade-off judgment", "Product thinking", "Mentoring", "Ownership of quality"],
    tools: [
      t("GitHub Copilot", "In-editor code generation", "The baseline for AI-assisted development."),
      t("Claude", "Large codebase reasoning", "Excellent for refactors and reviews."),
      t("Cursor", "AI-native code editor", "Shows how AI-first engineering works."),
      t("LLM APIs", "Building AI features", "Turns you into an AI product builder."),
    ],
    bullets: [
      "Used AI coding assistants to accelerate delivery while maintaining review standards.",
      "Shipped an AI-powered feature integrated with an LLM API.",
      "Automated repetitive engineering tasks to improve team throughput.",
    ],
    defaultSkills: ["Programming", "Debugging", "Version control", "Testing", "Problem solving", "APIs"],
  },
  {
    key: "product",
    label: "Product Management",
    keywords: ["product manager", "product owner", "scrum", "roadmap", "business analyst"],
    futureRole: "AI Product Strategy Associate",
    explanation:
      "Your role can evolve from gathering requirements to shaping AI-enabled products — faster research synthesis and prototyping, with more focus on customer outcomes and prioritization.",
    recommendations: [
      {
        title: "AI Product Strategy Associate",
        fit: "Your discovery and prioritization skills are the core of this role.",
        aiChange: "Research synthesis and spec drafting speed up dramatically.",
        nextSkills: ["AI prototyping", "Opportunity sizing", "Evaluation design"],
      },
      {
        title: "Product Operations Associate",
        fit: "You keep delivery organized.",
        aiChange: "Reporting and release comms automate.",
        nextSkills: ["Analytics", "Process design", "Tooling"],
      },
      {
        title: "Technical Business Analyst",
        fit: "You translate between business and build teams.",
        aiChange: "Documentation and analysis become AI-assisted.",
        nextSkills: ["SQL basics", "Process mapping", "Requirements with AI"],
      },
    ],
    automate: ["Meeting notes", "Requirement drafts", "Release notes", "Competitor scans", "Backlog grooming prep"],
    assist: ["User research synthesis", "Prototype generation", "Prioritization frameworks", "Data analysis", "Roadmap storytelling"],
    human: ["Customer empathy", "Prioritization judgment", "Stakeholder alignment", "Vision setting", "Decision ownership"],
    tools: [
      t("ChatGPT / Claude", "Research synthesis and specs", "Cuts discovery time in half."),
      t("Notion AI", "Docs, roadmaps and decisions", "Keeps the product narrative in one place."),
      t("Figma AI", "Fast concept exploration", "Communicate ideas without a designer."),
      t("Amplitude / GA", "Product analytics", "Data closes the loop on decisions."),
    ],
    bullets: [
      "Used AI to synthesize customer research into prioritized product opportunities.",
      "Prototyped an AI-assisted feature concept and validated it with users.",
      "Automated release communication to keep stakeholders aligned.",
    ],
    defaultSkills: ["Requirements gathering", "Prioritization", "Stakeholder management", "Analytics", "Roadmapping"],
  },
  {
    key: "design",
    label: "Design / Creative",
    keywords: ["design", "graphic", "ux", "ui", "creative", "video editor", "illustrator"],
    futureRole: "AI Creative Systems Designer",
    explanation:
      "Your role can evolve from producing assets one by one to designing creative systems — AI accelerates exploration and variation while your taste, craft and concept direction lead the work.",
    recommendations: [
      {
        title: "AI Creative Systems Designer",
        fit: "Your visual craft plus AI tooling produces far more range.",
        aiChange: "AI explores options; you curate and refine.",
        nextSkills: ["Generative tooling", "Design systems", "Art direction"],
      },
      {
        title: "Product / UX Designer",
        fit: "You already think about users and flows.",
        aiChange: "Wireframes and copy drafts generate instantly.",
        nextSkills: ["UX research", "Prototyping", "Accessibility"],
      },
      {
        title: "Content & Motion Designer",
        fit: "You can produce for multiple channels.",
        aiChange: "Video and motion editing becomes AI-assisted.",
        nextSkills: ["AI video tools", "Brand systems", "Storyboarding"],
      },
    ],
    automate: ["Resizing and reformatting", "Background removal", "Asset variations", "Basic retouching", "Copy placeholders"],
    assist: ["Concept exploration", "Moodboarding", "Layout suggestions", "Copywriting", "Design critique prep"],
    human: ["Taste and craft", "Brand judgment", "Concept originality", "Client empathy", "Storytelling"],
    tools: [
      t("Figma AI", "UI design and prototyping", "Industry standard for product design."),
      t("Adobe Firefly", "Generative imagery and edits", "Expands what one designer can produce."),
      t("Canva AI", "Fast brand-consistent output", "Perfect for high-volume marketing assets."),
      t("Runway", "AI video and motion", "Opens up a new creative medium."),
    ],
    bullets: [
      "Used generative AI tools to explore more design directions in less time.",
      "Built a reusable design system that sped up campaign production.",
      "Produced AI-assisted motion and video assets for multi-channel use.",
    ],
    defaultSkills: ["Visual design", "Layout", "Typography", "Adobe/Figma", "Brand consistency", "Creativity"],
  },
  {
    key: "data",
    label: "Data / Analytics",
    keywords: ["data", "analyst", "analytics", "bi", "sql", "reporting analyst", "scientist"],
    futureRole: "AI Decision Intelligence Analyst",
    explanation:
      "Your role can evolve from building reports to driving decisions — AI accelerates cleaning, querying and drafting, so your value moves to framing the question and defending the recommendation.",
    recommendations: [
      {
        title: "AI Decision Intelligence Analyst",
        fit: "Your analysis skills plus AI tooling shorten the path to insight.",
        aiChange: "Query writing and summaries automate; interpretation stays yours.",
        nextSkills: ["AI-assisted SQL", "Storytelling with data", "Experiment design"],
      },
      {
        title: "Business Intelligence Analyst",
        fit: "You already build reporting others rely on.",
        aiChange: "Self-service dashboards replace ad-hoc requests.",
        nextSkills: ["Power BI / Looker", "Data modelling", "KPI design"],
      },
      {
        title: "Analytics Engineer",
        fit: "You understand data structure.",
        aiChange: "Pipeline code is AI-assisted.",
        nextSkills: ["dbt basics", "Python", "Data quality"],
      },
    ],
    automate: ["Data cleaning", "Recurring reports", "Chart generation", "Query drafting", "Documentation"],
    assist: ["Hypothesis generation", "Statistical checks", "Anomaly detection", "Narrative writing", "Model prototyping"],
    human: ["Framing the right question", "Business context", "Skepticism about results", "Persuasion", "Ethical data use"],
    tools: [
      t("Power BI / Looker Studio", "Dashboards and self-service reporting", "Where most business analysis is consumed."),
      t("ChatGPT Advanced Data Analysis", "Fast exploration of datasets", "Analysis without heavy setup."),
      t("SQL + AI copilots", "Faster, cleaner queries", "Still the core analyst skill."),
      t("Python / pandas", "Deeper analysis and automation", "Unlocks repeatable work."),
    ],
    bullets: [
      "Used AI-assisted analysis to shorten reporting cycles.",
      "Built dashboards that replaced recurring manual report requests.",
      "Translated analysis into recommendations adopted by the business.",
    ],
    defaultSkills: ["Excel", "SQL", "Dashboards", "Reporting", "Statistics basics", "Data storytelling"],
  },
  {
    key: "legal",
    label: "Legal / Compliance",
    keywords: ["legal", "compliance", "paralegal", "contract", "risk", "regulatory", "aml", "kyc"],
    futureRole: "AI-Assisted Compliance Coordinator",
    explanation:
      "Your role can evolve from manual document review to AI-assisted review at scale — the first pass is automated while your judgment, interpretation and accountability stay central.",
    recommendations: [
      {
        title: "AI-Assisted Compliance Coordinator",
        fit: "Your review and documentation discipline fits directly.",
        aiChange: "AI extracts clauses and flags risk; you decide.",
        nextSkills: ["AI document review", "Controls testing", "Regulatory research"],
      },
      {
        title: "Contract Operations Associate",
        fit: "You manage contract lifecycles.",
        aiChange: "Drafting and comparison speed up.",
        nextSkills: ["CLM tools", "Template design", "Workflow automation"],
      },
      {
        title: "Risk Analyst",
        fit: "You spot issues before they escalate.",
        aiChange: "Monitoring becomes continuous rather than periodic.",
        nextSkills: ["Data literacy", "Risk frameworks", "Reporting"],
      },
    ],
    automate: ["Clause extraction", "Document comparison", "Checklist tracking", "First-draft summaries", "Filing and records"],
    assist: ["Regulatory research", "Risk flagging", "Policy drafting", "Training material creation", "Audit preparation"],
    human: ["Legal judgment", "Accountability", "Ethical reasoning", "Negotiation", "Stakeholder advice"],
    tools: [
      t("Claude", "Long-document review and summaries", "Handles contracts and policies well."),
      t("CLM tools", "Contract lifecycle management", "Where compliance workflows live."),
      t("Notion / SharePoint", "Policy knowledge bases", "Makes guidance findable and current."),
      t("Excel + Copilot", "Controls tracking and testing", "Practical compliance reporting."),
    ],
    bullets: [
      "Used AI tools to speed up first-pass contract and policy review.",
      "Built a tracker that improved visibility of compliance obligations.",
      "Created clear internal guidance that reduced repeat queries.",
    ],
    defaultSkills: ["Document review", "Attention to detail", "Regulatory knowledge", "Reporting", "Coordination"],
  },
  {
    key: "procurement",
    label: "Procurement",
    keywords: ["procurement", "purchasing", "sourcing", "buyer", "vendor"],
    futureRole: "AI Vendor Intelligence Coordinator",
    explanation:
      "Your role can evolve from processing purchase requests to running AI-supported vendor intelligence — comparisons and spend analysis happen fast, so you focus on negotiation and supplier relationships.",
    recommendations: [
      {
        title: "AI Vendor Intelligence Coordinator",
        fit: "Your sourcing and vendor experience transfers directly.",
        aiChange: "AI compares quotes and analyzes spend; you negotiate.",
        nextSkills: ["Spend analytics", "AI research", "Contract basics"],
      },
      {
        title: "Supply Chain Analyst",
        fit: "You understand suppliers and lead times.",
        aiChange: "Forecasting and risk alerts become predictive.",
        nextSkills: ["Data literacy", "Forecasting", "Dashboarding"],
      },
      {
        title: "Procurement Operations Coordinator",
        fit: "You keep the purchasing process moving.",
        aiChange: "Approvals and PO admin automate.",
        nextSkills: ["Workflow automation", "ERP tools", "Process design"],
      },
    ],
    automate: ["PO creation", "Quote comparison tables", "Vendor record updates", "Approval routing", "Spend reports"],
    assist: ["Supplier research", "Contract review", "Category analysis", "Risk screening", "Negotiation preparation"],
    human: ["Negotiation", "Relationship management", "Commercial judgment", "Ethics", "Escalation handling"],
    tools: [
      t("Excel + Copilot", "Spend and quote analysis", "Core procurement analysis tool."),
      t("ChatGPT", "Supplier research and RFP drafting", "Speeds up sourcing prep."),
      t("Airtable", "Vendor databases", "Structure without heavy systems."),
      t("Power BI", "Spend dashboards", "Makes savings visible."),
    ],
    bullets: [
      "Used AI-assisted research to shortlist and compare suppliers faster.",
      "Built a spend dashboard that highlighted savings opportunities.",
      "Automated purchase request routing to reduce cycle time.",
    ],
    defaultSkills: ["Vendor management", "Negotiation", "Excel", "Cost analysis", "Coordination"],
  },
  {
    key: "admin",
    label: "Admin / Executive Support",
    keywords: ["admin", "assistant", "secretary", "receptionist", "clerk", "office", "executive assistant", "data entry"],
    futureRole: "AI Executive Operations Assistant",
    explanation:
      "Your role can evolve from scheduling and documentation to running AI-supported executive operations — notes, drafts and tracking are automated while you own priorities, discretion and relationships.",
    recommendations: [
      {
        title: "AI Executive Operations Assistant",
        fit: "Your organization and communication skills scale beautifully with AI.",
        aiChange: "Notes, drafts and follow-ups generate automatically.",
        nextSkills: ["Prompt writing", "Workflow automation", "Meeting intelligence"],
      },
      {
        title: "Business Operations Coordinator",
        fit: "You already keep teams organized.",
        aiChange: "Tracking and reporting automate.",
        nextSkills: ["Airtable / Notion", "Dashboards", "Process design"],
      },
      {
        title: "Project Support Associate",
        fit: "You coordinate across many stakeholders.",
        aiChange: "Status updates and documentation write themselves.",
        nextSkills: ["Project tools", "Risk tracking", "Stakeholder comms"],
      },
    ],
    automate: ["Meeting notes", "Calendar coordination drafts", "Expense records", "Document formatting", "Follow-up reminders"],
    assist: ["Email drafting", "Travel research", "Presentation building", "Priority triage", "Vendor comparison"],
    human: ["Discretion", "Anticipating needs", "Relationship management", "Judgment under pressure", "Cultural awareness"],
    tools: [
      t("Microsoft Copilot", "Outlook, Word, Excel and Teams", "Where executive work already happens."),
      t("Notion AI", "Trackers, notes and documentation", "Turns scattered notes into systems."),
      t("Otter / Fireflies", "Meeting transcription and summaries", "Removes note-taking overhead."),
      t("Zapier", "Connecting daily tools", "Automates the small repetitive tasks."),
    ],
    bullets: [
      "Used AI meeting tools to produce consistent summaries and action tracking.",
      "Automated recurring administrative workflows to save weekly hours.",
      "Built a shared tracker that improved team visibility and follow-through.",
    ],
    defaultSkills: ["Scheduling", "Documentation", "Communication", "MS Office", "Coordination", "Organization"],
  },
  {
    key: "education",
    label: "Education / Training",
    keywords: ["teacher", "trainer", "lecturer", "tutor", "instructional", "learning", "faculty", "education"],
    futureRole: "AI Learning Experience Associate",
    explanation:
      "Your role can evolve from preparing every material by hand to designing AI-supported learning experiences — content and assessments generate quickly, so you focus on coaching and outcomes.",
    recommendations: [
      {
        title: "AI Learning Experience Associate",
        fit: "Your teaching and content skills fit modern L&D roles.",
        aiChange: "AI drafts material; you design the learning journey.",
        nextSkills: ["Instructional design", "AI content generation", "Learning analytics"],
      },
      {
        title: "Corporate Trainer",
        fit: "You can explain complex ideas simply.",
        aiChange: "Personalized learning paths become possible at scale.",
        nextSkills: ["LMS tools", "Facilitation", "Assessment design"],
      },
      {
        title: "Content Development Specialist",
        fit: "You create structured learning content.",
        aiChange: "Production speed increases sharply.",
        nextSkills: ["Multimedia tools", "Curriculum design", "AI editing"],
      },
    ],
    automate: ["Lesson plan drafts", "Quiz generation", "Grading of objective tests", "Material formatting", "Progress reports"],
    assist: ["Personalized explanations", "Curriculum research", "Feedback drafting", "Activity design", "Learning analytics"],
    human: ["Mentoring", "Motivation", "Classroom judgment", "Empathy", "Assessment of real understanding"],
    tools: [
      t("ChatGPT / Claude", "Lesson and assessment drafting", "Multiplies preparation capacity."),
      t("Canva AI", "Learning visuals and slides", "Makes material more engaging."),
      t("Notion", "Curriculum and resource hubs", "Keeps learning content organized."),
      t("LMS platforms", "Delivery and tracking", "Where corporate learning lives."),
    ],
    bullets: [
      "Used AI tools to design learning materials and assessments faster.",
      "Built a structured learning path that improved completion rates.",
      "Analyzed learner feedback to improve program outcomes.",
    ],
    defaultSkills: ["Teaching", "Curriculum design", "Presentation", "Assessment", "Communication", "Coaching"],
  },
  {
    key: "retail",
    label: "Retail / Store Operations",
    keywords: ["retail", "store", "cashier", "merchandis", "shop", "branch", "front desk", "hospitality", "restaurant"],
    futureRole: "AI Store Performance Optimizer",
    explanation:
      "Your role can evolve from daily floor operations to data-informed store performance — AI handles forecasting and reporting while you lead the team and the customer experience.",
    recommendations: [
      {
        title: "AI Store Performance Optimizer",
        fit: "Your floor experience plus data skills is a rare combination.",
        aiChange: "Forecasting and stock alerts become automatic.",
        nextSkills: ["Retail analytics", "Dashboarding", "Inventory planning"],
      },
      {
        title: "Customer Experience Lead",
        fit: "You interact with customers all day.",
        aiChange: "Feedback analysis becomes continuous.",
        nextSkills: ["CX measurement", "Coaching", "Service design"],
      },
      {
        title: "Retail Operations Coordinator",
        fit: "You keep the store running smoothly.",
        aiChange: "Scheduling and reporting automate.",
        nextSkills: ["Workforce tools", "Process design", "Excel"],
      },
    ],
    automate: ["Sales reports", "Stock counts reconciliation", "Shift schedule drafts", "Promotion signage", "Routine checklists"],
    assist: ["Demand forecasting", "Customer feedback analysis", "Merchandising decisions", "Staffing optimization", "Basket analysis"],
    human: ["Team leadership", "Customer rapport", "On-the-spot judgment", "Coaching", "Service recovery"],
    tools: [
      t("Excel / Google Sheets AI", "Sales and stock analysis", "Practical retail analytics starting point."),
      t("Power BI / Looker Studio", "Store performance dashboards", "Turns daily numbers into decisions."),
      t("Canva AI", "In-store and social promotion", "Professional materials without a designer."),
      t("Workforce apps", "Scheduling and task tracking", "Reduces admin, increases floor time."),
    ],
    bullets: [
      "Used sales data and AI analysis to improve stock and promotion decisions.",
      "Built a simple store performance dashboard reviewed weekly by the team.",
      "Improved customer experience by acting on structured feedback analysis.",
    ],
    defaultSkills: ["Customer service", "Sales", "Inventory", "Team coordination", "POS systems", "Merchandising"],
  },
  {
    key: "general",
    label: "General Business",
    keywords: [],
    futureRole: "AI-Ready Business Operations Associate",
    explanation:
      "Your profile can evolve into a versatile, AI-ready business role — you use AI tools to research, write, analyze and automate, which makes you immediately useful across teams.",
    recommendations: [
      {
        title: "AI-Ready Business Operations Associate",
        fit: "Your communication and organizational foundations transfer to many teams.",
        aiChange: "Routine coordination automates; you focus on judgment and delivery.",
        nextSkills: ["Prompt writing", "Excel / Sheets", "Workflow automation"],
      },
      {
        title: "Customer Experience Associate",
        fit: "Strong communicators do well in customer-facing roles.",
        aiChange: "AI supports responses; empathy stays human.",
        nextSkills: ["CRM basics", "Service writing", "Problem solving"],
      },
      {
        title: "Marketing / Sales Support Associate",
        fit: "A great entry point to build commercial skills.",
        aiChange: "Research and content drafting become AI-assisted.",
        nextSkills: ["Content basics", "CRM", "Analytics basics"],
      },
    ],
    automate: ["Note taking", "Document formatting", "Basic research", "Data entry", "Status updates"],
    assist: ["Writing and editing", "Presentation building", "Analysis of simple data", "Interview preparation", "Task planning"],
    human: ["Communication", "Reliability", "Curiosity", "Teamwork", "Problem solving"],
    tools: GENERAL_TOOLS.slice(0, 4),
    bullets: [
      "Used AI tools to research, draft and summarize work more efficiently.",
      "Built a simple automation that removed a recurring manual task.",
      "Created a dashboard or tracker that improved team visibility.",
    ],
    defaultSkills: ["Communication", "Excel", "Teamwork", "Organization", "Problem solving", "Research"],
  },
];

export function getFamily(key: FamilyKey): Family {
  return FAMILIES.find((f) => f.key === key) ?? FAMILIES[FAMILIES.length - 1]!;
}

export const FUTURE_ROLE_MAP = FAMILIES.map((f) => ({ from: f.label, to: f.futureRole }));

function detectFamily(text: string): FamilyKey {
  const lower = text.toLowerCase();
  let best: { key: FamilyKey; hits: number } = { key: "general", hits: 0 };
  for (const f of FAMILIES) {
    const hits = f.keywords.reduce((n, k) => (lower.includes(k) ? n + 1 : n), 0);
    if (hits > best.hits) best = { key: f.key, hits };
  }
  return best.key;
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Mock resume parsing. Swap for a real AI call later — keep the return shape. */
export function parseResume(input: ResumeInput, signup: SignupData): ParsedResume {
  const blob = [input.recentRole, input.experienceSummary, input.keySkills, input.industries, input.fileName]
    .filter(Boolean)
    .join(" ");
  const familyKey = detectFamily(blob);
  const family = getFamily(familyKey);

  const typedSkills = input.keySkills
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map(titleCase);

  const skills = typedSkills.length >= 3 ? typedSkills : Array.from(new Set([...typedSkills, ...family.defaultSkills])).slice(0, 8);

  const stage = signup.careerStage || "Early Career";
  const years =
    stage === "Student / Fresh Graduate"
      ? "0–1 years"
      : stage === "Early Career"
        ? "1–3 years"
        : stage === "Mid-Career"
          ? "4–8 years"
          : stage === "Senior Professional"
            ? "8+ years"
            : "Varied experience";

  const recentRole = input.recentRole.trim() || family.label + " Professional";

  const summary = `You appear to have experience in ${skills.slice(0, 4).join(", ").toLowerCase()}, built through work close to ${family.label.toLowerCase()}. Your profile suggests strength in delivering consistent day-to-day results and working with people across teams. This positions you well for roles such as ${family.recommendations
    .slice(0, 2)
    .map((r) => r.title)
    .join(" or ")}. With AI tools added to your workflow, the same experience becomes noticeably more valuable to employers.`;

  return {
    fileName: input.fileName,
    recentRole,
    primaryFunction: family.label,
    familyKey,
    yearsExperience: years,
    industryExposure: input.industries.trim() || "Open to multiple industries",
    summary,
    skills,
  };
}

export function getRecommendations(key: FamilyKey): Recommendation[] {
  return getFamily(key).recommendations;
}

const SKILL_GROUPS: { title: string; skills: SkillCard[] }[] = [
  {
    title: "A. AI Tool Skills",
    skills: [
      {
        name: "Prompt writing",
        why: "Clear instructions are the difference between generic and genuinely useful AI output.",
        beginnerAction: "Write 5 prompts you would use weekly and refine each one twice.",
        tool: "ChatGPT or Claude",
      },
      {
        name: "Document analysis with AI",
        why: "Reading and extracting from long documents is one of the biggest daily time savings.",
        beginnerAction: "Upload a report and ask for a one-page summary with key risks.",
        tool: "Claude",
      },
      {
        name: "AI-assisted research",
        why: "Faster, better-prepared work makes you noticeably more effective in meetings.",
        beginnerAction: "Research a company and prepare 5 smart questions before an interview.",
        tool: "ChatGPT or Gemini",
      },
      {
        name: "AI-assisted writing",
        why: "Consistent, professional communication scales your credibility.",
        beginnerAction: "Draft, critique and improve one work email using AI feedback.",
        tool: "ChatGPT",
      },
      {
        name: "Meeting summarization",
        why: "Turning conversations into clear actions is a highly visible contribution.",
        beginnerAction: "Record a mock meeting and generate notes plus action items.",
        tool: "Otter or Fireflies",
      },
    ],
  },
  {
    title: "B. Workflow & Automation Skills",
    skills: [
      {
        name: "Spotting repetitive workflows",
        why: "You cannot automate what you have not mapped.",
        beginnerAction: "List every task you repeat weekly and mark the top three.",
        tool: "Notion or paper",
      },
      {
        name: "No-code automation",
        why: "One working automation is the most convincing thing on a modern resume.",
        beginnerAction: "Build a trigger that saves email attachments to a sheet.",
        tool: "Zapier, Make or n8n",
      },
      {
        name: "Business tool automation",
        why: "CRM, HRMS and support tools all have automation built in.",
        beginnerAction: "Create one automatic reminder or status update rule.",
        tool: "HubSpot, Zendesk or your team's tool",
      },
      {
        name: "Trigger-action thinking",
        why: "It is the mental model behind every automated process.",
        beginnerAction: "Rewrite one process as 'when X happens, do Y'.",
        tool: "Make",
      },
      {
        name: "Quality checking AI output",
        why: "Trustworthy AI use requires a human reviewer — that is your advantage.",
        beginnerAction: "Create a 5-point checklist you apply to every AI draft.",
        tool: "Your own checklist",
      },
    ],
  },
  {
    title: "C. Data & Digital Skills",
    skills: [
      {
        name: "Excel / Google Sheets",
        why: "Still the most requested practical skill in almost every job ad.",
        beginnerAction: "Learn pivot tables, VLOOKUP/XLOOKUP and conditional formatting.",
        tool: "Excel with Copilot",
      },
      {
        name: "Dashboard reading",
        why: "Understanding a dashboard lets you contribute to decisions, not just tasks.",
        beginnerAction: "Rebuild one report as a simple visual dashboard.",
        tool: "Looker Studio",
      },
      {
        name: "KPI understanding",
        why: "Knowing what the business measures makes your work matter more.",
        beginnerAction: "Write down the 5 KPIs of your target role.",
        tool: "Company reports",
      },
      {
        name: "Basic analytics",
        why: "Simple analysis is enough to spot most useful patterns.",
        beginnerAction: "Analyze a public dataset and write three findings.",
        tool: "ChatGPT data analysis",
      },
      {
        name: "Data storytelling",
        why: "Insight only creates value when someone acts on it.",
        beginnerAction: "Turn one chart into a three-sentence recommendation.",
        tool: "Canva or Slides",
      },
    ],
  },
  {
    title: "D. Human Advantage Skills",
    skills: [
      {
        name: "Communication",
        why: "As AI produces more content, clear human communication stands out more.",
        beginnerAction: "Practice explaining your work in 60 seconds.",
        tool: "Practice + AI feedback",
      },
      {
        name: "Empathy",
        why: "Customers and colleagues still want to be understood by a person.",
        beginnerAction: "Rewrite a difficult message from the other person's perspective.",
        tool: "Role-play with AI",
      },
      {
        name: "Negotiation",
        why: "High-value outcomes are still agreed between humans.",
        beginnerAction: "Prepare three trade-offs before your next request.",
        tool: "AI role-play",
      },
      {
        name: "Critical thinking",
        why: "AI output needs someone who can spot what is wrong or missing.",
        beginnerAction: "Challenge one AI answer and document what it got wrong.",
        tool: "Any AI assistant",
      },
      {
        name: "Ethical decision-making",
        why: "Responsible AI use is quickly becoming a hiring requirement.",
        beginnerAction: "Learn your industry's basic data privacy rules.",
        tool: "Company policy + reading",
      },
    ],
  },
];

const PATH = [
  {
    window: "Days 1–30",
    title: "Build AI Awareness",
    items: [
      "Learn basic prompt writing",
      "Use AI to summarize documents",
      "Use AI to improve your resume",
      "Identify repetitive tasks in your target role",
      "Learn one AI writing or research tool",
    ],
  },
  {
    window: "Days 31–60",
    title: "Apply AI to Workflows",
    items: [
      "Learn one no-code automation tool",
      "Build a simple workflow",
      "Create a sample dashboard or tracker",
      "Practice using AI for role-specific tasks",
      "Create a mini portfolio project",
    ],
  },
  {
    window: "Days 61–90",
    title: "Become AI-Ready for Employers",
    items: [
      "Build a before/after case study",
      "Show how AI improves productivity",
      "Prepare AI-powered interview examples",
      "Add AI tools to your resume",
      "Apply for roles with a stronger future-ready profile",
    ],
  },
];

function levelFor(score: number): "Beginner" | "Developing" | "Strong" {
  return score >= 70 ? "Strong" : score >= 45 ? "Developing" : "Beginner";
}

export function buildReport(parsed: ParsedResume, interest: InterestData, signup: SignupData): Report {
  const family = getFamily(parsed.familyKey);
  const stage = signup.careerStage || "Early Career";
  const experienced = ["Mid-Career", "Senior Professional"].includes(stage);
  const skillCount = parsed.skills.length;

  const base = experienced ? 58 : stage === "Student / Fresh Graduate" ? 38 : 46;
  const seed = (skillCount * 3) % 11;

  const gapsAnalysis = [
    { category: "AI Tool Fluency", score: Math.min(95, base - 12 + seed), step: "Learn how to use ChatGPT or Claude to summarize documents, draft emails, research companies, and prepare interview answers." },
    { category: "Communication", score: Math.min(95, base + 20), step: "Practice explaining your work and results in clear, simple language — then get AI feedback on your phrasing." },
    { category: "Data Literacy", score: Math.min(95, base - 6 + seed), step: "Learn pivot tables and build one small dashboard from data you already work with." },
    { category: "Workflow Thinking", score: Math.min(95, base + 2), step: "Map one process you repeat weekly and identify where the manual steps are." },
    { category: "Industry Knowledge", score: Math.min(95, experienced ? base + 22 : base + 4), step: `Follow how AI is being adopted in ${interest.industry || parsed.industryExposure} and note three real examples.` },
    { category: "Problem Solving", score: Math.min(95, base + 14), step: "Document one problem you solved end-to-end and the measurable result." },
    { category: "Automation Readiness", score: Math.min(95, base - 16 + seed), step: "Build your first automation in Zapier or Make — even a two-step one counts." },
    { category: "Leadership Potential", score: Math.min(95, experienced ? base + 18 : base - 2), step: "Take ownership of one improvement and bring others along with you." },
  ].map((g) => ({ category: g.category, score: g.score, level: levelFor(g.score), nextStep: g.step }));

  const aiReadiness = Math.round(gapsAnalysis.reduce((n, g) => n + g.score, 0) / gapsAnalysis.length);

  const tools: ToolCard[] = [...family.tools, ...GENERAL_TOOLS].slice(0, 9);

  const chosenRole = interest.chosenRole || family.recommendations[0]!.title;

  return {
    startingPoint: `Based on your resume, you are currently positioned for ${family.recommendations[0]!.title.replace("AI-Powered ", "").replace("AI-Assisted ", "")} roles. Your strengths are ${parsed.skills
      .slice(0, 4)
      .join(", ")
      .toLowerCase()}. To grow with AI, focus on using AI tools for faster drafting, summarizing, analysis and workflow automation inside ${family.label.toLowerCase()}.`,
    strengths: parsed.skills.slice(0, 5),
    gaps: gapsAnalysis
      .filter((g) => g.level === "Beginner")
      .slice(0, 3)
      .map((g) => g.category),
    currentRole: parsed.recentRole,
    futureRole: chosenRole.startsWith("AI") ? chosenRole : family.futureRole,
    evolutionExplanation: family.explanation,
    automate: family.automate,
    assist: family.assist,
    human: family.human,
    gapsAnalysis,
    skillGroups: SKILL_GROUPS,
    tools,
    path: PATH,
    aiReadiness,
    scores: [
      { label: "AI Readiness", value: aiReadiness, note: "Growing — a few tools away from a real jump." },
      { label: "Automation Exposure", value: Math.min(90, 100 - aiReadiness + 10), note: "Some tasks will change; your role does not disappear." },
      { label: "Learning Urgency", value: Math.min(92, 100 - aiReadiness + 18), note: "A focused 90 days makes a visible difference." },
      { label: "Career Growth Potential", value: Math.min(96, aiReadiness + 30), note: "Strong — your foundation transfers well." },
      { label: "Human Skill Advantage", value: Math.min(96, aiReadiness + 24), note: "These skills become more valuable, not less." },
    ],
    resumeBullets: family.bullets,
  };
}

export interface SampleProfile {
  label: string;
  signup: Partial<SignupData>;
  resume: ResumeInput;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    label: "Fresh Graduate – Business Administration",
    signup: { firstName: "Maya", lastName: "Santos", email: "maya.santos@example.com", phone: "+63 917 555 0101", location: "Manila", careerStage: "Student / Fresh Graduate" },
    resume: {
      fileName: "Maya_Santos_Resume.pdf",
      recentRole: "Business Administration Graduate",
      experienceSummary: "Internship in office administration, coordinated events, supported social media posting and basic reporting.",
      keySkills: "Communication, Excel, Internship experience, Social media coordination",
      industries: "Open to Any Industry",
    },
  },
  {
    label: "Customer Service Representative",
    signup: { firstName: "Jorge", lastName: "Reyes", email: "jorge.reyes@example.com", phone: "+63 917 555 0102", location: "Cebu", careerStage: "Early Career" },
    resume: {
      fileName: "Jorge_Reyes_CV.pdf",
      recentRole: "Customer Service Representative",
      experienceSummary: "Handled inbound customer support tickets and calls, resolved billing issues, escalated complex cases.",
      keySkills: "Customer handling, Ticket management, Communication, Issue resolution",
      industries: "BPO / Customer Service",
    },
  },
  {
    label: "Sales Associate",
    signup: { firstName: "Alia", lastName: "Cruz", email: "alia.cruz@example.com", phone: "+63 917 555 0103", location: "Makati", careerStage: "Early Career" },
    resume: {
      fileName: "Alia_Cruz_Resume.docx",
      recentRole: "Sales Associate",
      experienceSummary: "Generated leads, ran client calls, managed follow-ups and kept the CRM updated for a regional territory.",
      keySkills: "Lead generation, Client calls, Follow-ups, CRM updates",
      industries: "Retail",
    },
  },
  {
    label: "HR Assistant",
    signup: { firstName: "Kim", lastName: "Delos Reyes", email: "kim.dr@example.com", phone: "+63 917 555 0104", location: "Quezon City", careerStage: "Early Career" },
    resume: {
      fileName: "Kim_HR_Assistant.pdf",
      recentRole: "HR Assistant",
      experienceSummary: "Maintained employee records, supported onboarding, coordinated interviews and prepared HR documentation.",
      keySkills: "Employee records, Onboarding, Coordination, HR documentation",
      industries: "Technology",
    },
  },
  {
    label: "Finance Analyst",
    signup: { firstName: "Paolo", lastName: "Lim", email: "paolo.lim@example.com", phone: "+63 917 555 0105", location: "Taguig", careerStage: "Mid-Career" },
    resume: {
      fileName: "Paolo_Lim_Finance.pdf",
      recentRole: "Finance Analyst",
      experienceSummary: "Prepared monthly reports, performed reconciliation, checked invoices and supported budget reviews.",
      keySkills: "Excel, Reports, Reconciliation, Invoice checking",
      industries: "Banking / Finance",
    },
  },
];
