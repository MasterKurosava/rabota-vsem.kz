"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  await deleteSession();
  revalidatePath("/", "layout");
  redirect("/");
}
