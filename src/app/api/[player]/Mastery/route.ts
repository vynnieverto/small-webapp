import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// Will need to test this endpoint with a player that has never played a game before. 
// This endpoint should be used to get the mastery data for a player, or to store the mastery data for a player in the database. 
// It should not be used to update the mastery data for a player. That should be done in the /refresh endpoint.


export async function GET(request: Request, {params}: {params: {player: string}}) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    try{
        // Get the player ID from the request parameters
        const riotId = params.player;
        const [gameName, tagLine] = riotId.split('#');

        // Query the database for the player using the provided gameName and tagLine
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

        // Check if the player has mastery data in the database
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
            // If no mastery data is found, attempt to fetch it from the API
            const apiKey = process.env.RIOT_API_KEY!;
            const region = player.region;
            const url = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-player/${player.puuid}`;
            const requestOptions: RequestInit = {
                method: 'GET',
                headers: {
                    'X-Riot-Token': apiKey,
                    'Content-Type': 'application/json',
                },
            };
            const response = await fetch(url, requestOptions);
            const masteryData = await response.json();
            if (!response.ok) {
                return NextResponse.json({ error: 'Failed to fetch mastery data from API' }, {
                    status: response.status,
                    headers: responseHeaders,
                });
            }

            // Save the mastery data to the database
            const playerMasteryData = masteryData.map((mastery: any) => ({
                championId: mastery.championId,
                playerId: player.id,
                championLevel: mastery.championLevel,
                championPoints: mastery.championPoints,
                totalLevelPoints: mastery.championPointsUntilNextLevel + mastery.championPointsSinceLastLevel,
                pointsUntilNextLevel: mastery.championPointsUntilNextLevel,
                lastPlayTime: mastery.lastPlayTime,
            }));

            const temp = await prisma.playerMastery.createMany({
                data: playerMasteryData,
            });
            if (!temp) {
                return NextResponse.json({ error: 'Failed to save mastery data to database' }, {
                    status: 500,
                    headers: responseHeaders,
                });
            }

            return NextResponse.json(playerMasteryData, {
                status: 200,
                headers: responseHeaders,
            });

        } else{
            return NextResponse.json(findAllPlayerMastery, {
                status: 200,
                headers: responseHeaders,
            });
        }
    } catch (error) {
        console.error('Error fetching mastery data:', error);
        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: responseHeaders,
        });
    }

    
    

}