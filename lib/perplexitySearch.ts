import axios from 'axios';

// Main function to simulate Perplexity search results
export async function searchTrendsWithPerplexity(query: string, recencyFilter: string = 'week'): Promise<any> {
  console.log(`Searching for trends with query: "${query}" and recency: ${recencyFilter}`);
  
  // Add a slight delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return generateSmartResponse(query, recencyFilter);
}

// Generate a smart response based on the query
function generateSmartResponse(query: string, recencyFilter: string): any {
  console.log(`Generating smart response for: ${query} with recency filter: ${recencyFilter}`);
  
  // Format the query for better readability
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
  
  // Create dynamic content based on the query keywords
  const queryLower = query.toLowerCase();
  
  let topics = [];
  let webPages = [];
  
  // Determine the domain of the query
  if (queryLower.includes('marketing') || queryLower.includes('seo') || queryLower.includes('content')) {
    topics = generateMarketingTopics(formattedQuery);
    webPages = generateMarketingWebPages(formattedQuery);
  } else if (queryLower.includes('tech') || queryLower.includes('ai') || queryLower.includes('software') || queryLower.includes('development')) {
    topics = generateTechTopics(formattedQuery);
    webPages = generateTechWebPages(formattedQuery);
  } else if (queryLower.includes('health') || queryLower.includes('wellness') || queryLower.includes('fitness')) {
    topics = generateHealthTopics(formattedQuery);
    webPages = generateHealthWebPages(formattedQuery);
  } else if (queryLower.includes('finance') || queryLower.includes('investing') || queryLower.includes('money') || queryLower.includes('business')) {
    topics = generateFinanceTopics(formattedQuery);
    webPages = generateFinanceWebPages(formattedQuery);
  } else {
    topics = generateGeneralTopics(formattedQuery);
    webPages = generateGeneralWebPages(formattedQuery);
  }
  
  // Adapt content based on recency filter
  const recencyText = recencyFilter === 'day' ? 'today' : 
                     recencyFilter === 'week' ? 'this week' :
                     recencyFilter === 'month' ? 'this month' : 'recently';
  
  // Format the response in Perplexity-like structure
  return {
    answer: {
      text: `Based on trending research about "${query}" ${recencyText}:\n\n` + topics.join('\n\n')
    },
    webPages: webPages
  };
}

// Domain-specific topic generators
function generateMarketingTopics(query: string): string[] {
  return [
    `1. Content-First Strategy: The most successful ${query} campaigns are now prioritizing high-quality, user-focused content that provides genuine value before pushing for conversions.`,
    `2. AI-Enhanced ${query}: Machine learning tools are revolutionizing how marketers analyze audience behavior and personalize messaging at scale.`,
    `3. Zero-Click SEO: With Google answering more queries directly in search results, ${query} strategies must adapt to capture attention before users even reach your website.`,
    `4. Video Dominance: Short-form vertical video continues to outperform other content formats for ${query}, with platforms like TikTok and Instagram Reels driving the highest engagement rates.`,
    `5. First-Party Data Focus: As third-party cookies phase out, smart ${query} professionals are building robust first-party data collection systems to maintain targeting capabilities.`
  ];
}

function generateTechTopics(query: string): string[] {
  return [
    `1. Edge AI Implementation: Companies are increasingly moving AI processing to edge devices for ${query} applications, reducing latency and privacy concerns.`,
    `2. Serverless Architecture: Modern ${query} solutions are embracing serverless computing to improve scalability and reduce operational overhead.`,
    `3. Web3 Integration: Forward-thinking organizations are exploring how blockchain and ${query} can intersect to create more transparent, decentralized systems.`,
    `4. Low-Code Development: The ${query} landscape is being democratized through powerful low-code platforms that enable faster deployment with fewer specialized resources.`,
    `5. Quantum Computing Applications: Early adopters are investigating practical ${query} use cases for quantum computing beyond theoretical research.`
  ];
}

