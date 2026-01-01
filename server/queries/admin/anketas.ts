import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export interface AdminAnketa {
  id: string;
  userId: string;
  categoryId: string;
  cityId: string;
  title: string;
  description: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  showLocation: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    rating: number | null;
    _count: {
      commentsRecv: number;
    };
  };
  city: {
    id: string;
    nameRu: string;
    nameEn: string;
    nameKk: string;
  };
  category: {
    id: string;
    nameRu: string;
    nameEn: string;
    nameKk: string;
    filterTag: string;
  };
  _count: {
    comments: number;
  };
}

export interface AnketaFilters {
  search?: string;
  status?: "published" | "draft" | "all";
  categoryId?: string;
  cityId?: string;
}

export async function getAdminAnketas(
  filters: AnketaFilters = {}
): Promise<AdminAnketa[]> {
  await requireAdmin();

  const where: any = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  if (filters.status && filters.status !== "all") {
    where.isActive = filters.status === "published";
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.cityId) {
    where.cityId = filters.cityId;
  }

  return db.anketa.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          rating: true,
          _count: {
            select: {
              commentsRecv: true,
            },
          },
        },
      },
      city: {
        select: {
          id: true,
          nameRu: true,
          nameEn: true,
          nameKk: true,
        },
      },
      category: {
        select: {
          id: true,
          nameRu: true,
          nameEn: true,
          nameKk: true,
          filterTag: true,
        },
      },
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
}



