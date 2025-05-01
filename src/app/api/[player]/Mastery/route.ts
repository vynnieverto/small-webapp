import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export async function GET(request: Request, {params}: {params: {player: string}}) {
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

        const findAllPlayerMastery = await prisma.playerMastery.findMany({
            where: {
                playerId: player.id,
            },
            select: {
                championId: true,
                championLevel: true,
                championPoints: true,
                totalLevelPoints: true,
                pointsUntilNextLevel: true,
            }
        });

        if (!findAllPlayerMastery) {
            
        }

        // const playerMastery = findAllPlayerMastery.map((mastery) => ({
        //     championId: mastery.championId,
        //     championLevel: mastery.championLevel,
        //     championPoints: mastery.championPoints,
        //     lastPlayTime: mastery.lastPlayTime,
        // }));




        
        



    } catch (error) {
        console.error('Error fetching mastery data:', error);
        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: responseHeaders,
        });
    }

    
    

}