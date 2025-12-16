import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/types';
import { extractKeywords } from '@/lib/keyword-extractor';

const parser = new Parser();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sources } = body;

        if (!sources || !Array.isArray(sources)) {
            return NextResponse.json({ error: 'Invalid sources' }, { status: 400 });
        }

        const allNews: NewsItem[] = [];

        await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sources.map(async (source: any) => {
                try {
                    if (source.type === 'web' && source.selector) {
                        try {
                            const response = await fetch(source.url, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
                                }
                            });
                            const html = await response.text();
                            const $ = cheerio.load(html);

                            $(source.selector).each((_, element) => {
                                const title = $(element).text().trim();
                                const link = $(element).attr('href');

                                if (title && link) {
                                    // Fix relative URLs
                                    const absoluteLink = link.startsWith('http')
                                        ? link
                                        : new URL(link, source.url).toString();

                                    allNews.push({
                                        id: `${absoluteLink}-${Math.random().toString(36).substr(2, 9)}`,
                                        title: title,
                                        link: absoluteLink,
                                        sourceId: source.id,
                                        sourceName: source.name,
                                        pubDate: new Date().toISOString(),
                                        contentSnippet: '',
                                        matchedActorIds: [],
                                        tags: extractKeywords(title, ''),
                                    });
                                }
                            });

                        } catch (scrapeError) {
                            console.error(`Error scraping ${source.name}:`, scrapeError);
                        }
                    } else {
                        const feed = await parser.parseURL(source.url);
                        feed.items.forEach((item) => {
                            if (item.title && item.link) {
                                allNews.push({
                                    id: `${item.guid || item.link}-${Math.random().toString(36).substr(2, 9)}`,
                                    title: item.title,
                                    link: item.link,
                                    sourceId: source.id,
                                    sourceName: source.name,
                                    pubDate: item.pubDate || new Date().toISOString(),
                                    contentSnippet: item.contentSnippet || item.content,
                                    matchedActorIds: [],
                                    tags: extractKeywords(item.title, item.contentSnippet || item.content),
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${source.name}:`, error);
                }
            })
        );

        // Sort by date desc
        allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        return NextResponse.json({ news: allNews });
    } catch (error) {
        console.error("API Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
