<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initWebComponents } from '$lib/stencil-loader';
  import { page } from '$app/stores';

  onMount(() => {
    initWebComponents();
  });

  let { children } = $props();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Browse' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/my-recipes', label: 'My Recipes' },
    { href: '/planner', label: 'Meal Planner' },
  ];

  function isActive(href: string, path: string): boolean {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }
</script>

<div class="app-shell">
  <nav class="nav">
    <div class="nav__inner">
      <a href="/" class="nav__brand">Recipe Finder</a>
      <div class="nav__links">
        {#each navLinks as link (link.href)}
          <a href={link.href} class={isActive(link.href, $page.url.pathname) ? 'active' : ''}>
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  </nav>

  <main class="app-main">
    {@render children()}
  </main>

  <footer class="footer">
    Recipe Finder &amp; Meal Planner &mdash; built with SvelteKit + StencilJS. Data from
    <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">TheMealDB</a>.
  </footer>
</div>
