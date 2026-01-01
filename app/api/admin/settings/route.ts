import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/settings - Получить настройки сайта (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the first (and should be only) settings record
    let settings = await db.siteSettings.findFirst();

    // If no settings exist, create default one
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/admin/settings - Обновить настройки сайта (админ)
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get the first settings record or create if doesn't exist
    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {},
      });
    }

    // Update settings
    const updatedSettings = await db.siteSettings.update({
      where: { id: settings.id },
      data: {
        phone: body.phone !== undefined ? body.phone : undefined,
        address: body.address !== undefined ? body.address : undefined,
        whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
        mapEmbedUrl: body.mapEmbedUrl !== undefined ? body.mapEmbedUrl : undefined,
        officeLat: body.officeLat !== undefined ? body.officeLat : undefined,
        officeLng: body.officeLng !== undefined ? body.officeLng : undefined,
        footerLinks: body.footerLinks !== undefined ? body.footerLinks : undefined,
        homepageTexts: body.homepageTexts !== undefined ? body.homepageTexts : undefined,
        faq: body.faq !== undefined ? body.faq : undefined,
        about: body.about !== undefined ? body.about : undefined,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("PATCH /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
