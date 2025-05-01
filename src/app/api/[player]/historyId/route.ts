import { stat } from "fs";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This is a placeholder, but its final functionality will be to get the IDs of the last 20 matches played by the queried player
export default function GET(request: Request){
    return NextResponse.json({
        message: "Hello from the server!",
        status: 200,
    });

}