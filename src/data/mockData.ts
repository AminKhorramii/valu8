import { VC, BusinessCard } from '../types';

export const vcData: VC[] = [
  {
    id: 'yc',
    name: 'Y Combinator',
    companies: [
      // Active companies
      { id: '1', name: 'Stripe', tagline: 'Online payment processing for internet businesses', link: 'https://stripe.com', status: 'active', gradient: 'company-gradient-1', logo: 'https://logo.clearbit.com/stripe.com' },
      { id: '2', name: 'Airbnb', tagline: 'Book unique homes and experiences', link: 'https://airbnb.com', status: 'active', gradient: 'company-gradient-2', logo: 'https://logo.clearbit.com/airbnb.com' },
      { id: '3', name: 'DoorDash', tagline: 'Restaurant delivery at your doorstep', link: 'https://doordash.com', status: 'active', gradient: 'company-gradient-3', logo: 'https://logo.clearbit.com/doordash.com' },
      { id: '4', name: 'Coinbase', tagline: 'Buy, sell, and manage cryptocurrency', link: 'https://coinbase.com', status: 'active', gradient: 'company-gradient-4', logo: 'https://logo.clearbit.com/coinbase.com' },
      { id: '5', name: 'Instacart', tagline: 'Grocery delivery in as fast as 1 hour', link: 'https://instacart.com', status: 'active', gradient: 'company-gradient-5', logo: 'https://logo.clearbit.com/instacart.com' },
      // Inactive companies
      { id: '6', name: 'Atrium', tagline: 'Legal services for startups', link: '#', status: 'inactive', gradient: 'company-gradient-1' },
      { id: '7', name: 'Kite', tagline: 'AI-powered coding assistant', link: '#', status: 'inactive', gradient: 'company-gradient-2' },
      { id: '8', name: 'Tutorspree', tagline: 'Marketplace for tutors', link: '#', status: 'inactive', gradient: 'company-gradient-3' },
      { id: '9', name: 'Starsky Robotics', tagline: 'Autonomous trucking technology', link: '#', status: 'inactive', gradient: 'company-gradient-4' },
      { id: '10', name: 'Treeline', tagline: 'Visual programming for backend', link: '#', status: 'inactive', gradient: 'company-gradient-5' },
    ]
  },
  {
    id: 'pear',
    name: 'Pear VC',
    companies: [
      // Active companies
      { id: '11', name: 'Vise', tagline: 'AI-driven portfolio management', link: 'https://vise.com', status: 'active', gradient: 'company-gradient-2', logo: 'https://logo.clearbit.com/vise.com' },
      { id: '12', name: 'Nash', tagline: 'Non-custodial crypto exchange', link: 'https://nash.io', status: 'active', gradient: 'company-gradient-3', logo: 'https://logo.clearbit.com/nash.io' },
      { id: '13', name: 'Guardant Health', tagline: 'Precision oncology company', link: 'https://guardanthealth.com', status: 'active', gradient: 'company-gradient-4', logo: 'https://logo.clearbit.com/guardanthealth.com' },
      { id: '14', name: 'Affinity', tagline: 'Relationship intelligence platform', link: 'https://affinity.co', status: 'active', gradient: 'company-gradient-5', logo: 'https://logo.clearbit.com/affinity.co' },
      { id: '15', name: 'Branch', tagline: 'Deep linking and mobile attribution', link: 'https://branch.io', status: 'active', gradient: 'company-gradient-1', logo: 'https://logo.clearbit.com/branch.io' },
      // Inactive companies
      { id: '16', name: 'Accompany', tagline: 'Relationship intelligence platform', link: '#', status: 'inactive', gradient: 'company-gradient-2' },
      { id: '17', name: 'LiveRail', tagline: 'Video advertising platform', link: '#', status: 'inactive', gradient: 'company-gradient-3' },
      { id: '18', name: 'Maginatics', tagline: 'Cloud storage software', link: '#', status: 'inactive', gradient: 'company-gradient-4' },
      { id: '19', name: 'FoundationDB', tagline: 'Distributed database', link: '#', status: 'inactive', gradient: 'company-gradient-5' },
      { id: '20', name: 'Inkling', tagline: 'Digital textbook platform', link: '#', status: 'inactive', gradient: 'company-gradient-1' },
    ]
  },
  {
    id: '20vc',
    name: '20VC',
    companies: [
      // Active companies
      { id: '21', name: 'BeReal', tagline: 'Authentic social media platform', link: 'https://bereal.com', status: 'active', gradient: 'company-gradient-3', logo: 'https://logo.clearbit.com/bereal.com' },
      { id: '22', name: 'Synthesia', tagline: 'AI video generation platform', link: 'https://synthesia.io', status: 'active', gradient: 'company-gradient-4', logo: 'https://logo.clearbit.com/synthesia.io' },
      { id: '23', name: 'Hopin', tagline: 'Virtual events platform', link: 'https://hopin.com', status: 'active', gradient: 'company-gradient-5', logo: 'https://logo.clearbit.com/hopin.com' },
      { id: '24', name: 'Sorare', tagline: 'Fantasy football with NFTs', link: 'https://sorare.com', status: 'active', gradient: 'company-gradient-1', logo: 'https://logo.clearbit.com/sorare.com' },
      { id: '25', name: 'Pitch', tagline: 'Collaborative presentation software', link: 'https://pitch.com', status: 'active', gradient: 'company-gradient-2', logo: 'https://logo.clearbit.com/pitch.com' },
      // Inactive companies
      { id: '26', name: 'Quibi', tagline: 'Short-form mobile video platform', link: '#', status: 'inactive', gradient: 'company-gradient-3' },
      { id: '27', name: 'Essential', tagline: 'Smartphone manufacturer', link: '#', status: 'inactive', gradient: 'company-gradient-4' },
      { id: '28', name: 'Vine', tagline: 'Short-form video platform', link: '#', status: 'inactive', gradient: 'company-gradient-5' },
      { id: '29', name: 'Homejoy', tagline: 'Home cleaning marketplace', link: '#', status: 'inactive', gradient: 'company-gradient-1' },
      { id: '30', name: 'Rdio', tagline: 'Music streaming service', link: '#', status: 'inactive', gradient: 'company-gradient-2' },
    ]
  }
];

