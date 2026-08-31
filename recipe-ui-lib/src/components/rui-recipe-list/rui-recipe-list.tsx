import { Component, h, Prop, Event, EventEmitter, Host, Watch } from '@stencil/core';
import { RecipeSummary } from '../rui-recipe-card/rui-recipe-card';

/**
 * Responsive grid of recipe cards. Re-renders cards when recipes/favorites change.
 */
@Component({
  tag: 'rui-recipe-list',
  styleUrl: 'rui-recipe-list.css',
  shadow: true,
})
export class RuiRecipeList {
  /** Array of recipe summaries to display. */
  @Prop() recipes: RecipeSummary[] = [];

  /** Array of favorite recipe ids (used to mark cards as favorite). */
  @Prop() favorites: string[] = [];

  /** Empty-state message. */
  @Prop() emptyMessage = 'No recipes found.';

  /** Emitted when a card is clicked. detail: RecipeSummary. */
  @Event({ eventName: 'ruiSelectRecipe', bubbles: true, composed: true })
  ruiSelectRecipe!: EventEmitter<RecipeSummary>;

  /** Emitted when a favorite is toggled from a card. detail: { recipe, isFavorite }. */
  @Event({ eventName: 'ruiFavoriteToggle', bubbles: true, composed: true })
  ruiFavoriteToggle!: EventEmitter<{ recipe: RecipeSummary; isFavorite: boolean }>;

  // Force Stencil to re-render when array props change by reference.
  @Watch('recipes') recipesChanged() {}
  @Watch('favorites') favoritesChanged() {}

  private isFav(id: string) {
    return this.favorites.includes(id);
  }

  render() {
    if (!this.recipes || this.recipes.length === 0) {
      return (
        <Host>
          <p class="rui-list__empty">{this.emptyMessage}</p>
        </Host>
      );
    }
    return (
      <Host>
        <div class="rui-list">
          {this.recipes.map((r) => (
            <rui-recipe-card
              recipe={r}
              isFavorite={this.isFav(r.id)}
              onRuiCardClick={(e: CustomEvent<RecipeSummary>) => {
                e.stopPropagation();
                this.ruiSelectRecipe.emit(e.detail);
              }}
              onRuiFavoriteToggle={(e: CustomEvent<any>) => {
                e.stopPropagation();
                this.ruiFavoriteToggle.emit(e.detail);
              }}
            />
          ))}
        </div>
      </Host>
    );
  }
}
