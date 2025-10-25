import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: true, error: "Get Working" },
    { status: 200 },
  );
}

export async function POST() {
  return NextResponse.json(
    { success: true, error: "Post Working" },
    { status: 200 },
  );
}
