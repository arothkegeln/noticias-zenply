
import { prisma } from '../lib/prisma';

async function checkDB() {
    console.log("🔍 Checking Database content...");
    try {
        const count = await prisma.news.count();
        console.log(`📊 Total news in DB: ${count}`);

        if (count > 0) {
            const news = await prisma.news.findMany({
                take: 5,
                orderBy: { pubDate: 'desc' },
                include: { source: true } // Assuming relation exists or just checking fields
            });

            console.log("\n📰 Latest 5 news items:");
            news.forEach((n, i) => {
                console.log(`\n[${i + 1}] ${n.title}`);
                console.log(`    Date: ${n.pubDate}`);
                console.log(`    Source: ${n.sourceName} (ID: ${n.sourceId})`);
                console.log(`    URL: ${n.url}`);
            });
        } else {
            console.log("⚠️ DB is empty. Upsert is failing silently.");
        }
    } catch (e) {
        console.error("❌ Error checking DB:", e);
    }
}

checkDB();
