import type { RecipeFull, RecipeIngredient, RecipeSummary } from '$lib/types/recipe';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strMealThumb?: string;
  strInstructions?: string;
  strYoutube?: string;
  strSource?: string;
  [key: string]: string | undefined; // strIngredient1..20, strMeasure1..20
}

function toSummary(m: MealDbMeal): RecipeSummary {
  return {
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    category: m.strCategory,
    area: m.strArea,
  };
}

function toFull(m: MealDbMeal): RecipeFull {
  const ingredients: RecipeIngredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = m[`strIngredient${i}`];
    const measure = m[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure?.trim() || undefined });
    }
  }
  return {
    id: m.idMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    category: m.strCategory,
    area: m.strArea,
    instructions: m.strInstructions,
    youtube: m.strYoutube,
    source: m.strSource,
    ingredients,
  };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
  return (await res.json()) as T;
}

/** Search recipes by name. Returns empty array when no matches. */
export async function searchByName(q: string): Promise<RecipeSummary[]> {
  if (!q.trim()) return [];
  const data = await getJson<{ meals: MealDbMeal[] | null }>(`${BASE}/search.php?s=${encodeURIComponent(q)}`);
  return (data.meals || []).map(toSummary);
}

/** List all recipe categories (names only). */
export async function listCategories(): Promise<string[]> {
  const data = await getJson<{ categories: { strCategory: string }[] }>(`${BASE}/categories.php`);
  return data.categories.map((c) => c.strCategory).sort();
}

/** Filter recipes by category. */
export async function filterByCategory(category: string): Promise<RecipeSummary[]> {
  const data = await getJson<{ meals: MealDbMeal[] | null }>(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  // filter.php returns a reduced shape (idMeal, strMeal, strMealThumb) — no category/area.
  return (data.meals || []).map(toSummary);
}

/** Look up full recipe details by id. */
export async function lookupById(id: string): Promise<RecipeFull | null> {
  const data = await getJson<{ meals: MealDbMeal[] | null }>(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!data.meals || data.meals.length === 0) return null;
  return toFull(data.meals[0]);
}

/** Fetch a single random recipe. */
export async function randomMeal(): Promise<RecipeFull | null> {
  const data = await getJson<{ meals: MealDbMeal[] | null }>(`${BASE}/random.php`);
  if (!data.meals || data.meals.length === 0) return null;
  return toFull(data.meals[0]);
}

/** Fetch N random recipes (parallel calls). */
export async function randomMeals(n: number): Promise<RecipeSummary[]> {
  const results = await Promise.all(Array.from({ length: n }, () => randomMeal()));
  return results.filter((r): r is RecipeFull => r !== null).map((r) => ({
    id: r.id,
    name: r.name,
    image: r.image,
    category: r.category,
    area: r.area,
  }));
}