export interface InsightCard {
  category: string;
  title: string;
  insight: string;
  score: number; // 0-100
  type: 'positive' | 'neutral' | 'negative';
}

export const aiInsights: InsightCard[] = [
  {
    category: 'Business Overview',
    title: 'Business Viability',
    insight: 'Your B2B SaaS targets the $47B workflow automation market with a clear value proposition for mid-market companies.',
    score: 85,
    type: 'positive'
  },
  {
    category: 'Business Overview',
    title: 'Monetization Strategy',
    insight: 'Subscription model with tiered pricing aligns well with SaaS industry standards. Average ACV of $2,400 is competitive.',
    score: 78,
    type: 'positive'
  },
  {
    category: 'Business Overview',
    title: 'User Pain Points',
    insight: 'Addresses critical inefficiencies in manual processes, saving teams 15-20 hours per week on average.',
    score: 92,
    type: 'positive'
  },
  {
    category: 'Business Overview',
    title: 'Revenue Opportunities',
    insight: 'TAM of $12B in your target segments with 23% YoY growth. Multiple expansion vectors identified.',
    score: 80,
    type: 'positive'
  },
  {
    category: 'Business Overview',
    title: 'Potential Risks',
    insight: 'High competition from established players like Monday.com and Asana. Differentiation strategy needed.',
    score: 45,
    type: 'negative'
  },
  {
    category: 'Market Research',
    title: 'Market Trends',
    insight: 'AI-powered automation adoption increasing 34% annually. Remote work driving demand for unified platforms.',
    score: 88,
    type: 'positive'
  },
  {
    category: 'Market Research',
    title: 'Market Size & Growth',
    insight: 'Serviceable market of $3.2B growing at 28% CAGR. Strong secular tailwinds in productivity software.',
    score: 90,
    type: 'positive'
  },
  {
    category: 'Market Research',
    title: 'Customer Segmentation',
    insight: '50-200 employee companies show highest willingness to pay. Engineering and operations teams are primary users.',
    score: 75,
    type: 'positive'
  },
  {
    category: 'Market Research',
    title: 'Regulatory Environment',
    insight: 'GDPR and SOC2 compliance required for enterprise deals. Data residency requirements vary by region.',
    score: 65,
    type: 'neutral'
  }
];

export const businessCards: BusinessCard[] = [
  {
    title: 'Business Overview',
    items: ['Business viability', 'Monetization strategies', 'User pain points', 'Revenue opportunities', 'Potential risks']
  },
  {
    title: 'Market Research',
    items: ['Market trends', 'Market size & growth', 'Customer segmentation', 'Regulatory environment']
  }
];

export const mockFollowupQuestion = "What specific problem does your product solve and who is your target customer?";