import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { ProductGrid } from '~/components/ProductGrid';
import { Pagination } from '~/components/Pagination';
import { getProducts } from '~/models/product.server';

export const meta: MetaFunction = () => [
  { title: 'Products | My Store' },
  { name: 'description', content: 'Browse our product collection' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const category = url.searchParams.get('category') || undefined;

  const { products, totalPages } = await getProducts({ page, category });

  return json({ products, totalPages, currentPage: page });
}

export default function ProductsIndex() {
  const { products, totalPages, currentPage } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <ProductGrid products={products} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/products"
        searchParams={searchParams}
      />
    </div>
  );
}
