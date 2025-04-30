import { stat } from "fs";
import { NextResponse } from "next/server";


export default function GET(request: Request){
    return NextResponse.json({
        message: "Hello from the server!",
        status: 200,
    });

}