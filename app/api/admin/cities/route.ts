import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/cities - Получить все города (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cities = await db.city.findMany({
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

    return NextResponse.json(cities);
  } catch (error) {
    console.error("GET /api/admin/cities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/cities - Создать новый город (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const city = await db.city.create({
      data: {
        nameRu: body.nameRu,
        nameEn: body.nameEn,
        nameKk: body.nameKk,
        isActive: body.isActive !== undefined ? body.isActive : true,
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
    console.error("POST /api/admin/cities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
