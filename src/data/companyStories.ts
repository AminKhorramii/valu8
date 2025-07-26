export interface CompanyStory {
  id: string;
  companyName: string;
  tagline: string;
  foundedYear: number;
  closedYear: number;
  founders: string[];
  totalFunding: string;
  lastValuation: string;
  story: {
    title: string;
    summary: string;
    sections: {
      heading: string;
      content: string;
    }[];
  };
}

export const companyStories: CompanyStory[] = [
  {
    id: 'atrium',
    companyName: 'Atrium',
    tagline: 'Legal services for startups',
    foundedYear: 2017,
    closedYear: 2020,
    founders: ['Justin Kan', 'Augie Rakow'],
    totalFunding: '$75.5M',
    lastValuation: '$400M',
    story: {
      title: 'The Rise and Fall of Atrium: When Tech Meets Law',
      summary: 'Atrium aimed to revolutionize legal services for startups by combining technology with traditional law practice. Despite raising significant funding and attracting high-profile clients, the company shut down in 2020, offering valuable lessons about market timing and business model validation.',
      sections: [
        {
          heading: 'The Vision',
          content: 'Founded by serial entrepreneur Justin Kan (co-founder of Twitch), Atrium set out to modernize legal services for startups. The vision was compelling: use technology to make legal work more efficient, transparent, and affordable. The company promised to combine the expertise of top-tier lawyers with software tools that could automate routine legal tasks.'
        },
        {
          heading: 'Early Success and Rapid Growth',
          content: 'Atrium quickly gained traction in Silicon Valley, attracting clients ranging from early-stage startups to unicorn companies. The firm\'s tech-forward approach resonated with founders who were frustrated with traditional law firms. By 2019, Atrium had raised $75.5 million in funding and was valued at $400 million, with backing from investors like Andreessen Horowitz and General Catalyst.'
        },
        {
          heading: 'The Technology Promise',
          content: 'The core of Atrium\'s proposition was its proprietary software platform that would streamline legal processes. The company invested heavily in building tools for contract generation, legal research, and case management. However, the technology development proved more challenging and expensive than anticipated. The legal industry\'s resistance to change and regulatory constraints made automation more difficult than in other sectors.'
        },
        {
          heading: 'Market Reality Check',
          content: 'Despite the initial enthusiasm, Atrium faced several challenges. The legal services market proved to be more traditional and price-sensitive than expected. Many startups, especially in early stages, opted for cheaper alternatives or delayed legal work during economic uncertainty. The COVID-19 pandemic further reduced demand as startups tightened budgets.'
        },
        {
          heading: 'The Economics Problem',
          content: 'Atrium\'s business model required significant upfront investment in technology and talent while generating revenue through traditional hourly billing. This created a mismatch between costs and revenue that became unsustainable. The company struggled to achieve the scale necessary to make its technology investments profitable.'
        },
        {
          heading: 'The Shutdown Decision',
          content: 'In March 2020, Justin Kan announced that Atrium would be shutting down. In a candid blog post, he explained that the company had failed to find sufficient product-market fit and that continuing operations would not be in the best interest of employees or investors. The shutdown was handled professionally, with the company helping clients transition to other firms.'
        },
        {
          heading: 'Lessons Learned',
          content: 'Atrium\'s story offers several important lessons: 1) Technology alone cannot disrupt every industry - some sectors have fundamental constraints that limit automation. 2) Market timing is crucial - launching during a period of economic uncertainty affected demand. 3) Business model validation is essential - even with great technology, the economics must work. 4) Founder honesty and professional shutdown can preserve relationships and reputation for future ventures.'
        }
      ]
    }
  },
  {
    id: 'kite',
    companyName: 'Kite',
    tagline: 'AI-powered coding assistant',
    foundedYear: 2014,
    closedYear: 2022,
    founders: ['Adam Smith'],
    totalFunding: '$17M',
    lastValuation: 'Undisclosed',
    story: {
      title: 'Kite: The AI Coding Assistant That Was Ahead of Its Time',
      summary: 'Kite was building AI-powered code completion tools years before GitHub Copilot made the concept mainstream. Despite being technically innovative and ahead of its time, Kite struggled to achieve sustainable growth and shut down in 2022, just as the market was beginning to embrace AI coding assistants.',
      sections: [
        {
          heading: 'The Early Vision',
          content: 'Founded in 2014 by Adam Smith, Kite had an ambitious vision: use machine learning to help developers write code faster and with fewer bugs. The company began developing AI models that could understand code context and provide intelligent suggestions - a concept that seemed futuristic at the time.'
        },
        {
          heading: 'Technical Innovation',
          content: 'Kite built impressive technology, creating local AI models that could provide code completions without sending code to external servers - a crucial privacy feature for enterprise customers. The company developed plugins for popular editors like VS Code, Atom, and PyCharm, offering real-time code suggestions powered by deep learning models trained on millions of code repositories.'
        },
        {
          heading: 'Market Timing Challenges',
          content: 'While Kite\'s technology was innovative, the market wasn\'t quite ready. In 2014-2018, many developers were skeptical of AI-assisted coding. The concept of machines helping write code felt foreign to many programmers who prided themselves on their craft. Enterprise adoption was slow, as companies were cautious about integrating AI tools into their development workflows.'
        },
        {
          heading: 'Competition and Market Evolution',
          content: 'As the market evolved, larger tech companies began investing heavily in similar technologies. Microsoft\'s acquisition of GitHub and subsequent development of Copilot created a formidable competitor with vast resources and direct access to millions of developers. Google, Amazon, and other tech giants also began developing competing AI coding tools.'
        },
        {
          heading: 'Monetization Struggles',
          content: 'Kite faced challenges in converting its free users to paid plans. While the tool had a dedicated user base, many developers expected coding tools to be free. The company struggled to demonstrate clear ROI to enterprise customers, making it difficult to achieve the recurring revenue needed to sustain operations.'
        },
        {
          heading: 'The Ironic Timing',
          content: 'In November 2022, Kite announced it would be shutting down - just as AI coding assistants were becoming mainstream. GitHub Copilot had launched to great fanfare, and the developer community\'s attitude toward AI assistance had shifted dramatically. The very market Kite had been trying to create for years was finally materializing, but it was too late for the company.'
        },
        {
          heading: 'Key Takeaways',
          content: 'Kite\'s story illustrates the challenges of being too early to market: 1) Great technology isn\'t enough if the market isn\'t ready. 2) Being first doesn\'t guarantee success - sometimes being second with better execution and resources wins. 3) Market timing can make or break a company, regardless of technical merit. 4) Persistence is important, but knowing when to pivot or shut down is equally crucial.'
        }
      ]
    }
  },
  {
    id: 'tutorspree',
    companyName: 'Tutorspree',
    tagline: 'Marketplace for tutors',
    foundedYear: 2011,
    closedYear: 2013,
    founders: ['Ryan Bednar', 'Josh Abramson'],
    totalFunding: '$2.1M',
    lastValuation: 'Undisclosed',
    story: {
      title: 'Tutorspree: The Marketplace That Couldn\'t Scale',
      summary: 'Tutorspree was an early attempt to create an online marketplace connecting students with tutors. Despite initial traction and funding, the company struggled with unit economics and market dynamics that made sustainable growth impossible, leading to its acquisition and eventual shutdown.',
      sections: [
        {
          heading: 'The Marketplace Dream',
          content: 'Founded in 2011, Tutorspree aimed to solve a real problem: connecting students who needed academic help with qualified tutors. The founders, Ryan Bednar and Josh Abramson, envisioned a platform that would make it easy for anyone to find and book tutoring sessions, similar to how Airbnb connected travelers with hosts.'
        },
        {
          heading: 'Early Traction',
          content: 'The concept resonated with users, and Tutorspree quickly gained traction. Students appreciated the ability to browse tutor profiles, read reviews, and book sessions online. Tutors liked the platform\'s tools for managing schedules and payments. The company raised $2.1 million in seed funding and seemed poised for growth.'
        },
        {
          heading: 'The Unit Economics Problem',
          content: 'However, Tutorspree faced fundamental challenges with its business model. Unlike other successful marketplaces, tutoring sessions were infrequent and highly personal. Students often formed long-term relationships with tutors and would move off-platform to avoid fees. This made it difficult to maintain the transaction volume needed to sustain the marketplace.'
        },
        {
          heading: 'Supply and Demand Imbalance',
          content: 'The company struggled to balance supply and demand across different subjects and geographic areas. While there was strong demand for math and science tutoring, finding qualified tutors in specialized subjects or specific locations proved challenging. This led to poor user experiences and reduced platform efficiency.'
        },
        {
          heading: 'Competition from Alternatives',
          content: 'Tutorspree faced competition not just from other startups, but from traditional tutoring services, schools, and informal networks. Many students found tutors through word-of-mouth or school programs, making it hard for the platform to capture significant market share. The low switching costs made it easy for users to try alternatives.'
        },
        {
          heading: 'The Acquisition and Pivot',
          content: 'In 2013, Tutorspree was acquired by Wyzant, a competing tutoring platform. While this provided an exit for investors, it effectively marked the end of the Tutorspree brand and vision. The acquisition was more about acquiring users and technology rather than a successful business outcome.'
        },
        {
          heading: 'Lessons for Marketplace Builders',
          content: 'Tutorspree\'s experience offers valuable insights for marketplace entrepreneurs: 1) Not all services work well as marketplaces - personal, infrequent services can be challenging. 2) Unit economics must work from early stages. 3) Network effects need to be strong enough to prevent disintermediation. 4) Consider whether your marketplace faces unique challenges that don\'t exist in other categories.'
        }
      ]
    }
  }
];