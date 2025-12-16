import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all hidden news for the current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                hiddenNews: {
                    orderBy: { hiddenAt: 'desc' }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ hiddenNews: user.hiddenNews });
    } catch (error) {
        console.error('Error fetching hidden news:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Hide a news item
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { newsUrl, newsTitle } = body;

        if (!newsUrl || !newsTitle) {
            return NextResponse.json({ error: 'Missing newsUrl or newsTitle' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Use upsert to avoid duplicates
        const hiddenNews = await prisma.hiddenNews.upsert({
            where: {
                userId_newsUrl: {
                    userId: user.id,
                    newsUrl: newsUrl
                }
            },
            update: {},
            create: {
                userId: user.id,
                newsUrl: newsUrl,
                newsTitle: newsTitle
            }
        });

        return NextResponse.json({ hiddenNews });
    } catch (error) {
        console.error('Error hiding news:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
