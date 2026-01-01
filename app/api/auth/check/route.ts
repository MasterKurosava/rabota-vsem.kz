import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getSession();

  const response = NextResponse.json({
    authenticated: !!session,
    user: session ? {
      userId: session.userId,
      email: session.email,
      phone: session.phone,
      role: session.role,
    } : null,
  });

  // Prevent caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}







