import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  isFavorite: boolean;
  isImplemented: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IdeaCategory = 
  | 'business'
  | 'tech'
  | 'creative'
  | 'personal'
  | 'health'
  | 'education'
  | 'lifestyle'
  | 'other';

export const CATEGORY_LABELS: Record<IdeaCategory, string> = {
  business: 'Business',
  tech: 'Tech',
  creative: 'Creative',
  personal: 'Personal',
  health: 'Health',
  education: 'Education',
  lifestyle: 'Lifestyle',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<IdeaCategory, string> = {
  business: '#10B981',
  tech: '#3B82F6',
  creative: '#F59E0B',
  personal: '#EC4899',
  health: '#14B8A6',
  education: '#8B5CF6',
  lifestyle: '#F97316',
  other: '#6B7280',
};

interface IdeaState {
  ideas: Idea[];
  categories: IdeaCategory[];
  selectedCategory: IdeaCategory | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadIdeas: () => Promise<void>;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'isImplemented'>) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleImplemented: (id: string) => Promise<void>;
  setSelectedCategory: (category: IdeaCategory | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

const STORAGE_KEY = '@ideastash_ideas';

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  categories: ['business', 'tech', 'creative', 'personal', 'health', 'education', 'lifestyle', 'other'],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,

  loadIdeas: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const ideas = data ? JSON.parse(data) : [];
      set({ ideas, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load ideas', isLoading: false });
    }
  },

  addIdea: async (ideaData) => {
    const newIdea: Idea = {
      ...ideaData,
      id: Date.now().toString(),
      isFavorite: false,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const { ideas } = get();
    const updatedIdeas = [newIdea, ...ideas];
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
    set({ ideas: updatedIdeas });
  },

  updateIdea: async (id, updates) => {
    const { ideas } = get();
    
    const updatedIdeas = ideas.map(idea =>
      idea.id === id
        ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
        : idea
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
    set({ ideas: updatedIdeas });
  },

  deleteIdea: async (id) => {
    const { ideas } = get();
    
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
    set({ ideas: updatedIdeas });
  },

  toggleFavorite: async (id) => {
    const { ideas } = get();
    
    const updatedIdeas = ideas.map(idea =>
      idea.id === id
        ? { ...idea, isFavorite: !idea.isFavorite, updatedAt: new Date().toISOString() }
        : idea
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
    set({ ideas: updatedIdeas });
  },

  toggleImplemented: async (id) => {
    const { ideas } = get();
    
    const updatedIdeas = ideas.map(idea =>
      idea.id === id
        ? { ...idea, isImplemented: !idea.isImplemented, updatedAt: new Date().toISOString() }
        : idea
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIdeas));
    set({ ideas: updatedIdeas });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));
