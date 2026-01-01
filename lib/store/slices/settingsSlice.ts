import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SiteSettings } from "@prisma/client";

// Сериализуемый тип для Redux store (Date -> string)
export type SerializableSiteSettings = Omit<SiteSettings, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface SettingsState {
  settings: SerializableSiteSettings | null;
  isLoading: boolean;
}

const initialState: SettingsState = {
  settings: null,
  isLoading: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SerializableSiteSettings | null>) => {
      state.settings = action.payload;
      state.isLoading = false;
    },
    clearSettings: (state) => {
      state.settings = null;
      state.isLoading = true;
    },
  },
});

export const { setSettings, clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;

