# recipe-ui-lib

A reusable **StencilJS** web-component library for the Recipe Finder &amp; Meal Planner application. Built with Stencil 4, ships framework-agnostic custom elements that can be consumed by Svelte, React, Vue, or plain HTML.

## Components

| Tag | Description | Props | Events | Slots |
| --- | --- | --- | --- | --- |
| `<rui-button>` | Button primitive | `variant`, `disabled`, `loading`, `type` | `ruiClick` | default (label) |
| `<rui-modal>` | Modal dialog | `open`, `modalTitle`, `closeOnBackdrop` | `ruiClose` | default (body), `footer` |
| `<rui-search-bar>` | Debounced search input | `value`, `placeholder`, `debounceMs` | `ruiSearchInput`, `ruiSearchSubmit` | `leading` |
| `<rui-filter-chips>` | Multi-select category chips | `categories`, `selected` | `ruiFilterChange` | — |
| `<rui-recipe-card>` | Recipe summary card | `recipe`, `isFavorite` | `ruiCardClick`, `ruiFavoriteToggle` | default (footer actions) |
| `<rui-recipe-list>` | Responsive recipe grid | `recipes`, `favorites`, `emptyMessage` | `ruiSelectRecipe`, `ruiFavoriteToggle` | — |
| `<rui-recipe-detail>` | Full recipe view | `recipe`, `isFavorite` | `ruiAddToPlan`, `ruiFavoriteToggle` | `actions`, `ingredients-extra` |
| `<rui-meal-planner>` | Weekly meal planner | `plan`, `days` | `ruiAssignMeal`, `ruiRemoveMeal`, `ruiClearDay` | — |

## Install

```bash
npm install recipe-ui-lib
```

## Usage

### Option 1 — Lazy loader (recommended)

Registers all `<rui-*>` custom elements on the page:

```ts
import { defineCustomElements } from 'recipe-ui-lib/loader';
defineCustomElements();
```

### Option 2 — Per-component imports

```ts
import { defineCustomElement as defineRuiButton } from 'recipe-ui-lib/components/rui-button';
defineRuiButton();
```

### In HTML / any framework

```html
<rui-search-bar placeholder="Search recipes..."></rui-search-bar>
<rui-recipe-list recipes="..." favorites="..."></rui-recipe-list>
```

### In Svelte 5

```svelte
<rui-recipe-card
  recipe={myRecipe}
  isFavorite={false}
  onruiCardClick={(e) => console.log(e.detail)}
  onruiFavoriteToggle={(e) => toggleFav(e.detail)}
/>
```

> **Note on events:** Stencil emits `ruiFavoriteToggle`-style custom events. In Svelte 5 use the `onruiFavoriteToggle` attribute syntax (lowercase, no colon). In plain JS use `element.addEventListener('ruiFavoriteToggle', handler)`.

## Development

```bash
# install deps
npm install

# build the library (outputs dist/ + loader/)
npm run build

# watch mode
npm run build:watch

# run unit tests
npm test
```

## Packaging &amp; npm publish

The library is configured for npm publishing with a proper `exports` map, TypeScript types, and a lazy loader.

```bash
# build
npm run build

# verify the tarball locally
npm pack

# publish (requires npm login)
npm login
npm publish
```

## npm package

>https://www.npmjs.com/package/@ssj4kyuubi/recipe-ui-lib

## Project structure

```
recipe-ui-lib/
├── src/
│   ├── components/
│   │   ├── rui-button/
│   │   ├── rui-modal/
│   │   ├── rui-search-bar/
│   │   ├── rui-filter-chips/
│   │   ├── rui-recipe-card/
│   │   ├── rui-recipe-list/
│   │   ├── rui-recipe-detail/
│   │   └── rui-meal-planner/
│   ├── global/
│   │   └── styles.css      # shared CSS custom properties / theme tokens
│   └── index.ts
├── stencil.config.ts
├── package.json
└── tsconfig.json
```

## License

MIT
