<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { randomMeals, listCategories } from '$lib/api/themealdb';
  import { userRecipes } from '$lib/stores/userRecipes.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { userToSummary } from '$lib/api/recipes';
  import type { RecipeSummary } from '$lib/types/recipe';

  let randomRecipes = $state<RecipeSummary[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const [random, cats] = await Promise.all([randomMeals(8), listCategories()]);
      randomRecipes = random;
      categories = cats.map((c) => ({ label: c, value: c }));
    } catch (e: any) {
      error = e?.message || 'Failed to load recipes.';
    } finally {
      loading = false;
    }
  });

  let categories = $state<{ label: string; value: string }[]>([]);

  function onSearchSubmit(e: CustomEvent<string>) {
    const q = e.detail;
    goto(`/search?q=${encodeURIComponent(q)}`);
  }

  function onSearchInput(e: CustomEvent<string>) {
    // optional: live-update; here we just navigate on submit
    void e.detail;
  }

  function onFilterChange(e: CustomEvent<string[]>) {
    const selected = e.detail;
    if (selected.length === 1) {
      goto(`/search?c=${encodeURIComponent(selected[0])}`);
    } else if (selected.length > 1) {
      goto(`/search?cats=${selected.map(encodeURIComponent).join(',')}`);
    }
  }

  function onSelectRecipe(e: CustomEvent<RecipeSummary>) {
    goto(`/recipe/${e.detail.id}`);
  }

  function onFavoriteToggle(e: CustomEvent<{ recipe: RecipeSummary; isFavorite: boolean }>) {
    favorites.toggle(e.detail.recipe, e.detail.isFavorite);
  }

  // Combine random API recipes with user-created recipes on the home grid.
  let homeRecipes = $derived<RecipeSummary[]>([
    ...randomRecipes,
    ...userRecipes.items.map(userToSummary),
  ]);
</script>

<svelte:head>
  <title>Recipe Finder &amp; Meal Planner</title>
</svelte:head>

<section class="hero">
  <h1>Find your next favorite meal</h1>
  <p>Search thousands of recipes, save your favorites, and plan your week &mdash; all in one place.</p>
  <div class="hero__search">
    <rui-search-bar
      placeholder="Search recipes by name..."
      onruiSearchSubmit={onSearchSubmit}
      onruiSearchInput={onSearchInput}
    ></rui-search-bar>
  </div>
</section>

{#if categories.length > 0}
  <section style="margin-bottom: 2rem;">
    <div class="section-heading"><h2>Browse by category</h2></div>
    <rui-filter-chips
      categories={categories}
      selected={[]}
      onruiFilterChange={onFilterChange}
    ></rui-filter-chips>
  </section>
{/if}

<section>
  <div class="section-heading"><h2>Discover recipes</h2></div>
  {#if loading}
    <div class="loading">Loading recipes&hellip;</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <rui-recipe-list
      recipes={homeRecipes}
      favorites={favorites.ids}
      onruiSelectRecipe={onSelectRecipe}
      onruiFavoriteToggle={onFavoriteToggle}
    ></rui-recipe-list>
  {/if}
</section>
