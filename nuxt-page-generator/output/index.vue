<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const route = useRoute();

const page = computed(() => Number(route.query.page) || 1);
const category = computed(() => route.query.category as string | undefined);

const { data: products, pending, error } = await useFetch<{
  items: Product[];
  total: number;
  totalPages: number;
}>('/api/products', {
  query: { page, category, limit: 20 },
  watch: [page, category],
});

useSeoMeta({
  title: 'Products | My Store',
  description: 'Browse our collection of products',
});
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>Products</h1>
      <ProductFilters />
    </header>

    <div v-if="pending" class="loading">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error">
      <p>Failed to load products. Please try again.</p>
      <NuxtLink to="/products">Refresh</NuxtLink>
    </div>

    <template v-else-if="products">
      <div class="product-grid">
        <ProductCard
          v-for="product in products.items"
          :key="product.id"
          :product="product"
        />
      </div>

      <Pagination
        :current-page="page"
        :total-pages="products.totalPages"
        base-url="/products"
      />
    </template>
  </div>
</template>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; font-weight: 700; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.loading, .error { display: flex; justify-content: center; align-items: center; min-height: 300px; }
</style>
