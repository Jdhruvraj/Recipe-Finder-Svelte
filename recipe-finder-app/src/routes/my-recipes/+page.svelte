<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { userRecipes } from '$lib/stores/userRecipes.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { mealPlan } from '$lib/stores/mealPlan.svelte';
  import { DAYS_OF_WEEK } from '$lib/types/recipe';
  import {
    validateRecipe,
    type RecipeFormValues,
    type RecipeFormErrors,
    type UserRecipe,
  } from '$lib/api/userRecipes';
  import { userToSummary } from '$lib/api/recipes';
  import type { RecipeSummary } from '$lib/types/recipe';

  let showModal = $state(false);
  let editingId = $state<string | null>(null);
  let errors = $state<RecipeFormErrors>({});
  let notice = $state<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  let name = $state('');
  let category = $state('');
  let area = $state('');
  let image = $state('');
  let instructions = $state('');
  let ingredients = $state<{ name: string; measure: string }[]>([{ name: '', measure: '' }]);

  onMount(() => {
    const editId = $page.url.searchParams.get('edit');
    if (editId) {
      const r = userRecipes.getById(editId);
      if (r) openEdit(r);
    }
  });

  function resetForm() {
    name = '';
    category = '';
    area = '';
    image = '';
    instructions = '';
    ingredients = [{ name: '', measure: '' }];
    errors = {};
  }

  function openAdd() {
    editingId = null;
    resetForm();
    showModal = true;
  }

  function openEdit(r: UserRecipe) {
    editingId = r.id;
    name = r.name;
    category = r.category || '';
    area = r.area || '';
    image = r.image || '';
    instructions = r.instructions || '';
    ingredients = r.ingredients.length
      ? r.ingredients.map((i: { name: string; measure?: string }) => ({ name: i.name, measure: i.measure || '' }))
      : [{ name: '', measure: '' }];
    errors = {};
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    // Clear ?edit= from URL if present
    if ($page.url.searchParams.has('edit')) {
      goto('/my-recipes', { replaceState: true });
    }
  }

  function addIngredientRow() {
    ingredients = [...ingredients, { name: '', measure: '' }];
  }

  function removeIngredientRow(idx: number) {
    ingredients = ingredients.filter((_, i) => i !== idx);
    if (ingredients.length === 0) ingredients = [{ name: '', measure: '' }];
  }

  function save() {
    const values: RecipeFormValues = {
      name,
      category,
      area,
      image,
      instructions,
      ingredients,
    };
    const validation = validateRecipe(values);
    errors = validation;
    if (Object.keys(validation).length > 0) {
      return;
    }
    try {
      if (editingId) {
        userRecipes.update(editingId, values);
        notice = { type: 'success', text: 'Recipe updated.' };
      } else {
        userRecipes.create(values);
        notice = { type: 'success', text: 'Recipe created.' };
      }
      showModal = false;
      resetForm();
    } catch (e: any) {
      notice = { type: 'error', text: e?.message || 'Failed to save recipe.' };
    }
  }

  function removeRecipe(r: UserRecipe) {
    if (!confirm(`Delete "${r.name}"? This cannot be undone.`)) return;
    userRecipes.remove(r.id);
    // Clean up any favorites / meal-plan entries that referenced this deleted recipe
    if (favorites.isFavorite(r.id)) favorites.remove(r.id);
    for (const day of DAYS_OF_WEEK) {
      if (mealPlan.getMeal(day)?.recipe.id === r.id) mealPlan.remove(day);
    }
    notice = { type: 'success', text: 'Recipe deleted.' };
  }

  function onSelectRecipe(e: CustomEvent<RecipeSummary>) {
    goto(`/recipe/${e.detail.id}`);
  }

  function onFavoriteToggle(e: CustomEvent<{ recipe: RecipeSummary; isFavorite: boolean }>) {
    favorites.toggle(e.detail.recipe, e.detail.isFavorite);
  }

  let summaries = $derived(userRecipes.items.map(userToSummary));
</script>

