// Shared recipe types used across the app.

export interface RecipeSummary {
  id: string;
  name: string;
  image?: string;
  category?: string;
  area?: string;
}

export interface RecipeIngredient {
  name: string;
  measure?: string;
}

export interface RecipeFull {
  id: string;
  name: string;
  image?: string;
  category?: string;
  area?: string;
  instructions?: string;
  youtube?: string;
  source?: string;
  ingredients: RecipeIngredient[];
  /** true when the recipe was created locally by the user (vs. from TheMealDB). */
  isUserCreated?: boolean;
}

export interface PlannedMeal {
  recipe: RecipeSummary;
}

export type MealPlan = Record<string, PlannedMeal | null>;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
