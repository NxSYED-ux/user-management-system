import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return NextResponse.json(
    { success: true, error: `Get user details for id: ${id} is working` },
    { status: 200 },
  );
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return NextResponse.json(
    { success: true, error: `Update User for id: ${id} is working` },
    { status: 200 },
  );
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return NextResponse.json(
    { success: true, error: `Delete user for id: ${id} is working` },
    { status: 200 },
  );
}
