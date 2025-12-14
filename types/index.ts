export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'web';
  selector?: string; // CSS selector for web scraping
}

export interface Actor {
  id: string;
  name: string;
  keywords: string[];
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  sourceId: string;
  sourceName: string;
  pubDate: string;
  contentSnippet?: string;
  matchedActorIds: string[];
}
