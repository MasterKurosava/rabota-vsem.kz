"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSettings, type SerializableSiteSettings } from "@/lib/store/slices/settingsSlice";
import type { SiteSettings } from "@prisma/client";

interface SettingsInitializerProps {
  settings: SiteSettings | null;
}

export function SettingsInitializer({ settings }: SettingsInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Преобразуем Date в строки для сериализации в Redux
    const serializableSettings: SerializableSiteSettings | null = settings
      ? {
          ...settings,
          createdAt: settings.createdAt.toISOString(),
          updatedAt: settings.updatedAt.toISOString(),
        }
      : null;
    
    dispatch(setSettings(serializableSettings));
  }, [dispatch, settings]);

  return null;
}

