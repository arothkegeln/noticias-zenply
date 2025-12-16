import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { NewsItem } from '@/types';
import { extractKeywords } from '@/lib/keyword-extractor';
import { prisma } from '@/lib/prisma';

const parser = new Parser();

// Helper to fetch metadata from a single article URL
async function fetchArticleMetadata(url: string) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per article

        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const html = await response.text();
        const $ = cheerio.load(html);

        const image = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content');

        const description = $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content');

        // Extract body text for better tagging (limit to first 3000 chars to save memory/processing)
        const bodyText = $('article').text() || $('body').text();
        const cleanBody = bodyText.replace(/\s+/g, ' ').substring(0, 3000);

        // Extract Publish Date
        let date = $('meta[property="article:published_time"]').attr('content') ||
            $('meta[name="date"]').attr('content') ||
            $('meta[name="parsely-pub-date"]').attr('content') ||
            $('time').first().attr('datetime');

        // JSON-LD Fallback/Override (Often more reliable)
        if (!date) {
            $('script[type="application/ld+json"]').each((_, el) => {
                if (date) return;
                try {
                    const json = JSON.parse($(el).html() || '{}');
                    if (json['@type'] === 'NewsArticle' || json['@type'] === 'Article' || json['@type'] === 'Report') {
                        date = json.datePublished || json.dateModified || json.dateCreated;
                    }
                    // Verify if it is a graph array
                    if (Array.isArray(json['@graph'])) {
                        const article = json['@graph'].find((item: any) => item['@type'] === 'Article' || item['@type'] === 'NewsArticle');
                        if (article) {
                            date = article.datePublished || article.dateModified;
                        }
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            });
        }

        return { image, description, body: cleanBody, date };
    } catch (error) {
        return null;
    }
}

