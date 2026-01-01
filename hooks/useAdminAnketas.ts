import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Anketa, City, Category, User } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminAnketa extends Anketa {
  user: User & {
    _count: {
      commentsRecv: number;
    };
  };
  city: City;
  category: Category;
  _count: {
    comments: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAnketas(): Promise<AdminAnketa[]> {
  const response = await fetch("/api/admin/anketas");
  if (!response.ok) throw new Error("Failed to fetch anketas");
  return response.json();
}

async function updateAnketaStatus(id: string, isActive: boolean): Promise<AdminAnketa> {
  const response = await fetch(`/api/admin/anketas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) throw new Error("Failed to update anketa");
  return response.json();
}

async function deleteAnketa(id: string): Promise<void> {
  const response = await fetch(`/api/admin/anketas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete anketa");
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminAnketas() {
  return useQuery({
    queryKey: ["admin", "anketas"],
    queryFn: fetchAnketas,
  });
}

export function useUpdateAnketaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAnketaStatus(id, isActive),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "anketas"] });
    },
  });
}

export function useDeleteAnketa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAnketa(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "anketas"] });

      // Snapshot previous value
      const previousAnketas = queryClient.getQueryData<AdminAnketa[]>(["admin", "anketas"]);

      // Optimistically update to the new value
      queryClient.setQueryData<AdminAnketa[]>(["admin", "anketas"], (old) =>
        old ? old.filter((anketa) => anketa.id !== id) : []
      );

      // Return context with snapshotted value
      return { previousAnketas };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousAnketas) {
        queryClient.setQueryData(["admin", "anketas"], context.previousAnketas);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["admin", "anketas"] });
    },
  });
}