<svelte:head>
  <title>My Recipes &mdash; Recipe Finder</title>
</svelte:head>

<div class="section-heading">
  <h1 class="page-title" style="margin:0;">My recipes</h1>
  <button class="btn" onclick={openAdd}>+ Add recipe</button>
</div>
<p class="page-subtitle">{userRecipes.items.length} recipe{userRecipes.items.length === 1 ? '' : 's'} created by you.</p>

{#if notice}
  <div class="notice notice--{notice.type}">{notice.text}</div>
{/if}

<rui-recipe-list
  recipes={summaries}
  favorites={favorites.ids}
  emptyMessage="You haven't created any recipes yet. Click 'Add recipe' to get started."
  onruiSelectRecipe={onSelectRecipe}
  onruiFavoriteToggle={onFavoriteToggle}
>
</rui-recipe-list>

{#if userRecipes.items.length > 0}
  <section style="margin-top:2rem;">
    <h2 class="section-heading" style="margin:0 0 0.75rem;">Manage</h2>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
      {#each userRecipes.items as r (r.id)}
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius);">
          {#if r.image}
            <img src={r.image} alt={r.name} style="width:48px;height:48px;border-radius:var(--radius);object-fit:cover;" />
          {/if}
          <div style="flex:1;">
            <div style="font-weight:600;">{r.name}</div>
            <div style="font-size:0.8rem;color:var(--color-muted);">
              {r.category || 'Uncategorized'} &middot; {r.ingredients.length} ingredient{r.ingredients.length === 1 ? '' : 's'}
            </div>
          </div>
          <button class="btn btn--ghost" onclick={() => openEdit(r)}>Edit</button>
          <button class="btn btn--danger" onclick={() => removeRecipe(r)}>Delete</button>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<rui-modal open={showModal} modalTitle={editingId ? 'Edit recipe' : 'Add recipe'} onruiClose={closeModal}>
  <form onsubmit={(e) => { e.preventDefault(); save(); }}>
    <div class="form-field">
      <label for="r-name">Name *</label>
      <input id="r-name" bind:value={name} placeholder="e.g. Spaghetti Carbonara" />
      {#if errors.name}<div class="error-msg">{errors.name}</div>{/if}
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="r-cat">Category</label>
        <input id="r-cat" bind:value={category} placeholder="e.g. Pasta" />
      </div>
      <div class="form-field">
        <label for="r-area">Cuisine / Area</label>
        <input id="r-area" bind:value={area} placeholder="e.g. Italian" />
      </div>
    </div>

    <div class="form-field">
      <label for="r-img">Image URL</label>
      <input id="r-img" bind:value={image} placeholder="https://..." />
      {#if errors.image}<div class="error-msg">{errors.image}</div>{/if}
    </div>

    <div class="form-field">
      <label>Ingredients *</label>
      <div class="ingredient-rows">
        {#each ingredients as ing, idx (idx)}
          <div class="ingredient-row">
            <input bind:value={ing.name} placeholder="Ingredient name" />
            <input bind:value={ing.measure} placeholder="Measure (optional)" />
            <button type="button" onclick={() => removeIngredientRow(idx)} aria-label="Remove ingredient">&times;</button>
          </div>
        {/each}
      </div>
      <button type="button" class="btn btn--ghost" style="margin-top:0.5rem;" onclick={addIngredientRow}>+ Add ingredient</button>
      {#if errors.ingredients}<div class="error-msg">{errors.ingredients}</div>{/if}
    </div>

    <div class="form-field">
      <label for="r-instr">Instructions *</label>
      <textarea id="r-instr" bind:value={instructions} placeholder="Step-by-step instructions..."></textarea>
      {#if errors.instructions}<div class="error-msg">{errors.instructions}</div>{/if}
    </div>
  </form>

  <div slot="footer">
    <button class="btn btn--ghost" onclick={closeModal}>Cancel</button>
    <button class="btn" onclick={save}>{editingId ? 'Save changes' : 'Create recipe'}</button>
  </div>
</rui-modal>
