
import { prisma } from '../lib/prisma';

async function clearNews() {
    console.log("🧹 Starting DB Cleanup...");
    console.log("⚠️  This will delete ALL news items from the production database.");

    try {
        const countBefore = await prisma.news.count();
        console.log(`📊 Current news count: ${countBefore}`);

        if (countBefore === 0) {
            console.log("✅ Database is already empty.");
            return;
        }

        const deleted = await prisma.news.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} news items.`);

        const countAfter = await prisma.news.count();
        console.log(`📊 New news count: ${countAfter}`);

    } catch (e) {
        console.error("❌ Error clearing news:", e);
    }
}

clearNews();
