import { browser } from '$app/environment';
import {
  listUserRecipes,
  createUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
  type UserRecipe,
  type RecipeFormValues,
} from '$lib/api/userRecipes';

class UserRecipesStore {
  items = $state<UserRecipe[]>(browser ? listUserRecipes() : []);

  private refresh() {
    this.items = listUserRecipes();
  }

  create(values: RecipeFormValues): UserRecipe {
    const recipe = createUserRecipe(values);
    this.refresh();
    return recipe;
  }

  update(id: string, values: RecipeFormValues): UserRecipe {
    const recipe = updateUserRecipe(id, values);
    this.refresh();
    return recipe;
  }

  remove(id: string): boolean {
    const ok = deleteUserRecipe(id);
    if (ok) this.refresh();
    return ok;
  }

  getById(id: string): UserRecipe | undefined {
    return this.items.find((r) => r.id === id);
  }
}

export const userRecipes = new UserRecipesStore();
