import { Component, h, Prop, Event, EventEmitter, Host, Watch } from '@stencil/core';

/**
 * Modal dialog with default + footer slots.
 * @slot - Modal body content.
 * @slot footer - Footer actions (e.g. save/cancel buttons).
 */
@Component({
  tag: 'rui-modal',
  styleUrl: 'rui-modal.css',
  shadow: true,
})
export class RuiModal {
  /** Whether the modal is open. */
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Modal title. */
  @Prop() modalTitle = '';

  /** Close on backdrop click. */
  @Prop() closeOnBackdrop = true;

  /** Emitted when the modal requests to close (X button, backdrop, Escape). */
  @Event({ eventName: 'ruiClose', bubbles: true, composed: true })
  ruiClose!: EventEmitter<void>;

  private handleBackdrop = (e: MouseEvent) => {
    if (!this.closeOnBackdrop) return;
    if (e.target === e.currentTarget) {
      this.requestClose();
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) {
      this.requestClose();
    }
  };

  private requestClose() {
    this.ruiClose.emit();
  }

  @Watch('open')
  openChanged(isOpen: boolean) {
    if (isOpen) {
      document.addEventListener('keydown', this.handleKey);
    } else {
      document.removeEventListener('keydown', this.handleKey);
    }
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKey);
  }

  render() {
    return (
      <Host>
        {this.open && (
          <div class="rui-modal__backdrop" onClick={this.handleBackdrop}>
            <div
              class="rui-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-label={this.modalTitle}
            >
              <header class="rui-modal__header">
                <h3 class="rui-modal__title">{this.modalTitle}</h3>
                <button
                  class="rui-modal__close"
                  type="button"
                  aria-label="Close"
                  onClick={() => this.requestClose()}
                >
                  &times;
                </button>
              </header>
              <div class="rui-modal__body">
                <slot />
              </div>
              <footer class="rui-modal__footer">
                <slot name="footer" />
              </footer>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
