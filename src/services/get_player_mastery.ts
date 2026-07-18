import prisma from "@/lib/prisma";
import { isValidPlayerInfo } from "@/lib/utils";

export async function getPlayerMastery(params: {gameName: string, tagLine: string, region: string }){
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

    const checkValidInput = isValidPlayerInfo(inputGameName, inputTagLine, inputPlatform)
    if (checkValidInput.ok === false){
        return {
            status: checkValidInput.status,
            body: checkValidInput.body
        }
    }

    try{
        const player = await prisma.player.findUnique({
            where: {
                gameName_tagLine_Region: { 
                    gameName: inputGameName,
                    tagLine: inputTagLine,
                    Region: inputPlatform,
                },
            },
        })
        if (!player){
            return{
                status: 404,
                body: {error: 'Player not found'}
            }
        }

        const mastery = await prisma.mastery.findMany({

            where: {
                playerId: player.puuid
            },
            orderBy: {
                championPoints: "desc",
            },
            take: 5
        })

        return {
            status: 200,
            body: {mastery}
        }
    }
    catch {
        return {
            status: 500,
            body: {error: 'an error occurred'}
        }
    }

}