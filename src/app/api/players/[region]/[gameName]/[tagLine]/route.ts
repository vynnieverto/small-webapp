import { NextRequest, NextResponse } from 'next/server';
import {getPlayerProfile} from "@/services/get_player_profile";


export async function GET(request: NextRequest, { params }: { params: Promise<{gameName: string, tagLine: string, platform: string }> }){
    const values =await params
    const result = await getPlayerProfile(values)
    return NextResponse.json(result.body, 
        {status: result.status}
    )
}