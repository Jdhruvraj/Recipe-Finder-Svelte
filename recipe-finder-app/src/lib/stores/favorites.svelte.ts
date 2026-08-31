import { browser } from '$app/environment';
import type { RecipeSummary } from '$lib/types/recipe';

const STORAGE_KEY = 'rui.favorites.v1';

function load(): RecipeSummary[] {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

class FavoritesStore {
  items = $state<RecipeSummary[]>(load());

  private persist() {
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  get ids(): string[] {
    return this.items.map((r) => r.id);
  }

  isFavorite(id: string): boolean {
    return this.items.some((r) => r.id === id);
  }

  add(recipe: RecipeSummary) {
    if (this.isFavorite(recipe.id)) return;
    this.items.push(recipe);
    this.persist();
  }

  remove(id: string) {
    this.items = this.items.filter((r) => r.id !== id);
    this.persist();
  }

  toggle(recipe: RecipeSummary, force?: boolean) {
    const shouldFav = force !== undefined ? force : !this.isFavorite(recipe.id);
    if (shouldFav) this.add(recipe);
    else this.remove(recipe.id);
  }
}

export const favorites = new FavoritesStore();
