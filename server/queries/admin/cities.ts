import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export interface AdminCity {
  id: string;
  nameRu: string;
  nameEn: string;
  nameKk: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    anketa: number;
  };
}

export async function getAdminCities(): Promise<AdminCity[]> {
  await requireAdmin();

  return db.city.findMany({
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



