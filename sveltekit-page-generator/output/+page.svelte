<script lang="ts">
  import type { PageData } from './$types';
  import PostCard from '$lib/components/PostCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>Blog | My Site</title>
  <meta name="description" content="Read our latest blog posts" />
</svelte:head>

<div class="container">
  <h1>Blog</h1>

  <div class="posts-grid">
    {#each data.posts as post (post.id)}
      <PostCard {post} />
    {/each}
  </div>

  <Pagination
    currentPage={data.page}
    totalPages={data.totalPages}
    baseUrl="/blog"
  />
</div>

<style>
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; }
  .posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
</style>
