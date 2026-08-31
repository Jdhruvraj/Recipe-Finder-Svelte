// Client-side initialization of the recipe-ui-lib Stencil web components.
// Imported from +layout.svelte via onMount so it only runs in the browser.
import { browser } from '$app/environment';

export async function initWebComponents(): Promise<void> {
  if (!browser) return;
  // The loader registers all <rui-*> custom elements on the page.
  const mod = await import('@ssj4kyuubi/recipe-ui-lib/loader');
  if (mod && typeof mod.defineCustomElements === 'function') {
    mod.defineCustomElements();
  }
}
