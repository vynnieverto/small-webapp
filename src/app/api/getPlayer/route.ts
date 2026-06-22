import { NextResponse } from "next/server";
import {fetchOrCreatePlayer} from "@/services/fetch_or_create_player";

// TODO: Figure out what to do if a player has no games played. Note: This means that the player has no mastery data, no match history, etc. 
// Perhaps we should just return a 404 error?

// Note: gameName and tagLine are unique across regions. (at least they should be)

// Note: One typescript error is caused by the APIKEY being string | undefined, which was causing typescript to throw errors. It shows itself in the requestHeaders variable. 

export async function POST(request: Request) {

    try{
        
        const body = await request.json();
        const result = await fetchOrCreatePlayer(body);

        return NextResponse.json(result.body, {
            status: result.status,
        });
        // Extract gameName, tagLine from the request body


        // const inputGameName = body.gameName;
        // const inputTagLine = body.tagLine;
        // const inputPlatform = body.platform;

        // const apiKey = process.env.RIOT_API_KEY;



        // // check if the input is valid. 
        // // Note: How much should I care about malicious actors?
        // if (!inputGameName || !inputTagLine || !inputPlatform) {
        //     return NextResponse.json({ error: 'Game name, player name, and platform are required'}, {
        //         status: 400,
        //         headers: responseHeaders,
        //     });
        // }
        // if (typeof inputPlatform !== 'string' || !isValidPlatform(inputPlatform)) {
        //     return NextResponse.json({ error: 'Invalid platform'}, {
        //         status: 400,
        //         headers: responseHeaders,
        //     });
        // }

        // else if (typeof inputGameName !== 'string' || typeof inputTagLine !== 'string') {
        //     return NextResponse.json({ error: 'Game name and player name must be strings'}, {
        //         status: 400,
        //         headers: responseHeaders,
        //     });
        // }
        // else if (inputGameName.length < 3 || inputGameName.length > 16) {
        //     return NextResponse.json({ error: 'Game name must be between 3 and 16 characters'}, {
        //         status: 400,
        //         headers: responseHeaders,
        //     });
        // }
        // else if (inputTagLine.length < 3 || inputTagLine.length > 5) {
        //     return NextResponse.json({ error: 'Tag line must be between 3 and 5 characters'}, {
        //         status: 400,
        //         headers: responseHeaders,
        //     });
        // }


        // const regionalRoute = getRegionalRoute(inputPlatform);
        

        // // Check if the player exists in the database, and if so, return that player's data
        // const player = await prisma.player.findUnique({
        //     where: {
        //         // This is neccessary for compound unique keys in Prisma. 
        //         gameName_tagLine: { 
        //             gameName: inputGameName,
        //             tagLine: inputTagLine,
        //         },
        //     }
        // });
        // if (player) {
        //     return NextResponse.json({playerData: player}, {
        //         status: 200,
        //         headers: responseHeaders,
        //     });
        // }
    
        // // Sanity check for api key variable.
        // if (!apiKey) {
        //     console.error('API key is missing');
        //     return new Response(JSON.stringify({ error: 'API key is missing' }), {
        //         status: 500,
        //         headers: responseHeaders,
        //     });
        // }
        // // Get URL from environment variables
        // const url = `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${inputGameName}/${inputTagLine}`;

        // // Set up request options
        // const requestOptions = {
        //     method: 'GET',
        //     headers: {
        //         'X-Riot-Token': apiKey,
        //         'Content-Type': 'application/json',
        //     },
        // }

        // // Send request to Riot API
        // const apiResponse = await fetch(url, requestOptions); 
        // if (!apiResponse.ok) {
        //     return new Response(JSON.stringify({ error: 'Failed to fetch data from the external API' }), {
        //         status: apiResponse.status,
        //         headers: responseHeaders,
        //     });
        // }
        // const apiResponseData = await apiResponse.json();
        // let playerId = apiResponseData.puuid;
        // let playerName = apiResponseData.gameName;
        // let playerTagLine = apiResponseData.tagLine;

        

        // // TODO: There could be a better way to do this. Will come back to this later.
        // // if (!playerRegion) {
        // //     return NextResponse.json(
        // //         { error: 'Failed to fetch player region' }, 
        // //         {
        // //             status: 500,
        // //             headers: responseHeaders,
        // //         }
        // //     );
        // // }


        // // Attempt to create a new player in the database
        // try{
        //     const newPlayer = await prisma.player.create({
        //         data: {
        //             puuid: playerId,
        //             gameName: playerName,
        //             tagLine: playerTagLine,
        //             Region: inputPlatform,
        //         },

        //     })
        // // Check if the player was created successfully
        //     if (!newPlayer) {
        //         return NextResponse.json({ error: 'Failed to create player in the database' }, {
        //             status: 500,
        //             headers: responseHeaders,
        //         }
        //         );
        //     }
        //     console.log('Player created:', newPlayer);
        //     return NextResponse.json({playerData: newPlayer}, {
        //         status: 200});

        // } catch (error) {
        //     console.error('Error creating player:', error);
        //     return NextResponse.json({ error: 'Failed to create player in the database' }, {
        //         status: 500,
        //         headers: responseHeaders,
        //     } 
        //     );
        // }
        // Return RIOT API response: PUIID, GameName, TagLine

    }
    catch (error){
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request' }, {
            status: 500,
        });
    }

}


// The main idea is to query the players match history and get the region from the match ID, 
// since querying player information doesn't return the region

// This function should suffice unless the player has no match history, in which case we will return null.

// Note: the hemisphere used is the NA hemisphere, as it is the closest one to me. 
// async function getPlayerRegion(playerId: string, hemisphere: string){
//     // const regions = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru', 'ph2', 'sg2', 'th2', 'tw2', 'vn2'];
//     const url = `https://${hemisphere}.api.riotgames.com/lol/match/v5/matches/by-puuid/${playerId}/ids?start=0&count=1`;
//     let apiKey = process.env.RIOT_API_KEY!;
//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             'X-Riot-Token': apiKey,
//             'Content-Type': 'application/json',
//         },
//     };
//     try {
//         const apiResponse = await fetch(url, requestOptions);
//         if (!apiResponse.ok){
//             return null;
//         }
//         const apiResponseData = await apiResponse.json();

//         if (!apiResponseData || apiResponseData.length === 0) {
//             return null;
//         }
//         const matchId = apiResponseData[0];
//         const region = matchId.split('_')[0];
//         return region.toLowerCase();
        
//     } catch (error) {
//         console.error('Error fetching player region:', error);
//         return null;
//     }


// }