import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // @ssj4kyuubi/recipe-ui-lib ships pre-bundled web components; keep it out of optimizeDeps
  // so the custom-element definitions load correctly.
  optimizeDeps: {
    exclude: ['@ssj4kyuubi/recipe-ui-lib'],
  },
  ssr: {
    noExternal: ['@ssj4kyuubi/recipe-ui-lib'],
  },
});
