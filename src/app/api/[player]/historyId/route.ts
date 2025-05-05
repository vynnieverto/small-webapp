import { stat } from "fs";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This is a placeholder, but its final functionality will be to get the IDs of the last 20 matches played by the queried player
export default async function GET(request: Request, {params}: {params: {player: string}}) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    try{
        const riotId = params.player;
        const [gameName, tagLine] = riotId.split('#');
        const player = await prisma.player.findUnique({
            where: {
                gameName: gameName,
                tagLine: tagLine,
            },
        });
        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, {
                status: 404,
                headers: responseHeaders,
            });
        }

        const findLast20Matches = await prisma.playerMatchHistory.findMany({
            where: {
                playerId: player.id,
            },
            orderBy: {
                gameStartTime: 'desc',
            },
            take: 20,
        });
        if (!findLast20Matches) {
            
        }

    } catch (error) {
        console.error('Error fetching player data:', error);
        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: responseHeaders,
        });
    }
    // If everything goes well, return a success response
    // Note: This is a placeholder response.
    return NextResponse.json({
        message: "Hello from the server!",
        status: 200,
    });

}