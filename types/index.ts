export type SourceType = 'rss' | 'web';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  selector?: string; // CSS selector for web scraping
  imageSelector?: string; // CSS selector for image
  summarySelector?: string; // CSS selector for summary/bajada
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
  content?: string;
  contentSnippet?: string;
  imageUrl?: string;
  matchedActorIds: string[];
  tags: Tag[]; // Made mandatory for consistency
}

export interface Tag {
  text: string;
  category: 'company' | 'person' | 'country' | 'concept';
}