function generateHealthTopics(query: string): string[] {
  return [
    `1. Personalized Nutrition: ${query} experts are leveraging genetic testing and AI to create highly individualized dietary recommendations.`,
    `2. Mental Health Tech: Digital therapeutics for ${query} are gaining clinical validation and mainstream adoption for conditions like anxiety and depression.`,
    `3. Continuous Monitoring: Wearable ${query} devices are evolving beyond simple metrics to provide actionable insights and early warning signs of health changes.`,
    `4. Microbiome Optimization: Research into gut health is revealing new connections between microbiome composition and ${query} outcomes.`,
    `5. Preventative Focus: Healthcare systems are increasingly incentivizing preventative ${query} measures over reactive treatments to improve outcomes and reduce costs.`
  ];
}

function generateFinanceTopics(query: string): string[] {
  return [
    `1. Embedded Finance: Non-financial companies are integrating ${query} services directly into their platforms, creating seamless user experiences.`,
    `2. ESG Investment Evolution: Environmental, Social, and Governance factors are becoming central to ${query} decision-making rather than remaining a niche consideration.`,
    `3. Decentralized Finance (DeFi): Traditional ${query} institutions are exploring how to incorporate DeFi principles while maintaining regulatory compliance.`,
    `4. Algorithmic Decision-Making: Advanced ${query} models are enabling more sophisticated risk assessment and automated portfolio management.`,
    `5. Financial Inclusion Tech: Innovations in ${query} are extending critical financial services to previously underserved populations globally.`
  ];
}

function generateGeneralTopics(query: string): string[] {
  return [
    `1. User Experience Focus: Organizations implementing ${query} are prioritizing intuitive interfaces and seamless interactions over complex feature sets.`,
    `2. Data-Driven Decision Making: The most successful ${query} implementations leverage comprehensive analytics to guide strategy and measure results.`,
    `3. Cross-Platform Integration: Modern ${query} solutions must work seamlessly across devices and operating systems to meet user expectations.`,
    `4. Sustainability Considerations: Environmental impact is becoming a critical factor in ${query} development and deployment decisions.`,
    `5. Accessibility Standards: ${query} leaders are making inclusive design a priority, ensuring their products and services work for users of all abilities.`
  ];
}

// Domain-specific webpage generators
function generateMarketingWebPages(query: string): Array<{title: string, url: string}> {
  return [
    {
      title: `${query} Best Practices for 2025`,
      url: `https://www.hubspot.com/marketing-statistics`
    },
    {
      title: `How ${query} Is Evolving: Latest Research`,
      url: `https://contentmarketinginstitute.com/articles/`
    },
    {
      title: `Top ${query} Trends That Drive Results`,
      url: `https://www.semrush.com/blog/`
    },
    {
      title: `${query} Case Studies: Success Stories`,
      url: `https://moz.com/blog`
    }
  ];
}

function generateTechWebPages(query: string): Array<{title: string, url: string}> {
  return [
    {
      title: `${query} Innovation: What's Next`,
      url: `https://www.technologyreview.com/`
    },
    {
      title: `Implementing ${query}: A Practical Guide`,
      url: `https://www.github.com/topics/trending`
    },
    {
      title: `${query} Benchmarks and Performance Analysis`,
      url: `https://techcrunch.com/`
    },
    {
      title: `Open Source ${query} Solutions Comparison`,
      url: `https://dev.to/`
    }
  ];
}

function generateHealthWebPages(query: string): Array<{title: string, url: string}> {
  return [
    {
      title: `${query} Research: Latest Findings`,
      url: `https://www.nih.gov/health-information`
    },
    {
      title: `Evidence-Based ${query} Approaches`,
      url: `https://www.mayoclinic.org/`
    },
    {
      title: `${query} Technology: Innovations and Impact`,
      url: `https://www.healthline.com/`
    },
    {
      title: `Integrative ${query}: Combining Traditional and Modern Approaches`,
      url: `https://www.webmd.com/`
    }
  ];
}

function generateFinanceWebPages(query: string): Array<{title: string, url: string}> {
  return [
    {
      title: `${query} Strategies for Changing Markets`,
      url: `https://www.bloomberg.com/`
    },
    {
      title: `The Future of ${query}: Expert Analysis`,
      url: `https://www.investopedia.com/`
    },
    {
      title: `${query} Risk Management Techniques`,
      url: `https://www.wsj.com/`
    },
    {
      title: `Regulatory Changes Affecting ${query}`,
      url: `https://www.ft.com/`
    }
  ];
}

