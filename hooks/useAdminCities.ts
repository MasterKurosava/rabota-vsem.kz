import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { City } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminCity extends City {
  _count: {
    anketa: number;
  };
}

export interface CreateCityData {
  nameRu: string;
  nameEn: string;
  nameKk: string;
  isActive?: boolean;
}

export interface UpdateCityData {
  nameRu?: string;
  nameEn?: string;
  nameKk?: string;
  isActive?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchCities(): Promise<AdminCity[]> {
  const response = await fetch("/api/admin/cities");
  if (!response.ok) throw new Error("Failed to fetch cities");
  return response.json();
}

async function createCity(data: CreateCityData): Promise<AdminCity> {
  const response = await fetch("/api/admin/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create city");
  return response.json();
}

async function updateCity(id: string, data: UpdateCityData): Promise<AdminCity> {
  const response = await fetch(`/api/admin/cities/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update city");
  return response.json();
}

async function deleteCity(id: string): Promise<void> {
  const response = await fetch(`/api/admin/cities/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete city");
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminCities() {
  return useQuery({
    queryKey: ["admin", "cities"],
    queryFn: fetchCities,
  });
}

export function useCreateCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCityData) => createCity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cities"] });
    },
  });
}

export function useUpdateCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCityData }) =>
      updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cities"] });
    },
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCity(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "cities"] });
      const previousCities = queryClient.getQueryData<AdminCity[]>(["admin", "cities"]);

      queryClient.setQueryData<AdminCity[]>(["admin", "cities"], (old) =>
        old ? old.filter((city) => city.id !== id) : []
      );

      return { previousCities };
    },
    onError: (err, id, context) => {
      if (context?.previousCities) {
        queryClient.setQueryData(["admin", "cities"], context.previousCities);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cities"] });
    },
  });
}
