import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, eventSlug, teamName } = body;

        if (!userId || !eventSlug || !teamName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user is already in a team for this event (either as leader or member)
        const existingTeam = await prisma.team.findFirst({
            where: {
                eventSlug,
                OR: [
                    { leaderId: userId },
                    { members: { some: { id: userId } } }
                ]
            }
        });

        if (existingTeam) {
            return NextResponse.json({ error: 'You are already in a team for this event' }, { status: 400 });
        }

        // Generate unique 6-char code
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            code = Math.floor(10000 + Math.random() * 90000).toString();
            const check = await prisma.team.findUnique({ where: { code } });
            if (!check) isUnique = true;
        }

        const newTeam = await prisma.team.create({
            data: {
                name: teamName,
                code: code,
                eventSlug,
                leaderId: userId,
                members: {
                    connect: { id: userId } // Leader is automatically a member
                }
            }
        });

        return NextResponse.json({ success: true, team: newTeam }, { status: 201 });

    } catch (error) {
        console.error("Create Team Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
