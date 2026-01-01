import { useQuery, useMutation } from "@tanstack/react-query";

export function useAdminSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then(r => r.json()),
  });
}

export function useUpdateSettings() {
  return useMutation({
    mutationFn: (data: any) =>
      fetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  });
}
