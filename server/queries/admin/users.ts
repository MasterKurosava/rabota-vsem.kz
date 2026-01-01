import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  rating: number | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  _count: {
    anketa: number;
    commentsRecv: number;
  };
}

export interface UserFilters {
  search?: string;
  role?: "USER" | "ADMIN" | "all";
  verification?: "verified" | "unverified" | "all";
}

export async function getAdminUsers(
  filters: UserFilters = {}
): Promise<AdminUser[]> {
  await requireAdmin();

  const where: any = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search } },
    ];
  }

  if (filters.role && filters.role !== "all") {
    where.role = filters.role;
  }

  if (filters.verification && filters.verification !== "all") {
    if (filters.verification === "verified") {
      where.phoneVerified = true;
    } else {
      where.phoneVerified = false;
    }
  }

  return db.user.findMany({
    where,
    include: {
      _count: {
        select: {
          anketa: true,
          commentsRecv: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}



