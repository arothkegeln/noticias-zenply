
import * as cheerio from 'cheerio';

const startUrl = 'https://www.df.cl/ultimasnoticias';

async function debugList() {
    try {
        console.log(`Fetching list from ${startUrl}...`);
        const response = await fetch(startUrl, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log('--- TOP 5 ITEMS ---');
        let count = 0;
        $('.card__title').each((_, el) => {
            if (count >= 5) return;
            const $el = $(el);
            let title = $el.text().trim();
            // find link
            let link = $el.attr('href');
            if (!link) {
                const $link = $el.closest('a');
                if ($link.length) {
                    link = $link.attr('href');
                    if (!title) title = $link.text().trim();
                }
            }

            console.log(`[${count + 1}] ${title}`);
            console.log(`    Link: ${link}`);
            count++;
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

debugList();
