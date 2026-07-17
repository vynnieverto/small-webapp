import { NextRequest, NextResponse } from 'next/server';
import {getPlayerProfile} from "@/services/get_player_profile";


export async function GET(request: NextRequest, params: {gameName: string, tagLine: string, platform: string}){
    const result = await getPlayerProfile(params)
    return NextResponse.json(result.body, 
        {status: result.status}
    )
}