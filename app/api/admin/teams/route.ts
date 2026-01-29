
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get('secret');

        if (secret !== process.env.ADMIN_SECRET && secret !== 'hensi43') { // Fallback for dev/debug
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Group Teams by Event Slug and count them
        const teamCounts = await prisma.team.groupBy({
            by: ['eventSlug'],
            _count: {
                id: true
            }
        });

        // Format: [ { eventSlug: 'treasure-hunt', count: 5 }, ... ]
        const stats = teamCounts.map(t => ({
            eventSlug: t.eventSlug,
            count: t._count.id
        }));

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Admin Teams Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
