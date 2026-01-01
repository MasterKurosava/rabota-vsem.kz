"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnketaList } from "./AnketaList";
import { deleteAnketa } from "@/server/actions/anketas";
import { toast } from "sonner";

interface AnketaListWrapperProps {
  anketa: any[];
}

export function AnketaListWrapper({ anketa }: AnketaListWrapperProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту анкету?")) {
      return;
    }

    setIsDeleting(id);
    try {
      const result = await deleteAnketa(id);
      if (result.success) {
        toast.success("Анкета успешно удалена");
        router.refresh();
      } else {
        toast.error(result.error || "Ошибка при удалении анкеты");
      }
    } catch (error) {
      toast.error("Ошибка при удалении анкеты");
      console.error("Delete anketa error:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return <AnketaList anketa={anketa} onDelete={handleDelete} />;
}

