import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductList } from '@/components/products/product-list';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductListSkeleton } from '@/components/products/product-skeleton';
import { getProducts } from '@/lib/api/products';

export const metadata: Metadata = {
  title: 'Products | My Store',
  description: 'Browse our collection of products',
};

interface ProductsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    sort?: string;
    q?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category;
  const sort = searchParams.sort || 'newest';
  const query = searchParams.q;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of high-quality products
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategory={category}
            selectedSort={sort}
          />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductListWrapper
              page={page}
              category={category}
              sort={sort}
              query={query}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function ProductListWrapper({
  page,
  category,
  sort,
  query,
}: {
  page: number;
  category?: string;
  sort: string;
  query?: string;
}) {
  const { products, totalPages } = await getProducts({
    page,
    category,
    sort,
    query,
  });

  return (
    <ProductList
      products={products}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
