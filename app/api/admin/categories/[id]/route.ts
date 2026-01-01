import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/categories/[id] - Получить детали категории (админ)
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

    const category = await db.category.findUnique({
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
            city: true,
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

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/categories/[id] - Обновить категорию (админ)
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

    const updateData: {
      nameRu?: string;
      nameEn?: string;
      nameKk?: string;
      imageUrl?: string;
      filterTag?: string;
    } = {};

    if (body.nameRu !== undefined) updateData.nameRu = body.nameRu;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.nameKk !== undefined) updateData.nameKk = body.nameKk;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.filterTag !== undefined) updateData.filterTag = body.filterTag;

    const category = await db.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("PATCH /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/admin/categories/[id] - Удалить категорию (админ)
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

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
