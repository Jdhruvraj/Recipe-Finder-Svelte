<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { mealPlan } from '$lib/stores/mealPlan.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { userRecipes } from '$lib/stores/userRecipes.svelte';
  import { userToSummary } from '$lib/api/recipes';
  import { DAYS_OF_WEEK, type MealPlan, type RecipeSummary } from '$lib/types/recipe';

  let showAssignDialog = $state(false);
  let pendingDay = $state<string | null>(null);
  let notice = $state<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pool of recipes the user can assign: favorites + user-created.
  let assignable = $derived<RecipeSummary[]>([
    ...favorites.items,
    ...userRecipes.items.map(userToSummary),
  ]);

  function onAssignMeal(e: CustomEvent<{ day: string }>) {
    pendingDay = e.detail.day;
    showAssignDialog = true;
  }

  function onRemoveMeal(e: CustomEvent<{ day: string; recipe: RecipeSummary }>) {
    mealPlan.remove(e.detail.day);
    notice = { type: 'success', text: `Removed "${e.detail.recipe.name}" from ${e.detail.day}.` };
  }

  function onClearDay(e: CustomEvent<{ day: string }>) {
    mealPlan.clear(e.detail.day);
  }

  function onSelectMeal(e: CustomEvent<{ day: string; recipe: RecipeSummary }>) {
    goto(`/recipe/${e.detail.recipe.id}`);
  }

  function pickRecipe(recipe: RecipeSummary) {
    if (pendingDay) {
      mealPlan.assign(pendingDay, recipe);
      notice = { type: 'success', text: `Assigned "${recipe.name}" to ${pendingDay}.` };
    }
    showAssignDialog = false;
    pendingDay = null;
  }

  function clearAll() {
    if (!confirm('Clear the entire meal plan?')) return;
    mealPlan.clearAll();
    notice = { type: 'success', text: 'Meal plan cleared.' };
  }

  // Build a plan object keyed by day for the Stencil component.
  let planForComponent = $derived<MealPlan>(
    Object.fromEntries(DAYS_OF_WEEK.map((d) => [d, mealPlan.getMeal(d)]))
  );
</script>

<svelte:head>
  <title>Meal Planner &mdash; Recipe Finder</title>
</svelte:head>

<div class="section-heading">
  <h1 class="page-title" style="margin:0;">Weekly meal planner</h1>
  {#if mealPlan.count > 0}
    <button class="btn btn--ghost" onclick={clearAll}>Clear all</button>
  {/if}
</div>
<p class="page-subtitle">{mealPlan.count} of 7 days planned.</p>

{#if notice}
  <div class="notice notice--{notice.type}">{notice.text}</div>
{/if}

<rui-meal-planner
  plan={planForComponent}
  days={[...DAYS_OF_WEEK]}
  onruiAssignMeal={onAssignMeal}
  onruiRemoveMeal={onRemoveMeal}
  onruiClearDay={onClearDay}
  onruiSelectMeal={onSelectMeal}
></rui-meal-planner>

{#if showAssignDialog && pendingDay}
  <rui-modal open={true} modalTitle={`Assign a recipe to ${pendingDay}`} onruiClose={() => { showAssignDialog = false; pendingDay = null; }}>
    <div class="assign-dialog">
      {#if assignable.length === 0}
        <p style="color:var(--color-muted);">No recipes available to assign. Save favorites or create recipes first.</p>
      {:else}
        <p style="margin-top:0;color:var(--color-muted);">Pick from your favorites and created recipes:</p>
        <ul>
          {#each assignable as r (r.id)}
            <li>
              <button type="button" class="assign-item" onclick={() => pickRecipe(r)}>
                {#if r.image}
                  <img src={r.image} alt={r.name} />
                {/if}
                <span>{r.name}</span>
                <span style="color:var(--color-muted);font-size:0.8rem;">{r.category || ''}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <div slot="footer">
      <a href="/search" class="btn btn--ghost">Find more recipes</a>
      <button class="btn btn--ghost" onclick={() => { showAssignDialog = false; pendingDay = null; }}>Cancel</button>
    </div>
  </rui-modal>
{/if}
