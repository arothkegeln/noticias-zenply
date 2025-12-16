import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET all sources for the current user
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sources = await prisma.newsSource.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ sources });
}

// POST create a new source
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url, type, selector } = body;

    if (!name || !url || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const source = await prisma.newsSource.create({
      data: {
        name,
        url,
        type,
        selector: selector || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    console.error("Error creating source:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
