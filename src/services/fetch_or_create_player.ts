import { isValidPlatform, getRegionalRoute } from "@/lib/regions";


// Note: gameName and tagLine are unique across regions. (at least they should be)

// Note: One typescript error is caused by the APIKEY being string | undefined, which was causing typescript to throw errors. It shows itself in the requestHeaders variable. 
// const prisma = new PrismaClient();
import prisma from "@/lib/prisma";
export async function fetchOrCreatePlayer(body: unknown) {
    if (typeof body !== 'object' || body === null) {
        return {
            status: 500,
            body: { error: 'Invalid request body' },
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
            return {
                status: 400,
                body: { error: 'Game name, player name, and platform are required'},
            };
        }
        else if (inputGameName.length < 3 || inputGameName.length > 16) {
            return {
                status: 400,
                body: { error: 'Game name must be between 3 and 16 characters'},
            };
        }
        else if (inputTagLine.length < 3 || inputTagLine.length > 5) {
            return {
                status: 400,
                body: { error: 'Tag line must be between 3 and 5 characters' },
            };
        }

        if (!isValidPlatform(inputPlatform)) {
            return {
                status: 400,
                body: { error: 'Invalid platform' },
            };
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
            return {
                status: 200,
                body: {playerData: player},
            };
        }
    
        // Sanity check for api key variable.
        if (!apiKey) {
            console.error('API key is missing');
            return {
                status: 500,
                body: { error: 'API key is missing' },
            };
        }
        const encodedGameName = encodeURIComponent(inputGameName);
        const encodedTagLine = encodeURIComponent(inputTagLine);
        // Get URL from environment variables
        const url = `https://${regionalRoute}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;

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
            return {
                status: apiResponse.status,
                body: { error: 'failed to fetch data from external api'},
            };
        }
        const apiResponseData = await apiResponse.json();
        const playerId = apiResponseData.puuid;
        const playerName = apiResponseData.gameName;
        const playerTagLine = apiResponseData.tagLine;

        if (typeof playerId !== 'string' || typeof playerName !== 'string' || typeof playerTagLine !== 'string') {
            return {
                status: 502,
                body: { error: 'Riot returned invalid account data' },
            };
        }



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
                return { 
                    status: 500,
                    body: { error: 'Failed to create player in the database' },
                }
            }
            console.log('Player created:', newPlayer);
            return {
                status: 200,
                body: {playerData: newPlayer},
            };

        } catch (error) {
            console.error('Error creating player:', error);
            return {
                status: 500,
                body: { error: 'error creating player'},
            };
        }
        // Return RIOT API response: PUIID, GameName, TagLine

    }
    catch (error){
        console.error('Error:', error);
            return {
                status: 500,
                body: { error: 'error occurred while processing the request'},
            };
    }

}


