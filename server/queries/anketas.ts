import { db } from "@/lib/db";
import { cache } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface GetAnketasFilters {
  userId?: string;
  cityId?: string;
  categoryId?: string;
  categoryFilterTag?: string;
  search?: string;
  isActive?: boolean;
  minRating?: number;
  onlyWithReviews?: boolean;
  excludeUserId?: string; // Исключить анкеты конкретного пользователя
  onlyVerifiedUsers?: boolean; // Показывать только анкеты от подтвержденных пользователей (по умолчанию true для публичных страниц)
}

type SortByOption = "rating" | "reviews" | "newest" | "oldest";

interface GetAnketasOptions {
  take?: number;
  skip?: number;
  sortBy?: SortByOption;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD WHERE
// ─────────────────────────────────────────────────────────────────────────────

function buildWhere(filters: GetAnketasFilters) {
  const where: any = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.cityId) where.cityId = filters.cityId;
  if (filters.categoryId) where.categoryId = filters.categoryId;

  // Поиск по названию или описанию
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  // Собираем все условия для user в один объект
  const userFilters: any = {};

  // Фильтр по минимальному рейтингу
  if (filters.minRating !== undefined && filters.minRating !== null) {
    userFilters.rating = {
      gte: filters.minRating,
    };
  }

  // Только с отзывами
  if (filters.onlyWithReviews) {
    userFilters.commentsRecv = {
      some: {},
    };
  }

  // Показывать только анкеты от подтвержденных пользователей (по умолчанию true для публичных страниц)
  // Если userId указан (личный кабинет), не применяем этот фильтр
  const shouldFilterVerified = filters.onlyVerifiedUsers !== false && !filters.userId;
  if (shouldFilterVerified) {
    userFilters.phoneVerified = true;
  }

  // Добавляем user фильтры только если они есть
  if (Object.keys(userFilters).length > 0) {
    where.user = userFilters;
  }

  // Исключить анкеты конкретного пользователя
  if (filters.excludeUserId) {
    where.userId = {
      not: filters.excludeUserId,
    };
  }

  return where;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD ORDER BY
// ─────────────────────────────────────────────────────────────────────────────

function buildOrderBy(sortBy?: SortByOption) {
  switch (sortBy) {
    case "rating":
      return { user: { rating: "desc" as const } };
    case "reviews":
      // Сортировка по количеству отзывов - нужен подсчёт
      // Prisma не поддерживает сортировку по count напрямую,
      // поэтому придётся использовать createdAt как fallback
      // или делать агрегацию отдельно
      return { createdAt: "desc" as const };
    case "oldest":
      return { createdAt: "asc" as const };
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY ANKETAS
// ─────────────────────────────────────────────────────────────────────────────

async function queryAnketas(where: any, options?: GetAnketasOptions) {
  const orderBy = buildOrderBy(options?.sortBy);

  const anketas = await db.anketa.findMany({
    where,
    take: options?.take,
    skip: options?.skip,
    include: {
      city: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          rating: true,
          _count: {
            select: {
              commentsRecv: true, // Количество отзывов
            },
          },
        },
      },
    },
    orderBy,
  });

  // Если сортировка по отзывам, делаем client-side сортировку
  if (options?.sortBy === "reviews") {
    return anketas.sort((a, b) => {
      const aCount = a.user._count?.commentsRecv || 0;
      const bCount = b.user._count?.commentsRecv || 0;
      return bCount - aCount;
    });
  }

  return anketas;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET ANKETAS
// ─────────────────────────────────────────────────────────────────────────────

const getAnketasUncached = async (
  filters: GetAnketasFilters = {},
  options?: GetAnketasOptions
) => {
  // По умолчанию для публичных страниц показываем только анкеты от подтвержденных пользователей
  const finalFilters: GetAnketasFilters = {
    ...filters,
    // Если userId указан (личный кабинет), не фильтруем по подтвержденным
    // По умолчанию true для публичных страниц
    onlyVerifiedUsers: filters.userId ? false : (filters.onlyVerifiedUsers !== false),
  };

  let where = buildWhere(finalFilters);

  // Если пришёл filterTag — подставим categoryId
  if (finalFilters.categoryFilterTag) {
    const category = await db.category.findUnique({
      where: { filterTag: finalFilters.categoryFilterTag },
      select: { id: true },
    });

    if (category) {
      where.categoryId = category.id;
    }
  }

  return queryAnketas(where, options);
};

/** React cache — дедупликация */
export const getAnketas = cache(getAnketasUncached);

// ─────────────────────────────────────────────────────────────────────────────
// GET ANKETA BY ID
// ─────────────────────────────────────────────────────────────────────────────

export async function getAnketaById(id: string) {
  return db.anketa.findUnique({
    where: { id },
    include: {
      city: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          rating: true,
          phoneVerified: true,
          emailVerified: true,
          _count: {
            select: {
              commentsRecv: true,
            },
          },
        },
      },
      comments: {
        select: {
          id: true,
          rating: true,
          text: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET ANKETAS COUNT
// ─────────────────────────────────────────────────────────────────────────────

export async function getAnketasCount(
  filters: GetAnketasFilters = {}
): Promise<number> {
  // По умолчанию для публичных страниц показываем только анкеты от подтвержденных пользователей
  const finalFilters: GetAnketasFilters = {
    ...filters,
    // Если userId указан (личный кабинет), не фильтруем по подтвержденным
    // По умолчанию true для публичных страниц
    onlyVerifiedUsers: filters.userId ? false : (filters.onlyVerifiedUsers !== false),
  };

  let where = buildWhere(finalFilters);

  if (finalFilters.categoryFilterTag) {
    const category = await db.category.findUnique({
      where: { filterTag: finalFilters.categoryFilterTag },
      select: { id: true },
    });

    if (category) {
      where.categoryId = category.id;
    }
  }

  return db.anketa.count({ where });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET USER ANKETA COUNT
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserAnketaCount(userId: string) {
  return db.anketa.count({ where: { userId } });
}

export const getAnketaCount = getUserAnketaCount;
