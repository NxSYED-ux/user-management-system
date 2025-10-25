import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/../generated/prisma";
import type { roles } from "@/types/user";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
      : {};

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });
    const totalPages = Math.ceil(total / limit);

    const roleCounts = await prisma.user.groupBy({
      by: ["role"],
      where,
      _count: { role: true },
    });


    const stats = {
      ADMIN: roleCounts.find((r) => r.role === "ADMIN")?._count.role || 0,
      EDITOR: roleCounts.find((r) => r.role === "EDITOR")?._count.role || 0,
      VIEWER: roleCounts.find((r) => r.role === "VIEWER")?._count.role || 0,
    };

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, role }: { name: string; email: string; role?: roles } =
      await req.json();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || "VIEWER",
      },
    });

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
