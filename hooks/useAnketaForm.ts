import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { getAnketaSchema, type AnketaInput } from "@/lib/validators/anketa";
import { createAnketa, updateAnketa, deleteAnketa } from "@/server/actions/anketas";
import type { Anketa, City, Category } from "@prisma/client";

interface UseAnketaFormOptions {
  anketa?: Anketa & { city: City; category: Category };
  onSuccess?: () => void;
}

export function useAnketaForm(options: UseAnketaFormOptions = {}) {
  const router = useRouter();
  const t = useTranslations("anketa");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const schema = getAnketaSchema((key: string) => t(key));

  const form = useForm<AnketaInput>({
    resolver: zodResolver(schema),
    defaultValues: options.anketa
      ? {
          ...options.anketa,
          address: options.anketa.address ?? undefined,
          latitude: options.anketa.latitude ?? undefined,
          longitude: options.anketa.longitude ?? undefined,
        }
      : {
          showLocation: false,
          isActive: true,
        },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const showLocation = watch("showLocation");

  /** --- УНИФИЦИРОВАННЫЙ ПАРСЕР ДЛЯ FormData --- */
  const toFormData = useCallback((data: AnketaInput) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined || v === null) continue;
      fd.append(k, typeof v === "boolean" ? String(v) : String(v));
    }
    return fd;
  }, []);

  /** --- SUBMIT --- */
  const onSubmit = useCallback(async (data: AnketaInput) => {
    setLoading(true);
    setError(null);

    try {
      const fd = toFormData(data);
      const res = options.anketa
        ? await updateAnketa(options.anketa.id, fd)
        : await createAnketa(fd);

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/account/anketa");
        router.refresh();
        options.onSuccess?.();
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [options, router, toFormData]);

  /** --- DELETE --- */
  const handleDelete = useCallback(async () => {
    if (!options.anketa) return;

    setLoading(true);
    try {
      const res = await deleteAnketa(options.anketa.id);
      if (res.error) setError(res.error);
      else {
        router.push("/account/anketa");
        router.refresh();
        options.onSuccess?.();
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [options, router]);

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    errors,
    showLocation,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
  };
}
