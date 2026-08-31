import { Component, h, Prop, Event, EventEmitter, Host } from '@stencil/core';
import { RecipeSummary } from '../rui-recipe-card/rui-recipe-card';

export interface PlannedMeal {
  recipe: RecipeSummary;
}

export type MealPlan = Record<string, PlannedMeal | null>;

/**
 * Weekly meal planner. Renders one row per day with assign/remove/clear actions.
 * @slot - Per-day custom content (rendered above each day's actions).
 */
@Component({
  tag: 'rui-meal-planner',
  styleUrl: 'rui-meal-planner.css',
  shadow: true,
})
export class RuiMealPlanner {
  /** Map of day -> PlannedMeal (or null when empty). */
  @Prop() plan: MealPlan = {};

  /** Days of the week to render. */
  @Prop() days: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  /** Emitted when "Assign" is clicked. detail: { day }. */
  @Event({ eventName: 'ruiAssignMeal', bubbles: true, composed: true })
  ruiAssignMeal!: EventEmitter<{ day: string }>;

  /** Emitted when "Remove" is clicked on a planned meal. detail: { day, recipe }. */
  @Event({ eventName: 'ruiRemoveMeal', bubbles: true, composed: true })
  ruiRemoveMeal!: EventEmitter<{ day: string; recipe: RecipeSummary }>;

  /** Emitted when "Clear" is clicked for a day. detail: { day }. */
  @Event({ eventName: 'ruiClearDay', bubbles: true, composed: true })
  ruiClearDay!: EventEmitter<{ day: string }>;

  /** Emitted when a planned meal is clicked to view recipe. detail: { day, recipe }. */
  @Event({ eventName: 'ruiSelectMeal', bubbles: true, composed: true })
  ruiSelectMeal!: EventEmitter<{ day: string; recipe: RecipeSummary }>;

  private assign = (day: string) => this.ruiAssignMeal.emit({ day });
  private remove = (day: string, recipe: RecipeSummary) =>
    this.ruiRemoveMeal.emit({ day, recipe });
  private clear = (day: string) => this.ruiClearDay.emit({ day });
  private selectMeal = (day: string, recipe: RecipeSummary) =>
    this.ruiSelectMeal.emit({ day, recipe });

  render() {
    return (
      <Host>
        <div class="rui-planner">
          {this.days.map((day) => {
            const meal = this.plan[day];
            return (
              <div class="rui-planner__day">
                <div class="rui-planner__day-head">
                  <h4>{day}</h4>
                </div>
                {meal && meal.recipe ? (
                  <div
                    class="rui-planner__meal rui-planner__meal--clickable"
                    onClick={() => this.selectMeal(day, meal.recipe)}
                    role="button"
                    tabindex={0}
                    onKeyDown={(e: KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectMeal(day, meal.recipe);
                      }
                    }}
                    title="View recipe ingredients"
                  >
                    {meal.recipe.image && (
                      <img src={meal.recipe.image} alt={meal.recipe.name} />
                    )}
                    <div class="rui-planner__meal-info">
                      <span class="rui-planner__meal-name">{meal.recipe.name}</span>
                      {meal.recipe.category && (
                        <span class="rui-planner__meal-cat">{meal.recipe.category}</span>
                      )}
                    </div>
                    <div class="rui-planner__meal-actions">
                      <button
                        type="button"
                        class="rui-planner__view"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          this.selectMeal(day, meal.recipe);
                        }}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          this.remove(day, meal.recipe);
                        }}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        class="rui-planner__clear"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          this.clear(day);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div class="rui-planner__empty">
                    <span>No meal planned</span>
                    <button type="button" onClick={() => this.assign(day)}>
                      + Assign recipe
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}
