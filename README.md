# Recipe Finder & Meal Planner

Modern **Recipe Finder & Meal Planner** built with **Svelte 5 + SvelteKit** and a reusable **StencilJS** component library. Discover recipes from [TheMealDB](https://www.themealdb.com/api.php), view full details with ingredients & instructions, manage favorites, create your own recipes, and organize a weekly meal plan.

> **Live Demo (Vercel):** https://recipe-finder-sveltevercel.vercel.app/
> 
> **Stencil Library (npm):** https://www.npmjs.com/package/@ssj4kyuubi/recipe-ui-lib
> 
> **GitHub Repository:** https://github.com/Jdhruvraj/Recipe-Finder-Svelte

---

## Features

- **Recipe Discovery** — search by name, browse random recipes, filter by category, grid display via `rui-recipe-list`
- **Recipe Details** — dedicated `/recipe/[id]` page with image, meta, **ingredients in 2 side-by-side tables**, instructions, YouTube/source links (`rui-recipe-detail`)
- **Recipe Management** — add / edit / delete user-created recipes (modal `rui-modal`) with validation (name ≥3, instructions ≥10, ≥1 ingredient, valid image URL)
- **Favorites** — add/remove via heart toggle on cards & detail, view all at `/favorites` (localStorage `rui.favorites.v1`)
- **Weekly Meal Planner** — `/planner` 7-day grid (`rui-meal-planner`) – assign from favorites/user recipes, click meal or **View** to navigate to `/recipe/[id]`, modify/Remove/Clear/Clear-all
- **Web Components** — 8 Stencil components consumed as published npm package, demonstrating props, custom events (`rui*`), and slots
- **Theme:** Green palette `#16a34a / #15803d / #dcfce7`

## Tech Stack

- **SvelteKit 2 + Svelte 5** (runes `$state`, `$derived`, `$effect`) + TypeScript
- **StencilJS 4** – `recipe-ui-lib` (web components, shadow DOM)
- **TheMealDB API** – `search.php?s=`, `filter.php?c=`, `lookup.php?i=`, `random.php`, `categories.php` (no API key)
- **Storage:** `localStorage` for favorites, meal plan (`rui.mealPlan.v1`), user recipes (`rui.userRecipes.v1`)
- **Deploy:** `@sveltejs/adapter-vercel` on Vercel, `ssr = false` (client-side web components)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ (tested Node 20)
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/Jdhruvraj/Recipe-Finder-Svelte.git
cd Recipe-Finder-Svelte
```

### 2. Option A – Use Published npm Package (recommended)

```bash
# Stencil library is already published – no local build needed
cd recipe-finder-app
npm install          # installs @ssj4kyuubi/recipe-ui-lib@^0.1.4 from npm + SvelteKit deps
```

### 2. Option B – Local Development (file: dependency)

If you want to work on the Stencil library locally:

```bash
cd recipe-ui-lib
npm install
npm run build        # outputs dist/ + loader/
npm pack             # creates recipe-ui-lib-0.1.4.tgz

cd ../recipe-finder-app
# package.json: "recipe-ui-lib": "file:../recipe-ui-lib/recipe-ui-lib-0.1.4.tgz"
npm install
```

To switch to published package later:
```diff
- "@ssj4kyuubi/recipe-ui-lib": "file:../recipe-ui-lib/recipe-ui-lib-0.1.4.tgz"
+ "@ssj4kyuubi/recipe-ui-lib": "^0.1.4"
```

---

## Starting Development Server

```bash
cd recipe-finder-app
npm run dev
# → http://localhost:5173
```

---

## Stencil Library – Published on npm

- **Package:** `@ssj4kyuubi/recipe-ui-lib` `v0.1.4`
- **Link:** https://www.npmjs.com/package/@ssj4kyuubi/recipe-ui-lib
- **Install:** `npm install @ssj4kyuubi/recipe-ui-lib`
- **Loader:** `import { defineCustomElements } from '@ssj4kyuubi/recipe-ui-lib/loader'; defineCustomElements();` (called in `src/lib/stencil-loader.ts` via `onMount` in `+layout.svelte`)

**Components:** `rui-button`, `rui-modal` (default+footer slots), `rui-search-bar`, `rui-filter-chips`, `rui-recipe-card`, `rui-recipe-list` (grid), `rui-recipe-detail` (actions + ingredients-extra slots, 2-table layout), `rui-meal-planner` (`ruiSelectMeal` → navigate)

**Publish flow used:**
```bash
cd recipe-ui-lib
npm version patch # 0.1.3 → 0.1.4
npm run build
npm publish --access public --otp=<2FA>
```

See `recipe-ui-lib/README.md` for full component API (props/events/slots).

---

## Project Structure

```
Recipe-Finder-Svelte/
├── README.md                    # ← this file (root deliverable)
├── recipe-ui-lib/               # Stencil library (@ssj4kyuubi/recipe-ui-lib)
│   ├── src/
│   │   ├── components/ (rui-button, rui-modal, rui-search-bar, rui-filter-chips,
│   │   │               rui-recipe-card, rui-recipe-list, rui-recipe-detail, rui-meal-planner)
│   │   ├── global/styles.css    # --rui-* tokens (green)
│   │   └── index.ts
│   ├── stencil.config.ts
│   └── package.json (0.1.4, exports: ., ./loader)
└── recipe-finder-app/           # SvelteKit app
    ├── src/
    │   ├── lib/
    │   │   ├── api/themealdb.ts, userRecipes.ts, recipes.ts
    │   │   ├── stores/favorites.svelte.ts, mealPlan.svelte.ts, userRecipes.svelte.ts
    │   │   ├── types/recipe.ts
    │   │   └── stencil-loader.ts  # import('@ssj4kyuubi/recipe-ui-lib/loader')
    │   ├── routes/
    │   │   ├── +layout.svelte / +layout.ts (ssr=false)
    │   │   ├── +page.svelte (hero search, filter chips, discover grid)
    │   │   ├── search/+page.svelte
    │   │   ├── recipe/[id]/+page.svelte (detail + day picker modal)
    │   │   ├── favorites/+page.svelte
    │   │   ├── my-recipes/+page.svelte (modal CRUD)
    │   │   └── planner/+page.svelte (rui-meal-planner + assign modal)
    │   ├── app.css (green --color-* + mirrored --rui-*)
    │   └── app.html
    ├── static/favicon.svg
    ├── svelte.config.js (adapter-vercel)
    ├── vite.config.ts (exclude @ssj4kyuubi/recipe-ui-lib)
    └── package.json (@ssj4kyuubi/recipe-ui-lib ^0.1.4)
```

---

## Integration – Props / Events / Slots

- **Props:** `<rui-recipe-list recipes={results} favorites={favorites.ids}>`, `<rui-meal-planner plan={plan} days={[...]}>`, etc.
- **Events:** Stencil emits `ruiSearchSubmit`, `ruiFilterChange`, `ruiSelectRecipe`, `ruiFavoriteToggle`, `ruiAddToPlan`, `ruiAssignMeal`, `ruiRemoveMeal`, `ruiClearDay`, `ruiSelectMeal`, `ruiClose` → Svelte listens via `onrui*` (e.g. `onruiSelectMeal={goto}`).
- **Slots:** `rui-modal` default (body) + `footer`, `rui-recipe-detail` `actions` (Edit button) – `leading` slot removed per UX.
- **Main experience:** Every primary page is built from `<rui-*>` components.

## License

MIT
