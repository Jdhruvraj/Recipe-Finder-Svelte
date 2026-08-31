import { browser } from '$app/environment';
import { DAYS_OF_WEEK, type MealPlan, type PlannedMeal, type RecipeSummary } from '$lib/types/recipe';

const STORAGE_KEY = 'rui.mealPlan.v1';

function load(): MealPlan {
  if (!browser) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

class MealPlanStore {
  plan = $state<MealPlan>(load());

  private persist() {
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plan));
  }

  /** Assign a recipe to a day (overwrites any existing meal for that day). */
  assign(day: string, recipe: RecipeSummary) {
    this.plan[day] = { recipe };
    this.persist();
  }

  /** Remove the planned meal for a day (alias of clear). */
  remove(day: string) {
    delete this.plan[day];
    this.plan = { ...this.plan };
    this.persist();
  }

  /** Clear a day's meal. */
  clear(day: string) {
    this.remove(day);
  }

  /** Clear all planned meals. */
  clearAll() {
    this.plan = {};
    this.persist();
  }

  /** Get the planned meal for a day (or null). */
  getMeal(day: string): PlannedMeal | null {
    return this.plan[day] || null;
  }

  /** Count of days with a planned meal. */
  get count(): number {
    return DAYS_OF_WEEK.filter((d) => this.plan[d]).length;
  }
}

export const mealPlan = new MealPlanStore();
