export type DefaultFeed = {
  sourceName: string;
  topic: string;
  category: string;
  rssUrl: string;
  description: string;
  fetchIntervalMinutes: number;
};

export const defaultFeeds: DefaultFeed[] = [
  {
    sourceName: "BBC News",
    topic: "General",
    category: "Top Stories",
    rssUrl: "http://feeds.bbci.co.uk/news/rss.xml",
    description: "The top global breaking news and headlines from the BBC.",
    fetchIntervalMinutes: 15
  },
  {
    sourceName: "New York Times",
    topic: "World",
    category: "World News",
    rssUrl: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    description: "Extensive global coverage, investigations, and analysis from the NYT.",
    fetchIntervalMinutes: 20
  },
  {
    sourceName: "CNN",
    topic: "General",
    category: "Top Stories",
    rssUrl: "http://rss.cnn.com/rss/edition.rss",
    description: "International top stories and breaking news updates from CNN.",
    fetchIntervalMinutes: 15
  },
  {
    sourceName: "TechCrunch",
    topic: "Technology",
    category: "Startups & VC",
    rssUrl: "https://techcrunch.com/feed/",
    description: "The latest on technology, startup funding, and venture capital.",
    fetchIntervalMinutes: 15
  },
  {
    sourceName: "The Verge",
    topic: "Technology",
    category: "Culture",
    rssUrl: "https://www.theverge.com/rss/index.xml",
    description: "In-depth articles covering the intersection of technology, science, and art.",
    fetchIntervalMinutes: 20
  },
  {
    sourceName: "Wired",
    topic: "Technology",
    category: "Top Stories",
    rssUrl: "https://www.wired.com/feed/rss",
    description: "Technology, science, business, and cultural trends.",
    fetchIntervalMinutes: 20
  },
  {
    sourceName: "Wall Street Journal",
    topic: "Business",
    category: "Finance",
    rssUrl: "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
    description: "Top finance, market, and business news from WSJ.",
    fetchIntervalMinutes: 15
  },
  {
    sourceName: "New York Times",
    topic: "Business",
    category: "Business",
    rssUrl: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    description: "Breaking news on the economy, stock markets, and media.",
    fetchIntervalMinutes: 20
  },
  {
    sourceName: "CNBC",
    topic: "Business",
    category: "Top News",
    rssUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?profile=120000000&id=100003114",
    description: "Latest business and financial news updates.",
    fetchIntervalMinutes: 15
  }
];

export const availableTopics = Array.from(new Set(defaultFeeds.map((feed) => feed.topic)));