// Simple batch processor
async function processInBatches<T, R>(items: T[], batchSize: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(fn));
        results.push(...batchResults);
    }
    return results;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sources } = body;

        if (!sources || !Array.isArray(sources)) {
            return NextResponse.json({ error: 'Invalid sources' }, { status: 400 });
        }

        let allNews: NewsItem[] = [];
        const seenUrls = new Set<string>();

        // 1. Initial Fetch (RSS List / Web List)
        await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sources.map(async (source: any) => {
                try {
                    if (source.type === 'web' && source.selector) {
                        try {
                            const response = await fetch(source.url, {
                                cache: 'no-store',
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                }
                            });
                            const html = await response.text();
                            const $ = cheerio.load(html);

                            $(source.selector).each((_, element) => {
                                // PER SOURCE LIMIT REMOVED
                                // const sourceCount = allNews.filter(n => n.sourceId === source.id).length;
                                // if (sourceCount >= 40) return false; // Break Cheerio loop

                                const $el = $(element);
                                let title = $el.text().trim();
                                let link = $el.attr('href');

                                // Find closest link if element isn't one
                                if (!link) {
                                    const $link = $el.closest('a');
                                    if ($link.length) {
                                        link = $link.attr('href');
                                        if (!title) title = $link.text().trim();
                                    }
                                }

                                if (title && link) {
                                    const absoluteLink = link.startsWith('http') ? link : new URL(link, source.url).toString();

                                    // DEDUPLICATION CHECK
                                    if (seenUrls.has(absoluteLink)) return;
                                    seenUrls.add(absoluteLink);

                                    // Try to get easy metadata from listing first
                                    const $card = $el.closest('article') || $el.closest('.card') || $el.closest('div');
                                    let listImage = undefined;
                                    let listSummary = '';

                                    if (source.imageSelector) {
                                        listImage = $card.find(source.imageSelector).attr('src') || $card.find(source.imageSelector).attr('data-src');
                                        if (listImage && !listImage.startsWith('http')) {
                                            listImage = new URL(listImage, source.url).toString();
                                        }
                                    }

                                    if (source.summarySelector) {
                                        listSummary = $card.find(source.summarySelector).text().trim();
                                    }

                                    allNews.push({
                                        id: Buffer.from(absoluteLink).toString('base64'), // Deterministic ID
                                        title: title,
                                        link: absoluteLink,
                                        sourceId: source.id,
                                        sourceName: source.name,
                                        pubDate: new Date().toISOString(),
                                        contentSnippet: listSummary,
                                        imageUrl: listImage,
                                        matchedActorIds: [],
                                        tags: [], // Will populate properly after deep scrape
                                    });
                                }
                            });
                        } catch (scrapeError) {
                            console.error(`Error scraping ${source.name}:`, scrapeError);
                        }
                    } else {
                        // Use fetch + parseString to ensure consistent User-Agent and headers
                        try {
                            const response = await fetch(source.url, {
                                cache: 'no-store',
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                    'Accept': 'application/rss+xml, application/xml, text/xml, */*;q=0.8'
                                }
                            });

                            if (response.ok) {
                                const xml = await response.text();
                                const feed = await parser.parseString(xml);

                                feed.items.forEach((item) => {
                                    if (item.title && item.link) {
                                        // DEDUPLICATION CHECK
                                        if (seenUrls.has(item.link)) return;
                                        seenUrls.add(item.link);

                                        // PER SOURCE LIMIT REMOVED
                                        // const sourceCount = allNews.filter(n => n.sourceId === source.id).length;
                                        // if (sourceCount >= 40) return;

                                        allNews.push({
                                            id: Buffer.from(item.link).toString('base64'), // Deterministic ID
                                            title: item.title,
                                            link: item.link,
                                            sourceId: source.id,
                                            sourceName: source.name,
                                            pubDate: item.pubDate || new Date().toISOString(),
                                            contentSnippet: item.contentSnippet || item.content,
                                            matchedActorIds: [],
                                            tags: [],
                                        });
                                    }
                                });
                            }
                        } catch (rssError) {
                            console.error(`Error processing RSS ${source.name}:`, rssError);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching ${source.name}:`, error);
                }
            })
        );

        // Sort by date desc
        allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        // Limit Removed - User requested "Infinite" scraping even if slow
        // const recentNews = allNews.slice(0, 100);
        const recentNews = allNews;

        // 2. Deep Scraping & Persistence
        // Process in batches
        await processInBatches(recentNews, 5, async (item) => {
            try {
                // ... Metadata fetching logic ...
                const metadata = await fetchArticleMetadata(item.link);
                if (metadata) {
                    item.imageUrl = metadata.image || item.imageUrl;
                    item.contentSnippet = metadata.description || item.contentSnippet;
                    if (metadata.date) item.pubDate = metadata.date;

                    const tagContext = `${item.title} ${item.contentSnippet || ''} ${metadata.body}`;
                    item.tags = extractKeywords(item.title, tagContext);
                } else {
                    item.tags = extractKeywords(item.title, item.contentSnippet || '');
                }

                // UPSERT TO DATABASE
                try {
                    await prisma.news.upsert({
                        where: { url: item.link },
                        update: {},
                        create: {
                            url: item.link,
                            title: item.title,
                            sourceId: item.sourceId,
                            sourceName: item.sourceName,
                            pubDate: new Date(item.pubDate),
                            contentSnippet: item.contentSnippet,
                            imageUrl: item.imageUrl,
                            matchedActors: item.matchedActorIds,
                            tags: item.tags.map(t => JSON.stringify(t))
                        }
                    });
                } catch (dbError) {
                    console.error("DB Upsert Error (Non-blocking):", dbError);
                }

            } catch (err) {
                console.error(`Failed to process/save item ${item.link}`, err);
            }
            return item;
        });

        // 3. Return latest news FROM DATABASE (Verified Source of Truth)
        // This allows mixed history + fresh news
        try {
            const storedNews = await prisma.news.findMany({
                take: 500, // Increased from 100 to support broader range
                orderBy: { pubDate: 'desc' },
                where: {
                    sourceId: { in: sources.map((s: any) => s.id) }
                }
            });

            // Transform back to NewsItem type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedNews: NewsItem[] = storedNews.map((n: any) => ({
                id: n.id,
                title: n.title,
                link: n.url,
                sourceId: n.sourceId,
                sourceName: n.sourceName,
                pubDate: n.pubDate.toISOString(),
                contentSnippet: n.contentSnippet || undefined,
                imageUrl: n.imageUrl || undefined,
                matchedActorIds: n.matchedActorIds,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tags: n.tags.map((t: any) => JSON.parse(t))
            }));

            return NextResponse.json({ news: mappedNews });
        } catch (readError) {
            console.error("DB Read Error - Returning scraped items as fallback:", readError);
            return NextResponse.json({ news: recentNews });
        }
    } catch (error) {
        console.error("API Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '20');

        const news = await prisma.news.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { pubDate: 'desc' },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedNews = news.map((n: any) => ({
            id: n.id,
            title: n.title,
            link: n.url,
            sourceId: n.sourceId,
            sourceName: n.sourceName,
            pubDate: n.pubDate.toISOString(),
            contentSnippet: n.contentSnippet || undefined,
            imageUrl: n.imageUrl || undefined,
            matchedActorIds: n.matchedActorIds,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tags: n.tags.map((t: any) => JSON.parse(t))
        }));

        return NextResponse.json({
            news: mappedNews,
            nextCursor: news.length === limit ? news[news.length - 1].id : undefined
        });
    } catch (error) {
        console.error("GET Error", error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
