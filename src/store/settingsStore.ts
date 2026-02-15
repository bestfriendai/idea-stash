import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  hasCompletedOnboarding: boolean;
  sortOrder: 'newest' | 'oldest' | 'alphabetical' | 'category';
  viewMode: 'list' | 'grid';
}

interface SettingsState extends UserPreferences {
  isLoading: boolean;
  
  // Actions
  loadPreferences: () => Promise<void>;
  setOnboardingComplete: () => Promise<void>;
  setSortOrder: (order: 'newest' | 'oldest' | 'alphabetical' | 'category') => Promise<void>;
  setViewMode: (mode: 'list' | 'grid') => Promise<void>;
}

const STORAGE_KEY = '@ideastash_preferences';

const defaultPreferences: UserPreferences = {
  hasCompletedOnboarding: false,
  sortOrder: 'newest',
  viewMode: 'list',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultPreferences,
  isLoading: true,

  loadPreferences: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const prefs = JSON.parse(data);
        set({ ...prefs, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setOnboardingComplete: async () => {
    const newPrefs = { ...get(), hasCompletedOnboarding: true };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ hasCompletedOnboarding: true });
  },

  setSortOrder: async (order) => {
    const newPrefs = { ...get(), sortOrder: order };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ sortOrder: order });
  },

  setViewMode: async (mode) => {
    const newPrefs = { ...get(), viewMode: mode };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    set({ viewMode: mode });
  },
}));
