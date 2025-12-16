
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser();

// Mock Data
const CATALOG = [
    {
        id: 'df-cl-latest',
        name: 'DF - Últimas Noticias',
        url: 'https://www.df.cl/ultimasnoticias',
        type: 'web',
        selector: '.card__title'
    },
    {
        id: 'elpais-es',
        name: 'El País',
        url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',
        type: 'rss'
    }
];

async function testMixedFeed() {
    console.log(`Testing mixed feed logic...`);

    const allNews: any[] = [];

    await Promise.all(
        CATALOG.map(async (source) => {
            console.log(`Fetching ${source.name}...`);
            try {
                if (source.type === 'web') {
                    const response = await fetch(source.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0...' }
                    });
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    let count = 0;
                    $(source.selector!).each((_, el) => {
                        count++;
                        // DF Usually has current time
                        allNews.push({
                            sourceId: source.id,
                            title: $(el).text().trim(),
                            pubDate: new Date().toISOString() // NOW
                        });
                    });
                    console.log(`  > ${source.name}: Found ${count} raw items`);
                } else {
                    const response = await fetch(source.url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0...',
                            'Accept': 'application/rss+xml'
                        }
                    });
                    const xml = await response.text();
                    const feed = await parser.parseString(xml);
                    console.log(`  > ${source.name}: Found ${feed.items.length} raw items`);
                    feed.items.forEach(item => {
                        allNews.push({
                            sourceId: source.id,
                            title: item.title,
                            pubDate: item.pubDate || new Date().toISOString()
                        });
                    });
                }
            } catch (err) {
                console.error(`  > ${source.name} ERROR:`, err);
            }
        })
    );

    console.log(`\nTotal items before sort: ${allNews.length}`);

    // Sort logic from route.ts
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Slice logic
    const LIMIT = 100;
    const recent = allNews.slice(0, LIMIT);
    console.log(`Total items after slice (${LIMIT}): ${recent.length}`);

    // Count distribution
    const dfCount = recent.filter(i => i.sourceId === 'df-cl-latest').length;
    const epCount = recent.filter(i => i.sourceId === 'elpais-es').length;

    console.log(`Distribution:`);
    console.log(`  DF: ${dfCount}`);
    console.log(`  El Pais: ${epCount}`);

    // Show dates
    console.log("\nSample Dates:");
    recent.slice(0, 5).forEach(i => console.log(`  [${i.sourceId}] ${i.pubDate}`));
    console.log("...");
    recent.slice(-5).forEach(i => console.log(`  [${i.sourceId}] ${i.pubDate}`));

    if (epCount === 0) console.log("\nFAIL: El Pais is missing from the final feed!");
    else console.log("\nPASS: El Pais is present.");
}

testMixedFeed();
