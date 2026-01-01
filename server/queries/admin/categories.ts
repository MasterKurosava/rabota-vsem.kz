import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export interface AdminCategory {
  id: string;
  nameRu: string;
  nameEn: string;
  nameKk: string;
  imageUrl: string;
  filterTag: string;
  createdAt: Date;
  _count: {
    anketa: number;
  };
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await requireAdmin();

  return db.category.findMany({
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
}



