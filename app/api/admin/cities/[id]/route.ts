import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/cities/[id] - Получить детали города (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const city = await db.city.findUnique({
      where: { id },
      include: {
        anketa: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            category: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error("GET /api/admin/cities/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/cities/[id] - Обновить город (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const city = await db.city.update({
      where: { id },
      data: {
        nameRu: body.nameRu !== undefined ? body.nameRu : undefined,
        nameEn: body.nameEn !== undefined ? body.nameEn : undefined,
        nameKk: body.nameKk !== undefined ? body.nameKk : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
      },
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    return NextResponse.json(city);
  } catch (error) {
    console.error("PATCH /api/admin/cities/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/cities/[id] - Удалить город (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await db.city.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/cities/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
