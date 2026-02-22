# Vibe Finder

## Overview

Vibe Finder is a cross-platform mobile application (Android, iOS, and Web) built with Expo/React Native that helps users discover nearby restaurants, cafes, adventure spots, and entertainment venues based on their mood, companions, budget, and preferences. The app features a discovery-driven experience with mood-based filtering, a TikTok-style reels feed, search, favorites, and detailed place views.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, targeting Android, iOS, and Web simultaneously
- **Routing**: File-based routing via `expo-router` v6 with typed routes enabled. The app uses a tab-based layout (`app/(tabs)/`) with four main screens: Home, Discover, Reels, and Search. Additional screens include place detail (`app/place/[id].tsx`) and favorites (`app/favorites.tsx`)
- **State Management**: `@tanstack/react-query` for server state management; local component state via React hooks. No global state library — the app is relatively simple in its state needs
- **Styling**: React Native `StyleSheet` with a custom theme system (`lib/useTheme.ts`) supporting light/dark mode via `useColorScheme()`. Color tokens defined in `constants/colors.ts` with a coral/teal/navy palette
- **Fonts**: Poppins font family loaded via `@expo-google-fonts/poppins` (Regular, Medium, SemiBold, Bold weights)
- **Animations**: `react-native-reanimated` v4 for animations (FadeIn, SlideInRight, etc.)
- **Haptics**: `expo-haptics` for tactile feedback on user interactions
- **Data**: Places data is currently hardcoded in `constants/places.ts` with filtering utilities (`filterPlaces`). Seed data for restaurants, cafes, adventure, and entertainment venues is in `attached_assets/` JSON files (all Hyderabad-based locations)
- **Favorites**: Persisted locally using `@react-native-async-storage/async-storage` (see `lib/favorites.ts`)
- **Key UI Components**: `PlaceCard` (supports compact, horizontal layouts), `QuickAction`, `SectionHeader`, `ErrorBoundary`/`ErrorFallback`, `KeyboardAwareScrollViewCompat`

### Backend (Express)

- **Framework**: Express v5 running as a Node.js server (`server/index.ts`)
- **Purpose**: Serves as the API backend and, in production, serves the static web build
- **Routes**: Defined in `server/routes.ts` — currently minimal with placeholder for `/api` prefixed routes
- **Storage**: `server/storage.ts` implements an in-memory storage layer (`MemStorage`) with a user CRUD interface. This is a placeholder — the app is designed to transition to PostgreSQL via Drizzle ORM
- **CORS**: Custom CORS middleware that allows Replit domains and localhost origins for development
- **Development**: Uses `tsx` for TypeScript execution; production builds use `esbuild` to bundle the server

### Database (PostgreSQL + Drizzle ORM)

- **ORM**: Drizzle ORM with PostgreSQL dialect, configured in `drizzle.config.ts`
- **Schema**: Defined in `shared/schema.ts` — currently contains a `users` table with `id` (UUID, auto-generated), `username`, and `password` fields
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions for input validation
- **Migrations**: Output to `./migrations` directory; push with `npm run db:push`
- **Connection**: Requires `DATABASE_URL` environment variable
- **Note**: The current runtime storage is in-memory (`MemStorage`). The Drizzle schema exists but the database connection is not yet wired into the storage implementation

### Build & Deployment

- **Development**: Two processes run simultaneously — Expo dev server (`expo:dev`) and Express server (`server:dev`)
- **Production Web Build**: Custom build script (`scripts/build.js`) that starts Metro, bundles the web app, and outputs static files. The Express server serves these in production
- **Server Build**: Uses `esbuild` to bundle the server TypeScript into `server_dist/`
- **Environment**: Designed to run on Replit with `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, and `REPLIT_INTERNAL_APP_DOMAIN` environment variables

### Key Design Decisions

1. **Hardcoded place data vs. database**: Places are currently defined as constants in `constants/places.ts` rather than in the database. This enables rapid prototyping but should migrate to the database for real use
2. **Shared schema directory**: The `shared/` directory contains code used by both frontend and backend (database schemas, types, validation)
3. **In-memory storage pattern**: The storage layer uses an interface (`IStorage`) that can be swapped from `MemStorage` to a database-backed implementation without changing route handlers
4. **Tab-based navigation**: Four tabs (Home, Discover, Reels, Search) provide the core navigation. The Discover tab implements a step-by-step wizard flow (companion → mood → type → results)
5. **Platform-specific adaptations**: Safe area insets, keyboard handling, blur effects, and tab bar styling all have platform-specific logic for web vs. native

## External Dependencies

- **PostgreSQL**: Database (requires `DATABASE_URL` environment variable). Used with Drizzle ORM for schema management and queries
- **Expo Services**: Splash screen, fonts, image handling, location services, haptics
- **AsyncStorage**: Local device storage for favorites persistence
- **Unsplash**: Restaurant/place images are sourced from Unsplash URLs (referenced in `constants/places.ts`)
- **No external APIs currently integrated**: Place data is static. The app is structured to support API-based place discovery in the future