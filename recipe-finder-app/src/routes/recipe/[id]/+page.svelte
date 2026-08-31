<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { loadRecipeFull, toSummary, isUserRecipeId } from '$lib/api/recipes';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { mealPlan } from '$lib/stores/mealPlan.svelte';
  import { DAYS_OF_WEEK, type RecipeFull } from '$lib/types/recipe';

  let recipe = $state<RecipeFull | null>(null);
  let loading = $state(true);
  let error = $state('');

  let showAssignDialog = $state(false);
  let pendingRecipe = $state<RecipeFull | null>(null);

  let id = $derived($page.params.id);

  // React to id changes (e.g., navigating /recipe/1 -> /recipe/2 without remount)
  $effect(() => {
    // track id as dependency
    const currentId = id;
    if (!currentId) return;
    // Reset state and fetch
    loading = true;
    error = '';
    recipe = null;
    showAssignDialog = false;
    (async () => {
      try {
        const r = await loadRecipeFull(currentId);
        if (!r) {
          error = 'Recipe not found.';
        } else {
          recipe = r;
        }
      } catch (e: any) {
        error = e?.message || 'Failed to load recipe.';
      } finally {
        loading = false;
      }
    })();
  });

  function onFavoriteToggle(e: CustomEvent<{ recipe: RecipeFull; isFavorite: boolean }>) {
    favorites.toggle(toSummary(e.detail.recipe), e.detail.isFavorite);
  }

  function onAddToPlan(e: CustomEvent<RecipeFull>) {
    // Open a simple day-picker; assigning happens via assignToDay.
    pendingRecipe = e.detail;
    showAssignDialog = true;
  }

  function assignToDay(day: string) {
    if (pendingRecipe) {
      mealPlan.assign(day, toSummary(pendingRecipe));
      showAssignDialog = false;
      pendingRecipe = null;
      goto('/planner');
    }
  }

  let isFav = $derived(recipe ? favorites.isFavorite(recipe.id) : false);
</script>

<svelte:head>
  <title>{recipe ? recipe.name : 'Recipe'} &mdash; Recipe Finder</title>
</svelte:head>

{#if loading}
  <div class="loading">Loading recipe&hellip;</div>
{:else if error}
  <div class="error">{error}</div>
  <p style="text-align:center;"><a href="/search">&larr; Back to search</a></p>
{:else if recipe}
  <rui-recipe-detail
    recipe={recipe}
    isFavorite={isFav}
    onruiFavoriteToggle={onFavoriteToggle}
    onruiAddToPlan={onAddToPlan}
  >
    <span slot="actions">
      {#if isUserRecipeId(recipe.id)}
        <a class="btn btn--secondary" href={`/my-recipes?edit=${encodeURIComponent(recipe.id)}`}>
          Edit
        </a>
      {/if}
    </span>
  </rui-recipe-detail>

  {#if showAssignDialog && pendingRecipe}
    <rui-modal open={true} modalTitle="Add to meal plan" onruiClose={() => (showAssignDialog = false)}>
      <div class="assign-dialog">
        <p style="margin-top:0;color:var(--color-muted);">Choose a day for <strong>{pendingRecipe.name}</strong>:</p>
        <ul>
          {#each DAYS_OF_WEEK as day (day)}
            <li>
              <button type="button" class="assign-item" onclick={() => assignToDay(day)}>
                <span>{day}</span>
                <span>{mealPlan.getMeal(day) ? '(replaces ' + mealPlan.getMeal(day)!.recipe.name + ')' : ''}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </rui-modal>
  {/if}
{/if}
