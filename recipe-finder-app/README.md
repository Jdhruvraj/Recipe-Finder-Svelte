# Recipe Finder &amp; Meal Planner

A modern Recipe Finder &amp; Meal Planner built with **SvelteKit** (Svelte 5) that consumes a reusable **StencilJS** web-component library ([recipe-ui-lib](#stencil-library)) published to npm. Discover recipes from [TheMealDB](https://www.themealdb.com), view full details, manage favorites, create your own recipes, and organize a weekly meal plan.

## Features

- **Recipe Discovery** — search by name, browse, and filter by category.
- **Recipe Details** — dedicated page with ingredients, instructions, and source links.
- **Recipe Management** — add, edit, delete user-created recipes with input validation.
- **Favorites** — add/remove favorites and view them on a dedicated page.
- **Weekly Meal Planner** — assign recipes to days, modify or remove planned meals.
- **Web Components** — the UI is built from the `recipe-ui-lib` StencilJS library, demonstrating props, custom events, and slots across the framework boundary.

## Tech stack

- [SvelteKit 2](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev) (runes: `$state`, `$derived`, `$effect`)
- [StencilJS 4](https://stenciljs.com) — `recipe-ui-lib` web components
- [TheMealDB API](https://www.themealdb.com/api.php) — public recipe data (no API key required)
- [@sveltejs/adapter-vercel](https://github.com/sveltejs/kit/tree/main/packages/adapter-vercel) — deployment
- localStorage — persistence for favorites, meal plan, and user-created recipes

## Prerequisites

- Node.js 18+ (tested on Node 20)
- npm 9+

## Setup

### 1. Build &amp; pack the Stencil library

The app consumes `recipe-ui-lib` via a local tarball dependency (`file:../recipe-ui-lib/recipe-ui-lib-0.1.0.tgz`) until you publish it to npm. Build and pack it first:

```bash
cd recipe-ui-lib
npm install
npm run build
npm pack          # produces recipe-ui-lib-0.1.0.tgz
```

### 2. Install &amp; run the app

```bash
cd recipe-finder-app
npm install       # picks up the local tarball via the file: dependency
npm run dev       # starts the dev server
```

Open http://localhost:5173 in your browser.

### 3. (Optional) Switch to the published npm package

After you publish `recipe-ui-lib` to npm (see the library's README), replace the local tarball dependency in `recipe-finder-app/package.json`:

```diff
- "recipe-ui-lib": "file:../recipe-ui-lib/recipe-ui-lib-0.1.0.tgz"
+ "recipe-ui-lib": "^0.1.0"
```

Then run `npm install` again.

## Starting the development server

```bash
cd recipe-finder-app
npm run dev
```

The app runs at **http://localhost:5173** by default.

## Production build &amp; preview

```bash
cd recipe-finder-app
npm run build     # builds with @sveltejs/adapter-vercel
npm run preview   # preview the production build locally
```


## Project structure

```
recipe-finder-app/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── themealdb.ts      # TheMealDB API client
│   │   │   ├── userRecipes.ts    # local CRUD + validation
│   │   │   └── recipes.ts        # unified recipe loader
│   │   ├── stores/
│   │   │   ├── favorites.svelte.ts    # favorites (runes + localStorage)
│   │   │   ├── mealPlan.svelte.ts     # weekly meal plan
│   │   │   └── userRecipes.svelte.ts  # user-created recipes
│   │   ├── types/recipe.ts
│   │   └── stencil-loader.ts     # client-side web-component registration
│   ├── routes/
│   │   ├── +layout.svelte        # nav, footer, WC init
│   │   ├── +page.svelte          # home (hero search, categories, grid)
│   │   ├── search/+page.svelte   # search & filter results
│   │   ├── recipe/[id]/+page.svelte  # recipe detail
│   │   ├── favorites/+page.svelte    # favorites list
│   │   ├── my-recipes/+page.svelte   # user recipe CRUD
│   │   └── planner/+page.svelte      # weekly meal planner
│   ├── app.css
│   └── app.html
├── static/favicon.svg
├── svelte.config.js
├── vite.config.ts
├── package.json
└── tsconfig.json
```

## How SvelteKit &amp; Stencil integrate

- **Props:** Svelte passes data to Stencil components via attributes/properties, e.g. `<rui-recipe-list recipes={results} favorites={favorites.ids}>`.
- **Custom events:** Stencil components emit `rui*` custom events (e.g. `ruiFavoriteToggle`). Svelte 5 listens via the `onruiFavoriteToggle` attribute syntax, which compiles to `addEventListener` under the hood.
- **Slots:** Used for composable content — e.g. `<rui-search-bar><span slot="leading">🔍</span></rui-search-bar>`, `<rui-modal>body<... slot="footer">actions</rui-modal>`, and `<rui-recipe-detail><span slot="actions">Edit</span></rui-recipe-detail>`.
- **Loader:** `src/lib/stencil-loader.ts` calls `defineCustomElements()` from `recipe-ui-lib/loader` on the client (in `+layout.svelte`'s `onMount`) to register all `<rui-*>` custom elements.

## Assumptions

1. **No backend** — favorites, the meal plan, and user-created recipes persist in `localStorage` (per-browser). They are not synced across devices.
2. **Recipe API** — uses the free TheMealDB API (no key). Rate limits are generous but unauthenticated; heavy use may hit limits.
3. **User-created recipes** are stored locally with ids prefixed `user-` so they never collide with TheMealDB ids. They appear alongside API recipes in search results (filtered by name), favorites, and the meal planner.
4. **SSR is disabled** (`export const ssr = false` in `+layout.ts`) because the Stencil web components register only on the client and the app is data-driven from a public API + localStorage (both client-side concerns). This keeps hydration simple.
5. **Svelte 5 runes** are used for all reactive state (`$state`, `$derived`, `$effect`) — no legacy stores.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (adapter-vercel) |
| `npm run preview` | Preview the production build |
| `npm run check` | Type-check with `svelte-check` |

## License

MIT
