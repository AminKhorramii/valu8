export interface ResearchSection {
  id: string;
  title: string;
  items: ResearchItem[];
  comingSoon?: boolean;
}

export interface ResearchItem {
  id: string;
  title: string;
  content: string;
  status: 'completed' | 'in_progress' | 'coming_soon';
  score?: number;
}

export interface TeamMember {
  name: string;
  linkedinUrl: string;
  role: string;
  experience: string;
  strengths: string[];
  concerns: string[];
  score: number;
}

export const researchSections: ResearchSection[] = [
  {
    id: 'business-overview',
    title: 'Business Overview',
    items: [
      {
        id: 'business-viability',
        title: 'Business Viability',
        content: 'Your B2B SaaS model shows strong fundamentals with a clear value proposition targeting the $47B workflow automation market. The subscription-based revenue model aligns with industry standards and customer expectations.',
        status: 'completed',
        score: 85
      },
      {
        id: 'monetization-strategies',
        title: 'Monetization Strategies', 
        content: 'Tiered SaaS pricing with freemium entry point. Premium features include advanced analytics, team collaboration, and enterprise integrations. Estimated ARPU of $2,400 annually.',
        status: 'completed',
        score: 78
      },
      {
        id: 'user-pain-points',
        title: 'User Pain Points',
        content: 'Primary pain points include manual workflow management, lack of team visibility, and integration challenges between tools. Your solution addresses 80% of identified pain points.',
        status: 'completed',
        score: 92
      },
      {
        id: 'revenue-opportunities',
        title: 'Revenue and Market Opportunities',
        content: 'TAM of $12B in target segments with 23% YoY growth. Key opportunities in mid-market companies (50-200 employees) and specific verticals like consulting and agencies.',
        status: 'completed',
        score: 80
      },
      {
        id: 'potential-risks',
        title: 'Potential Risks',
        content: 'High competition from established players (Monday.com, Asana). Customer acquisition costs may be higher than projected. Enterprise sales cycles could extend 6-9 months.',
        status: 'completed',
        score: 45
      },
      {
        id: 'why-now',
        title: 'Why Now',
        content: 'Remote work acceleration has increased demand for unified workflow tools by 340%. AI capabilities are now mature enough for practical implementation. Market timing is optimal.',
        status: 'completed',
        score: 88
      },
      {
        id: 'validate-factors',
        title: 'Validate Unknown Factors',
        content: 'Need to validate: 1) Customer willingness to pay premium for AI features, 2) Integration complexity with existing tools, 3) Time-to-value for new customers.',
        status: 'in_progress',
        score: 60
      }
    ]
  },
  {
    id: 'market-research',
    title: 'Market Research',
    items: [
      {
        id: 'market-trends',
        title: 'Trends in the Market Sector',
        content: 'AI-powered automation adoption increasing 34% annually. No-code/low-code solutions gaining traction. Integration-first platforms becoming standard.',
        status: 'completed',
        score: 88
      },
      {
        id: 'competitive-analysis',
        title: 'Competitive Analysis',
        content: 'Direct competitors include Monday.com ($8B valuation), Asana ($5.5B), and Notion ($10B). Your differentiation lies in AI-first approach and vertical-specific templates.',
        status: 'coming_soon'
      },
      {
        id: 'market-size',
        title: 'Market Size and Growth Potential',
        content: 'Serviceable market of $3.2B growing at 28% CAGR. Addressable market expanding due to SMB digital transformation. Strong secular tailwinds.',
        status: 'completed',
        score: 90
      },
      {
        id: 'consumer-behavior',
        title: 'Consumer Behavior',
        content: 'B2B buyers increasingly expect consumer-grade UX. Average evaluation involves 6.8 stakeholders. Free trial conversion rate industry average: 15-20%.',
        status: 'completed',
        score: 75
      },
      {
        id: 'customer-segmentation',
        title: 'Customer Segmentation',
        content: 'Primary: Tech-forward SMBs (50-200 employees). Secondary: Digital agencies and consultancies. Tertiary: Department-level enterprise adoption.',
        status: 'completed',
        score: 82
      },
      {
        id: 'regulatory-environment',
        title: 'Regulatory Environment',
        content: 'GDPR compliance required for EU customers. SOC2 Type II certification needed for enterprise deals. Data residency requirements vary by region.',
        status: 'completed',
        score: 65
      },
      {
        id: 'key-considerations',
        title: 'Key Considerations',
        content: 'Platform scalability, data security, API rate limits, and international expansion requirements must be addressed in product roadmap.',
        status: 'completed',
        score: 70
      }
    ]
  },
  {
    id: 'launch-scale',
    title: 'Launch and Scale',
    items: [
      {
        id: 'mvp-roadmap',
        title: 'MVP Roadmap',
        content: 'Phase 1: Core workflow builder (3 months). Phase 2: Team collaboration features (2 months). Phase 3: Basic AI automation (4 months). Total: 9 months to market.',
        status: 'completed',
        score: 85
      },
      {
        id: 'hiring-roadmap',
        title: 'Hiring Roadmap and Cost',
        content: 'Year 1: 8 engineers, 3 product, 2 design, 4 sales/marketing. Estimated cost: $2.1M. Year 2: Scale to 25 people, cost: $4.8M annually.',
        status: 'completed',
        score: 78
      },
      {
        id: 'operational-cost',
        title: 'Operational Cost',
        content: 'Infrastructure: $50K/month. Tools and software: $25K/month. Office/remote: $30K/month. Marketing: $100K/month. Total: $205K/month operational.',
        status: 'completed',
        score: 72
      },
      {
        id: 'tech-stack',
        title: 'Tech Stack',
        content: 'Frontend: React/TypeScript. Backend: Node.js/Python. Database: PostgreSQL + Redis. Cloud: AWS/Vercel. AI: OpenAI API + custom models.',
        status: 'completed',
        score: 88
      },
      {
        id: 'code-no-code',
        title: 'Code/No Code',
        content: 'Hybrid approach: Core platform custom-built for performance. Workflow templates use no-code builders. Integrations via Zapier/Make.com initially.',
        status: 'completed',
        score: 80
      },
      {
        id: 'ai-ml-implementation',
        title: 'AI/ML Implementation',
        content: 'Smart task routing, predictive scheduling, automated reporting. Start with OpenAI API, migrate to fine-tuned models. Privacy-first approach.',
        status: 'completed',
        score: 82
      },
      {
        id: 'analytics-metrics',
        title: 'Analytics and Metrics',
        content: 'Key metrics: DAU/MAU, task completion rate, team adoption, revenue per user. Tools: Mixpanel, Amplitude, custom dashboards.',
        status: 'completed',
        score: 75
      },
      {
        id: 'distribution-channels',
        title: 'Distribution Channels',
        content: 'Product Hunt launch, content marketing, partnerships with consultancies, freemium model, referral program, conference sponsorships.',
        status: 'completed',
        score: 78
      },
      {
        id: 'early-user-acquisition',
        title: 'Early User Acquisition Strategy',
        content: 'Founder-led sales, beta program with 50 companies, community building, thought leadership content, early adopter incentives.',
        status: 'completed',
        score: 85
      },
      {
        id: 'late-game-acquisition',
        title: 'Late Game User Acquisition Strategy',
        content: 'Paid advertising (Google, LinkedIn), inside sales team, channel partnerships, enterprise sales, international expansion.',
        status: 'in_progress',
        score: 70
      },
      {
        id: 'partnerships',
        title: 'Partnerships and Collaborations',
        content: 'Integration partners (Slack, Microsoft), consulting firm partnerships, technology alliances, industry associations, user communities.',
        status: 'completed',
        score: 76
      },
      {
        id: 'customer-retention',
        title: 'Customer Retention',
        content: 'Onboarding optimization, success metrics tracking, proactive support, feature adoption campaigns, customer health scoring.',
        status: 'completed',
        score: 80
      },
      {
        id: 'guerrilla-marketing',
        title: 'Guerrilla Marketing Ideas',
        content: 'Productivity challenges on social media, free workflow audits, lunch-and-learn sessions, tool comparison guides, efficiency calculators.',
        status: 'completed',
        score: 72
      },
      {
        id: 'website-faqs',
        title: 'Website FAQs',
        content: 'Security and compliance, pricing and billing, integrations, data migration, team collaboration, mobile access, API documentation.',
        status: 'completed',
        score: 68
      },
      {
        id: 'seo-terms',
        title: 'SEO Terms',
        content: 'Workflow automation, project management software, team collaboration tools, productivity apps, business process automation.',
        status: 'completed',
        score: 74
      },
      {
        id: 'ad-copy',
        title: 'Google/Text Ad Copy',
        content: '"Automate your workflow in minutes" | "The AI-powered productivity platform teams love" | "Stop switching between tools"',
        status: 'completed',
        score: 76
      }
    ]
  },
  {
    id: 'raise-capital',
    title: 'Raise Capital',
    items: [
      {
        id: 'elevator-pitch',
        title: 'Elevator Pitch',
        content: '"We\'re building the AI-first workflow platform that helps teams eliminate busywork. Think Notion meets automation, specifically for growing companies."',
        status: 'completed',
        score: 82
      },
      {
        id: 'yc-pitch-deck',
        title: 'YC-style Pitch Deck',
        content: '10 slides covering problem, solution, market, traction, business model, competition, team, financials, funding, and milestones.',
        status: 'in_progress',
        score: 75
      },
      {
        id: 'pitch-preparation',
        title: 'Pitch Preparation',
        content: 'Demo flow, objection handling, financial projections, team introduction, market sizing validation, competitive differentiation.',
        status: 'in_progress',
        score: 70
      },
      {
        id: 'valuation',
        title: 'Valuation',
        content: 'Pre-money valuation: $8-12M based on comparable companies, team experience, and market opportunity. Post-money target: $12-15M.',
        status: 'completed',
        score: 78
      },
      {
        id: 'funding-required',
        title: 'Funding Required for Seed/Pre-seed Stage',
        content: 'Seeking $3M seed round. 18-month runway. Allocation: 60% engineering, 25% sales/marketing, 10% operations, 5% contingency.',
        status: 'completed',
        score: 85
      },
      {
        id: 'investor-outreach',
        title: 'Investor Outreach',
        content: 'Target: B2B SaaS focused VCs, previous portfolio companies in productivity/automation space. Warm introductions preferred.',
        status: 'in_progress',
        score: 68
      },
      {
        id: 'investor-concerns',
        title: 'Investor Concerns',
        content: 'Market saturation, customer acquisition costs, competitive moats, technical complexity, team scaling, international expansion.',
        status: 'completed',
        score: 72
      }
    ]
  }
];

