import { Component, h, Prop, Event, EventEmitter, Element, Host } from '@stencil/core';

/**
 * Shared button primitive with variants.
 * @slot - Button label/content.
 */
@Component({
  tag: 'rui-button',
  styleUrl: 'rui-button.css',
  shadow: true,
})
export class RuiButton {
  @Element() el!: HTMLElement;

  /** Button variant. */
  @Prop() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';

  /** Disabled state. */
  @Prop({ reflect: true }) disabled = false;

  /** Loading state (shows spinner, disables interaction). */
  @Prop() loading = false;

  /** Native button type. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** Emitted on click (bubbles/composed for cross-boundary listening). */
  @Event({ eventName: 'ruiClick', bubbles: true, composed: true })
  ruiClick!: EventEmitter<MouseEvent>;

  private handleClick = (e: MouseEvent) => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.ruiClick.emit(e);
  };

  render() {
    return (
      <Host>
        <button
          class={`rui-btn rui-btn--${this.variant}`}
          type={this.type}
          disabled={this.disabled || this.loading}
          onClick={this.handleClick}
          aria-busy={this.loading ? 'true' : 'false'}
        >
          {this.loading && <span class="rui-btn__spinner" aria-hidden="true" />}
          <span class="rui-btn__label">
            <slot />
          </span>
        </button>
      </Host>
    );
  }
}
