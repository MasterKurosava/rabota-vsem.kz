import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/categories - Получить все категории (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            anketa: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/categories - Создать новую категорию (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.nameRu || !body.nameEn || !body.nameKk) {
      return NextResponse.json(
        { error: "nameRu, nameEn, and nameKk are required" },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        nameRu: body.nameRu,
        nameEn: body.nameEn,
        nameKk: body.nameKk,
        imageUrl: body.imageUrl,
        filterTag: body.filterTag,
      },
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
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
