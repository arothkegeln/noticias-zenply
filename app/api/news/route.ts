import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/types';

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
                            const response = await fetch(source.url);
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
                                        pubDate: new Date().toISOString(), // Web scraping doesn't always give date easily
                                        contentSnippet: '',
                                        matchedActorIds: [],
                                    });
                                }
                            });

                        } catch (scrapeError) {
                            console.error(`Error scraping ${source.name}:`, scrapeError);
                        }
                    } else {
                        // Default to RSS
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
