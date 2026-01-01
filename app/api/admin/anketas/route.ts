import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/anketas - Получить все анкеты (только для админа)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const anketas = await db.anketa.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            rating: true,
            _count: {
              select: {
                commentsRecv: true,
              },
            },
          },
        },
        city: true,
        category: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(anketas);
  } catch (error) {
    console.error("GET /api/admin/anketas error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
