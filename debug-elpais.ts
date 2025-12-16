
import Parser from 'rss-parser';

const parser = new Parser();
const FEED_URL = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';

async function testFeed() {
    try {
        console.log(`Fetching feed: ${FEED_URL}`);
        const feed = await parser.parseURL(FEED_URL);
        console.log(`Title: ${feed.title}`);
        console.log(`Items found: ${feed.items.length}`);

        if (feed.items.length > 0) {
            console.log('--- First Item ---');
            console.log(feed.items[0]);
        }
    } catch (error) {
        console.error("Feed Error:", error);
    }
}

testFeed();
