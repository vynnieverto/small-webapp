import { NextRequest, NextResponse } from 'next/server';
import { getPlayerMastery } from '@/services/get_player_mastery';


export async function GET(request: NextRequest, { params }: { params: Promise<{gameName: string, tagLine: string, region: string }> }){
    const values =await params
    const result = await getPlayerMastery(values)
    return NextResponse.json(result.body, 
        {status: result.status}
    )
}