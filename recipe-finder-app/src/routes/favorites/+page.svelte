<script lang="ts">
  import { goto } from '$app/navigation';
  import { favorites } from '$lib/stores/favorites.svelte';
  import type { RecipeSummary } from '$lib/types/recipe';

  function onSelectRecipe(e: CustomEvent<RecipeSummary>) {
    goto(`/recipe/${e.detail.id}`);
  }

  function onFavoriteToggle(e: CustomEvent<{ recipe: RecipeSummary; isFavorite: boolean }>) {
    favorites.toggle(e.detail.recipe, e.detail.isFavorite);
  }
</script>

<svelte:head>
  <title>Favorites &mdash; Recipe Finder</title>
</svelte:head>

<h1 class="page-title">Your favorites</h1>
<p class="page-subtitle">{favorites.items.length} saved recipe{favorites.items.length === 1 ? '' : 's'}.</p>

<rui-recipe-list
  recipes={favorites.items}
  favorites={favorites.ids}
  emptyMessage="No favorites yet. Tap the heart on a recipe to save it here."
  onruiSelectRecipe={onSelectRecipe}
  onruiFavoriteToggle={onFavoriteToggle}
></rui-recipe-list>
