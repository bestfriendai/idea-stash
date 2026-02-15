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
      
      if (ideas.length === 0) {
        const sampleIdeas = generateSampleIdeas();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleIdeas));
        set({ ideas: sampleIdeas, isLoading: false });
      } else {
        set({ ideas, isLoading: false });
      }
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

function generateSampleIdeas(): Idea[] {
  return [
    {
      id: '1',
      title: 'AI-Powered Meal Planner',
      description: 'An app that generates weekly meal plans based on dietary preferences, budget, and available ingredients using AI.',
      category: 'tech',
      tags: ['AI', 'health', 'productivity'],
      isFavorite: true,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Local Artist Marketplace',
      description: 'A platform connecting local artists with buyers. Features include virtual galleries, commission requests, and event listings.',
      category: 'business',
      tags: ['marketplace', 'art', 'community'],
      isFavorite: true,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Morning Routine App',
      description: 'Guided morning routines with customizable checklists, affirmations, and habit tracking. Focus on building consistent morning habits.',
      category: 'personal',
      tags: ['habits', 'productivity', 'wellness'],
      isFavorite: false,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Podcast Clip Generator',
      description: 'Automatically generate short video clips from long-form podcast episodes for social media sharing.',
      category: 'creative',
      tags: ['content', 'social media', 'audio'],
      isFavorite: false,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Language Exchange Meetup App',
      description: 'Find and organize language exchange meetups in your area. Match with native speakers for mutual learning.',
      category: 'education',
      tags: ['language', 'community', 'learning'],
      isFavorite: false,
      isImplemented: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
