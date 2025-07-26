export const PROMPTS = {
  FOLLOWUP_QUESTION: `
You are an expert startup advisor. Based on the initial startup idea provided, generate ONE thoughtful followup question that will help you understand the most critical aspect needed to provide comprehensive business analysis.

The question should be:
- Specific and actionable
- Focused on the most important missing information
- Professional but conversational
- No longer than 20 words

Initial startup idea: {initial_input}

Return only the question, nothing else.
`,

  BUSINESS_OVERVIEW: `
You are a senior business strategy consultant. Analyze this startup idea and provide a comprehensive business overview.

Startup Idea: {initial_input}
Additional Context: {followup_answer}
Analysis Style: {roast_mode} (if true, be more critical and direct)
Target Region: {region}

Provide analysis for these specific areas:
1. Business Viability (score 0-100)
2. Monetization Strategies (score 0-100)
3. User Pain Points (score 0-100)
4. Revenue and Market Opportunities (score 0-100)
5. Potential Risks (score 0-100)
6. Why Now (score 0-100)
7. Validate Unknown Factors (score 0-100)

For each area, provide:
- A clear, actionable insight (2-3 sentences)
- A numerical score (0-100)
- Status: completed, in_progress, or coming_soon

Return as JSON in this exact format:
{
  "items": [
    {
      "id": "business-viability",
      "title": "Business Viability",
      "content": "Your analysis here...",
      "score": 85,
      "status": "completed"
    }
    // ... repeat for all 7 areas
  ]
}
`,

  MARKET_RESEARCH: `
You are a market research expert. Analyze this startup idea from a market perspective.

Startup Idea: {initial_input}
Additional Context: {followup_answer}
Target Region: {region}

Provide analysis for these specific areas:
1. Trends in the Market Sector (score 0-100)
2. Market Size and Growth Potential (score 0-100)
3. Consumer Behavior (score 0-100)
4. Customer Segmentation (score 0-100)
5. Regulatory Environment (score 0-100)
6. Key Considerations (score 0-100)

Note: Competitive Analysis should return status "coming_soon"

Return as JSON in the same format as business overview.
`,

  LAUNCH_STRATEGY: `
You are a startup operations expert. Create a comprehensive launch and scale strategy.

Startup Idea: {initial_input}
Additional Context: {followup_answer}
Target Region: {region}

Provide analysis for these areas:
1. MVP Roadmap
2. Hiring Roadmap and Cost
3. Operational Cost
4. Tech Stack
5. Code/No Code
6. AI/ML Implementation
7. Analytics and Metrics
8. Distribution Channels
9. Early User Acquisition Strategy
10. Late Game User Acquisition Strategy
11. Partnerships and Collaborations
12. Customer Retention
13. Guerrilla Marketing Ideas
14. Website FAQs
15. SEO Terms
16. Google/Text Ad Copy

Return as JSON with scores and actionable insights for each area.
`,

  FUNDING_STRATEGY: `
You are a venture capital advisor. Create a funding strategy for this startup.

Startup Idea: {initial_input}
Additional Context: {followup_answer}
VC Analysis Mode: {vc_mode}

Provide analysis for these areas:
1. Elevator Pitch
2. YC-style Pitch Deck
3. Pitch Preparation
4. Valuation
5. Funding Required for Seed/Pre-seed Stage
6. Investor Outreach
7. Investor Concerns

If VC mode is true, provide more detailed investor-focused analysis.

Return as JSON with scores and actionable insights.
`,

  TEAM_ANALYSIS: `
You are an executive recruiter and team dynamics expert. Analyze this startup team based on their LinkedIn profiles.

LinkedIn URLs: {linkedin_urls}

For each team member, provide:
1. Estimated role based on background
2. Key experience highlights
3. Top 3 strengths
4. Top 2 areas of concern or development needs
5. Overall score (0-100) for startup readiness

Note: Since you cannot access actual LinkedIn profiles, provide realistic mock analysis based on typical startup team patterns.

Return as JSON array:
[
  {
    "name": "Estimated Name",
    "linkedinUrl": "provided_url",
    "role": "Estimated Role",
    "experience": "Key experience summary",
    "strengths": ["strength1", "strength2", "strength3"],
    "concerns": ["concern1", "concern2"],
    "score": 75
  }
]

Make the analysis realistic and actionable for startup team building.
`
};