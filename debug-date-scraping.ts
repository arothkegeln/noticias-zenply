
import * as cheerio from 'cheerio';

const targetUrl = 'https://www.df.cl/primer-click-16-de-diciembre-0';

async function debugDate() {
    try {
        console.log(`Fetching ${targetUrl}...`);
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log('--- META TAGS ---');
        console.log('article:published_time:', $('meta[property="article:published_time"]').attr('content'));
        console.log('date:', $('meta[name="date"]').attr('content'));
        console.log('parsely-pub-date:', $('meta[name="parsely-pub-date"]').attr('content'));
        console.log('time datetime:', $('time').first().attr('datetime'));

        console.log('--- JSON-LD ---');
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const json = JSON.parse($(el).html() || '{}');
                console.log(JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Error parsing JSON-LD');
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

debugDate();
