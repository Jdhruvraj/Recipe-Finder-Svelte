<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { searchByName, filterByCategory, listCategories } from '$lib/api/themealdb';
  import { userRecipes } from '$lib/stores/userRecipes.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { userToSummary } from '$lib/api/recipes';
  import type { RecipeSummary } from '$lib/types/recipe';

  let results = $state<RecipeSummary[]>([]);
  let loading = $state(false);
  let error = $state('');
  let categories = $state<{ label: string; value: string }[]>([]);
  let selectedCats = $state<string[]>([]);

  let q = $derived($page.url.searchParams.get('q') || '');

  let categoriesLoaded = $state(false);

  onMount(async () => {
    const catsList = await listCategories().catch(() => []);
    categories = catsList.map((cat) => ({ label: cat, value: cat }));
    categoriesLoaded = true;
  });

  // Keep chip selection in sync with URL (single source of truth is the URL).
  // This also triggers search when URL changes via back/forward or direct navigation.
  let searchSeq = 0;
  $effect(() => {
    // Track URL + categoriesLoaded + userRecipes.items (for local filtering)
    const _q = $page.url.searchParams.get('q') || '';
    const _c = $page.url.searchParams.get('c') || '';
    const _cats = ($page.url.searchParams.get('cats') || '').split(',').filter(Boolean);
    void categoriesLoaded;
    void userRecipes.items.length;

    // Sync selectedCats from URL without causing feedback loop during typing
    if (_c) {
      if (selectedCats.length !== 1 || selectedCats[0] !== _c) selectedCats = [_c];
    } else if (_cats.length) {
      const same = _cats.length === selectedCats.length && _cats.every((v, i) => v === selectedCats[i]);
      if (!same) selectedCats = _cats;
    } else {
      if (selectedCats.length !== 0) selectedCats = [];
    }

    if (!categoriesLoaded) return;

    const seq = ++searchSeq;
    (async () => {
      loading = true;
      error = '';
      try {
        let apiResults: RecipeSummary[] = [];
        const query = _q.trim();
        const catsForSearch = _c ? [_c] : _cats;
        if (query) {
          apiResults = await searchByName(query);
        } else if (catsForSearch.length === 1) {
          apiResults = await filterByCategory(catsForSearch[0]);
        } else if (catsForSearch.length > 1) {
          const grouped = await Promise.all(catsForSearch.map((cat) => filterByCategory(cat)));
          const seen = new Set<string>();
          apiResults = grouped.flat().filter((r) => {
            if (seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
          });
        }
        // Include user-created recipes that match the search query (by name).
        const userMatches = userRecipes.items
          .filter((r) => !query || r.name.toLowerCase().includes(query.toLowerCase()))
          .map(userToSummary);
        if (seq === searchSeq) results = [...userMatches, ...apiResults];
      } catch (e: any) {
        if (seq === searchSeq) {
          error = e?.message || 'Search failed.';
          results = [];
        }
      } finally {
        if (seq === searchSeq) loading = false;
      }
    })();
  });

  function onSearchSubmit(e: CustomEvent<string>) {
    const value = e.detail;
    goto(`/search?q=${encodeURIComponent(value)}`);
  }

  function onFilterChange(e: CustomEvent<string[]>) {
    selectedCats = e.detail;
    if (selectedCats.length === 0) {
      goto('/search');
    } else if (selectedCats.length === 1) {
      goto(`/search?c=${encodeURIComponent(selectedCats[0])}`);
    } else {
      goto(`/search?cats=${selectedCats.map(encodeURIComponent).join(',')}`);
    }
  }

  function onSelectRecipe(e: CustomEvent<RecipeSummary>) {
    goto(`/recipe/${e.detail.id}`);
  }

  function onFavoriteToggle(e: CustomEvent<{ recipe: RecipeSummary; isFavorite: boolean }>) {
    favorites.toggle(e.detail.recipe, e.detail.isFavorite);
  }

  let heading = $derived(
    q ? `Results for "${q}"` : selectedCats.length ? `Category: ${selectedCats.join(', ')}` : 'Browse recipes'
  );
</script>

<svelte:head>
  <title>Search recipes &mdash; Recipe Finder</title>
</svelte:head>

<h1 class="page-title">Search &amp; browse</h1>

<div style="margin-bottom: 1rem;">
  <rui-search-bar
    value={q}
    placeholder="Search recipes by name..."
    onruiSearchSubmit={onSearchSubmit}
  ></rui-search-bar>
</div>

{#if categories.length > 0}
  <div style="margin-bottom: 1.5rem;">
    <rui-filter-chips
      categories={categories}
      selected={selectedCats}
      onruiFilterChange={onFilterChange}
    ></rui-filter-chips>
  </div>
{/if}

<h2 class="section-heading" style="margin: 0 0 1rem;">{heading}</h2>

{#if loading}
  <div class="loading">Searching&hellip;</div>
{:else if error}
  <div class="error">{error}</div>
{:else}
  <rui-recipe-list
    recipes={results}
    favorites={favorites.ids}
    emptyMessage={q || selectedCats.length ? 'No recipes matched your search.' : 'Start by searching or pick a category.'}
    onruiSelectRecipe={onSelectRecipe}
    onruiFavoriteToggle={onFavoriteToggle}
  ></rui-recipe-list>
{/if}
