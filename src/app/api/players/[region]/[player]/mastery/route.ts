import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {validRegions} from '@/lib/regions';

const prisma = new PrismaClient();

// Will need to test this endpoint with a player that has never played a game before. 
// This endpoint should be used to get the mastery data for a player, or to store the mastery data for a player in the database. 
// It should not be used to update the mastery data for a player. That should be done in the /refresh endpoint.


export async function GET(request: Request, {params}: {params: {region: string, player: string}}) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    // list of exisiting regions

    try{
        // Get the player ID from the request parameters
        let { region, player } = params;
        const [gameName, tagLine] = player.split('-');
        console.log('Region:', region);
        console.log('Game name:', gameName);
        console.log('Tag line:', tagLine);
        // Query the database for the player using the provided gameName and tagLine
        const playerData = await prisma.player.findUnique({
            where: {
                Region: region,
                gameName_tagLine: {
                    gameName: gameName,
                    tagLine: tagLine,

                },
            }
        });

        if (!playerData) {
            return NextResponse.json({ error: 'Player not found' }, {
                status: 404,
                headers: responseHeaders,
            });
        }

        // Check if the player has mastery data in the database
        const findAllPlayerMastery = await prisma.mastery.findMany({
            where: {
                playerId: playerData.puuid,
            },
            select: {
                championId: true,
                championLevel: true,
                championPoints: true,
                totalLevelPoints: true,
                pointsUntilNextLevel: true,
            }
        });

        if (findAllPlayerMastery.length === 0) {
            // If no mastery data is found, attempt to fetch it from the API
            const apiKey = process.env.RIOT_API_KEY!;
            const region = playerData.Region;
            if (!region || !validRegions.includes(region)) {
                return NextResponse.json({ error: 'Invalid region' }, {
                    status: 400,
                    headers: responseHeaders,
                });
            }
            
            const url = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${playerData.puuid}`;
            const requestOptions: RequestInit = {
                method: 'GET',
                headers: {
                    'X-Riot-Token': apiKey,

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
                playerId: playerData.puuid,
                championLevel: mastery.championLevel,
                championPoints: mastery.championPoints,
                totalLevelPoints: mastery.championPointsUntilNextLevel + mastery.championPointsSinceLastLevel,
                pointsUntilNextLevel: mastery.championPointsUntilNextLevel,
            }));

            const temp = await prisma.mastery.createMany({
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