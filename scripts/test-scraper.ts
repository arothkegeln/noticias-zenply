import { extractKeywords } from '../lib/keyword-extractor';
import * as cheerio from 'cheerio';

async function testScraper() {
    console.log("🚀 Starting Local Scraper Test...");

    // Simula Diario Financiero
    const sourceUrl = 'https://www.df.cl/';
    // Probamos selectores comunes de DF
    const selector = 'article, .card, .article-card';

    try {
        const response = await fetch(sourceUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log(`✅ Loaded HTML from ${sourceUrl}`);

        let count = 0;
        $(selector).each((i, el) => {
            if (count >= 10) return; // Limit to 10 for test

            const $el = $(el);
            let title = $el.find('h2').text().trim() || $el.text().trim().substring(0, 50);
            let link = $el.find('a').attr('href') || $el.closest('a').attr('href');

            // Simular extracción de fecha (metadata suele estar en deep scraping, pero a veces en lista)
            const timeEl = $el.find('time').attr('datetime');

            if (title && link) {
                console.log(`\n📰 Item ${i + 1}:`);
                console.log(`   Title: ${title}`);
                console.log(`   Link: ${link}`);
                console.log(`   Date (found in list): ${timeEl || 'Not found'}`);

                // Prueba de validación de fecha
                if (timeEl) {
                    const d = new Date(timeEl);
                    console.log(`   Date Object: ${d.toString()}`);
                    console.log(`   Is Valid?: ${!isNaN(d.getTime())}`);
                }
                count++;
            }
        });

        console.log(`\n🏁 Found ${count} items.`);

    } catch (e) {
        console.error("❌ Error scraping:", e);
    }
}

testScraper();
