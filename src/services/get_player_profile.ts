import prisma from "@/lib/prisma";
import { isValidPlatform } from '@/lib/regions';


export async function getPlayerProfile(params: {gameName: string, tagLine: string, region: string }) {
    const {gameName, tagLine, region} = params

    if (typeof gameName !== 'string' || typeof tagLine !== 'string' || typeof region !== 'string') {
        return {
            status: 400,
            body: { error: 'Game name, tag line, and platform must be strings' },
        };
    }
    const inputGameName = gameName.trim()
    const inputTagLine = tagLine.trim()
    const inputPlatform = region.trim().toLowerCase()

    if (!gameName || !tagLine || !region){
        return {
            status: 400,
            body: { error: 'Game name, player name, and platform are required'},
        };
    }
    if (inputGameName.length < 3 || inputGameName.length > 16) {
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

    try{

        const player = await prisma.player.findUnique({
            where: {
                gameName_tagLine_Region: { 
                    gameName: inputGameName,
                    tagLine: inputTagLine,
                    Region: inputPlatform,
                },
            }
        })
        if (!player) {
            return {
                status: 404,
                body: {error: 'player not foudn'}
            }
        }

        return {
            status: 200,
            body: {playerData: player}
        }
    }
    catch{
        return {
            status: 500,
            body: {error: 'unable to load player profile'}
        }
    }



}