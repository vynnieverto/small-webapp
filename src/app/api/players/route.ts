import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validRegions } from '@/lib/regions';

const prisma = new PrismaClient();
// this end

export default async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const region = url.searchParams.get('region');
    const gameName = url.searchParams.get('gameName')?.trim();

    const limit = 5

    if (!region || !validRegions.includes(region)) {
        return NextResponse.json({ error: 'Invalid or missing region' }, { status: 400 });
    }

    if (!gameName) {
        return NextResponse.json({ error: 'Missing gameName' }, { status: 400 });
    }

    if (gameName === '') {
        return NextResponse.json({ suggestions: [] });
    }
    // SQLite does not support case sensitive search apparently?
    try {
        const players = await prisma.player.findMany({
            where: {
                Region: region,
                gameName: {
                    contains: gameName,
                },

            },
            take: limit,
            orderBy: {
                gameName: 'asc',
            },
        });

        const suggestions = players.map(player => `${player.gameName}#${player.tagLine}`);
        return NextResponse.json({ suggestions }, { status: 200 });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }




}
