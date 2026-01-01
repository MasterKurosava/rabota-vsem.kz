import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminUser extends User {
  _count: {
    anketa: number;
    commentsRecv: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchUsers(): Promise<AdminUser[]> {
  const response = await fetch("/api/admin/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

async function updateUserVerification(
  id: string,
  data: { phoneVerified?: boolean; emailVerified?: boolean }
): Promise<AdminUser> {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
}

async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });
}

export function useUpdateUserVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      phoneVerified,
      emailVerified,
    }: {
      id: string;
      phoneVerified?: boolean;
      emailVerified?: boolean;
    }) => updateUserVerification(id, { phoneVerified, emailVerified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previousUsers = queryClient.getQueryData<AdminUser[]>(["admin", "users"]);

      queryClient.setQueryData<AdminUser[]>(["admin", "users"], (old) =>
        old ? old.filter((user) => user.id !== id) : []
      );

      return { previousUsers };
    },
    onError: (err, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["admin", "users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
