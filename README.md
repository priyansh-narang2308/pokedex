# Pokédex

A modern, high-performance Pokédex web application built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, and TanStack React Query.

---

## Features

- **Paginated Exploration & Infinite Scroll**: Browse through the complete Pokédex with smooth pagination and infinite scrolling powered by TanStack React Query.
- **Instant Real-Time Search**: Substring search by Pokémon name or direct lookup by Pokédex ID with debouncing and bi-directional URL query synchronization (`?search=...`).
- **Type Filtering**: Filter Pokémon by any elemental type using an animated select dropdown with overscroll protection and URL state persistence (`?type=...`).
- **Animated Detail View (`/pokemon/[name]`)**:
  - Dedicated dynamic route featuring staggered spring physics animations with Framer Motion.
  - High-resolution official artwork rendered over an ambient radial glow dynamically tinted to the Pokémon's primary type.
  - Physical measurements (Height & Weight) with metric conversions.
  - Ability breakdown highlighting standard and hidden abilities.
  - Animated base stat progress bars with custom color mapping per stat.
  - Top moves showcase.
- **Head-to-Head Comparison Engine (`/compare`)**:
  - Floating bottom Compare Dock that dynamically tracks queued Pokémon across all pages.
  - Split-screen comparison page that visually compares base stats side-by-side.
  - Winner calculation: dynamically highlights the winning stat bar in that Pokémon's type color while dulling the lower stat.
- **Persistent Favorites (`/?tab=favorites`)**:
  - One-click favoriting on Pokémon cards and detail views.
  - Client-side persistence using Zustand with LocalStorage sync.
  - Dedicated Favorites view supporting search and type filtering.
- **Glassmorphism & Micro-Interactions**:
  - Multi-layer glassmorphism design with backdrop blurs, subtle borders, and smooth card hover lifts.
  - Shimmering skeleton loading placeholders preventing layout shifts.
  - Animated toast notification stack for immediate user feedback.
- **Dark & Light Mode**: Seamless theme switching with system preference detection via next-themes.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management & Persistence**: [Zustand](https://zustand-demo.pmnd.rs/) with persist middleware
- **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **UI Components & Icons**: [shadcn/ui](https://ui.shadcn.com/), [@beui primitives](https://beui.dev/), and [Lucide React](https://lucide.dev/)

---

## API Used

Data is powered by the public [PokéAPI (v2)](https://pokeapi.co/):

- **Paginated List**: `GET https://pokeapi.co/api/v2/pokemon?limit=20&offset={offset}`
- **Pokémon Details**: `GET https://pokeapi.co/api/v2/pokemon/{nameOrId}`
- **Type List & Filtering**: `GET https://pokeapi.co/api/v2/type/{type}`
- **Global Search Index**: `GET https://pokeapi.co/api/v2/pokemon?limit=10000` (Lightweight name/ID index for instant client-side autocomplete)

---

## Installation

Ensure you have [Node.js](https://nodejs.org/) (v18.18+ or v20+) installed on your machine.

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/pokedex.git
   cd pokedex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Running Locally

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## Project Structure

```
pipelineai/
├── app/
│   ├── compare/
│   │   └── page.tsx              # Head-to-head Pokémon comparison page
│   ├── pokemon/
│   │   └── [name]/
│   │       └── page.tsx          # Dynamic Pokémon detail route
│   ├── globals.css               # Tailwind CSS tokens & theme definitions
│   ├── layout.tsx                # Root layout (Providers, Header, CompareDock, Toast)
│   └── page.tsx                  # Home page (Pokédex grid, search, filters, favorites)
├── components/
│   ├── header.tsx                # Global navigation header with theme toggle & badges
│   ├── logo.tsx                  # Custom Pokéball branding logo
│   ├── theme-provider.tsx        # Next-themes wrapper
│   ├── toast-provider.tsx        # Animated toast notifications context
│   ├── motion/
│   │   ├── animated-toast-stack.tsx # Animated stack toast component
│   │   ├── select.tsx            # Bouncy motion select primitive
│   │   └── page-reveal.tsx       # Smooth page reveal animation wrapper
│   ├── pokemon/
│   │   ├── compare-dock.tsx      # Floating bottom Compare Dock
│   │   ├── empty-state.tsx       # Reusable animated empty and error state component
│   │   ├── pokemon-card.tsx      # Interactive Pokémon grid card with actions
│   │   ├── pokemon-card-skeleton.tsx # Shimmer skeleton loading placeholder
│   │   ├── pokemon-detail-view.tsx   # Detailed view with animated stats and moves
│   │   ├── pokemon-grid.tsx      # Responsive CSS grid container
│   │   ├── search-bar.tsx        # Debounced search input with URL sync
│   │   ├── type-badge.tsx        # Dynamically colored Pokémon type badge
│   │   └── type-filter.tsx       # Type filter dropdown selector
│   └── ui/                       # Reusable shadcn base components (button, dialog, etc.)
├── hooks/
│   ├── useAllPokemons.ts         # Hook for caching all Pokémon names for instant search
│   ├── usePokemonByType.ts       # Hook for fetching Pokémon by elemental type
│   ├── usePokemonDetail.ts       # Hook for fetching single Pokémon details
│   ├── usePokemons.ts             # Infinite query hook for paginated listing
│   ├── usePokemonStore.ts        # Zustand persistent store (Favorites & Compare Queue)
│   └── use-scroll.ts             # Hook for header scroll transitions
└── lib/
    ├── api.ts                    # Generic fetch wrapper with error handling
    ├── colors.ts                 # Type colors & stat progress bar color mappings
    └── utils.ts                  # Classnames & styling utilities
```

---

## Challenges Faced

1. **PokéAPI Partial Search Limitation**:
   - _Challenge_: The PokéAPI does not provide a native substring/fuzzy search endpoint (querying `/pokemon/char` returns 404; only full exact names or IDs work).
   - _Solution_: Implemented a lightweight cached index fetch (`/pokemon?limit=10000`) on first search. This enables instantaneous substring matching in memory while lazily fetching rich card details via individual React Query hooks.

2. **Next.js 16 Asynchronous Route Params**:
   - _Challenge_: In Next.js 15 and 16, dynamic route parameters (`params`) in Server Components are asynchronous promises (`Promise<{ name: string }>`), causing errors if accessed synchronously.
   - _Solution_: Awaited `params` within the server component before initiating data fetching, ensuring strict Next.js 16 type compliance.

3. **Dropdown Overscroll & Page Hijacking**:
   - _Challenge_: Scrolling to the bottom of the custom motion select dropdown caused parent page scroll chaining.
   - _Solution_: Encapsulated dropdown item lists inside a dedicated `ScrollContainer` with CSS `overscroll-behavior: contain` and reset scroll positions on popover open/close cycles.

4. **Synchronizing State with Shareable URLs**:
   - _Challenge_: Keeping search inputs, type selectors, and navigation tabs synchronized with browser history and shareable URLs without triggering re-render thrashing.
   - _Solution_: Implemented debounced URL search param synchronization with Next.js `useRouter` and `useSearchParams`, providing instant shareability and bookmarking support.

---

## Future Improvements

- Evolution Chains: Fetch and visualize full evolution trees with level-up requirements and branching forms.
- Audio Cry Player: Play authentic Pokémon sound cries via the PokéAPI audio assets on card hover and detail views.
- Team Builder: Allow users to assemble a 6-Pokémon team with automatic type coverage, weakness, and resistance analysis.
- Damage Calculator: Interactive battle simulator calculating effectiveness multipliers between selected Pokémon.
- PWA / Offline Mode: Service worker caching for offline Pokédex lookups on mobile devices.
