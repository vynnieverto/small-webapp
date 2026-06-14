// This endpoint is meant to refresh the player data in the database.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Refresh is not implemented" },
    { status: 501 }
  );
}