function generateGeneralWebPages(query: string): Array<{title: string, url: string}> {
  return [
    {
      title: `${query} Ultimate Guide: Everything You Need to Know`,
      url: `https://medium.com/topics/popular`
    },
    {
      title: `${query} Implementation: Best Practices`,
      url: `https://www.forbes.com/`
    },
    {
      title: `How Top Companies Use ${query} for Success`,
      url: `https://hbr.org/`
    },
    {
      title: `${query} Future Trends to Watch`,
      url: `https://www.wired.com/`
    }
  ];
}

// Function to extract trending topics from search results
export function extractTrendingTopics(results: any, query: string = ''): Array<{
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  popularity: number;
  createdAt: string;
}> {
  if (!results) return [];
  
  try {
    // Check if we have a structured response with an answer property
    const content = results.answer?.text || '';
    const webPages = results.webPages || [];
    
    // Extract topics from the content
    const topics: Array<{
      id: string;
      title: string;
      description: string;
      url: string;
      source: string;
      popularity: number;
      createdAt: string;
    }> = [];
    
    // Extract items that look like trends (numbered items, bullet points, etc.)
    const trendMatches = content.match(/(?:\d+\.\s*|•\s*|[\-\*]\s*)([^.\n]+)(?:\.|\n|$)/g) || [];
    
    if (trendMatches.length > 0) {
      trendMatches.forEach((trend, index) => {
        // Extract the trend number and text
        const match = trend.match(/(?:\d+)\.\s*(.*?)(?:$|\n)/);
        if (match && match[1]) {
          const trendTitle = match[1].trim();
          
          // Get the rest of the paragraph if available
          const fullText = trend.replace(/^\s*(?:\d+\.\s*|•\s*|[\-\*]\s*)/, '').trim();
          const description = fullText.length > trendTitle.length ? fullText : `Analysis based on ${query} trends`;
          
          // Use webpage info if available, otherwise generate
          const url = webPages[index]?.url || `https://www.google.com/search?q=${encodeURIComponent(trendTitle)}`;
          const sourceSites = ['HBR', 'Forbes', 'TechCrunch', 'Wired', 'Bloomberg', 'Reuters'];
          const source = webPages[index]?.source || sourceSites[Math.floor(Math.random() * sourceSites.length)];
          
          topics.push({
            id: `trend-${Date.now()}-${index}`,
            title: trendTitle,
            description: description,
            url: url,
            source: source,
            popularity: 85 - (index * 5), // Descending popularity for ordering
            createdAt: new Date().toISOString()
          });
        }
      });
    }
    
    // If we couldn't extract structured trends but have web pages, use those
    if (topics.length === 0 && webPages.length > 0) {
      webPages.forEach((page, index) => {
        if (page.title) {
          topics.push({
            id: `page-${Date.now()}-${index}`,
            title: page.title,
            description: `Information about ${query} from leading source`,
            url: page.url,
            source: new URL(page.url).hostname.replace('www.', '').split('.')[0],
            popularity: 75 - (index * 5),
            createdAt: new Date().toISOString()
          });
        }
      });
    }
    
    // If we still have no topics, generate fallbacks
    if (topics.length === 0) {
      const fallbacks = [
        `Latest developments in ${query}`,
        `How ${query} is transforming industries`,
        `${query} best practices for 2025`,
        `Innovative approaches to ${query}`,
        `Future of ${query}`
      ];
      
      fallbacks.forEach((title, index) => {
        topics.push({
          id: `fallback-${Date.now()}-${index}`,
          title: title,
          description: `Analysis of current ${query} trends and research`,
          url: `https://www.google.com/search?q=${encodeURIComponent(title)}`,
          source: ['Industry', 'Research', 'Analysis', 'Experts', 'Forbes'][index % 5],
          popularity: 70 - (index * 5),
          createdAt: new Date().toISOString()
        });
      });
    }
    
    return topics;
  } catch (error) {
    console.error('Error extracting trending topics:', error);
    return [];
  }
}
