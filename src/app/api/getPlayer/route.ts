import { NextResponse } from "next/server";
import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();
export async function POST(request: Request) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };

    
    try{
        const {body} = await request.json();
        const inputGameName = body.gameName;
        const inputTagLine = body.tagLine;
        const inputRegion = body.region;

        const apiKey = process.env.RIOT_API_KEY;




        if (!inputGameName || !inputTagLine) {
            return NextResponse.json({ error: 'Game name and player name are required' }), {
                status: 400,
                headers: responseHeaders,
            };
        }
        else if (isNaN(inputGameName) || isNaN(inputTagLine)) {
            return NextResponse.json({ error: 'Game name and player name must be strings' }), {
                status: 400,
                headers: responseHeaders,
            };
        }

        // Check if the player exists in the database, and if so, return that player's data
        const player = await prisma.player.findUnique({
            where: {
                gameName: inputGameName,
                tagLine: inputTagLine,
            },
        });
        if (player) {
            return NextResponse.json(player, {
                status: 200,
                headers: responseHeaders,
            });
        }
    
        // Sanity check for environment variables
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is missing' }), {
                status: 500,
                headers: responseHeaders,
            });
        }
        // Get URL from environment variables
        const url = `https://${inputRegion}/riot/account/v1/accounts/by-riot-id/${inputGameName}/${inputTagLine}`;

        // Set up request options
        const requestOptions = {
            method: 'GET',
            headers: {
                'X-Riot-Token': apiKey,
                'Content-Type': 'application/json',
            },
        }

        // Send request to Riot API
        const apiResponse = await fetch(url, requestOptions); 
        if (!apiResponse.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data from the external API' }), {
                status: apiResponse.status,
                headers: responseHeaders,
            });
        }
        const apiResponseData = await apiResponse.json();
        let playerId = apiResponseData.PUUID;
        let playerName = apiResponseData.gameName;
        let playerTagLine = apiResponseData.tagLine;


        // Attempt to create a new player in the database
        try{
            const newPlayer = prisma.player.create({
                data: {
                    playerId: playerId,
                    gameName: playerName,
                    tagLine: playerTagLine,
                },

            })
        // Check if the player was created successfully
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
        // Return RIOT API response: PUIID, GameName, TagLine
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


// hopefully this isn't necessary
async function getPlayerRegion(playerId: string, hemisphere: string){
    // const regions = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2', 'tw2', 'vn2'];
    

}