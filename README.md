# IdeaStash 💡

Capture, organize, and track your ideas. Never let a great idea slip away.

## Features

- **Capture Ideas**: Quickly jot down ideas as they come
- **Categorize**: Organize by category (Business, Tech, Creative, Personal, Health, Education, Lifestyle)
- **Tag System**: Add tags for easy filtering
- **Search**: Full-text search across titles, descriptions, and tags
- **Favorites**: Star your best ideas
- **Track Progress**: Mark ideas as implemented
- **Sample Data**: Comes with example ideas to get started

## Tech Stack

- **Framework**: Expo SDK 54 with Expo Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Persistence**: AsyncStorage
- **UI**: React Native with custom theme

## Design

- **Brand Color**: #7C3AED (Purple)
- **Style**: Clean, modern, idea-focused
- **Category Colors**: Each category has a unique color
- **Dark Mode**: Supported

## Project Structure

```
idea-stash/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx     # Ideas list
│   │   ├── favorites.tsx # Favorited ideas
│   │   └── settings.tsx  # App settings
│   ├── idea/[id].tsx     # Idea detail
│   ├── add-idea.tsx      # Add new idea
│   ├── edit-idea.tsx     # Edit existing idea
│   └── paywall.tsx       # Premium upgrade
├── src/
│   ├── store/            # Zustand stores
│   │   ├── ideaStore.ts   # Ideas state
│   │   └── settingsStore.ts
│   └── ui/              # UI utilities
│       └── theme.ts      # Design tokens
└──aso/                   # App Store Optimization
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed installation instructions.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Screenshots

The app features:
- Purple branding (#7C3AED)
- Card-based idea display with category badges
- Color-coded category chips
- Tag display
- Implemented/done tracking
- Pull-to-refresh

## License

MIT
