# IdeaStash Architecture

## Overview

IdeaStash is a React Native mobile app built with Expo that helps users capture, organize, and track their ideas.

## Architecture Pattern

**Clean Architecture** with three main layers:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
├─────────────────────────────────────┤
│           Domain Layer              │
│    (Business Logic, State Stores)   │
├─────────────────────────────────────┤
│            Data Layer               │
│  (Storage, APIs, External Services) │
└─────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State Management | Zustand |
| Local Storage | AsyncStorage |

## Navigation Structure

```
Root Layout
├── Onboarding (first-time users)
├── Main Tabs (after onboarding)
│   ├── Ideas (index) - All ideas
│   ├── Favorites - Starred ideas
│   └── Settings - App preferences
├── Idea Detail (/idea/[id])
├── Add Idea (/add-idea)
├── Edit Idea (/edit-idea/[id])
└── Paywall (/paywall)
```

## State Management

### IdeaStore (`src/store/ideaStore.ts`)

Manages all idea-related state:

```typescript
interface IdeaState {
  ideas: Idea[];
  categories: IdeaCategory[];
  selectedCategory: IdeaCategory | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadIdeas: () => Promise<void>;
  addIdea: (idea: Idea) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleImplemented: (id: string) => Promise<void>;
  setSelectedCategory: (category: IdeaCategory | null) => void;
  setSearchQuery: (query: string) => void;
}
```

## Data Models

### Idea

```typescript
interface Idea {
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
```

### IdeaCategory

```typescript
type IdeaCategory = 
  | 'business'
  | 'tech'
  | 'creative'
  | 'personal'
  | 'health'
  | 'education'
  | 'lifestyle'
  | 'other';
```

## Storage Strategy

- **AsyncStorage**: Primary persistence layer
  - `@ideastash_ideas`: All ideas
  - `@ideastash_settings`: User preferences

## Theming

Design tokens in `src/ui/theme.ts`:

- **Colors**: Brand purple (#7C3AED) + category colors + semantic colors
- **Spacing**: 8pt grid system
- **Radius**: Consistent border radius
- **Typography**: System fonts with size scale
- **Shadows**: Elevation-based shadow system

## Category Colors

| Category | Color |
|----------|-------|
| Business | #10B981 |
| Tech | #3B82F6 |
| Creative | #F59E0B |
| Personal | #EC4899 |
| Health | #14B8A6 |
| Education | #8B5CF6 |
| Lifestyle | #F97316 |
| Other | #6B7280 |

## Future Enhancements

### Phase 2 (Premium)
- Cloud sync across devices
- Rich text editor for descriptions
- Image attachments
- Idea collaboration

### Phase 3 (Community)
- Public idea sharing
- Upvoting interesting ideas
- Developer/API access
