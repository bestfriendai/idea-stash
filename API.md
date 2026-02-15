# IdeaStash API

## Store API

### useIdeaStore

```typescript
import { useIdeaStore } from './src/store/ideaStore';
```

#### State

```typescript
{
  ideas: Idea[];
  categories: IdeaCategory[];
  selectedCategory: IdeaCategory | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
```

#### Actions

##### loadIdeas()

```typescript
const { loadIdeas } = useIdeaStore();
await loadIdeas();
```

##### addIdea(idea)

```typescript
await addIdea({
  title: 'My Idea',
  description: 'Idea description',
  category: 'tech',
  tags: ['tag1', 'tag2'],
});
```

##### updateIdea(id, updates)

```typescript
await updateIdea('1', { title: 'New Title' });
```

##### deleteIdea(id)

```typescript
await deleteIdea('1');
```

##### toggleFavorite(id)

```typescript
await toggleFavorite('1');
```

##### toggleImplemented(id)

```typescript
await toggleImplemented('1');
```

## Types

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

## Theme API

```typescript
import { colors, spacing, fontSize, fontWeight } from './src/ui/theme';

colors.primary      // #7C3AED
colors.categories.business // #10B981
// etc.
```
