import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE an actor
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify ownership
    const actor = await prisma.actor.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!actor) {
      return NextResponse.json({ error: "Actor not found" }, { status: 404 });
    }

    await prisma.actor.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting actor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update an actor
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify ownership
    const existingActor = await prisma.actor.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingActor) {
      return NextResponse.json({ error: "Actor not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, keywords, color } = body;

    // Convert keywords array to comma-separated string if provided
    const keywordsStr = keywords
      ? Array.isArray(keywords)
        ? keywords.join(",")
        : keywords
      : undefined;

    const actor = await prisma.actor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(keywordsStr && { keywords: keywordsStr }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({
      actor: {
        ...actor,
        keywords: actor.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      },
    });
  } catch (error) {
    console.error("Error updating actor:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
