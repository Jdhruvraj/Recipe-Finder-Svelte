import { Component, h, Prop, Event, EventEmitter, Host } from '@stencil/core';

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
  ingredients?: RecipeIngredient[];
}

/**
 * Full recipe detail view: image, meta, ingredients, instructions.
 * @slot actions - Action buttons (e.g. add to plan, favorite).
 * @slot ingredients-extra - Extra content under the ingredients list.
 */
@Component({
  tag: 'rui-recipe-detail',
  styleUrl: 'rui-recipe-detail.css',
  shadow: true,
})
export class RuiRecipeDetail {
  /** Full recipe object. */
  @Prop() recipe!: RecipeFull;

  /** Whether the recipe is favorited. */
  @Prop({ reflect: true }) isFavorite = false;

  /** Emitted when "Add to plan" is clicked. detail: RecipeFull. */
  @Event({ eventName: 'ruiAddToPlan', bubbles: true, composed: true })
  ruiAddToPlan!: EventEmitter<RecipeFull>;

  /** Emitted when the favorite toggle is clicked. detail: { recipe, isFavorite }. */
  @Event({ eventName: 'ruiFavoriteToggle', bubbles: true, composed: true })
  ruiFavoriteToggle!: EventEmitter<{ recipe: RecipeFull; isFavorite: boolean }>;

  private onAddToPlan = () => {
    this.ruiAddToPlan.emit(this.recipe);
  };

  private onFavToggle = () => {
    this.isFavorite = !this.isFavorite;
    this.ruiFavoriteToggle.emit({ recipe: this.recipe, isFavorite: this.isFavorite });
  };

  render() {
    const r = this.recipe;
    return (
      <Host>
        <article class="rui-detail">
          <header class="rui-detail__header">
            <div class="rui-detail__media">
              {r.image ? (
                <img src={r.image} alt={r.name} />
              ) : (
                <div class="rui-detail__placeholder">No image</div>
              )}
            </div>
            <div class="rui-detail__intro">
              <h2 class="rui-detail__title">{r.name}</h2>
              {(r.category || r.area) && (
                <p class="rui-detail__meta">
                  {[r.category, r.area].filter(Boolean).join(' \u00b7 ')}
                </p>
              )}
              <div class="rui-detail__actions">
                <slot name="actions" />
                <button
                  type="button"
                  class={`rui-detail__fav ${this.isFavorite ? 'is-fav' : ''}`}
                  aria-pressed={this.isFavorite ? 'true' : 'false'}
                  onClick={this.onFavToggle}
                >
                  {this.isFavorite ? '\u2665 Favorited' : '\u2661 Add to favorites'}
                </button>
                <button type="button" class="rui-detail__plan" onClick={this.onAddToPlan}>
                  + Add to meal plan
                </button>
              </div>
            </div>
          </header>

          <section class="rui-detail__section">
            <h3>Ingredients</h3>
            {r.ingredients && r.ingredients.length > 0 ? (
              (() => {
                const mid = Math.ceil(r.ingredients.length / 2);
                const left = r.ingredients.slice(0, mid);
                const right = r.ingredients.slice(mid);
                const renderTable = (rows: RecipeIngredient[], offset: number) => (
                  <table class="rui-detail__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ingredient</th>
                        <th>Measure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((ing, idx) => (
                        <tr>
                          <td class="rui-detail__td--index">{offset + idx + 1}</td>
                          <td class="rui-detail__ing-name">{ing.name}</td>
                          <td class="rui-detail__ing-measure">{ing.measure || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
                return (
                  <div class="rui-detail__tables">
                    {renderTable(left, 0)}
                    {right.length > 0 && renderTable(right, mid)}
                  </div>
                );
              })()
            ) : (
              <p class="rui-detail__empty">No ingredients listed.</p>
            )}
            <slot name="ingredients-extra" />
          </section>

          {r.instructions && (
            <section class="rui-detail__section">
              <h3>Instructions</h3>
              <p class="rui-detail__instructions">{r.instructions}</p>
            </section>
          )}

          {(r.youtube || r.source) && (
            <section class="rui-detail__section rui-detail__links">
              {r.youtube && (
                <a href={r.youtube} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              )}
              {r.source && (
                <a href={r.source} target="_blank" rel="noopener noreferrer">
                  Original source
                </a>
              )}
            </section>
          )}
        </article>
      </Host>
    );
  }
}
