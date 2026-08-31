import type { RecipeFull, RecipeIngredient, RecipeSummary } from '$lib/types/recipe';

const STORAGE_KEY = 'rui.userRecipes.v1';

export interface UserRecipe extends RecipeFull {
  isUserCreated: true;
}

export interface RecipeFormValues {
  name: string;
  category: string;
  area: string;
  image: string;
  instructions: string;
  ingredients: { name: string; measure: string }[];
}

export interface RecipeFormErrors {
  name?: string;
  instructions?: string;
  ingredients?: string;
  image?: string;
}

/** Validate a recipe form. Returns an object of field -> message (empty if valid). */
export function validateRecipe(values: RecipeFormValues): RecipeFormErrors {
  const errors: RecipeFormErrors = {};
  if (!values.name || values.name.trim().length < 3) {
    errors.name = 'Name is required (min 3 characters).';
  }
  if (!values.instructions || values.instructions.trim().length < 10) {
    errors.instructions = 'Instructions are required (min 10 characters).';
  }
  const validIngredients = values.ingredients.filter((i) => i.name && i.name.trim());
  if (validIngredients.length === 0) {
    errors.ingredients = 'At least one ingredient with a name is required.';
  }
  if (values.image && values.image.trim()) {
    try {
      new URL(values.image.trim());
    } catch {
      errors.image = 'Image must be a valid URL.';
    }
  }
  return errors;
}

function loadAll(): UserRecipe[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(recipes: UserRecipe[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function genId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toIngredients(rows: { name: string; measure: string }[]): RecipeIngredient[] {
  return rows
    .filter((r) => r.name && r.name.trim())
    .map((r) => ({ name: r.name.trim(), measure: r.measure?.trim() || undefined }));
}

/** List all user-created recipes. */
export function listUserRecipes(): UserRecipe[] {
  return loadAll();
}

/** Get a single user-created recipe by id. */
export function getUserRecipe(id: string): UserRecipe | undefined {
  return loadAll().find((r) => r.id === id);
}

/** Create a new user recipe from form values. Returns the created recipe. */
export function createUserRecipe(values: RecipeFormValues): UserRecipe {
  const recipe: UserRecipe = {
    id: genId(),
    name: values.name.trim(),
    image: values.image?.trim() || undefined,
    category: values.category?.trim() || undefined,
    area: values.area?.trim() || undefined,
    instructions: values.instructions.trim(),
    ingredients: toIngredients(values.ingredients),
    isUserCreated: true,
  };
  const all = loadAll();
  all.push(recipe);
  saveAll(all);
  return recipe;
}

/** Update an existing user recipe. Throws if not found. */
export function updateUserRecipe(id: string, values: RecipeFormValues): UserRecipe {
  const all = loadAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Recipe ${id} not found.`);
  const updated: UserRecipe = {
    ...all[idx],
    name: values.name.trim(),
    image: values.image?.trim() || undefined,
    category: values.category?.trim() || undefined,
    area: values.area?.trim() || undefined,
    instructions: values.instructions.trim(),
    ingredients: toIngredients(values.ingredients),
  };
  all[idx] = updated;
  saveAll(all);
  return updated;
}

/** Delete a user-created recipe by id. Returns true if deleted. */
export function deleteUserRecipe(id: string): boolean {
  const all = loadAll();
  const next = all.filter((r) => r.id !== id);
  if (next.length === all.length) return false;
  saveAll(next);
  return true;
}

/** Convert a user recipe to a summary (for cards/lists). */
export function toSummary(recipe: UserRecipe): RecipeSummary {
  return {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    category: recipe.category,
    area: recipe.area,
  };
}
