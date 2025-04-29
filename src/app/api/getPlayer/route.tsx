import { NextResponse } from "next/server";
import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();
export async function GET(request: Request) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };

    
    try{
        const {body} = await request.json();
        const gameName = body.gameName;
        const tagLine = body.tagLine;

        const externalUrl = process.env.RIOT_API_URL;
        const apiKey = process.env.RIOT_API_KEY;




        if (!gameName || !tagLine) {
            return NextResponse.json({ error: 'Game name and player name are required' }), {
                status: 400,
                headers: responseHeaders,
            };
        }
        else if (isNaN(gameName) || isNaN(tagLine)) {
            return NextResponse.json({ error: 'Game name and player name must be strings' }), {
                status: 400,
                headers: responseHeaders,
            };
        }

        // Check if the player exists in the database, and if so, return the cached data
        const player = await prisma.player.findUnique({
            where: {
                gameName: gameName,
                tagLine: tagLine,
            },
        });

        if (player) {
            return NextResponse.json(player, {
                status: 200,
                headers: responseHeaders,
            });
        }
    

        if (!externalUrl || !apiKey) {
            return new Response(JSON.stringify({ error: 'External URL or API key is missing' }), {
                status: 500,
                headers: responseHeaders,
            });
        }

        const url = `${externalUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

        const requestOptions = {
            method: 'GET',
            headers: {
                'X-Riot-Token': apiKey,
                'Content-Type': 'application/json',
            },
        }


        const apiResponse = await fetch(url, requestOptions); 
        if (!apiResponse.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data from the external API' }), {
                status: apiResponse.status,
                headers: responseHeaders,
            });
        }
        const apiResponseData = await apiResponse.json();
        let playerId = apiResponseData.puuid;
        let playerName = apiResponseData.gameName;
        let playerTagLine = apiResponseData.tagLine;

        try{
            const newPlayer = prisma.player.create({
                data: {
                    playerId: playerId,
                    gameName: playerName,
                    tagLine: playerTagLine,
                },

            })
            if (!newPlayer) {
                return NextResponse.json({ error: 'Failed to create player in the database' }), {
                    status: 500,
                    headers: responseHeaders,
                };
            }
            console.log('Player created:', newPlayer);

        } catch (error) {
            console.error('Error creating player:', error);
            return NextResponse.json({ error: 'Failed to create player in the database' }), {
                status: 500,
                headers: responseHeaders,
            }   ;
        }

        



        return NextResponse.json(apiResponseData, {
            status: 200});





    }

    catch (error){
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }), {
            status: 500,
            headers: responseHeaders,
        };
    }

}