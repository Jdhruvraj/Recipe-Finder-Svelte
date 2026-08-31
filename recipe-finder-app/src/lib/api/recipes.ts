import { browser } from '$app/environment';
import type { RecipeFull, RecipeSummary } from '$lib/types/recipe';
import { lookupById } from '$lib/api/themealdb';
import { getUserRecipe, toSummary as userToSummary } from '$lib/api/userRecipes';

/**
 * Load a full recipe by id. User-created recipes (id starts with "user-")
 * are read from localStorage; everything else is fetched from TheMealDB.
 */
export async function loadRecipeFull(id: string): Promise<RecipeFull | null> {
  if (id.startsWith('user-')) {
    const r = getUserRecipe(id);
    return r || null;
  }
  return lookupById(id);
}

/** Convert any RecipeFull into a RecipeSummary. */
export function toSummary(recipe: RecipeFull): RecipeSummary {
  return {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    category: recipe.category,
    area: recipe.area,
  };
}

/** True if an id refers to a user-created recipe. */
export function isUserRecipeId(id: string): boolean {
  return id.startsWith('user-');
}

// Re-export for convenience
export { userToSummary };
