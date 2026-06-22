import { NextResponse } from "next/server";
import { isValidPlatform, getRegionalRoute } from "@/lib/regions";


// Note: gameName and tagLine are unique across regions. (at least they should be)

// Note: One typescript error is caused by the APIKEY being string | undefined, which was causing typescript to throw errors. It shows itself in the requestHeaders variable. 
// const prisma = new PrismaClient();
import prisma from "@/lib/prisma";
export async function fetchOrCreatePlayer(body: unknown) {
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    if (typeof body !== 'object' || body === null) {
        return {
            status: 400,
            body: { error: 'Invalid request body' },
            headers: responseHeaders,
        };
    }
        
    const {
        gameName, 
        tagLine, 
        platform,
    } = body as { gameName: unknown, tagLine: unknown, platform: unknown };
    
    if (typeof gameName !== 'string' || typeof tagLine !== 'string' || typeof platform !== 'string') {
        return {
            status: 400,
            body: { error: 'Game name, tag line, and platform must be strings' },
            headers: responseHeaders,
        };
    }
    try{
        
        const inputGameName = gameName.trim();
        const inputTagLine = tagLine.trim();
        const inputPlatform = platform.trim();

        const apiKey = process.env.RIOT_API_KEY;


        // check if the input is valid. 
        // Note: How much should I care about malicious actors?
        if (!inputGameName || !inputTagLine || !inputPlatform) {
            return NextResponse.json({ error: 'Game name, player name, and platform are required'}, {
                status: 400,
                headers: responseHeaders,
            });
        }
        if (typeof inputPlatform !== 'string' || !isValidPlatform(inputPlatform)) {
            return NextResponse.json({ error: 'Invalid platform'}, {
                status: 400,
                headers: responseHeaders,
            });
        }

        else if (typeof inputGameName !== 'string' || typeof inputTagLine !== 'string') {
            return NextResponse.json({ error: 'Game name and player name must be strings'}, {
                status: 400,
                headers: responseHeaders,
            });
        }
        else if (inputGameName.length < 3 || inputGameName.length > 16) {
            return NextResponse.json({ error: 'Game name must be between 3 and 16 characters'}, {
                status: 400,
                headers: responseHeaders,
            });
        }
        else if (inputTagLine.length < 3 || inputTagLine.length > 5) {
            return NextResponse.json({ error: 'Tag line must be between 3 and 5 characters'}, {
                status: 400,
                headers: responseHeaders,
            });
        }


        const regionalRoute = getRegionalRoute(inputPlatform);
        

        // Check if the player exists in the database, and if so, return that player's data
        const player = await prisma.player.findUnique({
            where: {
                // This is neccessary for compound unique keys in Prisma. 
                gameName_tagLine: { 
                    gameName: inputGameName,
                    tagLine: inputTagLine,
                },
            }
        });
        if (player) {
            return NextResponse.json({playerData: player}, {
                status: 200,
                headers: responseHeaders,
            });
        }
    
        // Sanity check for api key variable.
        if (!apiKey) {
            console.error('API key is missing');
            return new Response(JSON.stringify({ error: 'API key is missing' }), {
                status: 500,
                headers: responseHeaders,
            });
        }
        // Get URL from environment variables
        const url = `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${inputGameName}/${inputTagLine}`;

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
        let playerId = apiResponseData.puuid;
        let playerName = apiResponseData.gameName;
        let playerTagLine = apiResponseData.tagLine;

        

        // TODO: There could be a better way to do this. Will come back to this later.
        // if (!playerRegion) {
        //     return NextResponse.json(
        //         { error: 'Failed to fetch player region' }, 
        //         {
        //             status: 500,
        //             headers: responseHeaders,
        //         }
        //     );
        // }


        // Attempt to create a new player in the database
        try{
            const newPlayer = await prisma.player.create({
                data: {
                    puuid: playerId,
                    gameName: playerName,
                    tagLine: playerTagLine,
                    Region: inputPlatform,
                },

            })
        // Check if the player was created successfully
            if (!newPlayer) {
                return NextResponse.json({ error: 'Failed to create player in the database' }, {
                    status: 500,
                    headers: responseHeaders,
                }
                );
            }
            console.log('Player created:', newPlayer);
            return NextResponse.json({playerData: newPlayer}, {
                status: 200});

        } catch (error) {
            console.error('Error creating player:', error);
            return NextResponse.json({ error: 'Failed to create player in the database' }, {
                status: 500,
                headers: responseHeaders,
            } 
            );
        }
        // Return RIOT API response: PUIID, GameName, TagLine

    }
    catch (error){
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }, {
            status: 500,
            headers: responseHeaders,
        });
    }

}


