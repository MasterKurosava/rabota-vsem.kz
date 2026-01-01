"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  try {
    const session = await requireAuth();

    const anketaId = formData.get("anketaId") as string;
    const recipientId = formData.get("recipientId") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const text = formData.get("text") as string;

    if (!anketaId || !recipientId || !rating || !text) {
      return { error: "Missing required fields" };
    }

    if (rating < 1 || rating > 5) {
      return { error: "Rating must be between 1 and 5" };
    }

    if (text.trim().length < 10) {
      return { error: "Comment must be at least 10 characters" };
    }

    // Check if user already commented on this anketa
    const existingComment = await db.comment.findFirst({
      where: {
        authorId: session.userId,
        anketaId,
      },
    });

    if (existingComment) {
      return { error: "You have already left a comment on this profile" };
    }

    // Create comment
    await db.comment.create({
      data: {
        authorId: session.userId,
        recipientId,
        anketaId,
        rating,
        text: text.trim(),
      },
    });

    // Update user rating (average of all comments)
    const comments = await db.comment.findMany({
      where: { recipientId },
      select: { rating: true },
    });

    const averageRating =
      comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;

    await db.user.update({
      where: { id: recipientId },
      data: { rating: averageRating },
    });

    revalidatePath(`/anketas/${anketaId}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to create comment" };
  }
}

