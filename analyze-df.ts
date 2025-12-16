
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'df_response.html');
const html = fs.readFileSync(filePath, 'utf-8');
const $ = cheerio.load(html);

console.log('Total card__title elements:', $('.card__title').length);

$('.card__title').slice(0, 3).each((i, el) => {
    console.log(`\n--- Item ${i + 1} ---`);
    console.log('Tag Name:', $(el).prop('tagName'));
    console.log('Start of HTML:', $.html(el).substring(0, 100)); // Print start of HTML

    const linkIn = $(el).find('a').attr('href');
    const linkIs = $(el).attr('href');
    const linkParent = $(el).closest('a').attr('href');

    console.log('Link inside:', linkIn);
    console.log('Link is element:', linkIs);
    console.log('Link is parent:', linkParent);
});
