import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE a source
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
    const source = await prisma.newsSource.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    await prisma.newsSource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting source:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH update a source
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
    const existingSource = await prisma.newsSource.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingSource) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, url, type, selector } = body;

    const source = await prisma.newsSource.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(type && { type }),
        ...(selector !== undefined && { selector: selector || null }),
      },
    });

    return NextResponse.json({ source });
  } catch (error) {
    console.error("Error updating source:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
