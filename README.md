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

Other scripts:

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Production build (`adapter-vercel`, outputs `.vercel/output`) |
| `npm run preview` | Preview production build locally |
| `npm run check` | Type-check `svelte-check --tsconfig ./tsconfig.json` |

**Stencil library dev (separate terminal):**

```bash
cd recipe-ui-lib
npm run build:watch   # watch + rebuild on change
```

For live Stencil changes to reflect in Svelte app (when using `file:` dep), rebuild pack and reinstall:

```powershell
Copy-Item -Path ".\dist\*" -Destination "..\recipe-finder-app\node_modules\@ssj4kyuubi\recipe-ui-lib\dist" -Recurse -Force
Copy-Item -Path ".\loader\*" -Destination "..\recipe-finder-app\node_modules\@ssj4kyuubi\recipe-ui-lib\loader" -Recurse -Force
# or bump version, npm pack, update tgz dep and npm install
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

## GitHub Repository

**Link:** https://github.com/Jdhruvraj/Recipe-Finder-Svelte

- `main` branch – initial commit `de2ccbb` + green theme + deployment
- `.gitignore` excludes `node_modules/`, `.svelte-kit/`, `.vercel/`, `dist/`, `.stencil/`, `*.tgz`
- Root Directory for Vercel: `recipe-finder-app`

---

## Vercel Deployment

**Link:** https://recipe-finder-sveltevercel.vercel.app/

- Pre-configured with `@sveltejs/adapter-vercel` (`svelte.config.js`)
- Dashboard: Import `Jdhruvraj/Recipe-Finder-Svelte` → **Root Directory: `recipe-finder-app`** → Framework `SvelteKit` → Deploy
- CLI alternative:
  ```bash
  cd recipe-finder-app
  npx vercel login
  npx vercel --prod
  ```
- Build logs: `✓ built in 667ms / 2.80s` (ignore Windows local `EPERM symlink .vercel` – Linux builds succeed)

---

## Assumptions Made

1. **No backend** – favorites, meal plan, user recipes in `localStorage` per-browser, not synced across devices. IDs for user recipes prefixed `user-` to avoid collision with TheMealDB numeric IDs.
2. **Public API** – TheMealDB free tier, no key, generous limits. `search.php` + `filter.php?c=` cover search/filter; categories from `categories.php`; random meals for home discovery.
3. **SSR disabled** – `src/routes/+layout.ts: ssr = false` because Stencil custom elements register only on client and data is client-side (API + localStorage).
4. **Svelte 5 runes** throughout (`$state`, `$derived`, `$effect`), no legacy stores. Classes `FavoritesStore`, `MealPlanStore`, `UserRecipesStore` use runes + `browser` guard.
5. **Validation** – `validateRecipe` checks name ≥3, instructions ≥10, ≥1 ingredient name, image URL must be parsable via `new URL()`. Inline `error-msg` shown in modal; no extra banner behind popup.
6. **Planner pool** – assignable recipes = favorites + user recipes (assigning any API recipe via `/recipe/[id]` → Add to plan → choose day). Clicking a planned meal (card or View button) navigates to `/recipe/[id]`.
7. **Styling** – Green theme `#16a34a / #15803d / #dcfce7`, fallback vars `var(--rui-color-primary, #16a34a)`, modal fallback bg, hero gradient `var(--color-primary-soft)`.
8. **npm / Vercel credentials required** for publish/deploy; codebase is fully prepared.

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
