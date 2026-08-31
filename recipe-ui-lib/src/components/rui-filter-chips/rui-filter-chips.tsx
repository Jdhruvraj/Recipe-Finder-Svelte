import { Component, h, Prop, Event, EventEmitter, Host } from '@stencil/core';

export interface FilterCategory {
  label: string;
  value: string;
}

/**
 * Filter chips for category selection (multi-select).
 */
@Component({
  tag: 'rui-filter-chips',
  styleUrl: 'rui-filter-chips.css',
  shadow: true,
})
export class RuiFilterChips {
  /** Available categories. */
  @Prop() categories: FilterCategory[] = [];

  /** Currently selected category values. */
  @Prop() selected: string[] = [];

  /** Emitted when the selection changes. detail: string[] (selected values). */
  @Event({ eventName: 'ruiFilterChange', bubbles: true, composed: true })
  ruiFilterChange!: EventEmitter<string[]>;

  private toggle = (value: string) => {
    const next = this.selected.includes(value)
      ? this.selected.filter((v) => v !== value)
      : [...this.selected, value];
    // Replace the array reference so consumers re-render.
    this.selected = [...next];
    this.ruiFilterChange.emit(this.selected);
  };

  render() {
    return (
      <Host>
        <div class="rui-chips" role="group" aria-label="Filters">
          {this.categories.map((cat) => {
            const active = this.selected.includes(cat.value);
            return (
              <button
                type="button"
                class={`rui-chip ${active ? 'rui-chip--active' : ''}`}
                aria-pressed={active ? 'true' : 'false'}
                onClick={() => this.toggle(cat.value)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </Host>
    );
  }
}
