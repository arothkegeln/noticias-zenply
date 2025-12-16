import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'df_response.html');
const html = fs.readFileSync(filePath, 'utf-8');
const $ = cheerio.load(html);

const selector = '.card__title';
const sourceUrl = 'https://www.df.cl/';
const results: Array<{ title: string, link: string, image?: string, summary?: string }> = [];

$(selector).each((_, element) => {
    const $el = $(element);
    let title = $el.text().trim();
    let link = $el.attr('href');

    // If the element is not a link, try to find the closest parent link
    if (!link) {
        const $link = $el.closest('a');
        if ($link.length) {
            link = $link.attr('href');
            if (!title) {
                title = $link.text().trim();
            }
        }
    }

    if (title && link) {
        // Fix relative URLs
        const absoluteLink = link.startsWith('http')
            ? link
            : new URL(link, sourceUrl).toString();

        // Find parent card to look for other elements
        const $card = $el.closest('article') || $el.closest('.card') || $el.closest('div');

        let image = $card.find('img').attr('src') || $card.find('img').attr('data-src');
        let summary = $card.find('.card__deck').text().trim() || $card.find('.card__excerpt').text().trim() || $card.find('p').first().text().trim();

        // Debug first item heavily
        if (results.length === 0) {
            console.log("--- DEBUG FIRST CARD STRUCTURE ---");
            console.log($card.html());
            console.log("--- END DEBUG ---");
        }

        results.push({ title, link: absoluteLink, image, summary });
    }
});

console.log(`Total news extracted: ${results.length}`);
console.log('\nFirst 5 items:');
results.slice(0, 5).forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.title}`);
    console.log(`   Link: ${item.link}`);
    console.log(`   Image: ${item.image}`);
    console.log(`   Summary: ${item.summary}`);
});
