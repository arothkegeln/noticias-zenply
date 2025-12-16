import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET all actors for the current user
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const actors = await prisma.actor.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Transform keywords from comma-separated string to array
  const transformedActors = actors.map((actor) => ({
    ...actor,
    keywords: actor.keywords.split(",").map((k) => k.trim()).filter(Boolean),
  }));

  return NextResponse.json({ actors: transformedActors });
}

// POST create a new actor
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, keywords, color } = body;

    if (!name || !keywords || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert keywords array to comma-separated string
    const keywordsStr = Array.isArray(keywords) ? keywords.join(",") : keywords;

    const actor = await prisma.actor.create({
      data: {
        name,
        keywords: keywordsStr,
        color,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      actor: {
        ...actor,
        keywords: actor.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating actor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