export const competitiveAnalysisSections = [
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    comingSoon: true
  },
  {
    id: 'feature-comparison',
    title: 'Feature Comparison',
    comingSoon: true
  },
  {
    id: 'pricing-comparison',
    title: 'Pricing Comparison',
    comingSoon: true
  }
];

export const mockTeamAnalysis: TeamMember[] = [
  {
    name: 'John Smith',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    role: 'CEO & Co-founder',
    experience: '8 years in B2B SaaS, Former Product Manager at Slack',
    strengths: ['Product Vision', 'Team Leadership', 'Enterprise Sales'],
    concerns: ['Limited technical background', 'First-time founder'],
    score: 85
  },
  {
    name: 'Sarah Chen',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    role: 'CTO & Co-founder', 
    experience: '10 years software engineering, Ex-Google Senior Engineer',
    strengths: ['Technical Architecture', 'AI/ML Expertise', 'Team Building'],
    concerns: ['Limited startup experience', 'No management experience'],
    score: 78
  },
  {
    name: 'Mike Johnson',
    linkedinUrl: 'https://linkedin.com/in/mikejohnson',
    role: 'Head of Growth',
    experience: '6 years growth marketing, Former Growth Lead at Notion',
    strengths: ['Growth Hacking', 'Data Analytics', 'Content Marketing'],
    concerns: ['Joined recently', 'Limited enterprise marketing experience'],
    score: 72
  }
];