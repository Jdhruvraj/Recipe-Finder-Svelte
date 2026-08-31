import { Component, h, Prop, Event, EventEmitter, Host } from '@stencil/core';

export interface RecipeSummary {
  id: string;
  name: string;
  image?: string;
  category?: string;
  area?: string;
}

/**
 * Recipe card. Displays summary info and a favorite toggle.
 * @slot - Footer actions slot (extra buttons rendered under the card).
 */
@Component({
  tag: 'rui-recipe-card',
  styleUrl: 'rui-recipe-card.css',
  shadow: true,
})
export class RuiRecipeCard {
  /** Recipe summary object. */
  @Prop() recipe!: RecipeSummary;

  /** Whether this recipe is favorited. */
  @Prop({ reflect: true }) isFavorite = false;

  /** Emitted when the card body is clicked. detail: RecipeSummary. */
  @Event({ eventName: 'ruiCardClick', bubbles: true, composed: true })
  ruiCardClick!: EventEmitter<RecipeSummary>;

  /** Emitted when the favorite heart is toggled. detail: { recipe, isFavorite }. */
  @Event({ eventName: 'ruiFavoriteToggle', bubbles: true, composed: true })
  ruiFavoriteToggle!: EventEmitter<{ recipe: RecipeSummary; isFavorite: boolean }>;

  private onCardClick = () => {
    this.ruiCardClick.emit(this.recipe);
  };

  private onFavClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.ruiFavoriteToggle.emit({ recipe: this.recipe, isFavorite: this.isFavorite });
  };

  render() {
    const r = this.recipe;
    return (
      <Host>
        <article class="rui-card" onClick={this.onCardClick}>
          <div class="rui-card__media">
            {r.image ? (
              <img src={r.image} alt={r.name} loading="lazy" />
            ) : (
              <div class="rui-card__placeholder" aria-hidden="true">
                <span>No image</span>
              </div>
            )}
            <button
              type="button"
              class={`rui-card__fav ${this.isFavorite ? 'is-fav' : ''}`}
              aria-pressed={this.isFavorite ? 'true' : 'false'}
              aria-label={this.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={this.onFavClick}
            >
              {this.isFavorite ? '\u2665' : '\u2661'}
            </button>
          </div>
          <div class="rui-card__body">
            <h3 class="rui-card__title">{r.name}</h3>
            {(r.category || r.area) && (
              <p class="rui-card__meta">
                {[r.category, r.area].filter(Boolean).join(' \u00b7 ')}
              </p>
            )}
          </div>
          <div class="rui-card__footer">
            <slot />
          </div>
        </article>
      </Host>
    );
  }
}
