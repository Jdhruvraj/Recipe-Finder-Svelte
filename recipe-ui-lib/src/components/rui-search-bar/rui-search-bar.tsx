import { Component, h, Prop, Event, EventEmitter, Host, Element } from '@stencil/core';

/**
 * Search bar with debounced input + submit events.
 * @slot leading - Optional leading icon/content.
 */
@Component({
  tag: 'rui-search-bar',
  styleUrl: 'rui-search-bar.css',
  shadow: true,
})
export class RuiSearchBar {
  @Element() el!: HTMLElement;

  /** Current input value. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text. */
  @Prop() placeholder = 'Search recipes...';

  /** Debounce delay in ms for ruiSearchInput. */
  @Prop() debounceMs = 300;

  /** Emitted (debounced) on input. detail: string. */
  @Event({ eventName: 'ruiSearchInput', bubbles: true, composed: true })
  ruiSearchInput!: EventEmitter<string>;

  /** Emitted on submit (Enter or button). detail: string. */
  @Event({ eventName: 'ruiSearchSubmit', bubbles: true, composed: true })
  ruiSearchSubmit!: EventEmitter<string>;

  private timer: any;

  private onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.ruiSearchInput.emit(this.value);
    }, this.debounceMs);
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();
    clearTimeout(this.timer);
    this.ruiSearchSubmit.emit(this.value);
  };

  disconnectedCallback() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <Host>
        <form class="rui-search" onSubmit={this.onSubmit} role="search">
          <input
            class="rui-search__input"
            type="search"
            value={this.value}
            placeholder={this.placeholder}
            onInput={this.onInput}
            aria-label={this.placeholder}
          />
          <button class="rui-search__btn" type="submit" aria-label="Search">
            Search
          </button>
        </form>
      </Host>
    );
  }
}
