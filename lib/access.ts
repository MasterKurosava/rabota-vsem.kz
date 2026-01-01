import { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === Role.ADMIN;
}

export async function getUserRole(): Promise<Role | null> {
  const session = await getSession();
  return session?.role ?? null;
}


