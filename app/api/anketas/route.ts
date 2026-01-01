import { NextRequest, NextResponse } from "next/server";
import { getAnketas, getAnketasCount } from "@/server/queries/anketas";
import { buildAnketaFilters } from "@/lib/utils/anketa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { filters, options } = buildAnketaFilters({
      cityId: searchParams.get("cityId") || undefined,
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      minRating: searchParams.get("minRating") || undefined,
      onlyWithReviews: searchParams.get("onlyWithReviews") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
    });

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [anketas, total] = await Promise.all([
      getAnketas(filters, {
        ...options,
        take: limit,
        skip,
      }),
      getAnketasCount(filters),
    ]);

    return NextResponse.json({
      data: anketas,
      hasMore: anketas.length === limit,
      total,
      page,
    });
  } catch (error) {
    console.error("Error fetching anketas:", error);
    return NextResponse.json(
      { error: "Failed to fetch anketas" },
      { status: 500 }
    );
  }
}

