import { NextResponse } from "next/server";


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

        if (!externalUrl || !apiKey) {
            return new Response(JSON.stringify({ error: 'External URL or API key is missing' }), {
                status: 500,
                headers: responseHeaders,
            });
        }


        if (!gameName || !tagLine) {
            return new Response(JSON.stringify({ error: 'Game name and player name are required' }), {
                status: 400,
                headers: responseHeaders,
            });
        }
        else if (isNaN(gameName) || isNaN(tagLine)) {
            return new Response(JSON.stringify({ error: 'Game name and player name must be strings' }), {
                status: 400,
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

        return NextResponse.json(apiResponseData, {
            status: 200});





    }

    catch (error){
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while processing the request' }), {
            status: 500,
            headers: responseHeaders,
        });
    }

}