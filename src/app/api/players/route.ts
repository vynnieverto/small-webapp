import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validRegions } from '@/lib/regions';

const prisma 
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

    try {
        
    }



}
