// Disable SSR for the whole app: the Stencil web components are client-only
// (they register custom elements via the loader in onMount). Rendering a
// static shell on the server and hydrating is fine, but to keep things simple
// and avoid hydration mismatches with custom elements, we render only on the
// client. (The app is data-driven from a public API + localStorage, both
// client-side concerns.)
export const ssr = false;
export const prerender = false;
