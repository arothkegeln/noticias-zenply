import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// DELETE: Unhide a news item
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify the hidden news belongs to the user
        const hiddenNews = await prisma.hiddenNews.findUnique({
            where: { id: id }
        });

        if (!hiddenNews) {
            return NextResponse.json({ error: 'Hidden news not found' }, { status: 404 });
        }

        if (hiddenNews.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.hiddenNews.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error unhiding news:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
